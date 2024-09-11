from django.db.models import Sum
from django.db.models.functions import TruncMonth
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Category, Product, Project, ProjectProduct, Sale
from .serializers import CategorySerializer, ProjectSerializer, ProjectProductSerializer


class GetProjectProducts(APIView):
    def post(self, request):
        project_id = request.data.get("project_id")

        if not project_id:
            return Response({"error": "Project ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            project_products = ProjectProduct.objects.filter(project_id=project_id)
        except ProjectProduct.DoesNotExist:
            return Response({"error": "No products found for this project"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProjectProductSerializer(project_products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AddCategory(APIView):
    serializer_class = CategorySerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetCategories(APIView):
    serializer_class = CategorySerializer

    def get(self, request):
        categories = Category.objects.all()
        serializer = self.serializer_class(categories, many=True)
        return Response(serializer.data)

class DeleteCategory(APIView):
    def delete(self, request):
        category_id = request.data.get('id')
        if not category_id:
            return Response({"error": "ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            category = Category.objects.get(id=category_id)
            category.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Category.DoesNotExist:
            return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)

class ModifyCategory(APIView):
    serializer_class = CategorySerializer

    def put(self, request):
        category_id = request.data.get('id')
        print(request.data)
        if not category_id:
            return Response({"error": "ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.serializer_class(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.views import APIView

from .serializers import ProductSerializer


class AddProduct(APIView):
    serializer_class = ProductSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetAllProducts(APIView):
    serializer_class = ProductSerializer

    def get(self, request):
        products = Product.objects.all()
        serializer = self.serializer_class(products, many=True)
        return Response(serializer.data)

class DeleteProduct(APIView):
    def delete(self, request):
        product_id = request.data.get('id')
        if not product_id:
            return Response({"error": "ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            product = Product.objects.get(id=product_id)
            product.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

class ModifyProduct(APIView):
    serializer_class = ProductSerializer

    def put(self, request):
        product_id = request.data.get('id')
        if not product_id:
            return Response({"error": "ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.serializer_class(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.views import APIView


class AddProject(APIView):
    serializer_class = ProjectSerializer
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            project = serializer.save()
            supplier = Supplier.objects.get(id=1)
            order = Order.objects.create(
                project=project,
                supplier=supplier,
                status='in progress'
            )
            order_serializer = OrderSerializer(order)
            return Response({
                'project': serializer.data,
                'order': order_serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ModifyOrder(APIView):
    def put(self, request, *args, **kwargs):
        order_id = request.data.get('id')
        status_value = request.data.get('status')
        supplier_id = request.data.get('supplier')

        if not order_id:
            return Response({'error': 'Order ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        data = {
            'status': status_value if status_value is not None else order.status,
        }

        if supplier_id:
            try:
                supplier = Supplier.objects.get(id=supplier_id)
                data['supplier'] = supplier.id  # Here, you're passing the ID of the Supplier to the serializer
            except Supplier.DoesNotExist:
                return Response({'error': 'Supplier not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            data['supplier'] = order.supplier.id  # Keep the existing supplier ID

        serializer = OrderSerializer(order, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ModifyProject(APIView):
    serializer_class = ProjectSerializer

    def put(self, request):
        project_id = request.data.get('id')
        if not project_id:
            return Response({"error": "ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.serializer_class(project, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetAllProjects(APIView):
    serializer_class = ProjectSerializer
    def get(self, request):
        projects = Project.objects.all()
        serializer = self.serializer_class(projects, many=True)
        return Response(serializer.data)

class DeleteProject(APIView):
    def delete(self, request):
        project_id = request.data.get('id')
        if not project_id:
            return Response({"error": "ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            project = Project.objects.get(id=project_id)
            project.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

class GetProject(APIView):
    serializer_class = ProjectSerializer

    def get(self, request):
        user = request.user
        projects = Project.objects.filter(user=user)
        if not projects:
            return Response({"error": "No projects found for this user."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.serializer_class(projects, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class getTotalProjects(APIView):
    def get(self, request):
        return Response({"total": Project.objects.all().count()})

class getTotalProducts(APIView):
    def get(self, request):
        return Response(Product.objects.all().count())

from rest_framework.views import APIView
from .models import Project, Product

class AddProductsToProject(APIView):
    serializer_class = ProjectProductSerializer

    def post(self, request):
        project_id = request.data.get('project_id')
        if not project_id:
            return Response({'error': 'Project id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)

        products_data = request.data.get('products', [])
        if not isinstance(products_data, list):
            return Response({'error': 'Products should be a list of product objects with ID and quantity'}, status=status.HTTP_400_BAD_REQUEST)

        for item in products_data:
            product_id = item.get('id')
            quantity = item.get('quantity')

            if not product_id or quantity is None:
                return Response({'error': 'Each product must have an id and quantity'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                return Response({'error': f'Product with ID {product_id} not found'}, status=status.HTTP_404_NOT_FOUND)

            project_product, created = ProjectProduct.objects.get_or_create(project=project, product=product)
            project_product.quantity = quantity
            project_product.save()
        project.update_total_purchase_amount()
        return Response({'status': 'Products added to project successfully', 'total_purchase_amount': project.totalPurchaseAmount}, status=status.HTTP_201_CREATED)



from rest_framework.views import APIView
from .models import Supplier
from .serializers import SupplierSerializer

class AddSupplier(APIView):
    serializer_class = SupplierSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetSuppliers(APIView):
    serializer_class = SupplierSerializer

    def get(self, request):
        suppliers = Supplier.objects.all()
        serializer = self.serializer_class(suppliers, many=True)
        return Response(serializer.data)

class DeleteSupplier(APIView):
    def delete(self, request):
        supplier_id = request.data.get('id')
        if not supplier_id:
            return Response({"error": "ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            supplier = Supplier.objects.get(id=supplier_id)
            supplier.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Supplier.DoesNotExist:
            return Response({"error": "Supplier not found"}, status=status.HTTP_404_NOT_FOUND)

class ModifySupplier(APIView):
    serializer_class = SupplierSerializer

    def put(self, request):
        supplier_id = request.data.get('id')
        if not supplier_id:
            return Response({"error": "ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            supplier = Supplier.objects.get(id=supplier_id)
        except Supplier.DoesNotExist:
            return Response({"error": "Supplier not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.serializer_class(supplier, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Order
from .serializers import OrderSerializer

class AddOrder(APIView):
    serializer_class = OrderSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetOrders(APIView):
    serializer_class = OrderSerializer

    def get(self, request):
        orders = Order.objects.all()
        serializer = self.serializer_class(orders, many=True)
        return Response(serializer.data)

class DeleteOrder(APIView):
    def delete(self, request):
        order_id = request.data.get('id')
        if not order_id:
            return Response({"error": "ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            order = Order.objects.get(id=order_id)
            order.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

class ModifyOrder(APIView):
    serializer_class = OrderSerializer

    def put(self, request):
        order_id = request.data.get('id')
        if not order_id:
            return Response({"error": "ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.serializer_class(order, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class getUserTotalProjects(APIView):
    def get(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({"error": "ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Count the number of projects for the given user_id
            project_count = Project.objects.filter(user_id=user_id).count()
        except Project.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Return the count in the response
        return Response({"total": project_count}, status=status.HTTP_200_OK)


class getUserTotalProducts(APIView):
    def get(self, request):
        user_id = request.query_params.get('user_id')

        # Validate user_id
        if not user_id:
            return Response({"error": "ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product_count = Product.objects.filter(user_id=user_id).count()
        except Project.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Return the count in the response
        return Response({"total": product_count}, status=status.HTTP_200_OK)

class SalesDataView(APIView):
    def get(self, request, format=None):
        sales_by_month = (
            Sale.objects.annotate(month=TruncMonth('date'))
            .values('month')
            .annotate(total_sales=Sum('amount'))
            .order_by('month')
        )

        monthly_sales = [0] * 12
        for sale in sales_by_month:
            month_index = sale['month'].month - 1
            monthly_sales[month_index] = sale['total_sales']

        data = {
            'series': {
                'name': "Monthly Sales Amount",
                'data': monthly_sales,
            }
        }

        return Response(data)
