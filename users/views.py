from django.http import JsonResponse
from rest_framework import views, generics, response, permissions, authentication, viewsets
from rest_framework.authentication import SessionAuthentication
from django.contrib.auth import authenticate, login, logout
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from users.serializers import UserSerializer
from django.conf import settings
import json
from .models import *
import math
from datetime import datetime


class CsrfExemptSessionAuthentication(authentication.SessionAuthentication):
    def enforce_csrf(self, request):
        return


class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (CsrfExemptSessionAuthentication, SessionAuthentication)

    def get(self, request):
        # return Response({'success': 'CSRF Cookie Set'})
        return  JsonResponse({'success': 'CSRF cookie set'})


class CheckAuthenticatedView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (CsrfExemptSessionAuthentication, SessionAuthentication)

    def get(self, request):
        if request.user.is_authenticated:
            return JsonResponse({'User isAuthenticated': True})
        else:
            return JsonResponse({'User isAuthenticated': False})


class RegisterView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer
    authentication_classes = (CsrfExemptSessionAuthentication, SessionAuthentication)

    def perform_create(self, serializer):
        user = serializer.save()
        user.backend = settings.AUTHENTICATION_BACKENDS[0]
        login(self.request, user)


class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (CsrfExemptSessionAuthentication, SessionAuthentication)

    def post(self, request):
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            if user.is_active:
                login(request, user)
                return JsonResponse({'detail': 'Logged in successfully.'}, status=status.HTTP_200_OK)
        else:
            return JsonResponse({'detail': 'User Name or Password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)


class UserUpdateView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (CsrfExemptSessionAuthentication, SessionAuthentication)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            update_data=serializer.data
            update_object = {'User Update: Update is successfully.': update_data}
            return JsonResponse(update_object, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserView(generics.RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (CsrfExemptSessionAuthentication, SessionAuthentication)

    serializer_class = UserSerializer
    lookup_field = 'pk'

    def get_object(self, *args, **kwargs):
        return self.request.user


class ChangePasswordView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (CsrfExemptSessionAuthentication, SessionAuthentication)

    def post(self, request):
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        user = request.user

        if not user.check_password(old_password):
            return Response({'detail': 'Invalid old password.'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({'detail': 'Password changed successfully.'}, status=status.HTTP_200_OK)


class AllUserDetail(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (CsrfExemptSessionAuthentication, SessionAuthentication)
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get(self, request):
        page_num = int(request.GET.get("page", 1))
        limit_num = int(request.GET.get("limit", 10))
        start_num = (page_num - 1) * limit_num
        end_num = limit_num * page_num
        search_param = request.GET.get("search")
        users = User.objects.all()
        total_projects = users.count()
        if search_param:
            users = users.filter(name__icontains=search_param)
        serializer = self.serializer_class(users[start_num:end_num], many=True)
        return Response({
            "status": "success",
            "total": total_projects,
            "page": page_num,
            "last_page": math.ceil(total_projects / limit_num),
            "users": serializer.data
        })


class UserDetail(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (CsrfExemptSessionAuthentication, SessionAuthentication)
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_user(self, pk):
        try:
            return User.objects.get(pk=pk)
        except:
            return None

    def get(self, request, pk):
        users = self.get_user(pk=pk)
        if users == None:
            return Response({"status": "fail", "message": f"Note with Id: {pk} not found"},
                            status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(users)
        return Response({"status": "success", "data": {"user": serializer.data}})

    def put(self, request, pk):
        users = self.get_user(pk)
        if users == None:
            return Response({"status": "fail", "message": f"Note with Id: {pk} not found"},
                            status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(
            users, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.validated_data['updatedAt'] = datetime.now()
            serializer.save()
            return Response({"status": "success", "data": {"user": serializer.data}})
        return Response({"status": "fail", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        users = self.get_user(pk)
        if users == None:
            return Response({"status": "fail", "message": f"Note with Id: {pk} not found"},
                            status=status.HTTP_404_NOT_FOUND)

        users.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class DeleteAccountView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (CsrfExemptSessionAuthentication, SessionAuthentication)

    def delete(self, request):
        user = request.user
        user.delete()
        logout(request)
        return Response({'detail': 'Account deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)


class LogoutView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (CsrfExemptSessionAuthentication, SessionAuthentication)

    def post(self, request):
        logout(request)
        return Response({'detail': 'Logged out successfully.'}, status=status.HTTP_200_OK)
