from functools import wraps
from django.http import HttpResponseForbidden
from .models import *


def get_user_role(user):
    try:
        user_role = UserRole.objects.get(user=user)
        return user_role.role
    except UserRole.DoesNotExist:
        return None


def has_permission(perm_name):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            if request.user.is_authenticated:
                user_role = get_user_role(request.user)
                if user_role and user_role.permissions.filter(name=perm_name).exists():
                    return view_func(request, *args, **kwargs)
            return HttpResponseForbidden("You don't have permission to access this page.")
        return _wrapped_view
    return decorator