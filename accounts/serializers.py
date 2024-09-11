from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

from products.models import Order
from .models import CustomUser, Role, UserRole, Notification, Permission


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['profile_picture'] = user.profile_picture
        try:
            user_role = UserRole.objects.get(user=user)
            role = user_role.role
            token['role'] = str(role)
            token['permissions'] = [perm.name for perm in role.permissions.all()]
        except UserRole.DoesNotExist:
            token['role'] = None
            token['permissions'] = []

        return token


from django.core.exceptions import ValidationError
from rest_framework import serializers
from .models import CustomUser, Role, UserRole


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['name']


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['name']



class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(required=False)
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=CustomUser.objects.all())]
    )
    class Meta:
        model = CustomUser
        fields = ('id', 'first_name', 'last_name', 'username', 'email', 'password', 'bio', 'profile_picture', 'role')
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate(self, data):
        role_name = data.get('role')
        if not self.context.get('is_login') and role_name is None:
            raise serializers.ValidationError("Role name is required.")

        if role_name and not Role.objects.filter(name=role_name).exists():
            raise serializers.ValidationError(f"Role '{role_name}' does not exist.")

        return data

    def create(self, validated_data):
        password = validated_data.pop('password')
        role_name = validated_data.pop('role', None)

        user = CustomUser(**validated_data)

        if self.context.get('is_login'):
            try:
                admin_role = Role.objects.get(name="Admin")
                user.role = admin_role.name
            except Role.DoesNotExist:
                raise serializers.ValidationError("Role 'Admin' does not exist.")
        elif role_name:
            try:
                role = Role.objects.get(name=role_name)
                user.role = role.name
            except Role.DoesNotExist:
                raise serializers.ValidationError(f"Role '{role_name}' does not exist.")
        else:

            try:
                product_viewer_role = Role.objects.get(name="Product Viewer")
                user.role = product_viewer_role.name
            except Role.DoesNotExist:
                raise serializers.ValidationError("Role 'Product Viewer' does not exist.")

        user.set_password(password)

        user.save()

        if user.role:
            try:
                role = Role.objects.get(name=user.role)
                UserRole.objects.get_or_create(user=user, role=role)
            except Exception as e:
                raise serializers.ValidationError(f"An error occurred while creating the UserRole: {str(e)}")

        return user

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'message', 'created_at']
        read_only_fields = ['created_at']