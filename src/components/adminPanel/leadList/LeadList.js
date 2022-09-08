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




export default function LeadList() {
    const { fiscalYear, todayDate, appURL } = useContext(UpperbarContext);
    // const apisignature = process.env.REACT_APP_SIGNATURE;
    const { customStyles } = useContext(StaffContext)

    const { reactURL, cooperativeList } = useContext(CooperativeContext)
    const [loading, setLoading] = useState(true)

    const { User } = useContext(AuthContext);
    const searchInput = useRef("");


    const [originalList, setOriginalList] = useState("")

    const [department, setDepartment] = useState("")
    const handleDepartment = (e) => {
        const target = e.target;
        const value = target.value;
        setDepartment(value);
    }

    const [subDepartment, setSubDepartment] = useState("")
    const handleSubDepartment = (e) => {
        const target = e.target;
        const value = target.value;
        setSubDepartment(value);
    }


    const [staff, setStaff] = useState("")
    const handleStaff = (e) => {
        const target = e.target;
        const value = target.value;
        setStaff(value);
    }

    const [organizationType, setOrganizationType] = useState("-1")
    const handleOrganizationType = (e) => {
        const target = e.target;
        const value = target.value;
        setOrganizationType(value);
    }

    const [clientType, setClientType] = useState("-1")
    const handleClientType = (e) => {
        const target = e.target;
        const value = target.value;
        setClientType(value);
    }

    const [product, setProduct] = useState("-1")
    const handleProduct = (e) => {
        const target = e.target;
        const value = target.value;
        setProduct(value);
    }

    const [lead, setLead] = useState("-1")
    const handleLead = (e) => {
        const target = e.target;
        const value = target.value;
        setLead(value);
    }

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



    // const [creditList, setCreditList] = useState([])

    // // API to hit Credit list

    // useEffect(() => {
    //     getCreditList();
    // }, [])

    // const getCreditList = () => {
    //     const dataForm = {
    //         CoOperativeCode: chooseCooperative,
    //         UserName: User.Username,
    //         Flag: "s",
    //         IsEncryptReq: "N",
    //         TimeStamp: "2022-05-02T01:35:44.345"
    //     }
    //     

    //     const requestOptions = {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(dataForm)
    //     };
    //     fetch(`${reactURL}MblPayPanel/CoOperative/CreditManagement`, requestOptions)
    //         .then((result) => {
    //             result.json().then((resp) => {
    //                 
    //                 if (resp.statuS_CODE === "0") {
    //                     const postResult = resp.creditLst ? resp.creditLst : "";
    //                     setLoading(false);
    //                     setCreditList(postResult);

    //                 } else {
    //                     setCreditList([]);
    //                 }

    //             })
    //         })
    // }



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
            center: true,
            width: "200px",
            cell: (row) => row.StaffName,
        },
        {
            name: "Organisation Name",
            grow: 4,
            center: true,
            width: "400px",
            cell: (row) => row.OrgName,
        },
        {
            name: "Address",
            // grow: 0,
            center: true,
            width: "200px",
            cell: (row) => row.OrgAddress,
        },
        {
            name: "Contact Person",
            // grow: 0,
            center: true,
            width: "200px",
            cell: (row) => row.OrgContactPerson,
        },
        {
            name: "Client Type",
            // grow: 0,
            center: true,
            width: "200px",
            cell: (row) => row.ClientType,
        },
        {
            name: "Source",
            // grow: 0,
            center: true,
            width: "200px",
            cell: (row) => row.Source,
        },
        {
            name: "Product",
            grow: 4,
            center: true,
            width: "200px",
            cell: (row) => row.Product,
        },
        {
            name: "Lead Status",
            // grow: 0,
            center: true,
            width: "200px",
            cell: (row) => row.LeadStatus,
        },
        {
            name: "Assigned To",
            // grow: 0,
            center: true,
            width: "200px",
            cell: (row) => row.AssignedTo,
        },
        {
            name: "Enquiry Date",
            // grow: 0,
            center: true,
            width: "200px",
            cell: (row) => row.EnquiryDate,
        },
        {
            name: "Enquiry Time",
            grow: 3,
            center: true,
            width: "200px",
            cell: (row) => row.EnquiryTime,
        },
        {
            name: "Remarks",
            // grow: 0,
            center: true,
            width: "400px",
            cell: (row) => row.Remarks,
        },
        {
            name: "Website",
            // grow: 0,
            center: true,
            width: "200px",
            cell: (row) => row.Website
        },
        {
            name: "Software",
            // grow: 0,
            center: true,
            width: "200px",
            cell: (row) => row.Software
        },
        {
            name: "Attendance",
            grow: 4,
            center: true,
            width: "200px",
            cell: (row) => row.AttendanceSystem
        },
        {
            name: "SMS",
            // grow: 0,
            center: true,
            width: "200px",
            cell: (row) => row.SMS
        },
        {
            name: "Cloud Backup",
            grow: 4,
            center: true,
            width: "200px",
            cell: (row) => row.CloudBackup
        },
    ];



    const searchHandler = (e) => {
        e.preventDefault();

        const srchQuery = searchInput.current.value.toLowerCase();

        if (srchQuery) {

            let srchResult = originalList.filter((list) => {
                return list["OrgName"].toLowerCase().includes(srchQuery) || list["OrgAddress"].toLowerCase().includes(srchQuery);
            });

            if (srchResult) {

                setLeadList(srchResult);
            } else {
                setLeadList({});
            }
        } else {
            setLeadList(originalList);
        }
    };

    //Organization type dropdown

    const [organizationList, setOrganizationList] = useState([])

    useEffect(() => {
        const dataForm = {
            FetchURL: `${appURL}api/org-type?ComID=${User.CompanyId}&BranchID=${User.BranchId}`,
            Type: "GET",
        };

        Fetchdata(dataForm).then(function (result) {

            if (result.StatusCode === 200) {

                const postResult = result.OrganizationTypes;
                setOrganizationList(postResult);
            } else {

            }
        });
    }, []);


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
            Status: -1,
            BranchID: User.BranchId,
            FetchURL: `${appURL}api/admin/department`,
        };

        Fetchdata(params).then(function (result) {

            if (result.StatusCode === 200) {
                const postResult = result.list ? result.list : "";
                setLoading(false);
                setDepartmentList(postResult);
                setOriginalList(postResult);
            } else {
                setLoading(false);

            }
        });
    };


    // API to hit Sub-Department list
    const [subdepartmentList, setSubdepartmentList] = useState([]);

    useEffect(() => {
        subdeptList();
    }, [department]);

    const subdeptList = () => {
        const params = {
            ComID: User.CompanyId,
            StaffID: -1,
            DepartID: department,
            Flag: "S",
            Type: "POST",
            Status: -1,
            BranchID: User.BranchId,
            FetchURL: `${appURL}api/admin/sub-department`,
        };

        Fetchdata(params).then(function (result) {

            if (result.StatusCode === 200) {
                const postResult = result.SubDepList ? result.SubDepList : "";
                setLoading(false);
                setSubdepartmentList(postResult);
                setOriginalList(postResult);
            } else {
                setLoading(false);
                setSubdepartmentList([]);

            }
        });
    };

    //API to hit Staff list
    const [staffList, setStaffList] = useState([]);

    useEffect(() => {
        stfList();
    }, [department, subDepartment]);

    const stfList = () => {
        const params = {
            ComID: User.CompanyId,
            StaffID: "-1",
            Flag: "S",
            Department: department,
            SubDepartment: subDepartment,
            Designation: "-1",
            Status: -1,
            BranchID: User.BranchId,
            Type: "POST",
            FetchURL: `${appURL}api/admin/user`,
        };


        Fetchdata(params).then(function (result) {
            if (result.StatusCode === 200) {
                const postResult = result.UserList ? result.UserList : "";
                setStaffList(postResult);
                setOriginalList(postResult);
                setLoading(false);
            } else {
                setLoading(false);
                setStaffList([]);

            }
        });
    };

    //API to hit Product list
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        proList();
    }, []);

    const proList = () => {
        const params = {
            ComID: User.CompanyId,
            StaffID: -1,
            Flag: "s",
            Type: "POST",
            BranchID: User.BranchId,
            FetchURL: `${appURL}api/admin/product`,
        };

        Fetchdata(params).then(function (result) {

            if (result.StatusCode === 200) {
                const postResult = result.ProductList ? result.ProductList : "";
                setProductList(postResult);
                setOriginalList(postResult);
                setLoading(false);
            } else {
                setLoading(false);
                setProductList({});

            }
        });
    };



    // API to hit lead list

    const [leadList, setLeadList] = useState([]);

    useEffect(() => {
        ledList();
    }, [organizationType, clientType, lead, product, reportOption, nepaliDate, month, year]);

    const ledList = () => {
        const params = {
            ComID: User.CompanyId,
            StaffID: "-1",
            Flag: reportOption === "day" ? "D" : reportOption === "month" ? "M" : "Y",
            DFlag: "N",
            Value: reportOption === "day" ? nepaliDate.fromDate : reportOption === "month" ? `${year}/${month}` : reportOption === "year" ? year : "",
            OrgTypeID: organizationType,
            ClientType: clientType,
            ProductID: product,
            LeadStatus: lead,
            BranchID: User.BranchId,
            Type: "POST",
            FetchURL: `${appURL}api/admin/leads-report`,
        };


        Fetchdata(params).then(function (result) {
            if (result.StatusCode === 200) {
                const postResult = result.Leadlst ? result.Leadlst : "";
                setLeadList(postResult);
                setOriginalList(postResult);
                setLoading(false);
            } else {
                setLoading(false);
                setLeadList([]);

            }
        });
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
                        data={leadList}
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
                                {/* <div className="upper-dataTbl me-2">
                                    <select
                                        style={{ fontSize: "11px" }}
                                        name="snotifiaction"
                                        value={department}
                                        onChange={handleDepartment}
                                        className="form-control form-control-sm searchField"
                                    >
                                        <option
                                            value=""
                                            disabled
                                            selected
                                            style={{ fontSize: "11px" }}
                                        >
                                            Select Department
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
                                </div>
                                    <div className="upper-dataTbl me-2">
                                        <select
                                            style={{ fontSize: "11px" }}
                                            name="snotifiaction"
                                            value={subDepartment}
                                            onChange={handleSubDepartment}
                                            className="form-control form-control-sm searchField"
                                        >
                                            <option
                                                value=""
                                                disabled
                                                selected
                                                style={{ fontSize: "11px" }}
                                            >
                                                Select SubDepartment
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
                                    </div>
                                    <div className="upper-dataTbl me-2">
                                        <select
                                            style={{ fontSize: "11px" }}
                                            name="snotifiaction"
                                            value={staff}
                                            onChange={handleStaff}
                                            className="form-control form-control-sm searchField"
                                        >
                                            <option
                                                value=""
                                                disabled
                                                selected
                                                style={{ fontSize: "11px" }}
                                            >
                                                Select Staff
                                            </option>

                                            {cooperativeList.map((item) => (
                                                <option
                                                    key={item.cooperativeCode}
                                                    value={item.cooperativeCode}
                                                >
                                                    {item.cooperativeName}
                                                </option>
                                            ))}
                                        </select>
                                    </div> */}

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


                                <div className="col-md-2 col-sm-2 col-lg-2 me-2">
                                    <label style={{ fontSize: "14px", textAlign: "left", display: "block" }}>Organization Type</label>
                                    <select
                                        style={{ fontSize: "11px" }}
                                        name="status"
                                        className="form-select form-select-sm"
                                        aria-label="Default select example "
                                        value={organizationType}
                                        onChange={handleOrganizationType}
                                    >
                                        <option selected disabled value="" style={{ fontSize: "11px" }}>
                                            Select Organization Type
                                        </option>
                                        <option value="-1">All</option>
                                        {organizationList.map((list) => (
                                            <>
                                                <option key={list.OrgTypeID} value={list.OrgTypeID}>
                                                    {list.OrgTypeName}
                                                </option>
                                            </>
                                        ))}


                                    </select>

                                </div>

                                <div className="col-md-2 col-sm-2 col-lg-2 me-2">
                                    <label style={{ fontSize: "14px", textAlign: "left", display: "block" }}>Client Type</label>
                                    <select
                                        style={{ fontSize: "11px" }}
                                        name="status"
                                        className="form-select form-select-sm"
                                        aria-label="Default select example "
                                        value={clientType}
                                        onChange={handleClientType}
                                    >
                                        <option selected disabled value="" style={{ fontSize: "11px" }}>
                                            Select Client
                                        </option>
                                        <option value="-1">All</option>
                                        <option value="0">Offline</option>
                                        <option value="1">Online</option>
                                        <option value="2">Both</option>
                                    </select>
                                </div>
                                <div className="col-md-2 col-sm-2 col-lg-2 me-2">
                                    <label style={{ fontSize: "14px", textAlign: "left", display: "block" }}>Product</label>
                                    <select
                                        style={{ fontSize: "11px" }}
                                        name="status"
                                        className="form-select form-select-sm"
                                        aria-label="Default select example "
                                        value={product}
                                        onChange={handleProduct}
                                    >
                                        <option selected disabled value="" style={{ fontSize: "11px" }}>
                                            Select Product
                                        </option>
                                        <option value="-1">All</option>
                                        {productList.map((list) => (
                                            <>
                                                <option key={list.ProdID} value={list.ProdID}>
                                                    {list.Product}
                                                </option>
                                            </>
                                        ))}

                                    </select>
                                </div>

                                <div className="col-md-2 col-sm-2 col-lg-2 me-2">
                                    <label style={{ fontSize: "14px", textAlign: "left", display: "block" }}>Leads Status</label>
                                    <select
                                        style={{ fontSize: "11px" }}
                                        name="status"
                                        className="form-select form-select-sm"
                                        aria-label="Default select example "
                                        value={lead}
                                        onChange={handleLead}
                                    >
                                        <option selected disabled value="" style={{ fontSize: "11px" }}>
                                            Select Leads Status
                                        </option>
                                        <option value="-1">All</option>
                                        <option value="1">Pending</option>
                                        <option value="2">Success</option>
                                        <option value="3">Failed</option>

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
                </>
            </div>

        </>
    );
}
