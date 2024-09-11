import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { userData, uploadImage, jwt } from "../utils/utils"; 
import Swal from "sweetalert2";

export default function AddPurchaseDetails({
  addPurchaseModalSetting,
  handlePageUpdate,
}) {
  const [project, setProject] = useState({
    name: "",
    image: "",
    purchaseDate: "",
    description: "",
    totalPurchaseAmount: 0,
    user: userData.user_id,
  });
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  const handleProjectInputChange = (key, value) => {
    setProject({ ...project, [key]: value });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await uploadImage(file, setProject, project);
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

  const createProject = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/products/projects/add/", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${jwt.access}`
        },
        body: JSON.stringify(project),
      });

      const result = await response.json();

      if (response.ok) {
        setOpen(false); 
        Swal.fire({
          icon: 'success',
          title: 'Project Created',
          text: 'The project has been successfully created.',
          timer: 2500
        });
        handlePageUpdate();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Creation Error',
          text: result.error || "Failed to create project",
          timer: 2500
        });
      }
    } catch (err) {
      console.log(err);
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
                        Create Project
                      </Dialog.Title>
                      <form action="#">
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="name"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Project Name
                            </label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={project.name}
                              onChange={(e) =>
                                handleProjectInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Project Name"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="image"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Project Image
                            </label>
                            <input
                              type="file"
                              id="image"
                              name="image"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="purchaseDate"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Purchase Date
                            </label>
                            <input
                              type="date"
                              id="purchaseDate"
                              name="purchaseDate"
                              value={project.purchaseDate}
                              onChange={(e) =>
                                handleProjectInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="description"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Description
                            </label>
                            <textarea
                              id="description"
                              name="description"
                              value={project.description}
                              onChange={(e) =>
                                handleProjectInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Project Description"
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <button
                    type="button"
                    onClick={createProject}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Create Project
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-gray-200 rounded-lg hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                    onClick={() => setOpen(false)}
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
