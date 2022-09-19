import React, { useContext, useEffect, useRef, useState } from "react";
import "../../leaveNotes/leaveNotePopup.css";
import "../organization/subdepartment/SubdepartmentPopup.css";
import CloseIcon from "../../../images/CloseIcon.svg";
import "../../hooks/imagePreview.css";
import "../organization/product/ProductPopup.css";
import "../organization/staff/Staff.css";
import "react-toastify/dist/ReactToastify.css";
import JobContext from "../jobState/JobContext";
import { ToastContainer, toast } from "react-toastify";
import DataTable from "react-data-table-component";
import StaffContext from "../organization/staffState/StaffContext";
import UpperbarContext from "../../context/upperbar-context";


export default function ApplicantPopup() {
    const { sidePanelBg } = useContext(UpperbarContext);
    const searchInput = useRef("");
    const { customStyles } = useContext(StaffContext)

    const {
        setApplicantPop, applicantList, setApplicantList, searchList
    } = useContext(JobContext);

    const closePopUp = (e) => {
        setApplicantPop(false);
        console.log("close")
    };

    const changeStatus = (ID, IsActive) => {
        // deactivateDepart(ID, IsActive);
    };

    const checkStatus = (IsActive) => {
        if (IsActive === 1) {
            return "Deactivate";
        } else if (IsActive === 0) {
            return "Activate";
        }
    };

    const searchHandler = (e) => {
        e.preventDefault();

        const srchQuery = searchInput.current.value.toLowerCase();
        if (srchQuery) {

            let srchResult = searchList.filter((list) => {
                return list["Name"].toLowerCase().includes(srchQuery);
            });

            if (srchResult) {

                setApplicantList(srchResult);
            } else {
                setApplicantList({});
            }
        } else {
            setApplicantList(searchList);
        }
    };



    const columns = [
        {
            name: "S.N.",
            grow: 0,
            center: true,
            cell: (row, index) => index + 1,
        },
        {
            name: "Name",
            // center: true,
            // grow: 0,
            width: "200px",
            selector: (row) => row.Name,
        },
        {
            name: "Contact",
            center: true,
            // grow: 0,
            selector: (row) => row.Contact,
        },
        {
            name: "Email",
            // grow: 0,
            center: true,
            width: "200px",
            selector: (row) => row.Email,
        },
        {
            name: "CV",
            // grow: 0,
            center: true,
            selector: (row) => row.CV,
        },
        {
            name: "Via",
            // grow: 0,
            center: true,
            selector: (row) => row.Via,
        },
        {
            name: "Job Status",
            // grow: 0,
            center: true,
            selector: (row) => row.JobStatus,
        },
        {
            name: "Created Date",
            // grow: 0,
            center: true,
            width: "200px",
            selector: (row) => row.CreatedDate,
        },
        // {
        //     name: "Action",
        //     // grow: 0,
        //     center: true,
        //     width: "200px",
        //     selector: (row) => {
        //         return (
        //             <>
        //                 <div className="ln-verition d-flex">
        //                     <button
        //                         type="button"
        //                         class="btn btn-sm editspan"
        //                     // onClick={() => editPop(row)}
        //                     >
        //                         View{" "}
        //                     </button>{" "}

        //                     <button
        //                         type="button"
        //                         class="btn btn-sm actvspan"
        //                         onClick={() => changeStatus(row.DepartmentID, row.Status)}
        //                     >
        //                         {checkStatus(row.Status)}
        //                     </button>
        //                 </div>
        //             </>
        //         );
        //     },
        // },
    ];


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
                <div className="staffpopup-inner">
                    <div className="popUpHeader ps-0 pe-0" style={sidePanelBg}>
                        <div className="popUpTitle">Applicant </div>
                        <div className="popUpClose">
                            <img
                                className="popUpCloseIcon"
                                src={CloseIcon}
                                alt="CloseIcon"
                                onClick={closePopUp}
                            />
                        </div>
                    </div>
                    <div style={{ margin: "20px" }}>
                        <DataTable
                            columns={columns}
                            data={applicantList}
                            customStyles={customStyles}
                            pagination
                            fixedHeader
                            fixedHeaderScrollHeight="350px"
                            highlightOnHover
                            pointerOnHover
                            responsive
                            dense
                            striped
                            subHeader
                            subHeaderComponent={
                                <>
                                    <div className="upper-dataTbl">
                                        <div className="d-flex" style={{ marginRight: "10px" }}>
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

                </div>
            </div>
        </>
    );
}
