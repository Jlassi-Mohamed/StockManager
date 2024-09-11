from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render
from django.urls import reverse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


import accounts.serializers


class Home(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_classes = accounts.serializers.MyTokenObtainPairSerializer

    def get(self, request, *args, **kwargs):
        user = request.user
        if user.is_authenticated:
            token = request.auth
            if token is None:
                return HttpResponse({
                    "message": "Token is missing",
                }, status=401)
            token = token.get('token')
            username = token.get('username')
            role = token.get('role')
            permissions = token.get('permissions')
            return Response({
                'username': username,
                'role': role,
                'permissions': permissions,
                'token': token
            })
        return HttpResponse({
            "message": "Not authenticated",
        })


