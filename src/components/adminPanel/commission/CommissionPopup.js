import React, { useContext, useEffect, useState } from "react";
import "../../leaveNotes/leaveNotePopup.css";
import "../organization/subdepartment/SubdepartmentPopup.css";
import CloseIcon from "../../../images/CloseIcon.svg";
import "../../hooks/imagePreview.css";
import "../organization/product/ProductPopup.css";
import "../organization/staff/Staff.css";
import CommissionContext from "../commissionState/CommissionContext";
import CommissionForm from "./CommissionForm";




export default function CommissionPopup() {

    const {

        setPopup,
        setCommissionFormError,

    } = useContext(CommissionContext);

    const closePopUp = (e) => {
        setPopup(false);
        setCommissionFormError({});
    };


    return (
        <>
            <div className="container leavenotepopup-wrapper">
                <div className="departmentpopup-inner ">
                    <div className="popUpHeader ps-0 pe-0">
                        <div className="popUpTitle">Commission </div>
                        <div className="popUpClose">
                            <img
                                className="popUpCloseIcon"
                                src={CloseIcon}
                                alt="CloseIcon"
                                onClick={closePopUp}
                            />
                        </div>
                    </div>
                    <CommissionForm />
                </div>
            </div>
        </>
    );
}
