import React, { useContext, useEffect, useState } from "react";
import "../../leaveNotes/leaveNotePopup.css";
import "../organization/subdepartment/SubdepartmentPopup.css";
import CloseIcon from "../../../images/CloseIcon.svg";
import "../../hooks/imagePreview.css";
import "../organization//product/ProductPopup.css";
import Plus from "../../../images/Plus.png";
import "../../hooks/imagePreview.css";
// import AuthContext from "../../../context/auth-context";
import { Fetchdata } from "../../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import UpperbarContext from "../../../context/upperbar-context";
import HamiChhimekiContext from "../hamichhimekiState/HamiChhimekiContext";
import AuthContext from "../../context/auth-context";

export default function ChhimkeiForm() {
    const {
        chhimekiFormValue, setChhimekiFormValue, chhimekivalue, popup, setPopup, chhimekiFormError, setChhimekiFormError, isSubmit, setIsSubmit, loading, setLoading, image, setImage, isUploaded, setIsUploaded, typeFile, setTypeFile, closeChecked, setCloseChecked, pushNotice, setPushNotice, editPop, setEditPop, handleEdit, isEditSubmit, setIsEditSubmit, chmList, chhimekiList, deactivateDepart, deactivateAgree, chhimekiURL, originalList, setOriginalList
    } = useContext(HamiChhimekiContext);

    const { User } = useContext(AuthContext);



    const closePopUp = (e) => {
        setPopup(false);
        setChhimekiFormError({});
    };

    const handleChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.type == "checkbox" ? target.checked : target.value;
        setChhimekiFormValue({ ...chhimekiFormValue, [name]: value });
    };


    const formNext = (e) => {

        e.preventDefault();
        setChhimekiFormError(validate(chhimekiFormValue));
        setIsSubmit(true);
    };

    useEffect(() => {

        if (Object.keys(chhimekiFormError).length === 0 && isSubmit) {

            const dataForm = {
                ChhimekiID: chhimekiFormValue.chhimekiID,
                Flag: "I",
                Name: chhimekiFormValue.name,
                Address: chhimekiFormValue.address,
                Contact: chhimekiFormValue.contact,
                Email: chhimekiFormValue.email,
                Logo: image !== null ? image.split(',')[1] : "",
                About: chhimekiFormValue.about,
                Website: chhimekiFormValue.website,
                Facebook: chhimekiFormValue.facebook,
                EstablishDate: chhimekiFormValue.establishDate,
                Adakshya: chhimekiFormValue.head,
                Latitude: chhimekiFormValue.latitude,
                Longitude: chhimekiFormValue.longitude,
                IsAllow: chhimekiFormValue.allowStatus,
                ExpiryDate: chhimekiFormValue.expiryDate,
                SenderID: chhimekiFormValue.senderID,
                ServerKey: chhimekiFormValue.serverKey,
                CreatedBy: 1,
                CType: "1",
                FetchURL: `${chhimekiURL}/api/sadmin/chhimeki-info`,
                Type: "POST",
            };

            Fetchdata(dataForm).then(function (result) {

                if (result.StatusCode === 200) {
                    setPopup(false);
                    chmList();
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
        }
        setIsSubmit(false);
    }, [chhimekiFormError]);

    const validate = (values) => {
        const errors = {};
        const numv = /^[0-9]+$/i;
        const digits = /^\d{10}$/;
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!values.chhimekiID) {
            errors.chhimekiID = "Required";
        }
        if (!values.name) {
            errors.name = "Required";
        }
        if (!values.address) {
            errors.address = "Required";
        }
        if (!values.about) {
            errors.about = "Required";
        }
        if (!values.head) {
            errors.head = "Required";
        }
        if (!values.establishDate) {
            errors.establishDate = "Required";
        }
        if (!values.expiryDate) {
            errors.expiryDate = "Required";
        }
        if (!values.allowStatus) {
            errors.allowStatus = "Required";
        }
        if (!values.contact) {
            errors.contact = "Required";
        } else if (!numv.test(values.contact)) {
            errors.contact = "Must be digits";
        } else if (!digits.test(values.contact)) {
            errors.contact = "Must be 10 digits";
        }
        if (values.email.length === 0) {
            setIsSubmit(true);
        } else if (!regex.test(values.email)) {
            errors.email = "This is not a valid email format";
        }

        return errors;
    };

    function handleImageChange(e) {
        if (e.target.files && e.target.files[0]) {
            setTypeFile(e.target.files[0].type);
            let reader = new FileReader();

            reader.onload = function (e) {
                setImage(e.target.result);
                setIsUploaded(true);
            };

            reader.readAsDataURL(e.target.files[0]);
        }
    }




    return (
        <>
            <div className="staffpopUpBody ps-3 pe-3">
                <div className="col-md-12 col-sm-12 col-lg-12">

                    <div className="row text-start ">
                        <div className="col-md-4 col-sm-4 col-lg-4">
                            <div className="form-group">
                                <label className="form-label" htmlFor="chhimekiID" style={{ fontSize: "12px" }}>
                                    Chhimeki ID<sup className="sup-col">*</sup>
                                </label>
                                <input
                                    type="text"
                                    value={chhimekiFormValue.chhimekiID}
                                    onChange={handleChange}
                                    name="chhimekiID"
                                    className="form-control form-control-sm"
                                    id="chhimekiID"
                                />
                                <p className="errormsg ">{chhimekiFormError.chhimekiID}</p>
                            </div>
                        </div>

                        <div className="col-md-8 col-sm-8 col-lg-8">
                            <div className="form-group">
                                <label className="form-label" htmlFor="name" style={{ fontSize: "12px" }}>
                                    Name<sup className="sup-col">*</sup>
                                </label>
                                <input
                                    type="text"
                                    value={chhimekiFormValue.name}
                                    onChange={handleChange}
                                    name="name"
                                    className="form-control form-control-sm"
                                    id="name"
                                />
                                <p className="errormsg ">{chhimekiFormError.name}</p>
                            </div>
                        </div>
                    </div>

                    <div className="row text-start ">
                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="contact" style={{ fontSize: "12px" }}>
                                    Contact<sup className="sup-col">*</sup>
                                </label>
                                <input
                                    type="text"
                                    value={chhimekiFormValue.contact}
                                    onChange={handleChange}
                                    name="contact"
                                    className="form-control form-control-sm mb-1"
                                    id="contact"
                                />
                                <p className="errormsg ">{chhimekiFormError.contact}</p>
                            </div>
                        </div>

                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="email" style={{ fontSize: "12px" }}>
                                    Email
                                </label>
                                <input
                                    type="text"
                                    value={chhimekiFormValue.email}
                                    onChange={handleChange}
                                    name="email"
                                    className="form-control form-control-sm mb-1"
                                    id="email"
                                />
                                <p className="errormsg ">{chhimekiFormError.email}</p>
                            </div>
                        </div>


                    </div>



                    <div className="row text-start ">

                        <div className="form-group">
                            <label className="form-label" htmlFor="address" style={{ fontSize: "12px" }}>
                                Address<sup className="sup-col">*</sup>
                            </label>
                            <input
                                type="text"
                                value={chhimekiFormValue.address}
                                onChange={handleChange}
                                name="address"
                                className="form-control form-control-sm mb-1"
                                id="address"
                            />
                            <p className="errormsg ">{chhimekiFormError.address}</p>
                        </div>

                    </div>

                    <div className="row text-start ">

                        <div className="form-group">
                            <label
                                htmlFor="exampleFormControlTextarea1"
                                className="form-label"
                                placeholder="about"
                                style={{ fontSize: "12px" }}
                            >
                                About<sup className="sup-col">*</sup>
                            </label>
                            <textarea
                                className="form-control"
                                name="about"
                                value={chhimekiFormValue.about}
                                onChange={handleChange}
                                id="exampleFormControlTextarea1"
                                rows="3"
                                style={{ fontSize: "12px" }}
                            ></textarea>
                            <p className="errormsg ">{chhimekiFormError.about}</p>
                        </div>

                    </div>


                    <div className="row text-start ">
                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="website" style={{ fontSize: "12px" }}>
                                    Website
                                </label>
                                <input
                                    type="text"
                                    value={chhimekiFormValue.website}
                                    onChange={handleChange}
                                    name="website"
                                    className="form-control form-control-sm mb-1"
                                    id="website"
                                />
                            </div>
                        </div>

                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="facebook" style={{ fontSize: "12px" }}>
                                    Facebook
                                </label>
                                <input
                                    type="text"
                                    value={chhimekiFormValue.facebook}
                                    onChange={handleChange}
                                    name="facebook"
                                    className="form-control form-control-sm mb-1"
                                    id="facebook"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row text-start ">
                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="establishDate" style={{ fontSize: "12px" }}>
                                    Established Date<sup className="sup-col">*</sup>
                                </label>
                                <input
                                    type="date"
                                    value={chhimekiFormValue.establishDate}
                                    onChange={handleChange}
                                    name="establishDate"
                                    className="form-control form-control-sm mb-1"
                                    id="establishDate"
                                />
                                <p className="errormsg ">{chhimekiFormError.establishDate}</p>
                            </div>
                        </div>

                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="head" style={{ fontSize: "12px" }}>
                                    Aadikshya<sup className="sup-col">*</sup>
                                </label>
                                <input
                                    type="text"
                                    value={chhimekiFormValue.head}
                                    onChange={handleChange}
                                    name="head"
                                    className="form-control form-control-sm mb-1"
                                    id="head"
                                />
                                <p className="errormsg ">{chhimekiFormError.head}</p>
                            </div>
                        </div>
                    </div>

                    <div className="row text-start ">
                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="latitude" style={{ fontSize: "12px" }}>
                                    Latitude
                                </label>
                                <input
                                    type="text"
                                    value={chhimekiFormValue.latitude}
                                    onChange={handleChange}
                                    name="latitude"
                                    className="form-control form-control-sm mb-1"
                                    id="latitude"
                                />
                            </div>
                        </div>

                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="longitude" style={{ fontSize: "12px" }}>
                                    Longtitude
                                </label>
                                <input
                                    type="text"
                                    value={chhimekiFormValue.longitude}
                                    onChange={handleChange}
                                    name="longitude"
                                    className="form-control form-control-sm mb-1"
                                    id="longitude"
                                />
                            </div>
                        </div>
                    </div>




                    <div className="row text-start ">
                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="expiryDate" style={{ fontSize: "12px" }}>
                                    Expiry Date<sup className="sup-col">*</sup>
                                </label>
                                <input
                                    type="date"
                                    value={chhimekiFormValue.expiryDate}
                                    onChange={handleChange}
                                    name="expiryDate"
                                    className="form-control form-control-sm mb-1"
                                    id="expiryDate"
                                />
                                <p className="errormsg ">{chhimekiFormError.expiryDate}</p>
                            </div>
                        </div>

                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="allowStatus" style={{ fontSize: "12px" }}>
                                    Select Allow Status<sup className="sup-col">*</sup>
                                </label>
                                <select
                                    id="allowStatus"
                                    name="allowStatus"
                                    onChange={handleChange}
                                    value={chhimekiFormValue.allowStatus}
                                    className="form-control form-control-sm mb-1"
                                    style={{ fontSize: "12px" }}
                                >
                                    <option value=" " selected >
                                        Select option
                                    </option>
                                    <option value="Y">Allow</option>
                                    <option value="N"> Disallow</option>

                                </select>
                                <p className="errormsg ">{chhimekiFormError.allowStatus}</p>
                            </div>
                        </div>
                    </div>


                    <div className="row text-start ">
                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="serverKey" style={{ fontSize: "12px" }}>
                                    Server Key
                                </label>
                                <input
                                    type="text"
                                    value={chhimekiFormValue.serverKey}
                                    onChange={handleChange}
                                    name="serverKey"
                                    className="form-control form-control-sm mb-1"
                                    id="serverKey"
                                />
                            </div>
                        </div>

                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="senderID" style={{ fontSize: "12px" }}>
                                    Sender ID
                                </label>
                                <input
                                    type="text"
                                    value={chhimekiFormValue.senderID}
                                    onChange={handleChange}
                                    name="senderID"
                                    className="form-control form-control-sm mb-1"
                                    id="senderID"
                                />
                            </div>
                        </div>
                    </div>


                    <div className="row text-start ">

                        <div className="form-group  ">
                            <div className="form-label" htmlFor="text" style={{ fontSize: "12px" }}>
                                Upload Image
                            </div>

                            <div className="BoxUpload">
                                <div className="image-upload">
                                    {!isUploaded ? (
                                        <>
                                            <label htmlFor="upload-input">
                                                <img
                                                    src={Plus}
                                                    draggable={"false"}
                                                    alt="placeholder"
                                                    style={{ width: 90, height: 100, paddingTop: "10px" }}
                                                />
                                                {/* <p style={{ color: "#444" }}>Click to upload image</p> */}
                                            </label>

                                            <input
                                                id="upload-input"
                                                type="file"
                                                accept=".jpg,.jpeg,.gif,.png,.mov,.mp4"
                                                onChange={handleImageChange}
                                            />
                                        </>
                                    ) : (
                                        <div className="ImagePreview">
                                            <img
                                                className="close-icon"
                                                src={CloseIcon}
                                                alt="CloseIcon"
                                                onClick={() => {
                                                    setIsUploaded(false);
                                                    setImage(null);
                                                }}
                                            />

                                            <img
                                                id="uploaded-image"
                                                src={image}
                                                draggable={false}
                                                alt="uploaded-img"
                                            />
                                        </div>
                                    )}
                                </div>
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
