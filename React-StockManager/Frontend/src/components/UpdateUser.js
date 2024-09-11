import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Swal from 'sweetalert2';
import useHasPermission from "../hooks/useHasPermission";
import { addNotification, jwt } from "../utils/utils";

export default function UpdateUser({ updateUserData, updateModalSetting, handleUpdatePage }) {
  const { first_name, last_name, username, email, bio, profile_picture, role } = updateUserData;
  const hasPermissionToUpdateUser = useHasPermission('update_user');


  const [user, setUser] = useState({
    first_name: first_name,
    last_name: last_name,
    username: username,
    email: email,
    bio: bio,
    profile_picture: profile_picture,
    role: role
  });
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(user);
    setUser({ ...user, [name]: value });
    console.log(user);
  };

  const updateUser = async() => {
    try {
      let request = await fetch("http://127.0.0.1:8000/accounts/modify/", {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${jwt.access}`
        },
        body: JSON.stringify(user),
      })
      let data = await request.json();
      console.log(user)
      if(request.ok) {
        Swal.fire({
          title: 'Success!',
          text: 'Your data has been updated successfully.',
          icon: 'success',
          timer: 1500, 
          showConfirmButton: false 
        });
        setOpen(false);
        handleUpdatePage();
      }
      else {
        Swal(data.detail);
      }
    }catch(error) {
      Swal(error)
    }
  };

  return (
    // Modal
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
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
                      <PlusIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                        Update User
                      </Dialog.Title>
                      <form>
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                              First Name
                            </label>
                            <input
                              type="text"
                              name="first_name"
                              id="first_name"
                              value={user.first_name}
                              onChange={handleInputChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="First Name"
                            />
                          </div>
                          <div>
                            <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                              Last Name
                            </label>
                            <input
                              type="text"
                              name="last_name"
                              id="last_name"
                              value={user.last_name}
                              onChange={handleInputChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Last Name"
                            />
                          </div>
                          <div>
                            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                              Username
                            </label>
                            <input
                              type="text"
                              name="username"
                              id="username"
                              value={user.username}
                              onChange={handleInputChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Username"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                              Email
                            </label>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              value={user.email}
                              onChange={handleInputChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Email Address"
                            />
                          </div>
                          <div>
                            <label htmlFor="bio" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                              Bio
                            </label>
                            <textarea
                              id="bio"
                              name="bio"
                              rows="3"
                              value={user.bio}
                              onChange={handleInputChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Bio"
                            />
                          </div>
                          <div>
                            <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                              Role
                            </label>
                            <input
                              type="text"
                              name="role"
                              id="role"
                              value={user.role}
                              onChange={handleInputChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Role"
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                {hasPermissionToUpdateUser && (
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                    onClick={updateUser}
                  >
                    Update User
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => updateModalSetting()}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
