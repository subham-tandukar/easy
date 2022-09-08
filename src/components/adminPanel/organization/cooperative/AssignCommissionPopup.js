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


export default function AssignCommissionPopup() {
    const { User } = useContext(AuthContext);
    const { appURL } = useContext(UpperbarContext);
    const {

        setAssignPopup, setAssignFormValue, assignvalue, assignSubmit,
        setAssignFormError, setAssignSubmit, assignFormValue, assignFormError, categoryList, assignCommission

    } = useContext(CooperativeContext);

    const closePopUp = (e) => {
        setAssignPopup(false);
        setAssignFormError({});
        setAssignSubmit(false)
        setAssignFormValue(assignvalue)
    };

    const handleChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.type == "checkbox" ? target.checked : target.value;
        setAssignFormValue({ ...assignFormValue, [name]: value });
    };

    const formSubmit = (e) => {
        e.preventDefault();
        setAssignFormError(validate(assignFormValue));
        setAssignSubmit(true);
    };

    useEffect(() => {
        if (Object.keys(assignFormError).length === 0 && assignSubmit) {
            assignCommission(assignFormValue)

            //   setAssignSubmit(false);
        }
    }, [assignFormError]);
    const validate = (values) => {
        const errors = {};
        if (!values.assignComm) {
            errors.assignComm = "Required";
        }
        return errors;
    };



    return (
        <>
            <div className="container leavenotepopup-wrapper">
                <div className="assigncommissionpopup-inner ">
                    <div className="popUpHeader ps-0 pe-0">
                        <div className="popUpTitle">Assign Commission </div>
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
                                            Assign Commission<sup style={{ color: "red" }}>*</sup>
                                        </label>
                                        <select
                                            class="form-select form-select-sm"
                                            aria-label="Default select example"
                                            name="assignComm"
                                            value={assignFormValue.assignComm}
                                            onChange={handleChange}
                                        >
                                            <option disabled value="" selected>
                                                Select Commission
                                            </option>

                                            {categoryList.map((item) => (
                                                <option
                                                    key={item.catId}
                                                    value={item.catId}
                                                >
                                                    {item.catName}
                                                </option>
                                            ))}
                                        </select>
                                        {assignFormError.assignComm && (
                                            <p className="errormsg">{assignFormError.assignComm}</p>
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
