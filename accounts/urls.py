from accounts.views import AdminSignupView, UserLoginView
from django.urls import path
urlpatterns = [
    path('', AdminSignupView.as_view(), name='admin-signup'),
    path('signup/', AdminSignupView.as_view(), name='user_create'),
    path('login/', UserLoginView.as_view(), name='user_login'),
]
