from functools import wraps
from rest_framework.response import Response
from rest_framework import status
from .models import UserRole

def get_user_role(user):
    try:
        user_role = UserRole.objects.get(user=user)
        return user_role.role
    except UserRole.DoesNotExist:
        return None

def has_permission(perm_names):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            if request.user.is_authenticated:
                user_role = get_user_role(request.user)
                if user_role and user_role.permissions.filter(name__in=perm_names).exists():
                    return view_func(request, *args, **kwargs)
            return Response({"error": "You don't have permission to access this page."}, status=status.HTTP_403_FORBIDDEN)
        return _wrapped_view
    return decorator
