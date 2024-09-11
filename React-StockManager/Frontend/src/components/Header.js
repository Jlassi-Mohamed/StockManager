import { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import defaultUserIcon from "../assets/user.png";
import Swal from "sweetalert2";
import  {getNotifications} from "../utils/utils"
const navigation = [
  { name: "Dashboard", href: "/", current: true },
  { name: "Inventory", href: "/inventory", current: false },
  { name: "Purchase Details", href: "/purchase-details", current: false },
  { name: "Manage Orders", href: "/manage-orders", current: false },
];

const userNavigation = [{ name: "Logout", href: "./login" }];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const localStorageData = JSON.parse(localStorage.getItem("user")) || {};
  const navigate = useNavigate();

  const logoutUser = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        localStorage.removeItem("authTokens");
        navigate("/login");
        Swal.fire({
          title: 'Logged out!',
          text: 'You have been logged out.',
          icon: 'success',
          timer: 1500, 
          showConfirmButton: false,
        });
      }
    });
  };
  const [notifications, setNotifications] = useState([]);
  const [notifClicked, setNotifClicked] = useState(false);

  const handleNotif = () => {
    setNotifClicked(!notifClicked)
  }
  useEffect(() => {
      fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
      try {
          const data = await getNotifications();
          setNotifications(data);
      } catch (error) {
          console.error('Failed to fetch notifications:', error);
      }
  };
  return (
    <div className="min-h-full">
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex justify-center items-center gap-2">
                      <img
                        className="h-8 w-8"
                        src={require("../assets/logo.png")}
                        alt="Inventory Management System"
                      />
                      <span className="font-bold text-white italic">
                        StockManager
                      </span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    <button
                      type="button"
                      className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      onClick={handleNotif}
                      >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    {notifClicked &&
                      <panel>
                        <ul>
                        {notifications.map((notif, index) => (
                            <li key={index}>{notif.message}</li>
                        ))}
                        </ul>
                      </panel>
                    }
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 rounded-full"
                            src={localStorageData.profile_picture || defaultUserIcon}
                            alt="profile"
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <button
                                  onClick={logoutUser}
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block w-full text-left px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  {item.name}
                                </button>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon
                        className="block h-6 w-6"
                        aria-hidden="true"
                      />
                    ) : (
                      <Bars3Icon
                        className="block h-6 w-6"
                        aria-hidden="true"
                      />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                {navigation.map((item) => (
                  <Link to={item.href} key={item.name}>
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block rounded-md px-3 py-2 text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  </Link>
                ))}
              </div>
              <div className="border-t border-gray-700 pt-4 pb-3">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={localStorageData.profile_picture || defaultUserIcon}
                      alt="profile"
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">
                      {localStorageData.first_name &&
                        localStorageData.last_name &&
                        `${localStorageData.first_name} ${localStorageData.last_name}`}
                    </div>
                    <div className="text-sm font-medium leading-none text-gray-400">
                      {localStorageData.role}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  {userNavigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={logoutUser}
                      className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
