import React, { useContext, useEffect, useState } from "react";
import "../../leaveNotes/leaveNotePopup.css";
import "../organization/subdepartment/SubdepartmentPopup.css";
import CloseIcon from "../../../images/CloseIcon.svg";
import "../../hooks/imagePreview.css";
import "../organization/product/ProductPopup.css";
import "../organization/staff/Staff.css";
import "react-toastify/dist/ReactToastify.css";
import HamiChhimekiContext from "../hamichhimekiState/HamiChhimekiContext";
import ChhimkeiForm from "./ChhimekiForm";
import ChhimkeiFormEdit from "./ChhimekiFormEdit";



export default function ChhimekiEditPopup() {

    const {

        setEditPop,
        setChhimekiFormError,

    } = useContext(HamiChhimekiContext);

    const closePopUp = (e) => {
        setEditPop(false);
        setChhimekiFormError({});
    };


    return (
        <>
            <div className="container leavenotepopup-wrapper">
                <div className="staffpopup-inner ">
                    <div className="popUpHeader ps-0 pe-0">
                        <div className="popUpTitle">Hami Chhimeki Edit </div>
                        <div className="popUpClose">
                            <img
                                className="popUpCloseIcon"
                                src={CloseIcon}
                                alt="CloseIcon"
                                onClick={closePopUp}
                            />
                        </div>
                    </div>
                    <ChhimkeiFormEdit />
                </div>
            </div>
        </>
    );
}
