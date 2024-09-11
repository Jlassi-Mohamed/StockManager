import uuid

from django.db import models
from accounts.models import CustomUser


class Category(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    image = models.URLField(null=True, blank=True)
    description = models.TextField(default="")

    def __str__(self):
        return self.name


class Product(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(default="")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, default=1)
    image = models.URLField(null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=1)

    def __str__(self):
        return self.name

from django.db.models import Sum, F
class Project(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    image = models.URLField(blank=True, null=True)
    purchaseDate = models.DateField()
    description = models.TextField(default="")
    totalPurchaseAmount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    products = models.ManyToManyField(Product)
    def calculate_total_purchase_amount(self):
        total_amount = ProjectProduct.objects.filter(project=self).aggregate(
            total_amount=Sum(F('quantity') * F('product__price'))
        )['total_amount'] or 0
        return total_amount
    def update_total_purchase_amount(self):
        self.totalPurchaseAmount = self.calculate_total_purchase_amount()
        self.save()


class ProjectProduct(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(null=False, default=1)
    class Meta:
        db_table = 'project_products'


class Supplier(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=100, default="jlassi.mohamedhani@gmail.com", null=True, blank=True)

    def __str__(self):
        return self.name

class Order(models.Model):
    ORDER_STATUS_CHOICES = [
        ('ordered', 'Ordered'),
        ('delivered', 'Delivered'),
        ('in progress', 'In progress'),
        ('canceled', 'Canceled'),
    ]
    id = models.AutoField(primary_key=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='orders')
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=100, choices=ORDER_STATUS_CHOICES, default='in progress')
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} for {self.project.name}"

class Sale(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    def __str__(self):
        return f"Sale #{self.id} for {self.order}"