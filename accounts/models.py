from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    bio = models.CharField(max_length=255, blank=True)
    profile_picture = models.URLField(null=True, blank=True)
    role = models.CharField(max_length=255, blank=True)

class Module(models.Model):
    name = models.CharField(max_length=100, primary_key=True)

    def __str__(self):
        return self.name

class Permission(models.Model):
    name = models.CharField(max_length=100, primary_key=True)
    module = models.ForeignKey(Module, to_field='name', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} ({self.module})"

class Role(models.Model):
    name = models.CharField(max_length=100, primary_key=True)
    permissions = models.ManyToManyField(Permission)

    def __str__(self):
        return self.name

class UserRole(models.Model):
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} - {self.role.name}"

class Notification(models.Model):
    message = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message