import React, { useContext, useEffect, useState } from "react";
import "./attendanceReport.css";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import "@sbmdkl/nepali-datepicker-reactjs/dist/index.css";
import NepaliDate from "nepali-date-converter";
import UpperbarContext from "../../context/upperbar-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../loading/spinner";
import DataTable from "react-data-table-component";
import AuthContext from "../../context/auth-context";
import AAddAttendance from "./addAttendance";
import { Fetchdata } from "../../hooks/getData";
import { GetToDate } from "../../hooks/dateConvertor";
import StaffContext from "../organization/staffState/StaffContext";

export default function AAttendanceReport() {
  const { User } = useContext(AuthContext);

  const { customStyles } = useContext(StaffContext);

  const initialValue = {
    deparment: "-1",
    subDepartment: "-1",
    date: GetToDate(),
  };
  const [formValues, setFormValues] = useState(initialValue);
  const [attPopup, setAttPopup] = useState(false);
  const [DFlag, setDFlag] = useState("N");
  const { fiscalYear, todayDate, appURL, darkText } =
    useContext(UpperbarContext);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [depList, setDepList] = useState([]);
  const [subDepList, setSubDepList] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);

  const weekDay = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const columns = [
    {
      name: "S.N.",
      // grow: 0,
      width: "55px",
      center: true,
      cell: (row, index) => index + 1,
    },
    // {
    //   name: "Date",
    //   // grow: 0,
    //   // width: "150px",
    //   center: true,
    //   selector: (row) => row.AttenDate,
    // },
    // {
    //   name: "Day",
    //   center: true,
    //   grow: 0,
    //   selector: (row) => {
    //     if (DFlag === "N") {
    //       const nDate = new NepaliDate(row.AttenDate).getBS();
    //       //
    //       const day = nDate.day;
    //       return weekDay[day];
    //     } else {
    //       const day = new Date(row.AttenDate).getDay();
    //
    //       return weekDay[day];
    //     }
    //   },
    // },
    {
      name: "Name",
      // grow: 2,
      width: "150px",
      selector: (row) => row.StaffName,
    },
    {
      name: "Check In",
      // grow: 0,
      center: true,
      selector: (row) => row.CheckIn,
    },
    {
      name: "Check Out",
      // grow: 0,
      center: true,
      selector: (row) => row.CheckOut,
    },
    {
      name: "Day Type",
      // grow: 0,
      center: true,
      selector: (row) => row.DayType,
    },
    {
      name: "Verified By",
      // grow: 0,
      center: true,
      selector: (row) => {
        if (row.DayType === "Absent") {
          return "Absent";
        } else {
          return row.VerifiedBy === null ? "Not Verified" : row.VerifiedBy;
        }
      },
    },
    {
      name: "Remark",
      center: true,
      width: "250px",
      selector: (row) => {
        if (row.CheckIn === "No Check In" && row.CheckOut === "No Check Out") {
          if (row.LeaveID != "0") {
            return "On Leave";
          } else {
            return "Absent";
          }
        } else if (
          row.CheckIn !== "No Check In" &&
          row.CheckOut === "No Check Out"
        ) {
          const remark = row.InRemarks + " | " + "No Check out";
          return remark;
        } else if (
          row.CheckIn === "No Check In" &&
          row.CheckOut !== "No Check Out"
        ) {
          const remark = row.InRemarks + " | " + "No Check out";
          return remark;
        } else {
          if (row.IsVerified === 1) {
            const remark = row.InRemarks + " | " + row.OutRemarks;
            return remark;
          } else if (row.IsVerified === 0) {
            return (
              <>
                <button
                  type="button"
                  class="btn btn-sm "
                  style={{
                    background: "var(--button-color)",
                    color: "white",
                  }}
                  onClick={() => handleAttendance({ row, sFlag: "A" })}
                >
                  Approve Atten.
                </button>

                <span className="pt-1">|</span>

                <button
                  type="button"
                  class="btn btn-sm "
                  style={{
                    background: "red",
                    color: "white",
                  }}
                  onClick={() => handleAttendance({ row, sFlag: "R" })}
                >
                  Reject
                </button>
              </>
            );
          } else {
            return "Rejected";
          }
        }
      },
    },
    // {
    //   name: "Action",
    //   center: true,
    //   width: "200px",
    //   selector: (row) => {
    //     const apiDate = row.AttenDate;
    //     let clipADate = apiDate.slice(8, 10);

    //     let clipTDate = todayDate.slice(8, 10);

    //     let showAction = false;
    //     if (clipADate === clipTDate) {
    //       showAction = true;
    //     }
    //     return (
    //       <>
    //         <div className="ln-verition d-flex">
    //           <button
    //             type="button"
    //             class="btn btn-sm "
    //             style={{
    //               background: "var(--button-color)",
    //               color: "white",
    //             }}
    //             // onClick={() => updateRequest(row)}
    //           >
    //             View
    //           </button>
    //           <span className="pt-1">|</span>

    //           {!showAction && (
    //             <button
    //               type="button"
    //               class="btn btn-sm "
    //               style={{
    //                 background: "var(--button-color)",
    //                 color: "white",
    //               }}
    //               onClick={() => ApproveAttendance(row)}
    //             >
    //               Approve
    //             </button>
    //           )}
    //         </div>
    //       </>
    //     );
    //   },
    // },
  ];

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "deparment") {
      formValues.subDepartment = "-1";
    }
    setFormValues({ ...formValues, [name]: value });
  };

  const addAttendance = (e) => {
    setAttPopup(true);
  };

  const handleDate = ({ bsDate }) => {
    let name = "date";
    setFormValues({ ...formValues, [name]: bsDate });
  };

  useEffect(() => {
    const dataForm = {
      ComID: User.CompanyId,
      StaffID: -1,
      Flag: "S",
      Status: "1",
      BranchID: User.BranchId,
      FetchURL: `${appURL}api/admin/department`,
      Type: "POST",
    };

    Fetchdata(dataForm).then(function (result) {
      if (result.StatusCode === 200) {
        const postResult = result.list;
        setDepList(postResult);
      } else {
        setDepList([]);
      }
    });
  }, []);

  useEffect(() => {
    if (formValues.deparment) {
      const dataForm = {
        ComID: User.CompanyId,
        StaffID: -1,
        DepartID: formValues.deparment,
        Flag: "S",
        Status: "1",
        BranchID: User.BranchId,
        FetchURL: `${appURL}api/admin/sub-department`,
        Type: "POST",
      };

      Fetchdata(dataForm).then(function (result) {
        if (result.StatusCode === 200) {
          const postResult = result.SubDepList;
          setSubDepList(postResult);
        } else {
          setSubDepList([]);
        }
      });
    }
  }, [formValues.deparment]);

  useEffect(() => {
    if (formValues.deparment && formValues.subDepartment && formValues.date) {
      const dataForm = {
        ComID: User.CompanyId,
        DepartmentID: formValues.deparment,
        SubDepartmentID: formValues.subDepartment,
        Flag: "D",
        Value: formValues.date,
        DFlag: "N",
        FetchURL: `${appURL}api/admin/atten-report`,
        Type: "POST",
      };

      Fetchdata(dataForm)
        .then(function (result) {
          if (result.StatusCode === 200) {
            const postResult = result.AttenRes;
            setAttendanceList(postResult);
            setInitialLoad(false);
            setLoading(false);
          } else {
            setAttendanceList([]);
            setInitialLoad(false);
            setLoading(false);
          }
        })
        .catch((err) => {
          setAttendanceList([]);
          setInitialLoad(false);
          setLoading(false);
        });
    }
  }, [reload, formValues.deparment, formValues.subDepartment, formValues.date]);

  const handleAttendance = (data) => {
    const dataForm = {
      ComID: User.CompanyId,
      StaffID: data.row.StaffID,
      UserID: User.UID,
      Flag: "ULS",
      AttenDate: data.row.AttenDate,
      DFlag: "N",
      AttenStatus: data.sFlag === "A" ? "1" : "2",
      BranchID: User.BranchId,
      FiscalID: User.FiscalId,
      FetchURL: `${appURL}api/admin/atten`,
      Type: "POST",
    };

    // Fetchdata(dataForm)
    //   .then(function (result) {
    //
    //     if (result.StatusCode === 200) {
    //
    //       toast(result.Message, {
    //         style: {
    //           color: "green",
    //           fontSize: "13px",
    //         },
    //       });
    //       setReload(!reload);
    //     } else {
    //       toast("Error: " + result.Message, {
    //         style: {
    //           color: "red",
    //           fontSize: "13px",
    //         },
    //       });
    //     }
    //   })
    //   .catch((err) => {
    //     toast("Error: " + err, {
    //       style: {
    //         color: "red",
    //         fontSize: "13px",
    //       },
    //     });
    //   });
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
      <div className="container-fluid sumatten-wrapper  mt-3 ps-4 pe-4">
        <div className="row mt-3">
          <div className="page-header">
            <div className="text-start  page-title" style={darkText}>
              Attendance Report
            </div>
            <div className="page-date">
              <div className="sec-content" style={darkText}>
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
          {" "}
          <div className="sec-dataTable">
            <div className="row mb-1 ">
              <div className="col-md-3 col-sm-3 col-lg-3 sel-month">
                <div className="text-start mb-1" style={darkText}>
                  Department
                </div>
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example "
                  name="deparment"
                  onChange={handleChange}
                  value={formValues.deparment}
                >
                  <option disabled value="" selected>
                    Select Department
                  </option>
                  <option value="-1">All</option>
                  {depList.map((list) => (
                    <>
                      <option key={list.DepartmentID} value={list.DepartmentID}>
                        {list.Department}
                      </option>
                    </>
                  ))}
                </select>
              </div>
              {formValues.deparment !== "-1" && (
                <div className="col-md-3 col-sm-3 col-lg-3 sel-month">
                  <div className="text-start mb-1" style={darkText}>
                    Sub-Department
                  </div>
                  <select
                    class="form-select form-select-sm"
                    aria-label="Default select example "
                    name="subDepartment"
                    onChange={handleChange}
                    value={formValues.subDepartment}
                  >
                    <option disabled value="" selected>
                      Select Sub-Department
                    </option>
                    <option value="-1">All</option>
                    {subDepList.map((list) => (
                      <>
                        <option key={list.SubDepartID} value={list.SubDepartID}>
                          {list.SubDepartName}
                        </option>
                      </>
                    ))}
                  </select>
                </div>
              )}

              <div className="col-md-3 col-sm-3 col-lg-3 sel-month">
                <div className="text-start mb-1" style={darkText}>
                  Select Date
                </div>
                {DFlag === "N" ? (
                  <Calendar
                    className="form-control form-control-sm pt-0 pb-0 "
                    dateFormat="YYYY/MM/DD"
                    // defaultDate="2010/01/01"
                    theme="default"
                    language="en"
                    value={formValues.date}
                    onChange={handleDate}
                    name="date"
                    hideDefaultValue={true}
                    placeholder={formValues.date}
                  />
                ) : (
                  <input
                    type="date"
                    // value={followFormValues.from}
                    placeholder="Select a Date"
                    className="form-control form-control-sm "
                    name="date"
                    onChange={handleChange}
                  />
                )}
              </div>
              <div className="col-md-3 col-sm-3 col-lg-3 addatt-btn d-flex">
                <button
                  type="button"
                  class="btn btn-sm"
                  style={{
                    background: "var(--button-color)",
                    color: "white",
                  }}
                  onClick={addAttendance}
                >
                  Add Attendance
                </button>
              </div>
            </div>

            <>
              {initialLoad ? (
                <div
                  className=" text-center d-flex flex-column justify-content-center align-items-center"
                  style={{ margin: "10% auto", width: "120px" }}
                >
                  <p className="initial-msg">Please provide input!</p>
                </div>
              ) : (
                <>
                  {loading ? (
                    <Spinner />
                  ) : (
                    <>
                      {" "}
                      <DataTable
                        columns={columns}
                        data={attendanceList}
                        customStyles={customStyles}
                        pagination
                        fixedHeader
                        fixedHeaderScrollHeight="335px"
                        highlightOnHover
                        pointerOnHover
                        progressPending={loading}
                        responsive
                        subHeader
                        dense
                        striped
                        subHeaderComponent={
                          <>
                            <div className="upper-dataTbl">
                              {/* <div className="d-flex">
                        <p className="pe-2">Search</p>
                        <input
                          ref={searchInput}
                          type="text"
                          class="form-control form-control-sm searchField"
                          placeholder=""
                          onChange={searchHandler}
                        />
                      </div> */}
                            </div>
                          </>
                        }
                      />
                    </>
                  )}
                </>
              )}
            </>
          </div>
        </>
      </div>
      {attPopup && (
        <AAddAttendance
          setAttPopup={setAttPopup}
          DFlag={DFlag}
          reload={reload}
          setReload={setReload}
        />
      )}
    </>
  );
}
