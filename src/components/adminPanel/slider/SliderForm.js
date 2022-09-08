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
import AuthContext from "../../context/auth-context";
import SliderContext from "../sliderState/SliderContext";

export default function SliderForm() {
    const {
        popup, setPopup, image, setImage, isUploaded, setIsUploaded, typeFile, setTypeFile, sliderFormError, setSliderFormError, isSubmit, setIsSubmit, loading, setLoading, originalList, setOriginalList, slidervalue, sliderFormValue, setSliderFormValue, fetchdata
    } = useContext(SliderContext);

    const { User } = useContext(AuthContext);



    const closePopUp = (e) => {
        setPopup(false);
        setSliderFormError({});
    };

    const handleChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.type == "checkbox" ? target.checked : target.value;
        setSliderFormValue({ ...sliderFormValue, [name]: value });
    };


    const formNext = (e) => {

        e.preventDefault();
        // setSliderFormError(validate(sliderFormValue));
        setIsSubmit(true);
        fetchdata(image)
    };

    // useEffect(() => {

    //     if (Object.keys(sliderFormError).length === 0 && isSubmit) {
    //         


    //     }
    //     setIsSubmit(false);
    // }, [sliderFormError]);

    // const validate = (values) => {
    //     const errors = {};

    //     if (!values.order) {
    //         errors.order = "Required";
    //     }


    //     return errors;
    // };

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
            <div className="sliderpopUpBody ps-3 pe-3">
                <div className="col-md-12 col-sm-12 col-lg-12">

                    {/* <div className="row text-start ">
                        <div className="col-md-12 col-sm-12 col-lg-12">
                            <div className="form-group">
                                <label className="form-label" htmlFor="order" style={{ fontSize: "12px" }}>
                                    Slider Name<sup className="sup-col">*</sup>
                                </label>
                                <select id="order" name="order"
                                    onChange={handleChange}
                                    value={sliderFormValue.order} className="form-control form-control-sm mb-1" style={{ fontSize: '12px' }}>
                                    <option value="none" selected>Select Order Note</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>

                                </select>
                                <p className="errormsg " style={{ marginBottom: "0" }}>{sliderFormError.order}</p>
                            </div>
                        </div>

                    </div> */}











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
