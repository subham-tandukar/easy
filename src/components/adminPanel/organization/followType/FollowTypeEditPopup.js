import React, { useContext, useEffect, useState } from "react";
import "../../../leaveNotes/leaveNotePopup.css";
import "../../organization/department/DepartmentPopup.css";
import CloseIcon from "../../../../images/CloseIcon.svg";
import AuthContext from "../../../context/auth-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Fetchdata } from "../../../hooks/getData";
import UpperbarContext from "../../../context/upperbar-context";

export default function FollowTypeEditPopup({
    setFollowTypeEditPopup,
    reload,
    setReload,
    followTypeFormValue,
    setFollowTypeFormValue,
    followTypeFormError,
    setFollowTypeFormError,
    followList,
    titleId
}) {
    const { User } = useContext(AuthContext);
    const { appURL } = useContext(UpperbarContext);

    const closePopUp = (e) => {
        setFollowTypeEditPopup(false);
        setFollowTypeFormError({});
    };

    const handleChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.type == "checkbox" ? target.checked : target.value;
        setFollowTypeFormValue({ ...followTypeFormValue, [name]: value });
    };

    const [isSubmit, setIsSubmit] = useState(false);

    const validate = (values) => {
        const errors = {};
        if (!values.followType) {
            errors.followType = "Required";
        }
        return errors;
    };

    const formSubmit = (e) => {
        e.preventDefault();
        setFollowTypeFormError(validate(followTypeFormValue));
        setIsSubmit(true);
    };

    useEffect(() => {
        if (Object.keys(followTypeFormError).length === 0 && isSubmit) {

            const dataForm = {
                ComID: User.CompanyId,
                StaffID: User.UID,
                FollowTypeID: titleId,
                Flag: "U",
                Name: followTypeFormValue.followType,
                BranchID: User.BranchId,
                FiscalID: User.FiscalId,
                FetchURL: `${appURL}api/admin/follow-type`,
                Type: "POST",
            };

            Fetchdata(dataForm).then(function (result) {

                if (result.StatusCode === 200) {
                    setFollowTypeEditPopup(false);
                    followList();
                    toast(result.Message, {
                        style: {
                            color: "green",
                            fontSize: "13px",
                        },
                    });
                } else {
                    toast("Error: " + result.Message, {
                        style: {
                            color: "red",
                            fontSize: "13px",
                        },
                    });
                }
            });

            setIsSubmit(false);
        }
    }, [followTypeFormError]);

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
            />
            <div className="container leavenotepopup-wrapper">
                <div className="departmentpopup-inner ">
                    <div className="popUpHeader ps-0 pe-0">
                        <div className="popUpTitle">Follow Type</div>
                        <div className="popUpClose">
                            <img
                                className="popUpCloseIcon"
                                src={CloseIcon}
                                alt="CloseIcon"
                                onClick={closePopUp}
                            />
                        </div>
                    </div>
                    <div className="departmentpopUpBody ps-3 pe-3">
                        <div className="row text-start mt-2 ">
                            <div className="col-md-12 col-sm-12 col-lg-12">
                                <div className="row text-start ">
                                    <div className="form-group">
                                        <label htmlFor="name" style={{ fontSize: "12px" }}>
                                            Follow Type<sup style={{ color: "red" }}>*</sup>
                                        </label>
                                        <input
                                            id="followType"
                                            style={{ fontSize: "13px" }}
                                            type="text"
                                            className="form-control form-control-sm "
                                            name="followType"
                                            value={followTypeFormValue.followType}
                                            onChange={handleChange}
                                        />
                                        {followTypeFormError.followType && (
                                            <p className="errormsg">{followTypeFormError.followType}</p>
                                        )}
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                    <div className="ln-popUpFooter">
                        <div className="row  mt-1 mb-1">
                            <div>
                                <button
                                    type="button"
                                    class="btn btn-sm me-2"
                                    style={{ background: "var(--button-color)", color: "white" }}
                                    onClick={formSubmit}
                                >
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    class="btn btn-sm btn-danger me-3"
                                    style={{ color: "white" }}
                                    onClick={closePopUp}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
