from django.urls import path, include
from candidate import views

urlpatterns = [
    path('bulk_list/', views.CandidateView.as_view(), name='candidate-bulk-list'),
    path('bulk_data/', views.CandidateCreateView.as_view(), name='candidate-bulk-data')

]