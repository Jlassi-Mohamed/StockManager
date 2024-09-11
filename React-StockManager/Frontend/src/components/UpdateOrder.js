import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Swal from 'sweetalert2';
import { jwt } from "../utils/utils";
import useHasPermission from "../hooks/useHasPermission";

export default function UpdateOrder({ updateOrderData, updateModalSetting, handlePageUpdate }) {
  const { id, supplier_id, status } = updateOrderData;
  const hasPermissionToUpdateOrder = useHasPermission('update_order');

  const [order, setOrder] = useState({
    id: id,
    supplier_id: supplier_id,
    status: status,
  });
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
  };

  const updateOrder = async () => {
    try {
      let request = await fetch(`http://127.0.0.1:8000/products/orders/modify/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt.access}`
        },
        body: JSON.stringify(order),
      });
      const data = await request.json();
      if (request.ok) {
        Swal.fire({
          title: 'Success!',
          text: 'Order updated successfully.',
          icon: 'success',
          timer: 1500, 
          showConfirmButton: false 
        });
        setOpen(false);
        handlePageUpdate();
      } else {
        Swal.fire({
          title: 'Error!',
          text: data.detail || 'Something went wrong!',
          icon: 'error'
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Network error, please try again later.',
        icon: 'error'
      });
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" initialFocus={cancelButtonRef} open={open} onClose={() => setOpen(false)}>
        <div className="fixed inset-0 bg-gray-500/75" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="max-w-sm mx-auto bg-white rounded p-6 shadow-lg">
            <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">Update Order</Dialog.Title>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">Supplier</label>
              <input
                type="text"
                name="supplier_id"
                value={order.supplier_id}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <label className="block text-sm font-medium text-gray-700 mt-4">Status</label>
              <select
                name="status"
                value={order.status}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="ordered">Ordered</option>
                <option value="delivered">Delivered</option>
                <option value="in progress">In progress</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
            <div className="flex gap-4 mt-4">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={updateOrder}
                disabled={!hasPermissionToUpdateOrder}
              >
                Save
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-gray-300 px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => setOpen(false)}
                ref={cancelButtonRef}
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
