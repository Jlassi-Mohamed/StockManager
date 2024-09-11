import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Swal from 'sweetalert2';
import { fetchPermissionsNames, jwt } from "../utils/utils"; 

export default function AddRole({
  addRoleModalSetting,
  roles = [],
  handlePageUpdate,
}) {
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    const getPermissions = async () => {
      try {
        const permissionData = await fetchPermissionsNames(); 
        const permissionNames = permissionData.map(role => role.name);
        setAvailablePermissions(permissionNames);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch roles.',
        });
      }
    };

    getPermissions();
  }, []);
  const handleRoleNameChange = (e) => {
    setRoleName(e.target.value);
  };

  const handlePermissionChange = (e) => {
    const permission = e.target.value;
    setSelectedPermissions((prevPermissions) =>
      prevPermissions.includes(permission)
        ? prevPermissions.filter((p) => p !== permission)
        : [...prevPermissions, permission]
    );
  };

  const addRole = () => {
    const isDuplicate = roles.some(
      (role) => role.name.toLowerCase() === roleName.toLowerCase()
    );

    if (isDuplicate) {
      Swal.fire({
        icon: 'warning',
        title: 'Already Exists',
        text: 'The role you are trying to add already exists.',
        confirmButtonText: 'OK'
      });
      return;
    }

    fetch("http://127.0.0.1:8000/accounts/add-new-role/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${jwt.access}`
      },
      body: JSON.stringify({
        role_name: roleName,
        permissions: selectedPermissions,
      }),
    })
      .then((result) => {
        Swal.fire({
          title: 'Success!',
          text: 'Role has been added successfully.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        handlePageUpdate();
        addRoleModalSetting();
      })
      .catch((err) => console.log(err));
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
                        Add Role
                      </Dialog.Title>
                      <form action="#">
                        <div className="mb-4">
                          <label
                            htmlFor="roleName"
                            className="block mb-2 text-sm font-medium text-gray-900"
                          >
                            Role Name
                          </label>
                          <input
                            type="text"
                            name="roleName"
                            id="roleName"
                            value={roleName}
                            onChange={handleRoleNameChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            placeholder="Enter role name"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="rolePermissions"
                            className="block mb-2 text-sm font-medium text-gray-900"
                          >
                            Permissions
                          </label>
                          <div id="rolePermissions" className="grid grid-cols-2 gap-2">
                            {availablePermissions.map((permission) => (
                              <div key={permission}>
                                <input
                                  type="checkbox"
                                  value={permission}
                                  id={`permission-${permission}`}
                                  checked={selectedPermissions.includes(permission)}
                                  onChange={handlePermissionChange}
                                  className="mr-2"
                                />
                                <label htmlFor={`permission-${permission}`} className="text-sm text-gray-900">
                                  {permission}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                            onClick={addRole}
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={() => addRoleModalSetting()}
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
