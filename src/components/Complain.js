import React, { useContext, useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import AuthContext from "./context/auth-context";
import { useNavigate } from "react-router-dom";
import UpperbarContext from "./context/upperbar-context";
import { Fetchdata } from "./hooks/getData";

export default function Complain() {
    const { appURL } = useContext(UpperbarContext);
    const { User } = useContext(AuthContext);
    const [complainFormError, setComplainFormError] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const complainvalue = {
        title: "",
        description: "",
        suggestion: "",
    };
    const [complainFormValue, setComplainFormValue] = useState(complainvalue);
    const handleChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        setComplainFormValue({ ...complainFormValue, [name]: value });
    };

    const validate = (values) => {
        const errors = {};
        if (!values.description) {
            errors.description = "Required";
        }
        return errors;
    };

    const formNext = (e) => {
        e.preventDefault();
        setComplainFormError(validate(complainFormValue));
        setIsSubmit(true);
        console.log(isSubmit)
    };


    useEffect(() => {

        if (Object.keys(complainFormError).length === 0 && isSubmit) {
            console.log(complainFormValue)

            const dataForm = {
                ComID: User.CompanyId,
                Flag: "i",
                Title: complainFormValue.title,
                Description: complainFormValue.description,
                Suggestion: complainFormValue.suggestion,
                FetchURL: `${appURL}api/complain`,
                Type: "POST",
            };
            console.log(dataForm)

            Fetchdata(dataForm).then(function (result) {
                console.log(result)

                if (result.StatusCode === 200) {
                    // chmList();
                    toast(result.Message, {
                        style: {
                            color: "green",
                            fontSize: "13px",
                        },
                    });
                    setComplainFormError({});
                    setComplainFormValue(complainvalue);
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
    }, [complainFormError]);

    let navigate = useNavigate();
    const routeChange = () => {
        let path = "/login";
        navigate(path);
        setComplainFormError({});
        setComplainFormValue(complainvalue);
        setIsSubmit(false);
    }


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
                <div className="staffpopup-inner ">
                    <div className="popUpHeader ps-0 pe-0">
                        <div className="popUpTitle">Complain </div>
                        <div className="popUpClose">
                            {/* <img
                                className="popUpCloseIcon"
                                src={CloseIcon}
                                alt="CloseIcon"
                                onClick={closePopUp}
                            /> */}
                        </div>
                    </div>


                    <div className="staffpopUpBody ps-3 pe-3">
                        <div className="col-md-12 col-sm-12 col-lg-12">
                            <div className="row text-start ">

                                <div className="form-group">
                                    <label className="form-label" htmlFor="title" style={{ fontSize: "12px" }}>
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={complainFormValue.title}
                                        onChange={handleChange}
                                        name="title"
                                        className="form-control form-control-sm mb-1"
                                        id="title"
                                    />
                                </div>
                            </div>

                            <div className="row text-start ">

                                <div className="form-group">
                                    <label
                                        htmlFor="exampleFormControlTextarea1"
                                        className="form-label"
                                        placeholder="description"
                                        style={{ fontSize: "12px" }}
                                    >
                                        Description<sup className="sup-col">*</sup>
                                    </label>
                                    <textarea
                                        className="form-control"
                                        name="description"
                                        value={complainFormValue.description}
                                        onChange={handleChange}
                                        id="exampleFormControlTextarea1"
                                        rows="3"
                                        style={{ fontSize: "12px" }}
                                    ></textarea>
                                    <p className="errormsg ">{complainFormError.description}</p>
                                </div>
                            </div>


                            <div className="row text-start ">
                                <div className="form-group">
                                    <label
                                        htmlFor="exampleFormControlTextarea1"
                                        className="form-label"
                                        placeholder="suggestion"
                                        style={{ fontSize: "12px" }}
                                    >
                                        Suggestion
                                    </label>
                                    <textarea
                                        className="form-control"
                                        name="suggestion"
                                        value={complainFormValue.suggestion}
                                        onChange={handleChange}
                                        id="exampleFormControlTextarea1"
                                        rows="3"
                                        style={{ fontSize: "12px" }}
                                    ></textarea>
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
                                    onClick={routeChange}
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
