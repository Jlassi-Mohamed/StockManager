from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import Category, Product, Project, Supplier, Order, ProjectProduct, Sale


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'image', 'description']

from rest_framework import serializers
from .models import Project, Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'image', 'user', 'price', 'category', 'quantity', 'description']

class ProjectSerializer(serializers.ModelSerializer):
    products = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), many=True, required=False)

    class Meta:
        model = Project
        fields = ['id', 'name', 'image', 'user', 'purchaseDate', 'description', 'totalPurchaseAmount', 'products']

    def create(self, validated_data):
        products_data = validated_data.pop('products', None)
        project = Project.objects.create(**validated_data)
        if products_data:
            project.products.set(products_data)
        return project

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['project_id'] = instance.id
        return representation


class ProjectProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectProduct
        fields = ['project', 'product', 'quantity']


class SupplierSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=Supplier.objects.all())]
    )
    class Meta:
        model = Supplier
        fields = ['id', 'name', 'email']

class OrderSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    supplier = SupplierSerializer(read_only=True)
    class Meta:
        model = Order
        fields = ['id', 'project', 'supplier', 'status', 'date']

class SaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fiels = ['id', 'date', 'amount']