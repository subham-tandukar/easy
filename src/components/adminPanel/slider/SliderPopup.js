import React, { useContext, useEffect, useState } from "react";
import "../../leaveNotes/leaveNotePopup.css";
import "../organization/subdepartment/SubdepartmentPopup.css";
import CloseIcon from "../../../images/CloseIcon.svg";
import "../../hooks/imagePreview.css";
import "../organization/product/ProductPopup.css";
import "../organization/staff/Staff.css";
import "react-toastify/dist/ReactToastify.css";
import SliderContext from "../sliderState/SliderContext";
import SliderForm from "./SliderForm";



export default function SliderPopup() {

    const {

        setPopup,
        // setChhimekiFormError,

    } = useContext(SliderContext);

    const closePopUp = (e) => {
        setPopup(false);
        // setChhimekiFormError({});
    };


    return (
        <>
            <div className="container leavenotepopup-wrapper">
                <div className="sliderpopup-inner ">
                    <div className="popUpHeader ps-0 pe-0">
                        <div className="popUpTitle">Slider</div>
                        <div className="popUpClose">
                            <img
                                className="popUpCloseIcon"
                                src={CloseIcon}
                                alt="CloseIcon"
                                onClick={closePopUp}
                            />
                        </div>
                    </div>
                    <SliderForm />
                </div>
            </div>
        </>
    );
}
