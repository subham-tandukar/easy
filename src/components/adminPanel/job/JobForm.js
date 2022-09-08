import React, { useContext, useEffect, useState } from "react";
import "../../leaveNotes/leaveNotePopup.css";
import "../organization/subdepartment/SubdepartmentPopup.css";
import CloseIcon from "../../../images/CloseIcon.svg";
import "../../hooks/imagePreview.css";
import "../organization//product/ProductPopup.css";
import Plus from "../../../images/Plus.png";
import "../../hooks/imagePreview.css";

import { Fetchdata } from "../../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JobContext from "../jobState/JobContext";
import AuthContext from "../../context/auth-context";
import UpperbarContext from "../../context/upperbar-context";


export default function JobForm() {
    const { appURL } = useContext(UpperbarContext);
    const {
        jobFormValue, setJobFormValue, setPopup, jobFormError, setJobFormError, isSubmit, setIsSubmit, image, setImage, isUploaded, setIsUploaded, setTypeFile, negotiable, setNegotiable, departmentList, subdepartmentList, designationList, shiftList, jobvalue, getJobList
    } = useContext(JobContext);

    const { User } = useContext(AuthContext);



    const closePopUp = (e) => {
        setPopup(false);
        setJobFormError({});
        setJobFormValue(jobvalue)
        setIsUploaded(false)
        setImage("")
        setNegotiable(false)
    };

    const handleChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        if (name === "department") {
            jobFormValue.subDepartment = "";
            jobFormValue.designation = "";
        }
        if (name === "subDepartment") {
            jobFormValue.designation = "";
        }
        setJobFormValue({ ...jobFormValue, [name]: value });
    };
    const handleOnChange = (e) => {
        setNegotiable(!negotiable);
    };


    const formNext = (e) => {

        e.preventDefault();
        setJobFormError(validate(jobFormValue));
        setIsSubmit(true);
        console.log(isSubmit)
    };

    useEffect(() => {

        if (Object.keys(jobFormError).length === 0 && isSubmit) {

            console.log(jobFormValue)
            console.log(negotiable)

            const dataForm = {
                ComID: User.CompanyId,
                StaffID: User.UID,
                Flag: "i",
                DepartID: jobFormValue.department,
                SubDepartID: jobFormValue.subDepartment,
                DesignationID: jobFormValue.designation,
                ShiftID: jobFormValue.shifts,
                ShiftTypeID: jobFormValue.shiftType,
                JobTypeID: jobFormValue.jobType,
                Title: jobFormValue.title,
                Description: jobFormValue.description,
                Banner: image !== null ? image.split(",")[1] : "",
                Responsibility: jobFormValue.responsibility,
                Education: jobFormValue.education,
                NoPos: jobFormValue.position,
                Experience: jobFormValue.experience,
                IsNeg: negotiable ? "1" : "0",
                Salary: jobFormValue.salary,
                StartDate: jobFormValue.startDate,
                EndDate: jobFormValue.endDate,
                InterviewDate: jobFormValue.interviewDate,
                JobStatus: "1",
                BranchID: User.BranchId,
                FiscalID: User.FiscalId,
                FetchURL: `${appURL}api/admin/job`,
                Type: "POST",
            };
            console.log(dataForm)

            Fetchdata(dataForm).then(function (result) {
                console.log(result)

                if (result.StatusCode === 200) {
                    getJobList();
                    toast(result.Message, {
                        style: {
                            color: "green",
                            fontSize: "13px",
                        },
                    });
                    setPopup(false);
                    setImage("")
                    setNegotiable(false)
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
    }, [jobFormError]);

    const validate = (values) => {
        const errors = {};
        if (!values.department) {
            errors.department = "Required";
        }
        if (!values.subDepartment) {
            errors.subDepartment = "Required";
        }
        if (!values.designation) {
            errors.designation = "Required";
        }
        if (!values.shifts) {
            errors.shifts = "Required";
        }
        if (!values.shiftType) {
            errors.shiftType = "Required";
        }
        if (!values.jobType) {
            errors.jobType = "Required";
        }
        if (!values.title) {
            errors.title = "Required";
        }
        if (!values.description) {
            errors.description = "Required";
        }
        if (!values.responsibility) {
            errors.responsibility = "Required";
        }
        if (!values.position) {
            errors.position = "Required";
        }
        if (!values.education) {
            errors.education = "Required";
        }
        if (!values.experience) {
            errors.experience = "Required";
        }
        if (!values.startDate) {
            errors.startDate = "Required";
        }
        if (!values.endDate) {
            errors.endDate = "Required";
        }
        if (!values.salary) {
            errors.salary = "Required";
        }
        if (!values.interviewDate) {
            errors.interviewDate = "Required";
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
                                <label className="form-label" htmlFor="department" style={{ fontSize: "12px" }}>
                                    Department<sup className="sup-col">*</sup>
                                </label>
                                <select
                                    id="department"
                                    name="department"
                                    onChange={handleChange}
                                    value={jobFormValue.department}
                                    className="form-control form-control-sm mb-1"
                                    style={{ fontSize: "12px" }}
                                >
                                    <option value="" selected>
                                        Select option
                                    </option>
                                    {departmentList.map((item) => (
                                        <option
                                            key={item.DepartmentID}
                                            value={item.DepartmentID}
                                        >
                                            {item.Department}
                                        </option>
                                    ))}

                                </select>
                                <p className="errormsg ">{jobFormError.department}</p>
                            </div>
                        </div>



                        <div className="col-md-4 col-sm-4 col-lg-4">
                            <div className="form-group">
                                <label className="form-label" htmlFor="subDepartment" style={{ fontSize: "12px" }}>
                                    Sub Department<sup className="sup-col">*</sup>
                                </label>
                                <select
                                    id="subDepartment"
                                    name="subDepartment"
                                    onChange={handleChange}
                                    value={jobFormValue.subDepartment}
                                    className="form-control form-control-sm mb-1"
                                    style={{ fontSize: "12px" }}
                                >
                                    <option value="" selected>
                                        Select option
                                    </option>
                                    {subdepartmentList.map((item) => (
                                        <option
                                            key={item.SubDepartID}
                                            value={item.SubDepartID}
                                        >
                                            {item.SubDepartName}
                                        </option>
                                    ))}

                                </select>
                                <p className="errormsg ">{jobFormError.subDepartment}</p>
                            </div>
                        </div>

                        <div className="col-md-4 col-sm-4 col-lg-4">
                            <div className="form-group">
                                <label className="form-label" htmlFor="designation" style={{ fontSize: "12px" }}>
                                    Designation<sup className="sup-col">*</sup>
                                </label>
                                <select
                                    id="designation"
                                    name="designation"
                                    onChange={handleChange}
                                    value={jobFormValue.designation}
                                    className="form-control form-control-sm mb-1"
                                    style={{ fontSize: "12px" }}
                                >
                                    <option value="" selected>
                                        Select option
                                    </option>
                                    {designationList.map((item) => (
                                        <option key={item.DesignationID} value={item.DesignationID}>
                                            {item.Designation}
                                        </option>
                                    ))}

                                </select>
                                <p className="errormsg ">{jobFormError.designation}</p>
                            </div>
                        </div>
                    </div>

                    <div className="row text-start ">
                        <div className="col-md-4 col-sm-4 col-lg-4">
                            <div className="form-group">
                                <label className="form-label" htmlFor="shifts" style={{ fontSize: "12px" }}>
                                    Shift<sup className="sup-col">*</sup>
                                </label>
                                <select
                                    id="shifts"
                                    name="shifts"
                                    onChange={handleChange}
                                    value={jobFormValue.shifts}
                                    className="form-control form-control-sm mb-1"
                                    style={{ fontSize: "12px" }}
                                >
                                    <option value="" selected>
                                        Select option
                                    </option>
                                    {shiftList.map((item) => (
                                        <option key={item.ShiftID} value={item.ShiftID}>
                                            {item.Shift}
                                        </option>
                                    ))}

                                </select>
                                <p className="errormsg ">{jobFormError.shifts}</p>
                            </div>
                        </div>

                        <div className="col-md-4 col-sm-4 col-lg-4">
                            <div className="form-group">
                                <label className="form-label" htmlFor="shiftType" style={{ fontSize: "12px" }}>
                                    Shift Type<sup className="sup-col">*</sup>
                                </label>
                                <select
                                    id="shiftType"
                                    name="shiftType"
                                    onChange={handleChange}
                                    value={jobFormValue.shiftType}
                                    className="form-control form-control-sm mb-1"
                                    style={{ fontSize: "12px" }}
                                >
                                    <option value="" selected>
                                        Select option
                                    </option>
                                    <option value="1">Weekly</option>
                                    <option value="2">Monthly</option>
                                    <option value="3">Yearly</option>

                                </select>
                                <p className="errormsg ">{jobFormError.shiftType}</p>
                            </div>
                        </div>

                        <div className="col-md-4 col-sm-4 col-lg-4">
                            <div className="form-group">
                                <label className="form-label" htmlFor="jobType" style={{ fontSize: "12px" }}>
                                    Job Type<sup className="sup-col">*</sup>
                                </label>
                                <select
                                    id="jobType"
                                    name="jobType"
                                    onChange={handleChange}
                                    value={jobFormValue.jobType}
                                    className="form-control form-control-sm mb-1"
                                    style={{ fontSize: "12px" }}
                                >
                                    <option value="" selected>
                                        Select option
                                    </option>
                                    <option value="1">Full Time</option>
                                    <option value="2">Part Time</option>
                                    <option value="3">Intern</option>
                                    <option value="4">Paid Intern</option>
                                    <option value="5">Freelance</option>
                                    <option value="6">Contract</option>
                                    <option value="7">Training</option>

                                </select>
                                <p className="errormsg ">{jobFormError.jobType}</p>
                            </div>
                        </div>


                    </div>



                    <div className="row text-start ">

                        <div className="form-group">
                            <label className="form-label" htmlFor="title" style={{ fontSize: "12px" }}>
                                Title<sup className="sup-col">*</sup>
                            </label>
                            <input
                                type="text"
                                value={jobFormValue.title}
                                onChange={handleChange}
                                name="title"
                                className="form-control form-control-sm mb-1"
                                id="title"
                            />
                            <p className="errormsg ">{jobFormError.title}</p>
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
                                value={jobFormValue.description}
                                onChange={handleChange}
                                id="exampleFormControlTextarea1"
                                rows="3"
                                style={{ fontSize: "12px" }}
                            ></textarea>
                            <p className="errormsg ">{jobFormError.description}</p>
                        </div>

                    </div>

                    <div className="row text-start ">

                        <div className="form-group">
                            <label
                                htmlFor="exampleFormControlTextarea1"
                                className="form-label"
                                placeholder="responsibility"
                                style={{ fontSize: "12px" }}
                            >
                                Responsibility<sup className="sup-col">*</sup>
                            </label>
                            <textarea
                                className="form-control"
                                name="responsibility"
                                value={jobFormValue.responsibility}
                                onChange={handleChange}
                                id="exampleFormControlTextarea1"
                                rows="3"
                                style={{ fontSize: "12px" }}
                            ></textarea>
                            <p className="errormsg ">{jobFormError.responsibility}</p>
                        </div>

                    </div>


                    <div className="row text-start ">

                        <div className="col-md-2 col-sm-2 col-lg-2">
                            <div className="form-group">
                                <label className="form-label" htmlFor="position" style={{ fontSize: "12px" }}>
                                    No. of Position
                                </label>
                                <input
                                    type="text"
                                    value={jobFormValue.position}
                                    onChange={handleChange}
                                    name="position"
                                    className="form-control form-control-sm mb-1"
                                    id="position"
                                />
                                <p className="errormsg ">{jobFormError.position}</p>
                            </div>
                        </div>

                        <div className="col-md-5 col-sm-5 col-lg-5">
                            <div className="form-group">
                                <label className="form-label" htmlFor="education" style={{ fontSize: "12px" }}>
                                    Education
                                </label>
                                <input
                                    type="text"
                                    value={jobFormValue.education}
                                    onChange={handleChange}
                                    name="education"
                                    className="form-control form-control-sm mb-1"
                                    id="education"
                                />
                                <p className="errormsg ">{jobFormError.education}</p>
                            </div>
                        </div>

                        <div className="col-md-5 col-sm-5 col-lg-5">
                            <div className="form-group">
                                <label className="form-label" htmlFor="experience" style={{ fontSize: "12px" }}>
                                    Experience
                                </label>
                                <input
                                    type="text"
                                    value={jobFormValue.experience}
                                    onChange={handleChange}
                                    name="experience"
                                    className="form-control form-control-sm mb-1"
                                    id="experience"
                                />
                                <p className="errormsg ">{jobFormError.experience}</p>
                            </div>
                        </div>
                    </div>

                    <div className="row text-start ">
                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="startDate" style={{ fontSize: "12px" }}>
                                    Start Date<sup className="sup-col">*</sup>
                                </label>
                                <input
                                    type="date"
                                    value={jobFormValue.startDate}
                                    onChange={handleChange}
                                    name="startDate"
                                    className="form-control form-control-sm mb-1"
                                    id="startDate"
                                />
                                <p className="errormsg ">{jobFormError.startDate}</p>
                            </div>
                        </div>

                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="endDate" style={{ fontSize: "12px" }}>
                                    End Date<sup className="sup-col">*</sup>
                                </label>
                                <input
                                    type="date"
                                    value={jobFormValue.endDate}
                                    onChange={handleChange}
                                    name="endDate"
                                    className="form-control form-control-sm mb-1"
                                    id="endDate"
                                />
                                <p className="errormsg ">{jobFormError.endDate}</p>
                            </div>
                        </div>
                    </div>

                    <div className="row text-start ">
                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="salary" style={{ fontSize: "12px" }}>
                                    Salary
                                </label>
                                <input
                                    type="text"
                                    value={jobFormValue.salary}
                                    onChange={handleChange}
                                    name="salary"
                                    className="form-control form-control-sm mb-1"
                                    id="salary"
                                />
                                <p className="errormsg ">{jobFormError.salary}</p>
                            </div>
                        </div>

                        <div className="col-md-6 col-sm-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label" htmlFor="interviewDate" style={{ fontSize: "12px" }}>
                                    Interview Date<sup className="sup-col">*</sup>
                                </label>
                                <input
                                    type="date"
                                    value={jobFormValue.interviewDate}
                                    onChange={handleChange}
                                    name="interviewDate"
                                    className="form-control form-control-sm mb-1"
                                    id="interviewDate"
                                />
                                <p className="errormsg ">{jobFormError.interviewDate}</p>
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
                            checked={negotiable}
                            style={{ fontSize: "12px", marginTop: "7px" }}
                        />
                        <label
                            class="form-check-label"
                            for="exampleCheck2"
                            style={{ fontSize: "12px", paddingLeft: "4px" }}
                        >
                            Negotiable
                        </label>
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
