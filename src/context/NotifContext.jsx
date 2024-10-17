import React, { createContext, useContext, useState } from "react";
import { MdCheckCircle, MdError, MdInfo } from "react-icons/md";

const NotifContext = createContext();

const notificationTypes = {
  info: {
    color: "text-black",
    bgColor: "bg-white",
    iconColor: "text-black",
    icon: <MdInfo className="w-5 h-5" />,
  },
  success: {
    color: "text-black",
    bgColor: "bg-white",
    iconColor: "text-green-600",
    icon: <MdCheckCircle className="w-5 h-5" />,
  },
  error: {
    color: "text-black",
    bgColor: "bg-white",
    iconColor: "text-red-600",
    icon: <MdError className="w-5 h-5" />,
  },
};

export const NotifProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    message: "",
    visible: false,
    type: "info",
  });

  const showNotification = (msg, type = "info") => {
    setNotification({ message: msg, visible: true, type });

    setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const { message, visible, type } = notification;

  return (
    <NotifContext.Provider value={showNotification}>
      {children}
      {visible && (
        <div
          id="toast-simple"
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 flex items-center w-max p-4 space-x-4 rtl:space-x-reverse text-gray-500 ${
            notificationTypes[type].bgColor
          }  rounded-lg shadow-lg transition-transform duration-300 ease-in-out
            transform-gpu  ${
              visible
                ? "translate-y-0 opacity-100"
                : "-translate-y-10 opacity-0"
            }`}
          role="alert"
        >
          <div className={`${notificationTypes[type].iconColor}`}>
            {notificationTypes[type].icon}
          </div>
          <div
            className={`ps-4 text-sm font-normal ${notificationTypes[type].color}`}
          >
            {message}
          </div>
        </div>
      )}
    </NotifContext.Provider>
  );
};

export const useNotif = () => {
  return useContext(NotifContext);
};
