import React, { useContext, useEffect, useState } from "react";
import "./viewNotificationPopup.css";
import CloseIcon from "../../images/CloseIcon.svg";

export default function ViewNotificationPopup({
  notification,
  setViewPopup,
  DFlag,
}) {
  const closePopUp = (e) => {
    setViewPopup(false);
  };


  return (
    <>
      <div className="container viewNotifyPopup-wrapper">
        <div className="viewNotifyPopup-inner ">
          <div className="popUpHeader ps-0 pe-0">
            <div className="popUpTitle">View</div>
            <div className="popUpClose">
              <img
                className="popUpCloseIcon"
                src={CloseIcon}
                alt="CloseIcon"
                onClick={closePopUp}
              />
            </div>
          </div>
          <div className="viewNotifyPopupBody ps-3 pe-3">
            <div className="row text-start mt-2 notification">
              <div className="row notify-header">
                <div className="col-lg-1 col-md-1 col-sm-1 sec-image">
                  <img
                    src={notification.CreatedByImage}
                    className="creator-img"
                  />
                </div>
                <div className="col-lg-3 col-md-3 col-sm-4 sec-creator text-start">
                  <div
                    className="created-by"
                    style={{ fontSize: "14px", fontWeight: "600" }}
                  >
                    Created By : {notification.CreatedBy}
                  </div>
                  <div className="created-at" style={{ fontSize: "12px" }}>
                    Published Date : {notification.PublishedDate}
                  </div>
                </div>
              </div>
              <hr className="nobody-hr" />
              <div className="row notify-body">
                <div className="col-8 sec-notify text-start">
                  <div
                    className="notify-title"
                    style={{ fontSize: "14px", fontWeight: "600" }}
                  >
                    {notification.Title}
                  </div>
                  <div className="notify-desc" style={{ fontSize: "12px" }}>
                    {notification.Description}
                  </div>
                </div>
                <div className="col-4 sec-notify-image">
                  <img src={notification.Image} className="notification-img" />
                </div>
              </div>
            </div>
          </div>

          <div className="viewNotifyPopupFooter">
            <div className="row  mt-1 mb-1">
              <div>
                {/* <button
                  type="button"
                  class="btn btn-sm me-2"
                  style={{ background: "var(--button-color)", color: "white" }}
                  onClick={handleSubmit}
                >
                  Submit
                </button> */}
                <button
                  type="button"
                  class="btn btn-sm btn-danger me-3"
                  style={{ color: "white" }}
                  onClick={closePopUp}
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
