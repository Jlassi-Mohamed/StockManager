from django.shortcuts import render
from django.http import JsonResponse
# Create your views here.
def getRoutes(request):
    routes = [
        'token',
        'token/refresh',
    ]
    return JsonResponse(routes, safe=False)