import React, { useContext, useEffect, useState } from "react";
import "../../leaveNotes/leaveNotePopup.css";
import "../organization/subdepartment/SubdepartmentPopup.css";
import CloseIcon from "../../../images/CloseIcon.svg";
import "../../hooks/imagePreview.css";
import "../organization/product/ProductPopup.css";
import "../organization/staff/Staff.css";
import "react-toastify/dist/ReactToastify.css";
import ClientManagementContext from "../clientManagementState/ClientManagementContext";
import ClientManagementForm from "./ClientManagementForm";



export default function ClientManagementPopup() {

    const {

        setPopup,
        setCollectorFormError,

    } = useContext(ClientManagementContext);

    const closePopUp = (e) => {
        setPopup(false);
        setCollectorFormError({});
    };


    return (
        <>
            <div className="container leavenotepopup-wrapper">
                <div className="collectorpopup-inner ">
                    <div className="popUpHeader ps-0 pe-0">
                        <div className="popUpTitle">Client Management </div>
                        <div className="popUpClose">
                            <img
                                className="popUpCloseIcon"
                                src={CloseIcon}
                                alt="CloseIcon"
                                onClick={closePopUp}
                            />
                        </div>
                    </div>
                    <ClientManagementForm />
                </div>
            </div>
        </>
    );
}
