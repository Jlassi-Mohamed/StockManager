from django.urls import path
from products import views

urlpatterns = [
    # Product endpoints
    path('add/', views.AddProduct.as_view(), name='add_product'),
    path('delete/', views.DeleteProduct.as_view(), name='delete_product'),
    path('modify/', views.ModifyProduct.as_view(), name='modify_product'),
    path('get-all/', views.GetAllProducts.as_view(), name='get_all_products'),
    path('get-total-products/', views.getTotalProducts.as_view(), name='get_total_products'),
    path('get-project-products/', views.GetProjectProducts.as_view(), name='get_project_products' ),

    # Category endpoints
    path('categories/add/', views.AddCategory.as_view(), name='add_category'),
    path('categories/get-all/', views.GetCategories.as_view(), name='get_categories'),
    path('categories/delete/', views.DeleteCategory.as_view(), name='delete_category'),
    path('categories/modify/', views.ModifyCategory.as_view(), name='modify_category'),

    # Project endpoints
    path('projects/add/', views.AddProject.as_view(), name='add_project'),
    path('projects/modify/', views.ModifyProject.as_view(), name='modify_project'),
    path('projects/get-all/', views.GetAllProjects.as_view(), name='get_all_projects'),
    path('projects/my/', views.GetProject.as_view(), name='get_user_projects'),
    path('projects/delete/', views.DeleteProject.as_view(), name='delete_project'),
    path('projects/add-to-project/', views.AddProductsToProject.as_view(), name='add_to_project'),
    path('projects/get-total-projects/', views.getTotalProjects.as_view(), name='get_total_projects'),
    path('get-user-count-projects/', views.getUserTotalProjects.as_view(), name='get_count_projects'),
    path('get-user-count-products/', views.getUserTotalProducts.as_view(), name='get_count_products'),

    path('orders/get-all/', views.GetOrders.as_view(), name='get_all_orders'),
    path('orders/modify/', views.ModifyOrder.as_view(), name='modify_order'),
    path('orders/delete/', views.DeleteOrder.as_view(), name='delete_order'),
    path('supplier/add/', views.AddSupplier.as_view(), name='add_supplier'),
    path('supplier/get-all/', views.GetSuppliers.as_view(), name='get_all_suppliers'),
    path('sales-data/', views.SalesDataView.as_view(), name='sales_data'),

]
