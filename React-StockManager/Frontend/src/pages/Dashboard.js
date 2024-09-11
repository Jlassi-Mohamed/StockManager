import React, { useContext, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import AuthContext from "../AuthContext";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { jwt } from "../utils/utils";
import useHasPermission from "../hooks/useHasPermission";
ChartJS.register(ArcElement, Tooltip, Legend);
export const data = {
  labels: ["Apple", "Knorr", "Shoop", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "# of Votes",
      data: [0, 1, 5, 8, 9, 15],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

function Dashboard() {
  const [saleAmount, setSaleAmount] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const hasPermissionToRetrieveProducts = useHasPermission('retrieve_product')
  const hasPermissionToRetrieveUsers = useHasPermission('retrieve_user')
  const [chart, setChart] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
    },
    series: [
      {
        name: "series",
        data: [10, 20, 40, 50, 60, 20, 10, 35, 45, 70, 25, 70],
      },
    ],
  });

  const updateChartData = (salesData) => {
    setChart({
      ...chart,
      series: [
        {
          name: "Monthly Sales Amount",
          data: salesData,
        },
      ],
    });
  };
  

  const authContext = useContext(AuthContext);

  useEffect(() => {

    fetchTotalPurchaseAmount();
    fetchOrdersData();
    fetchUsersData();
    fetchProductsData();
    fetchMonthlySalesData();
  }, []);



  const fetchTotalPurchaseAmount = async() => {
    try {
      let request = await fetch(`http://127.0.0.1:8000/accounts/get-total-users/`, {
        method: "GET", 
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt.access}`,
        }
      }
    )
    let data = await request.json();
    if(request.ok) {
      setPurchaseAmount(data)
      
    }
    }catch(error) {
      console.log(error)
    }
  };


  const fetchOrdersData = () => {

  }
  const fetchUsersData = async() => {
    try {
      let request = await fetch("http://127.0.0.1:8000/accounts/get-total-users/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${jwt.access}`,
        }
      })
      let data = await request.json()
      setUsers(data)
    }catch(error) {
      console.log('zaejfn')
    }
  };

  const fetchProductsData = async() => {
    try {
      let request = await fetch("http://127.0.0.1:8000/products/get-total-products/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${jwt.access}`,
        }
      })
      let data = await request.json()
      setProducts(data)
    }catch(error) {
      console.log('zaejfn')
    }
  };

  const fetchMonthlySalesData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/products/sales-data/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${jwt.access}`,
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        updateChartData(data.series.data);
      } else {
        console.error("Failed to fetch sales data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching monthly sales data:", error);
    }
  };
  

  return (
    <>
      <div className="grid grid-cols-1 col-span-12 lg:col-span-10 gap-6 md:grid-cols-3 lg:grid-cols-4  p-4 ">
        <article className="flex flex-col gap-4 rounded-lg border  border-gray-100 bg-white p-6  ">
          <div className="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>

            <span className="text-xs font-medium"> 67.81% </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Sales
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900">
                ${saleAmount}
              </span>

              <span className="text-xs text-gray-500"> from $240.94 </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col  gap-4 rounded-lg border border-gray-100 bg-white p-6 ">
          <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>

            <span className="text-xs font-medium"> 67.81% </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Purchase
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900">
                {" "}
                ${purchaseAmount}{" "}
              </span>

              <span className="text-xs text-gray-500"> from $404.32 </span>
            </p>
          </div>
        </article>
        <article className="flex flex-col   gap-4 rounded-lg border border-gray-100 bg-white p-6 ">
          <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>

            <span className="text-xs font-medium"> 67.81% </span>
          </div>
          {hasPermissionToRetrieveProducts && (
          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Total Products
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900">

                {" "}
                {products}{" "}
              </span>

            </p>
          </div>
          )}
        </article>
        <article className="flex flex-col   gap-4 rounded-lg border border-gray-100 bg-white p-6 ">
          <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>

            <span className="text-xs font-medium"> 67.81% </span>
          </div>
          {hasPermissionToRetrieveUsers && (
          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Total users
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900">
                {" "}
                {users}{" "}
              </span>
            </p>
          </div>
          )}
        </article>
        <div className="flex justify-around bg-white rounded-lg py-8 col-span-full justify-center">
          <div>
            <Chart
              options={chart.options}
              series={chart.series}
              type="bar"
              width="500"
            />
          </div>
          <div>
            <Doughnut data={data} />
          </div>
        </div>

      </div>
    </>
  );
}

export default Dashboard;
