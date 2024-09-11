import React from "react";
import { Link } from "react-router-dom";
import defaultUserIcon from "../assets/user.png";
import "../assets/style.css"
import { userData } from "../utils/utils";
import useHasPermission from "../hooks/useHasPermission";
function SideMenu() {
  const hasPermissionToRetrieveUsers = useHasPermission('retrieve_user')
  return (
    <div className="h-full flex-col justify-between  bg-white hidden lg:flex ">
      <div className="px-4 py-6">
        <nav aria-label="Main Nav" className="mt-6 flex flex-col space-y-1">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg hover:bg-gray-100 px-4 py-2 text-gray-700"
          >
            <img
              alt="dashboard-icon"
              src={require("../assets/dashboard-icon.png")}
              className="icon"
            />
            <span className="text-sm font-medium"> Dashboard </span>
          </Link>

          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
              <Link to="/inventory">
                <div className="flex items-center gap-2">
                  <img
                    alt="inventory-icon"
                    src={require("../assets/inventory-icon.png")
                    }
                    className="icon"
                  />
                  <span className="text-sm font-medium"> Inventory </span>
                </div>
              </Link>
            </summary>
          </details>

          <Link
            to="/purchase-details"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <img
              alt="purchase-icon"
              src={require("../assets/purchase-icon.png")}
              className="icon"
            />
            <span className="text-sm font-medium"> Purchase Details</span>
          </Link>
          <Link
            to="/sales"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <img alt="sale-icon" src={require("../assets/sales.png")} className="icon" />
            <span className="text-sm font-medium"> Sales</span>
          </Link>
          {hasPermissionToRetrieveUsers && (
          <Link
            to="/manage-users"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
            <img alt="sale-icon" src={require("../assets/user-management.png")} className="icon"/>
            <span className="text-sm font-medium"> Manage users</span>
          </Link>
          )}
          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
              <Link to="/manage-orders">
                <div className="flex items-center gap-2">
                  <img
                    alt="orders-icon"
                    src={require("../assets/store-icon.png")}
                    className="icon"
                  />
                  <span className="text-sm font-medium"> Manage Orders </span>
                </div>
              </Link>
            </summary>
          </details>
        </nav>
      </div>

      <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
        <div className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
          <img
            alt="Profile"
            src={userData.profile_picture || defaultUserIcon}
            className="h-10 w-10 rounded-full object-cover"
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              objectFit: 'cover' 
          }} 
          />

          <div>
            <p className="text-xs">
              <strong className="block font-medium">
                {userData.first_name + " " + userData.last_name}
              </strong>

              <span> {userData.role} </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideMenu;
