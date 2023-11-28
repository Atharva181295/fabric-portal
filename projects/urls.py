from django.urls import path
from projects.views import Projects, ProjectDetail

urlpatterns = [
    path('', Projects.as_view()),
    path('<str:pk>', ProjectDetail.as_view())
]
