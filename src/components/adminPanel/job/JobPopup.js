import React, { useContext, useEffect, useState } from "react";
import "../../leaveNotes/leaveNotePopup.css";
import "../organization/subdepartment/SubdepartmentPopup.css";
import CloseIcon from "../../../images/CloseIcon.svg";
import "../../hooks/imagePreview.css";
import "../organization/product/ProductPopup.css";
import "../organization/staff/Staff.css";
import "react-toastify/dist/ReactToastify.css";
import JobContext from "../jobState/JobContext";
import JobForm from "./JobForm";
import UpperbarContext from "../../context/upperbar-context";

export default function JobPopup() {
  const { sidePanelBg } = useContext(UpperbarContext);
  const {
    setPopup,
    setJobFormError,
    setJobFormValue,
    jobvalue,
    setIsUploaded,
    setImage,
    setNegotiable,
  } = useContext(JobContext);

  const closePopUp = (e) => {
    setPopup(false);
    setJobFormError({});
    setJobFormValue(jobvalue);
    setIsUploaded(false);
    setImage("");
    setNegotiable(false);
  };

  return (
    <>
      <div className="container leavenotepopup-wrapper">
        <div className="staffpopup-inner ">
          <div className="popUpHeader ps-0 pe-0" style={sidePanelBg}>
            <div className="popUpTitle">Job </div>
            <div className="popUpClose">
              <img
                className="popUpCloseIcon"
                src={CloseIcon}
                alt="CloseIcon"
                onClick={closePopUp}
              />
            </div>
          </div>
          <JobForm />
        </div>
      </div>
    </>
  );
}
