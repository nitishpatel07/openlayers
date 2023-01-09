import { toast } from "react-toastify";

export const showSuccessToast = (message) => {
  toast.success(message, {
    position: "bottom-left",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
};

export const showFailureToast = (message) => {
  toast.error(message, {
    position: "bottom-left",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
};

export const showRegularToast = (message) => {
  toast(message, {
    position: "bottom-left",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};

export const formatLargeNumber = (num) => {
  if (num < 1000) {
    return num.toString();
  }
  if (num < 100000) {
    return Math.floor(num / 1000) + "," + (num % 1000).toString();
  }
  if (num < 10000000) {
    return (
      Math.floor(num / 100000) +
      "," +
      Math.floor((num % 100000) / 1000) +
      "," +
      (num % 1000).toString()
    );
  }
  return (
    Math.floor(num / 10000000) +
    "," +
    Math.floor((num % 10000000) / 100000) +
    "," +
    Math.floor((num % 100000) / 1000) +
    "," +
    (num % 1000).toString()
  );
};
