import React, { useContext, useEffect, useState } from "react";
import "../../../leaveNotes/leaveNotePopup.css";
import "../subdepartment/SubdepartmentPopup.css";
import CloseIcon from "../../../../images/CloseIcon.svg";
import "../../../hooks/imagePreview.css";
import "../product/ProductPopup.css";
import "./Staff.css";
import AuthContext from "../../../context/auth-context";
import { Fetchdata } from "../../../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Basic from "./Basic";
import Service from "./Service";
import StaffContext from "../staffState/StaffContext";
import UpperbarContext from "../../../context/upperbar-context";

export default function StaffPopup() {
  const { User } = useContext(AuthContext);
  const { appURL } = useContext(UpperbarContext);
  const {
    staffPopup,
    setStaffPopup,
    staffEditPopup,
    setStaffEditPopup,
    currentStep,
    setStep,
    staffFormValue,
    setStaffFormValue,
    staffFormError,
    setStaffFormError,
    staffValue,
  } = useContext(StaffContext);

  const closePopUp = (e) => {
    setStaffPopup(false);
    setStaffFormError({});
    setStep(1);
  };

  // function showStep(step) {
  //     switch (step) {
  //         case 1:
  //             return <Basic />
  //         case 2:
  //             return <Service />
  //     }
  // }

  return (
    <>
      <div className="container leavenotepopup-wrapper">
        <div className="staffpopup-inner ">
          <div className="popUpHeader ps-0 pe-0">
            <div className="popUpTitle">Staff</div>
            <div className="popUpClose">
              <img
                className="popUpCloseIcon"
                src={CloseIcon}
                alt="CloseIcon"
                onClick={closePopUp}
              />
            </div>
          </div>
          <Basic />
        </div>
      </div>
    </>
  );
}
