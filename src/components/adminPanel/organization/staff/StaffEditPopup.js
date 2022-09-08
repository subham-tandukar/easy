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
import BasicEdit from "./BasicEdit";
import ServiceEdit from "./ServiceEdit";
import Spinner from "../../../loading/spinner";
import UpperbarContext from "../../../context/upperbar-context";

export default function StaffEditPopup() {
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

  const [loading, setLoading] = useState(true);

  const closePopUp = (e) => {
    setStaffEditPopup(false);
    setStaffFormError({});
    setStaffFormValue({
      firstName: "",
      middleName: "",
      lastName: "",
      userID: "",
      userCode: "",
      deviceCode: "",
      mobileCode: "",
      userName: "",
      password: "",
      email: "",
      contact: "",
      phone: "",
      address: "",
      district: "",
      dateOfBirth: "",
      citizenshipNo: "",
      pan: "",
      gender: "",
      blood: "",
      religion: "",
      marital: "",
      enrollDate: "",
      leaveDate: "",
      jobType: "",
      selectShift: "",
      shiftType: "",
      grade: "",
      department: "",
      subDepartment: "",
      designation: "",
      days: "",
    });
  };

  useEffect(() => {
    setLoading(false);
  }, [staffFormValue]);

  // function showStep(step) {
  //     switch (step) {
  //         case 1:
  //             return <BasicEdit />
  //         case 2:
  //             return <ServiceEdit />
  //     }
  // }

  return (
    <>
      <div className="container leavenotepopup-wrapper">
        <div className="staffpopup-inner ">
          <div className="popUpHeader ps-0 pe-0">
            <div className="popUpTitle">Staff Edit</div>
            <div className="popUpClose">
              <img
                className="popUpCloseIcon"
                src={CloseIcon}
                alt="CloseIcon"
                onClick={closePopUp}
              />
            </div>
          </div>
          {loading ? <Spinner /> : <BasicEdit />}
        </div>
      </div>
    </>
  );
}
