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
import CooperativeFormEdit from "./CooperativeFormEdit";
import Spinner from "../../../loading/spinner";

export default function CooperativeEditPopup() {
    const { User } = useContext(AuthContext);
    const { appURL } = useContext(UpperbarContext);
    const {

        setCooperativeEditPopup,
        setCooperativeFormError, cooperativeFormValue

    } = useContext(CooperativeContext);

    const [loading, setLoading] = useState(true);

    const closePopUp = (e) => {
        setCooperativeEditPopup(false);
        setCooperativeFormError({});
    };

    useEffect(() => {
        setLoading(false);
    }, [cooperativeFormValue]);



    return (
        <>
            <div className="container leavenotepopup-wrapper">
                <div className="staffpopup-inner ">
                    <div className="popUpHeader ps-0 pe-0">
                        <div className="popUpTitle">Cooperative Edit</div>
                        <div className="popUpClose">
                            <img
                                className="popUpCloseIcon"
                                src={CloseIcon}
                                alt="CloseIcon"
                                onClick={closePopUp}
                            />
                        </div>
                    </div>
                    {loading ? <Spinner /> : <CooperativeFormEdit />}
                </div>
            </div>
        </>
    );
}
