from accounts.views import AdminSignupView, UserLoginView, send_email, check_code, reset_password, UserSignupView, \
    getUsers, deleteUser, modifyUser, getTotalUsers, RoleListView, RolePermissionsView, NotificationView, \
    GetAllPermissions, CreateNewRole
from django.urls import path
urlpatterns = [
    path('', AdminSignupView.as_view(), name='admin-signup'),
    path('register/', AdminSignupView.as_view(), name='user_create'),
    path('login/', UserLoginView.as_view(), name='user_login'),
    path('send_email/', send_email, name='send_email'),
    path('check_code/', check_code, name='check_code'),
    path('reset_password/', reset_password, name='reset_password'),
    path('create_user/', UserSignupView.as_view(), name='create_user'),
    path("get/", getUsers.as_view(), name="get"),
    path("delete/", deleteUser.as_view(), name="delete"),
    path("modify/", modifyUser.as_view(), name="modify"),
    path("get-total-users/", getTotalUsers.as_view(), name="get_total"),
    path('roles/', RoleListView.as_view(), name='role-list'),
    path('roles/permissions/', RolePermissionsView.as_view(), name='get_role_permissions'),
    path('notifications/', NotificationView.as_view(), name='notifications'),
    path('permissions/', GetAllPermissions.as_view(), name='get_all_permissions'),
    path('add-new-role/', CreateNewRole.as_view(), name='add_new_role'),

]
