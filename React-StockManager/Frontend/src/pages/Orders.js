import React, { useState, useEffect } from "react";
import swal from "sweetalert";
import { jwt } from "../utils/utils";
import AddSupplier from "../components/AddSupplier";
import cancelIcon from "../assets/cancel.png";
import orderIcon from "../assets/shopping-bag.png";
import deliverIcon from "../assets/tracking.png";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatePage, setUpdatePage] = useState(true);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const addSupplierModalSetting = () => {
    setShowSupplierModal(!showSupplierModal);
  };

  useEffect(() => {
    fetchOrdersData();
    fetchSuppliersData();
  }, [updatePage]);

  const fetchOrdersData = async () => {
    try {
      let request = await fetch("http://127.0.0.1:8000/products/orders/get-all/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt.access}`,
        },
      });
      const data = await request.json();
      if (request.status === 200) {
        setOrders(data);
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchSuppliersData = async () => {
    try {
      let request = await fetch("http://127.0.0.1:8000/products/supplier/get-all/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt.access}`,
        },
      });
      const data = await request.json();
      if (request.status === 200) {
        setSuppliers(data);
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const modifyOrderStatus = async (orderId, status, supplier_id=null) => {
    try {
      let request = await fetch("http://127.0.0.1:8000/products/orders/modify/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt.access}`,
        },
        body: JSON.stringify({
          id: orderId,
          status,
          supplier_id,
        }),
      });

      if (request.ok) {
        swal("Success!", `Order status has been updated to ${status}`, "success");
        handlePageUpdate();
      } else {
        swal("Error!", "Failed to update order status", "error");
      }
    } catch (error) {
      console.log(error);
      swal("Error!", "Something went wrong", "error");
    }
  };

  const handleOrderClick = (orderId) => {
    modifyOrderStatus(orderId, "ordered");
  };

  const deleteOrder = async (orderId) => {
    const result = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this order?",
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
        let request = await fetch("http://127.0.0.1:8000/products/orders/delete/", {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${jwt.access}`,
          },
          body: JSON.stringify({ id: orderId }),
        });
        if (request.ok) {
          swal("Deleted!", "Order has been deleted successfully", "success");
          handlePageUpdate();
        }
      } catch (error) {
        alert("Error deleting order");
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
  
  const handleDeliverClick = async (orderId) => {
    const supplierOptions = suppliers.map(supplier => {
      return `<option value="${supplier.id}">${supplier.name}</option>`;
    }).join('');
  
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <select id="supplier-select">
        ${supplierOptions}
      </select>
    `;
  
    const { value: supplierId } = await swal({
      title: "Select Supplier",
      content: wrapper,
      buttons: {
        confirm: {
          text: "Submit",
          closeModal: true,
        },
      },
    });
  
    const selectedSupplierId = document.getElementById('supplier-select').value;
    console.log("selectedSupplierId", selectedSupplierId);
  
    if (selectedSupplierId) {
      const selectedSupplier = suppliers.find(supplier => supplier.id === parseInt(selectedSupplierId, 10));
  
      if (selectedSupplier) {
        modifyOrderStatus(orderId, "delivered", selectedSupplierId);
      } else {
        swal("Error!", "No valid supplier selected", "error");
      }
    } else {
      swal("Error!", "No supplier selected", "error");
    }
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        <div className="bg-white rounded p-3">
          <span className="font-semibold px-4">Order Management</span>
          <div className="flex justify-between items-center p-4">
            <div className="flex gap-4 items-center">
              <span className="font-semibold text-blue-600 text-base">
                Total Orders
              </span>
              <span className="font-semibold text-gray-600 text-base">
                {orders.length}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
                onClick={addSupplierModalSetting}
              >
                Add Supplier
              </button>
            </div>
          </div>
        </div>
        {showSupplierModal && (
          <AddSupplier
            addUserModalSetting={addSupplierModalSetting}
            handlePageUpdate={handlePageUpdate}
          />
        )}

        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center">
              <span className="font-bold">Orders</span>
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
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Order ID
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Project Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Supplier Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Status
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Date
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders
                .filter(order =>
                  order.project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  order.supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((order) => (
                  <tr key={order.id}>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      {order.id || 0}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      {order.project.name || "No Project Name"} 
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      {order.supplier.name || "No Supplier Name"} 
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      {order.status || "N/A"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      {new Date(order.date).toLocaleDateString() || "N/A"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      <div className="flex gap-3">
                        <button onClick={() => handleOrderClick(order.id)}>
                          <img
                            alt="order-icon"
                            src={orderIcon}
                            className="w-6 h-6"
                          />
                        </button>
                        <button onClick={() => handleDeliverClick(order.id)}>
                          <img
                            alt="deliver-icon"
                            src={deliverIcon}
                            className="w-6 h-6"
                          />
                        </button>
                        <button onClick={() => deleteOrder(order.id)}>
                          <img
                            alt="delete-icon"
                            src={cancelIcon}
                            className="w-6 h-6"
                          />
                        </button>
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

export default Orders;
