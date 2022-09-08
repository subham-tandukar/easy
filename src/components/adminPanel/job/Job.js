import React, { useContext, useEffect, useRef, useState } from "react";
import "../../profile/profile.css";
import DataTable from "react-data-table-component";
// import { Fetchdata } from "../../../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { ShowImgPreview } from "../../../hooks/imagePreview";
import Spinner from "../../loading/spinner";
import UpperbarContext from "../../context/upperbar-context";
import { ShowImgPreview } from "../../hooks/imagePreview";
import StaffContext from "../../adminPanel/organization/staffState/StaffContext";
import JobContext from "../jobState/JobContext";
import JobPopup from "./JobPopup";
import AuthContext from "../../context/auth-context";
import { Fetchdata } from "../../hooks/getData";
import JobEditPopup from "./JobEditPopup";
import ApplicantPopup from "./ApplicantPopup";



export default function Job() {
    const { fiscalYear, todayDate, appURL } = useContext(UpperbarContext);
    const { customStyles } = useContext(StaffContext)
    const { User } = useContext(AuthContext);
    var xlsx = require("xlsx");

    const {
        setJobFormValue, jobvalue, popup, setPopup, editPop, originalList,
        chooseDepartment, setChooseDepartment, chooseSubDepartment, setChooseSubDepartment,
        chooseDesignation, setChooseDesignation, chooseShift, setChooseShift, chooseShiftType, setChooseShiftType, chooseJobType, setChooseJobType, jobList, handleEdit, deactivateDepart, applicantPop, addApplicant, jobStatus, setJobStatus, changeStatus, setJobList
    } = useContext(JobContext);

    const handleDepartment = (e) => {
        setChooseDesignation("-1");
        setChooseSubDepartment("-1");

        const target = e.target;
        const value = target.value;
        setChooseDepartment(value);
    };

    const handleSubDepartment = (e) => {
        setChooseDesignation("-1");
        const target = e.target;
        const value = target.value;
        setChooseSubDepartment(value);
    };

    const handleDesignation = (e) => {
        const target = e.target;
        const value = target.value;
        setChooseDesignation(value);
    };

    const handleShift = (e) => {
        const target = e.target;
        const value = target.value;
        setChooseShift(value);
    }

    const handleShiftType = (e) => {
        const target = e.target;
        const value = target.value;
        setChooseShiftType(value);
    }

    const handleJobType = (e) => {
        const target = e.target;
        const value = target.value;
        setChooseJobType(value);
    }





    //API to hit Department list
    const [departmentList, setDepartmentList] = useState([]);

    useEffect(() => {
        deptList();
    }, []);

    const deptList = () => {
        const params = {
            ComID: User.CompanyId,
            StaffID: -1,
            Flag: "S",
            Type: "POST",
            Status: 1,
            BranchID: User.BranchId,
            FetchURL: `${appURL}api/admin/department`,
        };

        Fetchdata(params).then(function (result) {
            if (result.StatusCode === 200) {
                const postResult = result.list ? result.list : "";
                setDepartmentList(postResult);
            } else {

            }
        });
    };

    // API to hit Sub-Department list
    const [subdepartmentList, setSubdepartmentList] = useState([]);

    useEffect(() => {
        subdeptList();
    }, [chooseDepartment]);

    const subdeptList = () => {
        const params = {
            ComID: User.CompanyId,
            StaffID: -1,
            DepartID: chooseDepartment,
            Flag: "S",
            Type: "POST",
            Status: 1,
            BranchID: User.BranchId,
            FetchURL: `${appURL}api/admin/sub-department`,
        };

        Fetchdata(params).then(function (result) {

            if (result.StatusCode === 200) {
                const postResult = result.SubDepList ? result.SubDepList : "";
                setSubdepartmentList(postResult);
            } else {
                setSubdepartmentList([]);

            }
        });
    };

    //API to hit Designation list
    const [designationList, setDesignationList] = useState([]);

    useEffect(() => {
        desgList();
    }, [chooseDepartment, chooseSubDepartment]);

    const desgList = () => {
        const params = {
            ComID: User.CompanyId,
            StaffID: -1,
            DepartID: chooseDepartment,
            SubDepartID: chooseSubDepartment,
            Flag: "S",
            Type: "POST",
            Status: 1,
            BranchID: User.BranchId,
            FetchURL: `${appURL}api/admin/designation`,
        };

        Fetchdata(params).then(function (result) {

            if (result.StatusCode === 200) {
                const postResult = result.DesignationList ? result.DesignationList : "";
                setDesignationList(postResult);
            } else {
                setDesignationList([]);

            }
        });
    };

    //API to hit Shift list
    const [shiftList, setShiftList] = useState([]);

    useEffect(() => {
        shftList();
    }, []);

    const shftList = () => {
        const params = {
            ComID: User.CompanyId,
            StaffID: "-1",
            Flag: "S",
            Status: "1",
            BranchID: User.BranchId.toString(),
            Type: "POST",
            FetchURL: `${appURL}api/admin/shift`,
        };

        Fetchdata(params).then(function (result) {
            if (result.StatusCode === 200) {
                const postResult = result.ShiftList ? result.ShiftList : "";
                setShiftList(postResult);
            } else {
                setShiftList([]);

            }
        });
    };















    const searchInput = useRef("");

    const addLeaveNote = (e) => {
        setPopup(true);

        setJobFormValue(jobvalue);
    };





    const columns = [
        {
            name: "S.N.",
            grow: 0,
            center: true,
            cell: (row, index) => index + 1,
        },

        {
            name: "Title",
            // grow: 0,
            center: true,
            width: "200px",
            selector: (row) => row.Title,
        },

        {
            name: "Designation",
            // grow: 0,
            center: true,
            width: "200px",
            selector: (row) => row.Designation,
        },
        {
            name: "Job Type",
            center: true,
            // grow: 0,
            width: "200px",
            selector: (row) => row.JobType,
        },
        {
            name: "Shift Type",
            center: true,
            // grow: 0,
            width: "200px",
            selector: (row) => row.ShiftType,
        },
        {
            name: "No Pos",
            center: true,
            // grow: 0,
            width: "200px",
            selector: (row) => row.NoOfPos,
        },
        {
            name: "Start Date",
            center: true,
            // grow: 0,
            width: "200px",
            selector: (row) => row.StartDate,
        },
        {
            name: "End Date",
            center: true,
            // grow: 0,
            width: "200px",
            selector: (row) => row.EndDate,
        },
        {
            name: "Interview Date",
            center: true,
            // grow: 0,
            width: "200px",
            selector: (row) => row.InterviewDate,
        },
        {
            name: "No. of Applicant",
            center: true,
            selector: (row) => {
                return (
                    <>
                        <span onClick={() => addApplicant(row.JobID)}>{row.NoOfApplication}</span>
                    </>
                )
            }
        },
        {
            name: "Job Status",
            center: true,
            // grow: 0,
            selector: (row) => {
                return (
                    <>
                        <div>
                            <select
                                style={{ fontSize: "11px", marginLeft: "5px" }}
                                name="status"
                                className="form-select form-select-sm"
                                aria-label="Default select example "
                                // value={jobStatus}
                                defaultValue={row.JobStatusID}
                                onChange={handleJobStatus}
                                onClick={(e) => changeStatus([row.JobID, e.target.value])}
                            >
                                <option
                                    value=""
                                    disabled
                                    selected
                                    style={{ fontSize: "11px" }}
                                >
                                    Select
                                </option>

                                <option value="0">Cancel</option>
                                <option value="1">Open</option>
                                <option value="2">Close</option>
                            </select>
                        </div>
                    </>
                )
            },
        },

        {
            name: "Action",
            grow: 1,
            center: true,
            width: "150px",
            selector: (row) => {
                return (
                    <>
                        <div className="ln-verition d-flex">
                            <button
                                type="button"
                                class="btn btn-sm editspan"
                                onClick={() => handleEdit(row)}
                            >
                                View{" "}
                            </button>{" "}



                        </div>
                    </>
                );
            },
        },
    ];



    const handleJobStatus = (data) => {
        let getId = data[0];
        let indexList = jobStatus ? jobStatus.findIndex((list) => list.JobID === getId) : -1;
        if (indexList < 0) {
            setJobStatus(data[1])
        }
    }
    console.log(jobStatus)



    // const checkStatus = (IsActive) => {
    //     if (IsActive === 1) {
    //         return "Deactivate";
    //     } else if (IsActive === 0) {
    //         return "Activate";
    //     }
    // };


    const searchHandler = (e) => {
        e.preventDefault();

        const srchQuery = searchInput.current.value.toLowerCase();

        if (srchQuery) {

            let srchResult = originalList.filter((list) => {
                return list["Title"].toLowerCase().includes(srchQuery);
            });

            if (srchResult) {

                setJobList(srchResult);
            } else {
                setJobList({});
            }
        } else {
            setJobList(originalList);
        }
    };


    const readUploadFile = (e) => {
        e.preventDefault();
        if (e.target.files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = xlsx.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = xlsx.utils.sheet_to_json(worksheet);
                console.log(json);
            };
            reader.readAsArrayBuffer(e.target.files[0]);
        }
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
            <div className="container-fluid classatten-wrapper  mt-3 ps-4 pe-4">
                <div className="row mt-3">
                    <div className="page-header">
                        <div className="text-start  page-title">Job</div>
                        <div className="page-date">
                            <div className="sec-content">
                                Today's Date : {todayDate} <span>|</span> Fiscal Year :{" "}
                                {fiscalYear.StartDate}
                                <span>-</span>
                                {fiscalYear.EndDate}
                            </div>
                        </div>
                    </div>
                    <hr className="title-hr" />
                </div>

                <>

                    <div className="sec-dataTable">
                        <div className="upper-dataTbl">
                            <div className="btn-addlnote mb-3">
                                {/*  This is all about xlsx button */}
                                <form>
                                    <div className="input-xlsx">
                                        <label htmlFor="upload">Upload File</label>
                                        <input
                                            type="file"
                                            className="btn btn-sm"
                                            name="upload"
                                            id="upload"
                                            onChange={readUploadFile}
                                        />
                                    </div>
                                </form>
                                {/*  This is all about xlsx button  ends herer*/}

                                <button
                                    type="button"
                                    className="btn btn-sm"
                                    style={{
                                        background: "var(--button-color)",
                                        color: "white",
                                    }}
                                    onClick={addLeaveNote}
                                >
                                    Add New
                                </button>
                            </div>
                        </div>

                        <DataTable
                            columns={columns}
                            data={jobList}
                            customStyles={customStyles}
                            pagination
                            fixedHeader
                            fixedHeaderScrollHeight="410px"
                            data-tag="allowRowEvents"
                            highlightOnHover
                            pointerOnHover
                            responsive
                            dense
                            striped
                            subHeader
                            subHeaderComponent={
                                <>
                                    <div className="col-md-2 col-sm-2 col-lg-2 me-2">
                                        <label style={{ fontSize: "14px", textAlign: "left", display: "block" }}>Department</label>
                                        <select
                                            style={{ fontSize: "11px" }}
                                            name="status"
                                            className="form-select form-select-sm"
                                            aria-label="Default select example "
                                            value={chooseDepartment}
                                            onChange={handleDepartment}
                                        >
                                            <option
                                                value=""
                                                disabled
                                                selected
                                                style={{ fontSize: "11px" }}
                                            >
                                                Select Department
                                            </option>
                                            <option value="-1">All</option>
                                            {departmentList.map((item) => (
                                                <option
                                                    key={item.DepartmentID}
                                                    value={item.DepartmentID}
                                                >
                                                    {item.Department}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-2 col-sm-2 col-lg-2 me-2">
                                        <label style={{ fontSize: "14px", textAlign: "left", display: "block" }}>Sub Department</label>
                                        <select
                                            style={{ fontSize: "11px" }}
                                            name="status"
                                            className="form-select form-select-sm"
                                            aria-label="Default select example "
                                            value={chooseSubDepartment}
                                            onChange={handleSubDepartment}
                                        >
                                            <option
                                                value=""
                                                disabled
                                                selected
                                                style={{ fontSize: "11px" }}
                                            >
                                                Select SubDepartment
                                            </option>
                                            <option value="-1">All</option>
                                            {subdepartmentList.map((item) => (
                                                <option
                                                    key={item.SubDepartID}
                                                    value={item.SubDepartID}
                                                >
                                                    {item.SubDepartName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-2 col-sm-2 col-lg-2 me-2">
                                        <label style={{ fontSize: "14px", textAlign: "left", display: "block" }}>Designation</label>
                                        <select
                                            style={{ fontSize: "11px" }}
                                            name="status"
                                            className="form-select form-select-sm"
                                            aria-label="Default select example "
                                            value={chooseDesignation}
                                            onChange={handleDesignation}
                                        >
                                            <option
                                                value=""
                                                disabled
                                                selected
                                                style={{ fontSize: "11px" }}
                                            >
                                                Select Designation
                                            </option>
                                            <option value="-1">All</option>
                                            {designationList.map((item) => (
                                                <option key={item.DesignationID} value={item.DesignationID}>
                                                    {item.Designation}
                                                </option>
                                            ))}
                                        </select>
                                    </div>


                                    <div className="col-md-2 col-sm-2 col-lg-2 me-2">
                                        <label style={{ fontSize: "14px", textAlign: "left", display: "block" }}>Shift </label>
                                        <select
                                            style={{ fontSize: "11px" }}
                                            name="status"
                                            className="form-select form-select-sm"
                                            aria-label="Default select example "
                                            value={chooseShift}
                                            onChange={handleShift}
                                        >
                                            <option
                                                value=""
                                                disabled
                                                selected
                                                style={{ fontSize: "11px" }}
                                            >
                                                Select Shift
                                            </option>
                                            <option value="-1">All</option>
                                            {shiftList.map((item) => (
                                                <option key={item.ShiftID} value={item.ShiftID}>
                                                    {item.Shift}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-2 col-sm-2 col-lg-2 me-2">
                                        <label style={{ fontSize: "14px", textAlign: "left", display: "block" }}>Shift Type</label>
                                        <select
                                            style={{ fontSize: "11px" }}
                                            name="status"
                                            className="form-select form-select-sm"
                                            aria-label="Default select example "
                                            value={chooseShiftType}
                                            onChange={handleShiftType}
                                        >
                                            <option
                                                value=""
                                                disabled
                                                selected
                                                style={{ fontSize: "11px" }}
                                            >
                                                Select Shift Type
                                            </option>
                                            <option value="-1">All</option>
                                            <option value="1">Weekly</option>
                                            <option value="2">Monthly</option>
                                            <option value="3">Yearly</option>
                                        </select>
                                    </div>


                                    <div className="col-md-2 col-sm-2 col-lg-2 me-2">
                                        <label style={{ fontSize: "14px", textAlign: "left", display: "block" }}>Job Type </label>
                                        <select
                                            style={{ fontSize: "11px" }}
                                            name="status"
                                            className="form-select form-select-sm"
                                            aria-label="Default select example "
                                            value={chooseJobType}
                                            onChange={handleJobType}
                                        >
                                            <option
                                                value=""
                                                disabled
                                                selected
                                                style={{ fontSize: "11px" }}
                                            >
                                                Select Job Type
                                            </option>
                                            <option value="-1">All</option>
                                            <option value="1">Full Time</option>
                                            <option value="2">Part Time</option>
                                            <option value="3">Intern</option>
                                            <option value="4">Paid Intern</option>
                                            <option value="5">Freelance</option>
                                            <option value="6">Contract</option>
                                            <option value="7">Training</option>
                                        </select>
                                    </div>



                                    <div className="col-md-2 col-sm-2 col-lg-2 ">
                                        <div className="d-flex" style={{ paddingTop: "15px" }}>
                                            <input
                                                placeholder="Search"
                                                ref={searchInput}
                                                type="text"
                                                className="form-control form-control-sm searchField"
                                                onChange={searchHandler}
                                            />
                                        </div>
                                    </div>
                                </>
                            }
                        />

                    </div>
                </>

            </div>

            {popup && <JobPopup />}
            {editPop && <JobEditPopup />}
            {applicantPop && <ApplicantPopup />}
        </>
    );
}
