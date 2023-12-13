from django.http import JsonResponse
from rest_framework import generics,permissions, authentication
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from django.contrib.auth import authenticate, login, logout
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from users.serializers import UserSerializer
import json
from .models import *
import math
from datetime import datetime
from django.core.cache import cache
import time
import redis
from rest_framework.response import Response

redis_instance = redis.StrictRedis(host='127.0.0.1', port=6379, db=1)

def log_db_queries ( f ) :
    from django.db import connection
    def new_f ( * args , ** kwargs ) :
        start_time = time.time()
        res = f ( * args , ** kwargs )
        print ( "\n\n" )
        print ( "-"*80 )
        print ("db queries log for %s:\n" % (f.__name__))
        print ( " TOTAL COUNT : % s " % len ( connection.queries ) )
        for q in connection.queries :
            print ("%s: %s\n" % (q["time"] , q["sql"]))
        end_time = time.time ()
        duration = end_time - start_time
        print ('\n Total time: {:.3f} ms'.format(duration * 1000.0))
        print ("-"*80)
        return res
    return new_f



class CsrfExemptSessionAuthentication(authentication.SessionAuthentication):
    def enforce_csrf(self, request):
        return


class GetCSRFToken(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (CsrfExemptSessionAuthentication, SessionAuthentication)

    @staticmethod
    def get(request):
        # return Response({'success': 'CSRF Cookie Set'})
        return JsonResponse({'success': 'CSRF cookie set'})


class CheckAuthenticatedView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (CsrfExemptSessionAuthentication, SessionAuthentication)

    @staticmethod
    def get(request):
        print(request.user.is_authenticated)
        return JsonResponse({'is_authenticated': request.user.is_authenticated})


class RegisterView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer
    authentication_classes = (CsrfExemptSessionAuthentication, SessionAuthentication)

    def perform_create(self, serializer):
        user = serializer.save()
        user.backend = settings.AUTHENTICATION_BACKENDS[0]
        # login(self.request, user)


class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (CsrfExemptSessionAuthentication, SessionAuthentication)

    @staticmethod
    def post(request):
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        # csrf_token = request.META.get('CSRF_TOKEN')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            if user.is_active:
                login(request, user)
                try:
                    token = Token.objects.get(user_id=user.id)

                except Token.DoesNotExist:
                    token = Token.objects.create(user=user)

                print(request.COOKIES, 'session-id:',request.session.session_key,'token:',token.key)
                return JsonResponse({'detail': 'Logged in successfully.', 'COOKIES': request.COOKIES, 'SESSION_ID': request.session.session_key, 'token': token.key}, status=status.HTTP_200_OK)
        else:
            return JsonResponse({'detail': 'User Name or Password is incorrect.'}, status=status.HTTP_401_UNAUTHORIZED)


class UserUpdateView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (CsrfExemptSessionAuthentication, SessionAuthentication)

    @staticmethod
    def put(request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            update_data=serializer.data
            update_object = {'User Update: Update is successfully.': update_data}
            return JsonResponse(update_object, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (CsrfExemptSessionAuthentication, SessionAuthentication)

    serializer_class = UserSerializer
    lookup_field = 'pk'

    def get_object(self, *args, **kwargs):
        return self.request.user
        # serializer = UserSerializer(self.request.user, data=self.request.data, partial=True)
        # if serializer.is_valid():
        #     return Response({'User Details': serializer.data}, status=status.HTTP_200_OK)


class ChangePasswordView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (CsrfExemptSessionAuthentication, SessionAuthentication)

    @staticmethod
    def post(request):
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        user = request.user

        if not user.check_password(old_password):
            return Response({'detail': 'Invalid old password.'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({'detail': 'Password changed successfully.'}, status=status.HTTP_200_OK)


class AllUserDetail(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (CsrfExemptSessionAuthentication, SessionAuthentication)
    serializer_class = UserSerializer
    queryset = User.objects.all()

    @log_db_queries
    def get(self, request):
        page_num = int(request.GET.get("page", 1))
        limit_num = int(request.GET.get("limit", 10))
        start_num = (page_num - 1) * limit_num
        end_num = limit_num * page_num
        search_param = request.GET.get("search")
        if search_param is not None:
            cache_key = 'name' + search_param
        else:
            cache_key = 'name'

        if cache_key in cache:
            print("redis....")
            queryset = cache.get(cache_key)
            return Response(queryset)
        else:
            print('db.....')
            users = User.objects.all()
            total_projects = users.count()
            if search_param:
                users = users.filter(name__icontains=search_param)
            serializer = self.serializer_class(users[start_num:end_num], many=True)
            cache.set(cache_key, serializer.data, timeout=60*60)
            return Response({
                "status": "success",
                "total": total_projects,
                "page": page_num,
                "last_page": math.ceil(total_projects / limit_num),
                "users": serializer.data
            })


class UserDetail(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (CsrfExemptSessionAuthentication, SessionAuthentication)
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @staticmethod
    def get_user(pk):
        try:
            return User.objects.get(pk=pk)
        except:
            return None

    def get(self, request, pk):
        users = self.get_user(pk=pk)
        if users is None:
            return Response({"status": "fail", "message": f"Note with Id: {pk} not found"},
                            status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(users)
        return Response({"status": "success", "data": {"user": serializer.data}}, status=status.HTTP_200_OK)

    def put(self, request, pk):
        users = self.get_user(pk)
        if users is None:
            return Response({"status": "fail", "message": f"Note with Id: {pk} not found"},
                            status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(
            users, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.validated_data['updated_at'] = datetime.now()
            serializer.save()
            return Response({"status": "success", "data": {"user": serializer.data}}, status=status.HTTP_200_OK)
        return Response({"status": "fail", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        users = self.get_user(pk)
        if users is None:
            return Response({"status": "fail", "message": f"Note with Id: {pk} not found"},
                            status=status.HTTP_404_NOT_FOUND)

        users.delete()
        return Response({"status": f"User(ID:{pk}) successfully Deleted"}, status.HTTP_204_NO_CONTENT)


class DeleteAccountView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (CsrfExemptSessionAuthentication, SessionAuthentication)

    @staticmethod
    def delete(request):
        user = request.user
        user.delete()
        logout(request)
        return Response({'detail': 'Account deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)


class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (CsrfExemptSessionAuthentication, SessionAuthentication)

    @staticmethod
    def post(request):
        logout(request)
        return Response({'detail': 'Logged out successfully.'}, status=status.HTTP_200_OK)
        # if not request.user.is_authenticated:
        #     return JsonResponse({'detail': 'You\'re not logged in.'}, status=400)
        # logout(request)
        # return Response({'detail': 'Logged out successfully.'}, status=status.HTTP_200_OK)
