from django.urls import path

from users.views import *

urlpatterns = [
    path('csrf/', GetCSRFToken.as_view(), name='csrf_cookie'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('user_update/', UserUpdateView.as_view(), name='current_user_update'),
    path('change_password/', ChangePasswordView.as_view(), name='change_password'),
    path('checkauth/', CheckAuthenticatedView.as_view(), name='check_auth'),
    path('users/', AllUserDetail.as_view(), name='user_details'),
    path('users/<str:pk>', UserDetail.as_view(), name='user_details'),
    path('whoami/', UserView.as_view(), name='current_user_details'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('delete/', DeleteAccountView.as_view(), name='user_delete')
]
