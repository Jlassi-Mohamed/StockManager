import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { uploadImage, jwt } from "../utils/utils"; 

export default function UpdateProduct({
  updateProductData,
  updateModalSetting,
  handlePageUpdate,
}) {
  const { id, name, price, quantity, category, description, image, user } = updateProductData;
  const [product, setProduct] = useState({
    id: id,
    name: name,
    price: price,
    description: description,
    image: image,
    quantity: quantity,
    category: category,
    user: user
  });
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  const handleInputChange = (key, value) => {
    setProduct({ ...product, [key]: value });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await uploadImage(file, setProduct, product);
      } catch (error) {
        console.error("Error uploading image:", error);
        Swal.fire({
          icon: 'error',
          title: 'Upload Error',
          text: 'There was an error uploading the image.',
          timer: 2500
        });
      }
    }
  };

  const updateProduct = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/products/modify/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt.access}`
        },
        body: JSON.stringify(product)
      });
      const data = await response.json();

      if (response.status === 200) {
        Swal.fire({
          title: 'Success!',
          text: 'Your data has been updated successfully.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        setOpen(false);
        updateModalSetting(); 
        handlePageUpdate();
      } else {
        Swal.fire({
          title: 'Error!',
          text: data.detail || "Your data can't be updated!",
          icon: 'error',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      handlePageUpdate();
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
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
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <PlusIcon
                        className="h-6 w-6 text-blue-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold leading-6 text-gray-900"
                      >
                        Update Product
                      </Dialog.Title>
                      <form action="#">
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="name"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={product.name}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              placeholder="Ex. Apple iMac 27&ldquo;"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="price"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Price
                            </label>
                            <input
                              type="text"
                              name="price"
                              id="price"
                              value={product.price}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              placeholder="Ex. Apple"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="quantity"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Quantity
                            </label>
                            <input
                              type="number"
                              name="quantity"
                              id="quantity"
                              value={product.quantity}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              placeholder=""
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="category"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Category
                            </label>
                            <input
                              type="text"
                              name="category"
                              id="category"
                              value={product.category}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              placeholder="Ex. Electronics"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="description"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Description
                            </label>
                            <textarea
                              id="description"
                              name="description"
                              value={product.description}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              placeholder="Product description"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="image"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Product Image
                            </label>
                            <input
                              type="file"
                              name="image"
                              id="image"
                              
                              onChange={handleFileChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                    onClick={updateProduct}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-200 sm:mt-0 sm:w-auto"
                    onClick={() => {
                      setOpen(false);
                      updateModalSetting();
                    }}
                    ref={cancelButtonRef}
                  >
                    Cancel
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
