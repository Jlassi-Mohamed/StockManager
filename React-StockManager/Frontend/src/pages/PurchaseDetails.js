import React, { useState, useEffect } from "react";
import AddPurchaseDetails from "../components/AddPurchaseDetails";
import AddProductsToProject from "../components/AddProductsToProject";
import { jwt } from "../utils/utils";
import Swal from "sweetalert2";
import deleteIcon from "../assets/bin.png";
import addIcon from "../assets/add.png";
import orderIcon from "../assets/shopping.png";
import {useNavigate} from "react-router-dom";
function PurchaseDetails() {
  const [showPurchaseModal, setPurchaseModal] = useState(false);
  const [showAddProductsModal, setAddProductsModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);

  useEffect(() => {
    fetchProjectsData();
  }, [updatePage]);

  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  const fetchProjectsData = async () => {
    try {
      let request = await fetch("http://127.0.0.1:8000/products/projects/get-all/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt.access}`
        }
      });
      let data = await request.json();
      if (request.ok) {
        setProjects(data);
      } else {
        console.error("Error fetching projects:", data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  const navigate = useNavigate();

  const deleteProject = async(id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "Are you sure that you want to delete this project?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });
      if(result.isConfirmed) {
          let request = await fetch("http://127.0.0.1:8000/products/projects/delete/", {
            method: "DELETE", 
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${jwt.access}`, 
            },
            body: JSON.stringify({id: id})
          });
          const data = await request.json();
          if (request.status === 200) {
            console.log(" ok")
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            handlePageUpdate();
          }
          else {
            Swal.fire('Error!', data.detail || 'Something went wrong.', 'error');
          }
      }
    } catch(error) {
      handlePageUpdate();
    }
  } 
  const addSaleModalSetting = () => {
    setPurchaseModal(!showPurchaseModal);
  };


  const handleAddProducts = async(projectId) => {
    setSelectedProjectId(projectId);
    setAddProductsModal(true);
    await fetchProjectsData();
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        {showPurchaseModal && (
          <AddPurchaseDetails
            addSaleModalSetting={addSaleModalSetting}
            handlePageUpdate={handlePageUpdate}
          />
        )}
        {showAddProductsModal && (
          <AddProductsToProject
            showAddProductsModal={showAddProductsModal}
            setShowAddProductsModal={setAddProductsModal}
            projectID={selectedProjectId} 
            handlePageUpdate={handlePageUpdate}
          />
        )}

        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center">
              <span className="font-bold">Purchase Details</span>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
                onClick={addSaleModalSetting}
              >
                Add Purchase
              </button>
            </div>
          </div>
          {projects.length > 0 ? (
            <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Project
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Name
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Purchase Date
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Description
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Total Purchase Amount
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Created by
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      <img src={project.image} style={{ width: "50px", height: "50px" }} alt="project-img" />
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {project.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {project.purchaseDate}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {project.description}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {project.totalPurchaseAmount}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {project.user}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                      src={addIcon}
                      alt="Add Products"
                      style={{ cursor: 'pointer', width: '20px', height: '20px' }} 
                      onClick={() => handleAddProducts(project.id)}
                      />
                      <img
                      src={orderIcon}
                      alt="Add Products"
                      style={{ cursor: 'pointer', width: '20px', height: '20px' }} 
                      onClick={() => navigate('/manage-orders')}
                      />
                      <img
                      src={deleteIcon}
                      alt="Delete"
                      style={{ cursor: 'pointer', width: '20px', height: '20px' }} 
                      onClick={() => deleteProject(project.id)}
                      />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No projects found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PurchaseDetails;
