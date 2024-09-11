import React, { useState, useEffect} from "react";
import AddProduct from "../components/AddProduct";
import UpdateProduct from "../components/UpdateProduct";
import AddCategory from "../components/AddCategory";
import UpdateCategory from "../components/UpdateCategory";
import editIcon from "../assets/edit.png";
import { jwt, getUsernameById } from "../utils/utils";
import deleteIcon from "../assets/bin.png";
import useHasPermission from "../hooks/useHasPermission";
import Swal from "sweetalert2"
function Inventory() {
  const [showProductModal, setShowProductModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showUpdateCategoryModal, setShowUpdateCategoryModal] = useState(false);
  const [updateProduct, setUpdateProduct] = useState([]);
  const [updateCategory, setUpdateCategory] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [categories, setAllCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatePage, setUpdatePage] = useState(true);
  const [orders, setAllOrders] = useState([]);

  const hasPermissionToUpdateProduct = useHasPermission('update_product');
  const hasPermissionToCreateProduct = useHasPermission('create_product');
  const hasPermissionToDeleteProduct = useHasPermission('delete_product');
  const hasPermissionToRetrieveProduct = useHasPermission('retrieve_product');


  useEffect(() => {
    fetchProductsData();
    fetchCategoriesData();
  }, [updatePage]);

  const fetchProductsData = async () => {
    try {
      let request = await fetch('http://127.0.0.1:8000/products/get-all/', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt.access}`,
        },
      });
      const data = await request.json();
      if (request.status === 200) {
        setAllProducts(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategoriesData = async () => {
    try {
      let request = await fetch('http://127.0.0.1:8000/products/categories/get-all/', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt.access}`,
        },
      });
      const data = await request.json();
      console.log(data)
      if (request.status === 200) {
        setAllCategories(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addProductModalSetting = () => {
    setShowProductModal(!showProductModal);
  };


  const updateProductModalSetting = (selectedProductData) => {
    setUpdateProduct(selectedProductData);
    setShowUpdateModal(!showUpdateModal);
  };

  const addCategoryModalSetting = () => {
    setShowCategoryModal(!showCategoryModal);
  };

  const updateCategoryModalSetting = (selectedCategoryData) => {
    setUpdateCategory(selectedCategoryData);
    setShowUpdateCategoryModal(!showUpdateCategoryModal);
    fetchCategoriesData(); 
  };
  

  const deleteItem = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });
  
      if (result.isConfirmed) {
        let request = await fetch("http://127.0.0.1:8000/products/delete/", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt.access}`,
          },
          body: JSON.stringify({ id: id }),
        });
        if (request.ok) {
          Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          handlePageUpdate();
        }
      }
    } catch (error) {
      Swal.fire('Error!', 'Something went wrong.', 'error');
    }
  };
  
  const deleteCategory = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "All products of this category will be deleted !",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });
  
      if (result.isConfirmed) {
        let request = await fetch("http://127.0.0.1:8000/products/categories/delete/", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt.access}`,
          },
          body: JSON.stringify({ id: id }),
        });
        let data = await request.json()
        if (request.ok) {
          Swal.fire('Deleted!', 'Category has been deleted.', 'success');
          fetchCategoriesData();
          handlePageUpdate();
        }
        else {
          Swal.fire("Can't delete project", data.detail, "error")
        }
      }
    } catch (error) {
      Swal.fire('Error!', 'Something went wrong.', 'error');
    }
  };


  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        <div className="bg-white rounded p-3">
          <span className="font-semibold px-4">Overall Inventory</span>
          <div className="flex flex-col md:flex-row justify-center items-center">
          <div className="flex flex-col p-10  w-full  md:w-3/12  ">
          <span className="font-semibold text-blue-600 text-base">
            Total Products
          </span>
          <span className="font-semibold text-gray-600 text-base">
            {products.length}
          </span>
          <span className="font-thin text-gray-400 text-xs">
            Last 7 days
          </span>
        </div>
          
        <div className="flex flex-col gap-3 p-10   w-full  md:w-3/12 sm:border-y-2  md:border-x-2 md:border-y-0">
          <span className="font-semibold text-yellow-600 text-base">
            Orders
          </span>
          <div className="flex gap-8">
            <div className="flex flex-col">
              <span className="font-semibold text-gray-600 text-base">
                {orders.length}
              </span>
              <span className="font-thin text-gray-400 text-xs">
                Last 7 days
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-600 text-base">
                $2000
              </span>
              <span className="font-thin text-gray-400 text-xs">
                Revenue
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 p-10  w-full  md:w-3/12  sm:border-y-2 md:border-x-2 md:border-y-0">
          <span className="font-semibold text-purple-600 text-base">
            Top Selling
          </span>
          <div className="flex gap-8">
            <div className="flex flex-col">
              <span className="font-semibold text-gray-600 text-base">
                5
              </span>
              <span className="font-thin text-gray-400 text-xs">
                Last 7 days
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-600 text-base">
                $1500
              </span>
              <span className="font-thin text-gray-400 text-xs">Cost</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 p-10  w-full  md:w-3/12  border-y-2  md:border-x-2 md:border-y-0">
          <span className="font-semibold text-red-600 text-base">
            Low Stocks
          </span>
          <div className="flex gap-8">
            <div className="flex flex-col">
              <span className="font-semibold text-gray-600 text-base">
                12
              </span>
              <span className="font-thin text-gray-400 text-xs">
                Ordered
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-600 text-base">
                2
              </span>
              <span className="font-thin text-gray-400 text-xs">
                Not in Stock
              </span>
              </div>
              </div>
            </div>
          </div>
        </div>

        {hasPermissionToCreateProduct && showProductModal && (
          <AddProduct
            addProductModalSetting={addProductModalSetting}
            handlePageUpdate={handlePageUpdate}
          />
        )}
        
        {hasPermissionToUpdateProduct && showUpdateModal && (
          <UpdateProduct
            updateProductData={updateProduct}
            updateModalSetting={updateProductModalSetting}
            handlePageUpdate={handlePageUpdate}
          />
        )}

        {showCategoryModal && (
          <AddCategory
            addCategoryModalSetting={addCategoryModalSetting}
            fetchCategoriesData={fetchCategoriesData}
          />
        )}
        {showUpdateCategoryModal && (
          <UpdateCategory
            updateCategoryData={updateCategory}
            updateCategoryModalSetting={updateCategoryModalSetting}
            fetchCategoriesData={fetchCategoriesData}
          />
        )}


        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center">
              <span className="font-bold">Products</span>
              <div className="flex justify-center items-center px-2 border-2 rounded-md">
                <img
                  alt="search-icon"
                  className="w-5 h-5"
                  src={require("../assets/search-icon.png")}
                />
                <input
                  className="border-none outline-none focus:border-none text-xs"
                  type="text"
                  placeholder="Search here"
                  value={searchTerm}
                  onChange={handleSearchTerm}
                />
              </div>
            </div>
            {hasPermissionToCreateProduct && (
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
                onClick={addProductModalSetting}
              >
                Add Product
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold p-2 text-xs rounded"
                onClick={addCategoryModalSetting}
              >
                Add Category
              </button> 
            </div>
          )}
          </div>
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Products</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Name</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Price</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Quantity</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Category</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Description</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Added by</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900"></th>
              </tr>
            </thead>
            {hasPermissionToRetrieveProduct && (
            <tbody className="divide-y divide-gray-200">
              {products
                .filter( product =>
                  product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  product.description.toLowerCase().includes(searchTerm.toLowerCase())
                )
              .map((element) => (
                <tr key={element.id}>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                    <img
                      src={element.image}
                      alt="product-image"
                      style={{ width: '100px', height: 'auto' }}
                    />
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-900">{element.name}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{element.price}</td>
                  <td className="whitespace-nowrap px-4 py-2" style={{ color: element.quantity === 0 ? 'red' : element.quantity < 10 ? 'orange' : 'green' }}>
                    {element.quantity === 0 ? 'Not in Stock' : `In Stock (${element.quantity})`}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{element.category}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{element.description}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {element.user}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {hasPermissionToUpdateProduct && (
                    <img
                      src={editIcon}
                      alt="Edit"
                      style={{ cursor: 'pointer', width: '20px', height: '20px' }} // Smaller size using inline styles
                      onClick={() => updateProductModalSetting(element)}
                    />
                    )}
                    {hasPermissionToDeleteProduct && (
                    <img
                      src={deleteIcon}
                      alt="Delete"
                      style={{ cursor: 'pointer', width: '20px', height: '20px' }} 
                      onClick={() => deleteItem(element.id)}
                    />
                    )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            )}
          </table>
        </div>

        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 mt-5">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center">
              <span className="font-bold">Categories</span>
              <div className="flex justify-center items-center px-2 border-2 rounded-md">
                <input
                  className="border-none outline-none focus:border-none text-xs"
                  type="text"
                  placeholder="Search categories"
                />
              </div>
            </div>
          </div>
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Category</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Name</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Description</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-900"><img src={category.image} alt="category-image"/></td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-900">{category.name}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{category.description}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={editIcon}
                    alt="Edit"
                    style={{ cursor: 'pointer', width: '20px', height: '20px' }} 
                    onClick={() => updateCategoryModalSetting(category)}
                  />
                  <img
                    src={deleteIcon}
                    alt="Delete"
                    style={{ cursor: 'pointer', width: '20px', height: '20px' }} 
                    onClick={() => deleteCategory(category.id)}
                  />
                  </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
