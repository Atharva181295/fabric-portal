from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from projects.models import Project
from projects.serializers import ProjectSerializer
import math
from datetime import datetime

from users.views import CsrfExemptSessionAuthentication


class Projects(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (CsrfExemptSessionAuthentication, SessionAuthentication)
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()

    def get(self, request):
        page_num = int(request.GET.get("page", 1))
        limit_num = int(request.GET.get("limit", 10))
        start_num = (page_num - 1) * limit_num
        end_num = limit_num * page_num
        search_param = request.GET.get("search")
        projects = Project.objects.all()
        total_projects = projects.count()
        if search_param:
            projects = projects.filter(name__icontains=search_param)
        serializer = self.serializer_class(projects[start_num:end_num], many=True)
        return Response({
            "status": "success",
            "total": total_projects,
            "page": page_num,
            "last_page": math.ceil(total_projects / limit_num),
            "projects": serializer.data
        })

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": {"projects": serializer.data}}, status=status.HTTP_201_CREATED)
        else:
            return Response({"status": "fail", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class ProjectDetail(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (CsrfExemptSessionAuthentication, SessionAuthentication)
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_project(self, pk):
        try:
            return Project.objects.get(pk=pk)
        except:
            return None

    def get(self, request, pk):
        project = self.get_project(pk=pk)
        if project == None:
            return Response({"status": "fail", "message": f"Note with Id: {pk} not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(project)
        return Response({"status": "success", "data": {"project": serializer.data}})

    def put(self, request, pk):
        project = self.get_project(pk)
        if project == None:
            return Response({"status": "fail", "message": f"Note with Id: {pk} not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(
            project, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.validated_data['updated_at'] = datetime.now()
            serializer.save()
            return Response({"status": "success", "data": {"project": serializer.data}})
        return Response({"status": "fail", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        project = self.get_project(pk)
        if project == None:
            return Response({"status": "fail", "message": f"Note with Id: {pk} not found"}, status=status.HTTP_404_NOT_FOUND)

        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

