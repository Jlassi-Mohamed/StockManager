import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Swal from 'sweetalert2';

export default function AddCategory({
  addCategoryModalSetting,
  categories = [],
  handlePageUpdate,
}) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);
  const jwt = JSON.parse(localStorage.getItem("authTokens"))

  const handleNameChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setCategoryDescription(e.target.value);
  };

  const addCategory = () => {
    const isDuplicate = categories.some(
        (category) => category.name.toLowerCase() === categoryName.toLowerCase()
      );

    if (isDuplicate) {
        console.log("hi dup")
        Swal.fire({
            icon: 'warning',
            title: 'Already Exists',
            text: 'The item you are trying to add already exists.',
            confirmButtonText: 'OK'
          });
      return;
    }

    fetch("http://127.0.0.1:8000/products/categories/add/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${jwt.access}`
      },
      body: JSON.stringify({
        name: categoryName,
        description: categoryDescription,
      }),
    })
      .then((result) => {
        Swal.fire({
            title: 'Success!',
            text: 'Your data has been added successfully.',
            icon: 'success',
            timer: 1500, 
            showConfirmButton: false 
          });
        handlePageUpdate();
        addCategoryModalSetting();
      })
      .catch((err) => console.log(err));
  };

  return (
    // Modal
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg overflow-y-scroll">
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
                        className="text-lg py-4 font-semibold leading-6 text-gray-900"
                      >
                        Add Category
                      </Dialog.Title>
                      <form action="#">
                        <div className="mb-4">
                          <label
                            htmlFor="categoryName"
                            className="block mb-2 text-sm font-medium text-gray-900"
                          >
                            Category Name
                          </label>
                          <input
                            type="text"
                            name="categoryName"
                            id="categoryName"
                            value={categoryName}
                            onChange={handleNameChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            placeholder="Enter category name"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="categoryDescription"
                            className="block mb-2 text-sm font-medium text-gray-900"
                          >
                            Category Description
                          </label>
                          <textarea
                            name="categoryDescription"
                            id="categoryDescription"
                            value={categoryDescription}
                            onChange={handleDescriptionChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            placeholder="Enter category description"
                          />
                        </div>
                        <div className="flex items-center space-x-4">
                          <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                            onClick={addCategory}
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={() => addCategoryModalSetting()}
                            ref={cancelButtonRef}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
