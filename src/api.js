import axios, { isCancel } from "axios";

const checkInternetConnection = () => {
  if (!navigator.onLine) {
    console.log("You lost your internet connectivity!!");
  }
};

export var postAPI = function (URL, data) {
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: URL,
      data: data,
      // mode: "no-cors",
      // withCredentials: true,
      dataType: "text/html",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        checkInternetConnection();
        if (!isCancel(err)) {
          reject(err);
        }
      });
  });
};

export const getAuthToken = function () {
  return localStorage.getItem("token");
};
