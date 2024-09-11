from random import random

from django.utils.decorators import method_decorator
from rest_framework.decorators import api_view, permission_classes

from django.http import BadHeaderError
from django.views.decorators.csrf import csrf_exempt
from rest_framework import permissions, serializers
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from products.models import Product
from .decorator import has_permission
from .serializers import MyTokenObtainPairSerializer, UserSerializer, RoleSerializer, NotificationSerializer, \
    PermissionSerializer
from django.core.mail import send_mail, BadHeaderError
import random

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# Create your views here.
from rest_framework import generics, status
from rest_framework.response import Response
from accounts.models import CustomUser, Role, Notification, Permission

class getUsers(APIView):
    serializer_class = UserSerializer
    @method_decorator(has_permission(['retrieve_user']))
    def get(self, request):
        users = CustomUser.objects.all()
        serializer = self.serializer_class(users, many=True)
        return Response(serializer.data)


class getTotalUsers(APIView):
    @method_decorator(has_permission(['retrieve_user']))
    def get(self, request):
        totalUsers = CustomUser.objects.all().count()
        return Response(totalUsers)





class AdminSignupView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'is_login': True})
        if not serializer.is_valid():
            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response({"message": "GOOD REQUEST"}, status=status.HTTP_201_CREATED)


class UserSignupView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

    @method_decorator(has_permission(['create_user']))
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response({"message": "GOOD REQUEST"}, status=status.HTTP_201_CREATED)


class UserLoginView(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'is_login': False})
        try:
            serializer.is_valid(raise_exception=True)
        except serializers.ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
    
        tokens = serializer.validated_data
        return Response({
            'access': tokens['access'],
            'refresh': tokens['refresh'],
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)

class deleteUser(APIView):
    @classmethod
    @method_decorator(has_permission(['delete_user']))
    def delete(self, request):
        data = request.data
        username = data.get('username')

        if not username:
            return Response({"error": "username is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(username=username)
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class modifyUser(APIView):
    serializer_class = UserSerializer
    #@has_permission(['update_user'])
    def put(self, request):
        user_name = request.data.get('username')

        if not user_name:
            return Response({"error": "username is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(username=user_name)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            print(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@csrf_exempt
@permission_classes([AllowAny])
def send_email(request):
    if request.method == 'POST':
        from_email = request.data.get('from_email')
        subject = request.data.get('subject')
        verification_code = str(random.randint(100000, 999999))
        message = "Your verification code is: " + verification_code
        to_email = request.data.get("to_email", "")

        if to_email:
            try:
                email_exists = CustomUser.objects.filter(email=to_email).exists()
                if email_exists:
                    send_mail(subject, message, from_email, [to_email], fail_silently=False)
                    request.session['verification_code'] = verification_code
                    request.session['to_email'] = to_email
                    return Response({"message": "Email sent successfully"}, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "Email address not found"}, status=status.HTTP_400_BAD_REQUEST)
            except BadHeaderError:
                return Response({"error": "Invalid header found."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Please provide a valid email address."}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": "Invalid request method."}, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def check_code(request):
    if request.method == "POST":
        input_code = request.POST.get("verification_code", "")
        session_code = request.session.get('verification_code', "")
        if input_code == session_code:
            return Response("Verification successful. You can now reset your password.",status=status.HTTP_200_OK)
        else:
            return Response("Invalid verification code. Please try again.", status=status.HTTP_400_BAD_REQUEST)
    return Response("Please submit the verification code.", status=status.HTTP_400_BAD_REQUEST)


import json
import logging
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    if request.method == "POST":
        try:
            email = request.session.get('to_email', "")
            if not email:
                return Response({"detail": "Session expired or email not found."}, status=status.HTTP_400_BAD_REQUEST)

            data = json.loads(request.body)
            new_password = data.get("new_password", "")

            if email and new_password:
                try:
                    user = CustomUser.objects.get(email=email)
                    user.set_password(new_password)
                    user.save()
                    return Response({"detail": "Password reset successful."}, status=status.HTTP_200_OK)
                except CustomUser.DoesNotExist:
                    return Response({"detail": "User does not exist."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"detail": "Make sure all fields are entered and valid."}, status=status.HTTP_400_BAD_REQUEST)
        except json.JSONDecodeError:
            return Response({"detail": "Invalid JSON data."}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"detail": "Please submit your new password."}, status=status.HTTP_400_BAD_REQUEST)

class RoleListView(generics.ListAPIView):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer

class RolePermissionsView(APIView):
    def get(self, request, *args, **kwargs):
        role_name = request.data.get('role_name')

        if not role_name:
            return Response({
                'error': 'Please provide a role name.'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            role = Role.objects.get(name=role_name)
        except Role.DoesNotExist:
            return Response({
                'error': 'Role not found.'
            }, status=status.HTTP_404_NOT_FOUND)

        permissions = role.permissions.all()
        permissions_list = list(permissions.values('name'))

        return Response({
            'role': role.name,
            'permissions': permissions_list
        })

class GetAllPermissions(APIView):
    def get(self, request, *args, **kwargs):
        serializer = PermissionSerializer(Permission.objects.all(), many=True)
        return Response(serializer.data)


class CreateNewRole(APIView):
    def post(self, request, *args, **kwargs):
        # Extract data from the request
        role_name = request.data.get('role_name')
        permissions = request.data.get('permissions', [])

        if not role_name:
            return Response({"error": "Role name is required."}, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(permissions, list):
            return Response({"error": "Permissions should be a list."}, status=status.HTTP_400_BAD_REQUEST)

        valid_permissions = Permission.objects.filter(name__in=permissions)
        if valid_permissions.count() != len(permissions):
            return Response({"error": "One or more permissions are invalid."}, status=status.HTTP_400_BAD_REQUEST)

        role = Role.objects.create(name=role_name)

        role.permissions.set(valid_permissions)
        role.save()

        serializer = RoleSerializer(role)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class NotificationView(APIView):

    def post(self, request):
        serializer = NotificationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        notifications = Notification.objects.all().order_by('-created_at')
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



