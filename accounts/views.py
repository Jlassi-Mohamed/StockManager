from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from rest_framework import generics, permissions, serializers, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import CustomUser
from .decorator import has_permission
from .serializers import SignupSerializer, MyTokenObtainPairSerializer


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# Create your views here.
from rest_framework import generics, status
from rest_framework.response import Response
from accounts.models import CustomUser
from accounts.serializers import SignupSerializer

class AdminSignupView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = SignupSerializer

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
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except serializers.ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        tokens = serializer.validated_data
        return Response({
            'refresh': tokens['refresh'],
            'access': tokens['access'],
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)





@has_permission('create_user')
def create_user(request):
    pass


@has_permission('retrieve_user')
def retrieve_user(request):
    pass


@has_permission('update_user')
def update_user(request):
    pass


# AND SO ON ...