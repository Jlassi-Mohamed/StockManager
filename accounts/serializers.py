from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import CustomUser, UserRole, Role, Permission


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        try:
            user_role = UserRole.objects.get(user=user)
            role = user_role.role
            token['role'] = role.name
            token['permissions'] = [perm.name for perm in role.permissions.all()]
        except UserRole.DoesNotExist:
            token['role'] = None
            token['permissions'] = []

        return token


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=CustomUser.objects.all())]
    )

    class Meta:
        model = CustomUser
        fields = ('first_name', 'last_name', 'username', 'email', 'password', 'password2', 'bio', 'profile_picture')

        Required_fields = ('first_name', 'username', 'email', 'password', 'password2')
    def validate(self, attrs): # deser
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data): #ser
        user = CustomUser.objects.create(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            username=validated_data['username'],
            email=validated_data['email'],
            bio=validated_data['bio'],
            profile_picture=validated_data['profile_picture']
        )

        user.set_password(validated_data['password'])
        user.save()
        role = Role.objects.get(name="Admin")
        UserRole.objects.create(user=user, role=role)
        all_permissions = Permission.objects.all()
        user.user_permissions.set(all_permissions)

        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('first_name', 'last_name', 'username', 'email', 'password', 'bio', 'profile_picture')
