import React, { useContext, useEffect, useState } from "react";
import "../../../leaveNotes/leaveNotePopup.css";
import "../subdepartment/SubdepartmentPopup.css";
import CloseIcon from "../../../../images/CloseIcon.svg";
import "../../../hooks/imagePreview.css";
import "../product/ProductPopup.css";
import "../staff/Staff.css";
import AuthContext from "../../../context/auth-context";
import UpperbarContext from "../../../context/upperbar-context";
import CooperativeContext from "../cooperativeState/CooperativeContext";
import CategoryForm from "./CategoryForm";
import UpdateCategoryForm from "./UpdateCategoryForm";

export default function CategoryPopup() {
    const { User } = useContext(AuthContext);
    const { appURL } = useContext(UpperbarContext);
    const {

        setCategoryPopup, setCategoryFormValue, categoryvalue,
        setCategoryFormError, setCategorySubmit, setInputFields, categoryList

    } = useContext(CooperativeContext);

    const closePopUp = (e) => {
        setCategoryPopup(false);
        setCategoryFormError({});
        setCategorySubmit(false)
        setCategoryFormValue(categoryvalue)
        setInputFields([])
    };

    const [activeTab, setActiveTab] = useState({
        tab1: true,
        tab2: false,
    });
    const handleTab1 = () => {
        setActiveTab({
            tab1: true,
            tab2: false,
        });
    };
    const handleTab2 = () => {
        setActiveTab({
            tab1: false,
            tab2: true,
        });
    };



    return (
        <>
            <div className="container leavenotepopup-wrapper">
                <div className="staffpopup-inner ">
                    <div className="popUpHeader ps-0 pe-0">
                        <div className="popUpTitle">Category </div>
                        <div className="popUpClose">
                            <img
                                className="popUpCloseIcon"
                                src={CloseIcon}
                                alt="CloseIcon"
                                onClick={closePopUp}
                            />
                        </div>
                    </div>
                    <div className="insidePopup">
                        <ul>
                            <li
                                className={activeTab.tab1 === true ? "active" : ""}
                                onClick={handleTab1}
                            >
                                <i className="fa fa-user icon"></i>Add{" "}
                            </li>
                            <li
                                className={activeTab.tab2 === true ? "active" : ""}
                                onClick={handleTab2}
                            >
                                <i className="fas fa-sliders icon"></i>Edit{" "}
                            </li>
                        </ul>
                    </div>
                    <div>
                        {activeTab.tab1 && <CategoryForm />}
                        {activeTab.tab2 && <UpdateCategoryForm />}

                    </div>

                </div>
            </div>
        </>
    );
}
