import React, { useContext, useEffect, useRef, useState } from "react";
import "../../profile/profile.css";
import DataTable from "react-data-table-component";
import AuthContext from "../../context/auth-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpperbarContext from "../../context/upperbar-context";
import CooperativeContext from "../organization/cooperativeState/CooperativeContext";
import { Fetchdata } from "../../hooks/getData";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import "@sbmdkl/nepali-datepicker-reactjs/dist/index.css";
import StaffContext from "../organization/staffState/StaffContext";



export default function LeadSummary() {
    const { customStyles } = useContext(StaffContext)
    const { fiscalYear, todayDate, appURL } = useContext(UpperbarContext);
    // const apisignature = process.env.REACT_APP_SIGNATURE;

    const { reactURL, cooperativeList } = useContext(CooperativeContext)
    const [loading, setLoading] = useState(true)

    const { User } = useContext(AuthContext);



    const searchInput = useRef("");

    const [originalList, setOriginalList] = useState("")


    const [reportOption, setReportOption] = useState("")
    const handleReport = (e) => {
        const target = e.target;
        const value = target.value;
        setReportOption(value);
    }


    const [nepaliDate, setNepaliDate] = useState("")
    const handleDate = ({ bsDate }) => {
        setNepaliDate({ ...nepaliDate, fromDate: bsDate });
    };


    const [year, setYear] = useState("")
    const handleYear = (e) => {
        const target = e.target;
        const value = target.value;
        setYear(value);
    }

    const [month, setMonth] = useState("")
    const handleMonth = (e) => {
        const target = e.target;
        const value = target.value;
        setMonth(value);
    }



    const [leadSummary, setLeadSummary] = useState([]);

    useEffect(() => {
        ledSumm();
    }, [reportOption, nepaliDate, month, year]);

    const ledSumm = () => {
        const params = {
            ComID: User.CompanyId,
            StaffID: "-1",
            Flag: reportOption === "day" ? "D" : reportOption === "month" ? "M" : "Y",
            DFlag: "N",
            Value: reportOption === "day" ? nepaliDate.fromDate : reportOption === "month" ? `${year}/${month}` : reportOption === "year" ? year : "",
            BranchID: User.BranchId,
            Type: "POST",
            FetchURL: `${appURL}api/admin/leads-summary`,
        };


        Fetchdata(params).then(function (result) {
            if (result.StatusCode === 200) {
                const postResult = result.Leadlst ? result.Leadlst : "";
                setLeadSummary(postResult);
                setOriginalList(postResult);
                setLoading(false);
            } else {
                setLoading(false);
                setLeadSummary([]);

            }
        });
    };



    const columns = [
        {
            name: "S.N.",
            // grow: 0,
            center: true,
            cell: (row, index) => index + 1,
        },
        {
            name: "Staff",
            // grow: 0,
            width:"200px",
            center: true,
            cell: (row) => row.StaffName,
        },
        {
            name: "Organisation",
            // grow: 0,
            center: true,
            cell: (row) => row.Org,
        },
        {
            name: "Lead",
            // grow: 0,
            center: true,
            cell: (row) => row.Lead,
        },
        {
            name: "Online",
            // grow: 0,
            center: true,
            cell: (row) => row.Online,
        },
        {
            name: "Offline",
            // grow: 0,
            center: true,
            cell: (row) => row.Offline,
        },
        {
            name: "Both",
            // grow: 0,
            center: true,
            cell: (row) => row.Both,
        },
        {
            name: "Website",
            // grow: 0,
            center: true,
            cell: (row) => row.Website
        },
        {
            name: "Software",
            // grow: 0,
            center: true,
            cell: (row) => row.Software
        },
        {
            name: "Attendance System",
            // grow: 0,
            center: true,
            cell: (row) => row.AttendanceSystem
        },
        {
            name: "SMS",
            // grow: 0,
            center: true,
            cell: (row) => row.SMS
        },
        {
            name: "Cloud Backup",
            // grow: 0,
            center: true,
            cell: (row) => row.Cloud
        },
        {
            name: "Pending",
            // grow: 0,
            center: true,
            cell: (row) => row.Pending
        },
        {
            name: "Success",
            // grow: 0,
            center: true,
            cell: (row) => row.Success
        },
        {
            name: "Failed",
            // grow: 0,
            center: true,
            cell: (row) => row.Failed
        },
    ];



    const searchHandler = (e) => {
        e.preventDefault();

        const srchQuery = searchInput.current.value.toLowerCase();

        if (srchQuery) {

            let srchResult = originalList.filter((list) => {
                return list["Org"].toLowerCase().includes(srchQuery) || list["StaffName"].toLowerCase().includes(srchQuery);
            });

            if (srchResult) {

                setLeadSummary(srchResult);
            } else {
                setLeadSummary({});
            }
        } else {
            setLeadSummary(originalList);
        }
    };





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
                <>

                    <DataTable
                        columns={columns}
                        data={leadSummary}
                        customStyles={customStyles}
                        pagination
                        fixedHeader
                        fixedHeaderScrollHeight="410px"
                        highlightOnHover
                        pointerOnHover
                        responsive
                        dense
                        striped
                        subHeader
                        subHeaderComponent={
                            <>


                                <div className="col-md-2 col-sm-2 col-lg-2 me-2">
                                    <label style={{ fontSize: "14px", textAlign: "left", display: "block" }}>Report Option</label>
                                    <select
                                        style={{ fontSize: "11px" }}
                                        name="status"
                                        className="form-select form-select-sm"
                                        aria-label="Default select example "
                                        value={reportOption}
                                        onChange={handleReport}
                                    >
                                        <option selected disabled value="" style={{ fontSize: "11px" }}>
                                            Select Report Option
                                        </option>
                                        <option value="day">Day</option>
                                        <option value="month">Month</option>
                                        <option value="year">Year</option>
                                    </select>
                                </div>


                                {reportOption === "day" && (

                                    <div className="upper-dataTbl me-2">
                                        <label style={{ fontSize: "14px", textAlign: "left", display: "block" }}>From Date</label>
                                        <Calendar
                                            className="form-control form-control-sm mb-1"
                                            dateFormat="YYYY/MM/DD"
                                            theme="default"
                                            language="en"
                                            values={nepaliDate}
                                            onChange={handleDate}
                                        />
                                    </div>
                                )}


                                {reportOption === "year" || reportOption === "month" ?
                                    <div className="col-md-2 col-sm-2 col-lg-2 me-2">
                                        <label style={{ fontSize: "14px", textAlign: "left", display: "block" }}>Year</label>
                                        <select
                                            style={{ fontSize: "11px" }}
                                            name="status"
                                            className="form-select form-select-sm"
                                            aria-label="Default select example "
                                            value={year}
                                            onChange={handleYear}
                                        >
                                            <option selected disabled value="" style={{ fontSize: "11px" }}>
                                                Select Year
                                            </option>
                                            <option value="2079">2079</option>
                                            <option value="2080">2080</option>
                                        </select>
                                    </div>
                                    : <></>}

                                {reportOption === "month" && (

                                    <div className="col-md-2 col-sm-2 col-lg-2 me-2">
                                        <label style={{ fontSize: "14px", textAlign: "left", display: "block" }}>Month</label>
                                        <select
                                            style={{ fontSize: "11px" }}
                                            name="status"
                                            className="form-select form-select-sm"
                                            aria-label="Default select example "
                                            value={month}
                                            onChange={handleMonth}
                                        >
                                            <option selected disabled value="" style={{ fontSize: "11px" }}>
                                                Select Month
                                            </option>
                                            <option value="01">Baishakh</option>
                                            <option value="02">Jestha</option>
                                            <option value="03">Ashar</option>
                                            <option value="04">Shrawan</option>
                                            <option value="05">Bhadra</option>
                                            <option value="06">Asoj</option>
                                            <option value="07">Kartik</option>
                                            <option value="08">Mangsir</option>
                                            <option value="09">Poush</option>
                                            <option value="10">Magh</option>
                                            <option value="11">Falgun</option>
                                            <option value="12">Chaitra</option>
                                        </select>
                                    </div>
                                )}

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
                </>
            </div>
        </>
    );
}
