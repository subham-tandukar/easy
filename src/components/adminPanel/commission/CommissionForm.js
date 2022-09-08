import React, { useContext, useEffect, useState } from "react";
import "../../leaveNotes/leaveNotePopup.css";
import "../organization/subdepartment/SubdepartmentPopup.css";
import "../../hooks/imagePreview.css";
import "../organization//product/ProductPopup.css";
import "../../hooks/imagePreview.css";
// import AuthContext from "../../../context/auth-context";
import { Fetchdata } from "../../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../../context/auth-context";
import CommissionContext from "../commissionState/CommissionContext";

export default function CommissionForm() {
    const {
        commissionFormValue, setCommissionFormValue, setPopup, commissionFormError, setCommissionFormError, isSubmit, setIsSubmit, operatorList, fetchdata
    } = useContext(CommissionContext);

    const { User } = useContext(AuthContext);


    const closePopUp = (e) => {
        setPopup(false);
        setCommissionFormError({});
    };

    const handleChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.type == "checkbox" ? target.checked : target.value;
        setCommissionFormValue({ ...commissionFormValue, [name]: value });
    };


    const formNext = (e) => {
        e.preventDefault();
        setCommissionFormError(validate(commissionFormValue));
        setIsSubmit(true);
    };

    useEffect(() => {

        if (Object.keys(commissionFormError).length === 0 && isSubmit) {

            fetchdata(commissionFormValue)
        }
        setIsSubmit(false);
    }, [commissionFormError]);

    const validate = (values) => {
        const errors = {};
        if (!values.gateway) {
            errors.gateway = "Required";
        }
        if (!values.commissionType) {
            errors.commissionType = "Required";
        }
        if (!values.operator) {
            errors.operator = "Required";
        }
        if (!values.rate) {
            errors.rate = "Required";
        }
        return errors;
    };


    return (
        <>
            <div className="staffpopUpBody ps-3 pe-3">
                <div className="col-md-12 col-sm-12 col-lg-12">

                    <div className="row text-start ">
                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="gateway" style={{ fontSize: "12px" }}>
                                    Select Gateway<sup className="sup-col">*</sup>
                                </label>
                                <select
                                    style={{ fontSize: "11px" }}
                                    name="gateway"
                                    value={commissionFormValue.gateway}
                                    onChange={handleChange}
                                    className="form-control form-control-sm searchField"
                                >
                                    <option
                                        value=""
                                        disabled
                                        selected
                                        style={{ fontSize: "11px" }}
                                    >
                                        Select Option
                                    </option>
                                    <option value="ESWEA">eSewa</option>
                                    <option value="PAYPOINT">Paypoint</option>
                                    <option value="KHALTI">Khalti</option>
                                    <option value="NEPS">Neps</option>
                                </select>
                                <p className="errormsg ">{commissionFormError.gateway}</p>
                            </div>
                        </div>

                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="operator" style={{ fontSize: "12px" }}>
                                    Select Operator<sup className="sup-col">*</sup>
                                </label>
                                <select
                                    style={{ fontSize: "11px" }}
                                    name="operator"
                                    value={commissionFormValue.operator}
                                    onChange={handleChange}
                                    className="form-control form-control-sm searchField"
                                >
                                    <option
                                        value=""
                                        disabled
                                        selected
                                        style={{ fontSize: "11px" }}
                                    >
                                        Select Option
                                    </option>
                                    {operatorList.map((item) => (
                                        <option
                                            key={item.operatorValue}
                                            value={item.operatorValue}
                                        >
                                            {item.operatorName}
                                        </option>
                                    ))}

                                </select>
                                <p className="errormsg ">{commissionFormError.operator}</p>
                            </div>
                        </div>
                    </div>

                    <div className="row text-start ">


                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="commissionType" style={{ fontSize: "12px" }}>
                                    Select Commission Type<sup className="sup-col">*</sup>
                                </label>
                                <select
                                    style={{ fontSize: "11px" }}
                                    name="commissionType"
                                    value={commissionFormValue.commissionType}
                                    onChange={handleChange}
                                    className="form-control form-control-sm searchField"
                                >
                                    <option
                                        value=""
                                        disabled
                                        selected
                                        style={{ fontSize: "11px" }}
                                    >
                                        Select Option
                                    </option>
                                    <option value="P">Percentage</option>
                                    <option value="F">Flat</option>
                                </select>
                                <p className="errormsg ">{commissionFormError.commissionType}</p>
                            </div>
                        </div>

                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="rate" style={{ fontSize: "12px" }}>
                                    {commissionFormValue.commissionType === "P" ? "Percentage" : commissionFormValue.commissionType === "F" ? "Flat" : ""} Rate<sup className="sup-col">*</sup>
                                </label>
                                <input
                                    type="text"
                                    value={commissionFormValue.rate}
                                    onChange={handleChange}
                                    name="rate"
                                    className="form-control form-control-sm mb-1"
                                    id="rate"
                                />
                                <p className="errormsg ">{commissionFormError.rate}</p>
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
                            onClick={formNext}
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
        </>
    );
}
