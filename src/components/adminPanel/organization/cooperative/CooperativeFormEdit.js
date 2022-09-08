import React, { useContext, useEffect, useState } from "react";
import "../../../leaveNotes/leaveNotePopup.css";
import "../subdepartment/SubdepartmentPopup.css";
import CloseIcon from "../../../../images/CloseIcon.svg";
import "../../../hooks/imagePreview.css";
import "../product/ProductPopup.css";
import Plus from "../../../../images/Plus.png";
import "../../../hooks/imagePreview.css";
import AuthContext from "../../../context/auth-context";
import { Fetchdata } from "../../../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpperbarContext from "../../../context/upperbar-context";
import CooperativeContext from "../cooperativeState/CooperativeContext";

export default function CooperativeFormEdit() {
    const { User } = useContext(AuthContext);
    const { appURL } = useContext(UpperbarContext);
    const {
        cooperativeEditPopup, setCooperativeEditPopup, editIsSubmit, setEditIsSubmit, originalList, setOriginalList, allowApp, setAllowApp, loading, setLoading, cooperativeFormValue, setCooperativeFormValue, cooperativeFormError, setCooperativeFormError, cooperativevalue, free, setFree, disableUltility, setDisableUtility, showBalance, setShowBalance, reactURL, coopList, editData
    } = useContext(CooperativeContext);

    const closePopUp = (e) => {
        setCooperativeEditPopup(false);
        setAllowApp(false);
        setDisableUtility(false);
        setShowBalance(false);
        setFree(false);
        setCooperativeFormError({});
    };

    const handleChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.type == "checkbox" ? target.checked : target.value;
        setCooperativeFormValue({ ...cooperativeFormValue, [name]: value });
    };


    const formNext = (e) => {

        e.preventDefault();
        setCooperativeFormError(validate(cooperativeFormValue));
        setEditIsSubmit(true);
    };
    useEffect(() => {
        if (Object.keys(cooperativeFormError).length === 0 && editIsSubmit) {
            editData(cooperativeFormValue)
            setEditIsSubmit(false);
        }
    }, [cooperativeFormError]);

    const validate = (values) => {
        const errors = {};
        const numv = /^[0-9]+$/i;
        const digits = /^\d{10}$/;
        if (!values.CoopID) {
            errors.CoopID = "Required";
        }
        if (!values.nickName) {
            errors.nickName = "Required";
        }
        if (!values.address) {
            errors.address = "Required";
        }
        if (!values.contactNumber) {
            setEditIsSubmit(true);
        } else if (!numv.test(values.contactNumber)) {
            errors.contactNumber = "Must be digits";
        } else if (!digits.test(values.contactNumber)) {
            errors.contactNumber = "Must be 10 digits";
        }
        if (!values.logo) {
            errors.logo = "Required";
        }
        if (!values.serverName) {
            errors.serverName = "Required";
        }
        if (!values.dbName) {
            errors.dbName = "Required";
        }
        if (!values.userName) {
            errors.userName = "Required";
        }
        if (!values.fullName) {
            errors.fullName = "Required";
        }

        return errors;
    };

    const handleOnChange = (e) => {
        setAllowApp(!allowApp)
    };

    const handleOnFree = (e) => {
        setFree(!free)
    };
    const handleOnDisable = (e) => {
        setDisableUtility(!disableUltility)
    };
    const handleOnShow = (e) => {
        setShowBalance(!showBalance)
    };



    return (
        <>
            <div className="staffpopUpBody ps-3 pe-3">
                <div className="col-md-12 col-sm-12 col-lg-12">



                    <div className="row text-start">
                        <div className="form-group">
                            <label className="form-label" htmlFor="purpose" style={{ fontSize: "12px" }}>
                                Scope
                            </label>
                        </div>
                        <div>
                            <input type="radio" name="scope" id="MobileBanking" value="E" onChange={handleChange} checked={cooperativeFormValue.scope === "E"} />
                            <label className="label-radio" htmlFor="MobileBanking" style={{ marginRight: "10px", width: "100px" }} >Mobile Banking</label>

                            <input type="radio" name="scope" id="smart" onChange={handleChange} value="C" checked={cooperativeFormValue.scope === "C"} />
                            <label className="label-radio" htmlFor="smart" style={{ marginRight: "10px", width: "150px" }}>Smart Collection Entry</label>

                            <input type="radio" name="scope" id="both" onChange={handleChange} value="B" checked={cooperativeFormValue.scope === "B"} />
                            <label className="label-radio" htmlFor="both">Both</label>

                        </div>
                    </div>


                    <div className="row text-start ">
                        <div className="col-md-4 col-sm-4 col-lg-4">
                            <div className="form-group">
                                <label className="form-label" htmlFor="CoopID" style={{ fontSize: "12px" }}>Coop. ID<sup className="sup-col">*</sup></label>
                                <input type="text" className="form-control form-control-sm" onChange={handleChange} value={cooperativeFormValue.CoopID} id="CoopID" name="CoopID" />
                                <p className="errormsg " style={{ marginBottom: "0" }}>{cooperativeFormError.CoopID}</p>
                            </div>
                        </div>

                        <div className="col-md-8 col-sm-8 col-lg-8">
                            <div className="form-group">
                                <label className="form-label" htmlFor="CoopName" style={{ fontSize: "12px" }}>Cooperative Name</label>
                                <input type="text" className="form-control form-control-sm mb-1" onChange={handleChange} value={cooperativeFormValue.CoopName} id="CoopName" name="CoopName" />
                            </div>
                        </div>
                    </div>

                    <div className="row text-start ">
                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="nickName" style={{ fontSize: "12px" }}>Nick Name<sup className="sup-col">*</sup></label>
                                <input type="text" className="form-control form-control-sm mb-1" onChange={handleChange} value={cooperativeFormValue.nickName} id="nickName" name="nickName" />
                                <p className="errormsg " style={{ marginBottom: "0" }}>{cooperativeFormError.nickName}</p>
                            </div>
                        </div>

                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="address" style={{ fontSize: "12px" }}>Address<sup className="sup-col">*</sup></label>
                                <input type="text" className="form-control form-control-sm mb-1" onChange={handleChange} value={cooperativeFormValue.address} id="address" name="address" />
                                <p className="errormsg " style={{ marginBottom: "0" }}>{cooperativeFormError.address}</p>
                            </div>
                        </div>


                    </div>

                    <div className="row text-start ">
                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: "12px" }} htmlFor="contactPerson">Contact Person</label>
                                <input type="text" className="form-control form-control-sm mb-1" onChange={handleChange} value={cooperativeFormValue.contactPerson} id="contactPerson" name="contactPerson" />
                            </div>
                        </div>

                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="contactNumber" style={{ fontSize: "12px" }}>Contact Number</label>
                                <input type="text" className="form-control form-control-sm mb-1" onChange={handleChange} value={cooperativeFormValue.contactNumber} id="contactNumber" name="contactNumber" />
                                <p className="errormsg " style={{ marginBottom: "0" }}>{cooperativeFormError.contactNumber}</p>
                            </div>
                        </div>
                    </div>

                    <div className="row text-start ">

                        <div className="form-group">
                            <label className="form-label" htmlFor="url" style={{ fontSize: "12px" }}>CBS URL</label>
                            <input type="text" className="form-control form-control-sm mb-1" onChange={handleChange} value={cooperativeFormValue.url} id="url" name="url" />
                        </div>

                    </div>

                    <div className="row text-start ">
                        <div className="col-md-4 col-sm-4 col-lg-4">
                            <div className="form-group">
                                <label className="form-label" htmlFor="creditLimit" style={{ fontSize: "12px" }}>Credit Limit</label>
                                <input type="text" className="form-control form-control-sm mb-1" onChange={handleChange} value={cooperativeFormValue.creditLimit} id="creditLimit" name="creditLimit" />
                            </div>
                        </div>

                        <div className="col-md-4 col-sm-4 col-lg-4">
                            <div className="form-group">
                                <label className="form-label" htmlFor="noOfUser" style={{ fontSize: "12px" }}>No. of User</label>
                                <input type="text" className="form-control form-control-sm mb-1" onChange={handleChange} value={cooperativeFormValue.noOfUser} id="noOfUser" name="noOfUser" />
                            </div>
                        </div>

                        <div className="col-md-4 col-sm-4 col-lg-4">
                            <div className="form-group">
                                <label className="form-label" htmlFor="expire" style={{ fontSize: "12px" }}>License Expire</label>
                                <input type="text" className="form-control form-control-sm mb-1" onChange={handleChange} value={cooperativeFormValue.expire} id="expire" name="expire" />
                            </div>
                        </div>
                    </div>

                    <div className="row text-start ">
                        <div className="col-md-4 col-sm-4 col-lg-4">
                            <div className="form-group">
                                <label className="form-label" htmlFor="color" style={{ fontSize: "12px" }}>Color</label>
                                <input type="text" className="form-control form-control-sm mb-1" onChange={handleChange} value={cooperativeFormValue.color} id="color" name="color" />
                            </div>
                        </div>

                        <div className="col-md-8 col-sm-8 col-lg-8">
                            <div className="form-group">
                                <label className="form-label" htmlFor="logo" style={{ fontSize: "12px" }}>Logo<sup className="sup-col">*</sup></label>
                                <input type="text" className="form-control form-control-sm mb-1" onChange={handleChange} value={cooperativeFormValue.logo} id="logo" name="logo" />
                                <p className="errormsg ">{cooperativeFormError.logo}</p>
                            </div>
                        </div>
                    </div>

                    {/* <div className="row text-start ">
                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="serverName" style={{ fontSize: "12px" }}>Server Name<sup className="sup-col">*</sup></label>
                                <input type="text" className="form-control form-control-sm mb-1" onChange={handleChange} value={cooperativeFormValue.serverName} id="serverName" name="serverName" />
                                <p className="errormsg " style={{ marginBottom: "0" }}>{cooperativeFormError.serverName}</p>
                            </div>
                        </div>

                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="dbName" style={{ fontSize: "12px" }}>DB Name<sup className="sup-col">*</sup></label>
                                <input type="text" className="form-control form-control-sm mb-1" onChange={handleChange} value={cooperativeFormValue.dbName} id="dbName" name="dbName" />
                                <p className="errormsg " style={{ marginBottom: "0" }}>{cooperativeFormError.dbName}</p>
                            </div>
                        </div>
                    </div>


                    <div className="row text-start ">
                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="dbUsername" style={{ fontSize: "12px" }}>DB Username</label>
                                <input type="text" className="form-control form-control-sm mb-1" onChange={handleChange} value={cooperativeFormValue.dbUsername} id="dbUsername" name="dbUsername" />
                            </div>
                        </div>

                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="dbPassword" style={{ fontSize: "12px" }}>DB Password</label>
                                <input type="text" className="form-control form-control-sm mb-1" onChange={handleChange} value={cooperativeFormValue.dbPassword} id="dbPassword" name="dbPassword" />
                            </div>
                        </div>
                    </div> */}


                    <div className="row text-start ">
                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="serverKey" style={{ fontSize: "12px" }}>Server Key</label>
                                <input type="text" className="form-control form-control-sm mb-1" onChange={handleChange} value={cooperativeFormValue.serverKey} id="serverKey" name="serverKey" />
                            </div>
                        </div>

                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="senderId" style={{ fontSize: "12px" }}>Sender ID</label>
                                <input type="text" className="form-control form-control-sm mb-1" onChange={handleChange} value={cooperativeFormValue.senderId} id="senderId" name="senderId" />
                            </div>
                        </div>
                    </div>


                    <div className="checkbox-close">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="exampleCheck2"
                            name="closeChecked"

                            onChange={handleOnChange}
                            checked={allowApp}
                        />
                        <label
                            class="form-check-label"
                            for="exampleCheck2"
                            style={{ fontSize: "12px", paddingLeft: "5px" }}
                        >
                            Allow app
                        </label>

                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="exampleCheck3"
                            name="notWorking"
                            onChange={handleOnFree}
                            checked={free}
                            style={{ marginLeft: "10px" }}
                        />
                        <label class="form-check-label" for="exampleCheck3" style={{ fontSize: "12px", paddingLeft: "5px" }}>
                            Free
                        </label>

                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="exampleCheck4"
                            name="notWorking"
                            onChange={handleOnDisable}
                            checked={disableUltility}
                            style={{ marginLeft: "10px" }}
                        />
                        <label class="form-check-label" for="exampleCheck4" style={{ fontSize: "12px", paddingLeft: "5px" }}>
                            Disable Utility
                        </label>
                        {cooperativeFormValue.scope === "C" || cooperativeFormValue.scope === "B" ? (
                            <>
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="exampleCheck5"
                                    name="notWorking"
                                    onChange={handleOnShow}
                                    checked={showBalance}
                                    style={{ marginLeft: "10px" }}
                                />
                                <label class="form-check-label" for="exampleCheck5" style={{ fontSize: "12px", paddingLeft: "5px" }}>
                                    Show Balance
                                </label>
                            </>
                        ) : <></>}

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
                            Update
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
