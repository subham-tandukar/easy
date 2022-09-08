import React, { useContext, useEffect, useState } from "react";
import "../../../leaveNotes/leaveNotePopup.css";
import "../subdepartment/SubdepartmentPopup.css";
import CloseIcon from "../../../../images/CloseIcon.svg";
import "../../../hooks/imagePreview.css";
import "../product/ProductPopup.css";
import "../staff/Staff.css";
import AuthContext from "../../../context/auth-context";
import { Fetchdata } from "../../../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpperbarContext from "../../../context/upperbar-context";
import CooperativeForm from "./CooperativeForm";
import CooperativeContext from "../cooperativeState/CooperativeContext";

export default function CooperativePopup() {
    const { User } = useContext(AuthContext);
    const { appURL } = useContext(UpperbarContext);
    const {

        setCooperativePopup,
        setCooperativeFormError,

    } = useContext(CooperativeContext);

    const closePopUp = (e) => {
        setCooperativePopup(false);
        setCooperativeFormError({});
    };



    return (
        <>
            <div className="container leavenotepopup-wrapper">
                <div className="staffpopup-inner ">
                    <div className="popUpHeader ps-0 pe-0">
                        <div className="popUpTitle">Cooperative </div>
                        <div className="popUpClose">
                            <img
                                className="popUpCloseIcon"
                                src={CloseIcon}
                                alt="CloseIcon"
                                onClick={closePopUp}
                            />
                        </div>
                    </div>
                    <CooperativeForm />
                </div>
            </div>
        </>
    );
}
