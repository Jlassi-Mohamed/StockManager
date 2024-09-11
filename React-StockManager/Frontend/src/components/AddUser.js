import { useState, useRef, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Swal from 'sweetalert2';
import { jwt, fetchRolesNames,addNotification } from "../utils/utils";

export default function AddUser({ addUserModalSetting, handlePageUpdate }) {

  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    password2: "",
    bio: "",
    profile_picture: null,
    role: "",
  });
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);
  useEffect(() => {
    const getRoles = async () => {
      try {
        const roleData = await fetchRolesNames(); 
        const roleNames = roleData.map(role => role.name);
        setRoles(roleNames);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch roles.',
        });
      }
    };

    getRoles();
  }, []);

  const uploadImage = async (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "stockmanager-profilepictures");

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dyeiuox51/image/upload", {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      if (response.ok) {
        setUserData({ ...userData, profile_picture: result.url });
        Swal.fire("Success", "Image Successfully Uploaded", "success");
      } else {
        Swal.fire("Error", "Image upload failed.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Image upload failed.", "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadImage(file);
    }
  };

  const addUser = async () => {
    if (userData.password !== userData.password2) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Passwords do not match.',
      });
      return;
    }

    const { password2, ...user } = userData;

    try {
      const response = await fetch("http://127.0.0.1:8000/accounts/create_user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt.access}`,
        },
        body: JSON.stringify(user),
      });
      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: 'Success!',
          text: data.detail || 'User has been added successfully.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
        handlePageUpdate();
        addUserModalSetting();
        addNotification("User created !")
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.detail || 'There was an issue with this operation.',
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'There was an error connecting to the server. Please check your internet connection.',
        timer: 2500,
      });
    }
  };

  return (
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
                        Add User
                      </Dialog.Title>
                      <form>
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                          {/* Form fields */}
                          <div>
                            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                              id="first_name"
                              name="first_name"
                              type="text"
                              value={userData.first_name}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            />
                          </div>
                          <div>
                            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                              id="last_name"
                              name="last_name"
                              type="text"
                              value={userData.last_name}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            />
                          </div>
                          <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                              id="username"
                              name="username"
                              type="text"
                              value={userData.username}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                              id="email"
                              name="email"
                              type="email"
                              value={userData.email}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            />
                          </div>
                          <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                              id="password"
                              name="password"
                              type="password"
                              value={userData.password}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            />
                          </div>
                          <div>
                            <label htmlFor="password2" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                              id="password2"
                              name="password2"
                              type="password"
                              value={userData.password2}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            />
                          </div>
                          <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                            <textarea
                              id="bio"
                              name="bio"
                              value={userData.bio}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            />
                          </div>
                          <div>
                            <label htmlFor="profile_picture" className="block text-sm font-medium text-gray-700">Profile Picture</label>
                            <input
                              id="profile_picture"
                              name="profile_picture"
                              type="file"
                              onChange={handleFileChange}
                              className="mt-1 block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                          </div>
                          <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                            <select
                              id="role"
                              name="role"
                              value={userData.role}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            >
                              <option value="">Select a role</option>
                              {roles.map((role, index) => (
                                <option key={index} value={role}>
                                  {role}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-sm"
                            onClick={addUser}
                          >
                            Add User
                          </button>
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:text-sm ml-2"
                            onClick={() => setOpen(false)}
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
