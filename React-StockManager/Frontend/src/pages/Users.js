import React, { useState, useEffect } from "react";
import AddUser from "../components/AddUser";
import UpdateUser from "../components/UpdateUser";
import AddRole from "../components/AddRole"; 
import editIcon from "../assets/edit.png";
import deleteIcon from "../assets/bin.png";
import defaultUserIcon from "../assets/user.png";
import swal from "sweetalert";
import { jwt } from "../utils/utils";
import useHasPermission from "../hooks/useHasPermission";

function Users() {
  const [showUserModal, setShowUserModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false); 
  const [updateUser, setUpdateUser] = useState(null);
  const [users, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatePage, setUpdatePage] = useState(true);
  const hasPermissionToCreateUser = useHasPermission("create_user");
  const hasPermissionToRetrieveUser = useHasPermission("retrieve_user");
  const hasPermissionToUpdateUser = useHasPermission('update_user');
  const hasPermissionToDeleteUser = useHasPermission('delete_user');

  useEffect(() => {
    fetchUsersData();
  }, [updatePage]);

  const fetchUsersData = async () => {
    try {
      let request = await fetch("http://127.0.0.1:8000/accounts/get/", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${jwt.access}`,
        },
      });
      const data = await request.json();
      if (request.status === 200) {
        console.log("Users fetched");
        setAllUsers(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addUserModalSetting = () => {
    setShowUserModal(!showUserModal);
  };

  const updateUserModalSetting = (selectedUserData) => {
    console.log("Clicked: edit");
    console.log(selectedUserData);
    setUpdateUser(selectedUserData);
    setShowUpdateModal(!showUpdateModal);
  };

  const addRoleModalSetting = () => {
    setShowRoleModal(!showRoleModal); 
  };

  const deleteUser = async (username) => {
    const result = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this user?",
      icon: "warning",
      dangerMode: true,
      buttons: {
        cancel: "Cancel",
        confirm: {
          text: "Delete",
          value: true,
          visible: true,
          className: "swal-button--danger",
          closeModal: true,
        },
      },
    });
    if (result) {
      try {
        let request = await fetch("http://127.0.0.1:8000/accounts/delete/", {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${jwt.access}`,
          },
          body: JSON.stringify({ username: username }),
        });
        if (request.ok) {
          swal("Deleted!", "User has been deleted successfully", "success");
          handlePageUpdate();
        }
      } catch (error) {
        alert("Error deleting user");
      }
    } else {
      swal("Cancelled", "", "info");
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
          <span className="font-semibold px-4">User Management</span>
          <div className="flex justify-between items-center p-4">
            <div className="flex gap-4 items-center">
              <span className="font-semibold text-blue-600 text-base">
                Total Users
              </span>
              <span className="font-semibold text-gray-600 text-base">
                {users.length}
              </span>
            </div>
            <div className="flex gap-2">
              {hasPermissionToCreateUser && (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
                  onClick={addUserModalSetting}
                >
                  Add User
                </button>
              )}
              {hasPermissionToCreateUser && (
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold p-2 text-xs rounded"
                  onClick={addRoleModalSetting} 
                >
                  Add Role
                </button>
              )}
            </div>
          </div>
        </div>

        {showUserModal && (
          <AddUser
            addUserModalSetting={addUserModalSetting}
            handlePageUpdate={handlePageUpdate}
          />
        )}
        {hasPermissionToUpdateUser && showUpdateModal && (
          <UpdateUser
            updateUserData={updateUser}
            updateModalSetting={updateUserModalSetting}
            handlePageUpdate={handlePageUpdate}
          />
        )}
        {hasPermissionToCreateUser && showRoleModal && (
          <AddRole
            addRoleModalSetting={addRoleModalSetting} 
            handlePageUpdate={handlePageUpdate}
          />
        )}

        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center">
              <span className="font-bold">Users</span>
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
          </div>
          {hasPermissionToRetrieveUser && (
            <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900"></th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    First Name
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Last Name
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Username
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Email
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Role
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Bio
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users
                  .filter(
                    (user) =>
                      user.first_name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      user.last_name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      user.username
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      user.email
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      user.role
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .map((user) => (
                    <tr key={user.id}>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                        <img
                          src={user.profile_picture || defaultUserIcon}
                          alt="profile_picture"
                          style={{
                            width: "25px",
                            height: "25px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                        {user.first_name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        {user.last_name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        {user.username}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        {user.role}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        {user.bio || "N/A"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2">
                        <div className="flex items-center space-x-4">
                          {hasPermissionToUpdateUser && (
                          <button
                            onClick={() => updateUserModalSetting(user)}
                            className="flex items-center justify-center w-6 h-6 text-green-600 hover:text-green-800"
                          >
                            <img src={editIcon} alt="edit_icon" />
                          </button>
                          )}
                          {hasPermissionToDeleteUser && (
                          <button
                            onClick={() => deleteUser(user.username)}
                            className="flex items-center justify-center w-6 h-6 text-red-600 hover:text-red-800"
                          >
                            <img src={deleteIcon} alt="delete_icon" />
                          </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Users;
