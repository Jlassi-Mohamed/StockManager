import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Swal from 'sweetalert2';
import { fetchProductsData, jwt } from '../utils/utils'; 

export default function AddProductsToProject({ projectID, showAddProductsModal, setShowAddProductsModal, handlePageUpdate }) {
  const [products, setProducts] = useState([{ id: "", quantity: "1" }]);
  const [productOptions, setProductOptions] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProductsData();
        setProductOptions(data);
      } catch (err) {
        setError("Failed to fetch products.");
      }
    };

    getProducts();
  }, []);

  const handleProductChange = (index, event) => {
    const { name, value } = event.target;
    const updatedProducts = [...products];
    updatedProducts[index][name] = value;
    setProducts(updatedProducts);
  };

  const handleAddProduct = () => {
    setProducts([...products, { id: "", quantity: "1" }]); 

  };

  const handleRemoveProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formattedProducts = products.map(product => ({
      ...product,
      quantity: product.quantity || "1" 
    }));

    try {
      const response = await fetch("http://127.0.0.1:8000/products/projects/add-to-project/", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt.access}`
        },
        body: JSON.stringify({
          project_id: projectID, 
          products: formattedProducts
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to add products');
      }
  
      const result = await response.json();
      setSuccess("Products added successfully!");
      Swal.fire("Success", "Products added successfully!", "success");
      handlePageUpdate();
    } catch (error) {
      setError("An error occurred while adding products.");
      Swal.fire("Error", error.message || "An error occurred while adding products.", "error");
    }
  };
  
  return (
    <Transition.Root show={showAddProductsModal} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setShowAddProductsModal(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <PlusIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                        Add Products to Project
                      </Dialog.Title>
                      <form onSubmit={handleSubmit}>
                        {products.map((product, index) => (
                          <div key={index} className="flex items-center mb-2">
                            <select
                              name="id"
                              value={product.id}
                              onChange={(e) => handleProductChange(index, e)}
                              className="border p-2 w-1/2 bg-white"
                              required
                            >
                              <option value="" disabled>Select Product</option>
                              {productOptions.map(option => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ))}
                            </select>
                            <input
                              type="number"
                              name="quantity"
                              value={product.quantity}
                              onChange={(e) => handleProductChange(index, e)}
                              className="border p-2 w-1/2 ml-2"
                              placeholder="Quantity"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveProduct(index)}
                              className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={handleAddProduct}
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                          Add Another Product
                        </button>
                        <button
                          type="submit"
                          className="bg-green-500 text-white px-4 py-2 rounded ml-2"
                        >
                          Submit
                        </button>
                        {error && <p className="text-red-500 mt-4">{error}</p>}
                        {success && <p className="text-green-500 mt-4">{success}</p>}
                      </form>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end p-4">
                  <button
                    type="button"
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
                    onClick={() => setShowAddProductsModal(false)}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
