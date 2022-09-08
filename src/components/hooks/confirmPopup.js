import React from "react";
import CloseIcon from "../../images/CloseIcon.svg";
import "./confirmPopup.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { RiAlertFill } from "react-icons/ri";

export default function ConfirmPopup(data) {
  const handlePopup = () => {



    fetchdata(data.FormData)
      .then(function (result) {
        if (result.StatusCode === 200) {

          data.setReload(!data.reload);
          data.setTrigger(false);
        } else {

          toast("Error: Occurred error during fetch", {
            style: {
              color: "red",
              fontSize: "13px",
            },
          });
        }
      })
      .catch((err) => {
        toast("Error: Occurred error during fetch" + err, {
          style: {
            color: "red",
            fontSize: "13px",
          },
        });
      });
  };

  const fetchdata = async (dataToSend) => {

    if (dataToSend.Type === "POST") {

      const response = await fetch(dataToSend.FetchURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      const cooptive = await response.json();

      return cooptive;
    } else {
      const response = await fetch(dataToSend.FetchURL);
      const cooptive = await response.json();

      return cooptive;
    }
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
      />
      <div className="container confirm-popup">
        <div className="confirm-popup-inner ">
          <div className="popUpHeader ps-0 pe-0">
            <div className="popUpTitle">Easy School</div>
            <div className="popUpClose">
              <img
                className="popUpCloseIcon"
                src={CloseIcon}
                alt="CloseIcon"
                onClick={() => data.setTrigger(false)}
              />
            </div>
          </div>

          <div className="confirm-body ps-3 pe-3">
            <div className="row text-start ">
              <div className="">{data.message}</div>
            </div>
          </div>

          <div className="confirm-footer">
            <div className="row">
              <div>
                <button
                  type="button"
                  class="btn btn-sm me-2"
                  style={{ background: "var(--button-color)", color: "white" }}
                  onClick={handlePopup}
                >
                  Okay
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-danger me-1"
                  style={{ color: "white" }}
                  onClick={() => data.setTrigger(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
