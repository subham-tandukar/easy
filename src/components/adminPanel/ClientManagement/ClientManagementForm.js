import React, { useContext, useEffect, useState } from "react";
import "../../leaveNotes/leaveNotePopup.css";
import "../organization/subdepartment/SubdepartmentPopup.css";
// import CloseIcon from "../../../images/CloseIcon.svg";
import "../../hooks/imagePreview.css";
import "../organization//product/ProductPopup.css";
// import Plus from "../../../images/Plus.png";
import "../../hooks/imagePreview.css";
import { Fetchdata } from "../../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../../context/auth-context";
import ClientManagementContext from "../clientManagementState/ClientManagementContext";

export default function ClientManagementForm() {
    const {
        collectorFormValue, setCollectorFormValue, setPopup, collectorFormError, setCollectorFormError, isSubmit, setIsSubmit, loading, setLoading, showBalance, setShowBalance
    } = useContext(ClientManagementContext);

    // const { User } = useContext(AuthContext);

    // 

    // Functions for Collector Form

    const closePopUp = (e) => {
        setPopup(false);
        setCollectorFormError({});
    };

    const handleChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.type == "checkbox" ? target.checked : target.value;
        setCollectorFormValue({ ...collectorFormValue, [name]: value });
    };


    const formNext = (e) => {
        e.preventDefault();
        setCollectorFormError(validate(collectorFormValue));
        setIsSubmit(true);
    };

    useEffect(() => {

        if (Object.keys(collectorFormError).length === 0 && isSubmit) {


            //     const dataForm = {
            //         ChhimekiID: chhimekiFormValue.chhimekiID,
            //         Flag: "I",
            //         Name: chhimekiFormValue.name,
            //         Address: chhimekiFormValue.address,
            //         Contact: chhimekiFormValue.contact,
            //         Email: chhimekiFormValue.email,
            //         Logo: image !== null ? image.split(',')[1] : "",
            //         About: chhimekiFormValue.about,
            //         Website: chhimekiFormValue.website,
            //         Facebook: chhimekiFormValue.facebook,
            //         EstablishDate: chhimekiFormValue.establishDate,
            //         Adakshya: chhimekiFormValue.head,
            //         Latitude: chhimekiFormValue.latitude,
            //         Longitude: chhimekiFormValue.longitude,
            //         IsAllow: chhimekiFormValue.allowStatus,
            //         ExpiryDate: chhimekiFormValue.expiryDate,
            //         SenderID: chhimekiFormValue.senderID,
            //         ServerKey: chhimekiFormValue.serverKey,
            //         CreatedBy: 1,
            //         CType: "1",
            //         FetchURL: `${chhimekiURL}/api/sadmin/chhimeki-info`,
            //         Type: "POST",
            //     };
            //     
            //     Fetchdata(dataForm).then(function (result) {
            //         
            //         if (result.StatusCode === 200) {
            //             setPopup(false);
            //             chmList();
            //             toast(result.Message, {
            //                 style: {
            //                     color: "green",
            //                     fontSize: "13px",
            //                 },
            //             });
            //         } else {
            //             toast("Error: " + result.Message, {
            //                 style: {
            //                     color: "red",
            //                     fontSize: "13px",
            //                 },
            //             });
            //         }
            //     });
        }
        setIsSubmit(false);
    }, [collectorFormError]);

    const validate = (values) => {
        const errors = {};
        // const numv = /^[0-9]+$/i;
        // const digits = /^\d{10}$/;
        // const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!values.coopCode) {
            errors.coopCode = "Required";
        }
        if (!values.coopName) {
            errors.coopName = "Required";
        }
        if (!values.address) {
            errors.address = "Required";
        }
        if (!values.telephone) {
            errors.telephone = "Required";
        }
        if (!values.logo) {
            errors.logo = "Required";
        }

        // if (!values.contact) {
        //     errors.contact = "Required";
        // } else if (!numv.test(values.contact)) {
        //     errors.contact = "Must be digits";
        // } else if (!digits.test(values.contact)) {
        //     errors.contact = "Must be 10 digits";
        // }
        // if (values.email.length === 0) {
        //     setIsSubmit(true);
        // } else if (!regex.test(values.email)) {
        //     errors.email = "This is not a valid email format";
        // }

        return errors;
    };


    const handleOnChange = (e) => {
        setShowBalance(!showBalance);
    };

    // Functions for collector form ends

    const [labelRadio, setLabelRadio] = useState("espay")
    const handleRadioChange = (e) => {
        const target = e.target;
        const value = target.value;
        setLabelRadio(value);
    };

    return (
        <>
            <div className="collectorpopUpBody ps-3 pe-3">



                {/* For Radio Button */}

                <div style={{ textAlign: "left" }}>
                    <label className="form-label" htmlFor="purpose" style={{ fontSize: "14px" }}>Select Product</label>
                </div>
                <div style={{ textAlign: "left" }}>
                    <input type="radio" name="product" id="espay" value="espay" onChange={handleRadioChange} checked={labelRadio === "espay"} />
                    <label className="label-radio" htmlFor="espay" style={{ marginRight: "10px" }} >ES Pay</label>

                    <input type="radio" name="product" id="smartCollector" onChange={handleRadioChange} value="smartCollector" checked={labelRadio === "smartCollector"} />
                    <label className="label-radio" htmlFor="smartCollector" style={{ marginRight: "10px", width: "100px" }}>Smart Collector</label>

                    <input type="radio" name="product" id="collector" onChange={handleRadioChange} value="collector" checked={labelRadio === "collector"} />
                    <label className="label-radio" htmlFor="collector">Collector</label>


                    <input type="radio" name="product" id="school" onChange={handleRadioChange} value="school" checked={labelRadio === "school"} />
                    <label className="label-radio" htmlFor="school" style={{ marginLeft: "10px" }}>School</label>
                </div>

                {labelRadio === "collector" && (

                    <div className="col-md-12 col-sm-12 col-lg-12">
                        <div className="row text-start ">
                            <div className="col-md-4 col-sm-4 col-lg-4">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="coopCode" style={{ fontSize: "12px" }}>
                                        Coop. Code<sup className="sup-col">*</sup>
                                    </label>
                                    <input
                                        type="text"
                                        value={collectorFormValue.coopCode}
                                        onChange={handleChange}
                                        name="coopCode"
                                        className="form-control form-control-sm"
                                        id="coopCode"
                                    />
                                    <p className="errormsg ">{collectorFormError.coopCode}</p>
                                </div>
                            </div>

                            <div className="col-md-8 col-sm-8 col-lg-8">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="coopName" style={{ fontSize: "12px" }}>
                                        Coop. Name<sup className="sup-col">*</sup>
                                    </label>
                                    <input
                                        type="text"
                                        value={collectorFormValue.coopName}
                                        onChange={handleChange}
                                        name="coopName"
                                        className="form-control form-control-sm"
                                        id="coopName"
                                    />
                                    <p className="errormsg ">{collectorFormError.coopName}</p>
                                </div>
                            </div>
                        </div>

                        <div className="row text-start ">
                            <div className="col-md-6 col-sm-6 col-lg-6">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="address" style={{ fontSize: "12px" }}>
                                        Address<sup className="sup-col">*</sup>
                                    </label>
                                    <input
                                        type="text"
                                        value={collectorFormValue.address}
                                        onChange={handleChange}
                                        name="address"
                                        className="form-control form-control-sm mb-1"
                                        id="address"
                                    />
                                    <p className="errormsg ">{collectorFormError.address}</p>
                                </div>
                            </div>

                            <div className="col-md-6 col-sm-6 col-lg-6">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="telephone" style={{ fontSize: "12px" }}>
                                        Telephone
                                    </label>
                                    <input
                                        type="text"
                                        value={collectorFormValue.telephone}
                                        onChange={handleChange}
                                        name="telephone"
                                        className="form-control form-control-sm mb-1"
                                        id="telephone"
                                    />
                                    <p className="errormsg ">{collectorFormError.telephone}</p>
                                </div>
                            </div>


                        </div>



                        <div className="row text-start ">

                            <div className="form-group">
                                <label className="form-label" htmlFor="logo" style={{ fontSize: "12px" }}>
                                    Logo<sup className="sup-col">*</sup>
                                </label>
                                <input
                                    type="text"
                                    value={collectorFormValue.logo}
                                    onChange={handleChange}
                                    name="logo"
                                    className="form-control form-control-sm mb-1"
                                    id="logo"
                                />
                                <p className="errormsg ">{collectorFormError.logo}</p>
                            </div>

                        </div>

                        <div className="checkbox-close">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="exampleCheck2"
                                name="closeChecked"
                                onChange={handleOnChange}
                                checked={showBalance}
                                style={{ fontSize: "12px", marginTop: "7px" }}
                            />
                            <label
                                class="form-check-label"
                                for="exampleCheck2"
                                style={{ fontSize: "12px", paddingLeft: "4px" }}
                            >
                                Current
                            </label>
                        </div>

                    </div>
                )}
            </div>

            {labelRadio === "collector" && (
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
            )}
        </>
    );
}
