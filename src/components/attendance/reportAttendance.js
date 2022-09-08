import React, { useContext, useState } from "react";
import "./reportAttendance.css";
import MonthlyAttendance from "./monthlyAttendance";
import DailyAttendance from "./dailyAttendance";
import AttendancePopup from "./attendancePopup";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import "@sbmdkl/nepali-datepicker-reactjs/dist/index.css";
import NepaliDate from "nepali-date-converter";
import UpperbarContext from "../context/upperbar-context";
import { GetCurrMonth, GetFromDate, GetToDate } from "../hooks/dateConvertor";

export default function ReportAttendance() {
  const [category, setCategory] = useState("");
  const [month, setMonth] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [attPopup, setAttPopup] = useState(false);
  const [DFlag, setDFlag] = useState("N");
  const { fiscalYear, todayDate, appURL } = useContext(UpperbarContext);
  const [reload, setReload] = useState(false);

  const addAttendance = (e) => {
    setAttPopup(true);
  };

  const handleFromDate = ({ bsDate }) => {
    setFromDate(bsDate);
  };

  const handleToDate = ({ bsDate }) => {
    setToDate(bsDate);
  };

  function getNepaliDate() {
    const nepDate = new NepaliDate().getBS();
    var cm = nepDate.month + 1;
    let zm = cm < 10 ? `0${cm}` : cm;
    // 
    var cd = nepDate.date + 1;
    let zd = cd < 10 ? `0${cd}` : cd;
    let strDate = nepDate.year + "-" + zm + "-" + zd;
    // 
    return strDate;
  }

  return (
    <>
      <div className="container-fluid sumatten-wrapper  mt-3 ps-4 pe-4">
        <div className="row mt-3">
          <div className="page-header">
            <div className="text-start  page-title">Attendance Report</div>
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
          {" "}
          <div className="sec-dataTable">
            <div className="row mb-3 ">
              <div
                className={
                  category === "1"
                    ? "col-md-3 col-sm-3 col-lg-3 select-category"
                    : "col-md-3 col-sm-3 col-lg-3"
                }
              >
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example "
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setToDate(GetToDate());
                    setFromDate(GetFromDate());
                    setMonth(GetCurrMonth());
                  }}
                >
                  <option disabled value="" selected>
                    Select Category
                  </option>
                  <option value="1">Daily</option>
                  <option value="2">Month</option>
                </select>
              </div>
              {category === "2" && (
                <div
                  className={
                    category === "1"
                      ? "col-md-3 col-sm-3 col-lg-3"
                      : "col-md-3 col-sm-3 col-lg-3 sel-month"
                  }
                >
                  <select
                    class="form-select form-select-sm"
                    aria-label="Default select example "
                    onChange={(e) => setMonth(e.target.value)}
                    value={month}
                  >
                    <option disabled value="" selected>
                      Select Month
                    </option>
                    {DFlag === "N" ? (
                      <>
                        <option value="01">Baisakh</option>
                        <option value="02">Jesth</option>
                        <option value="03">Asar</option>
                        <option value="04">Srawan</option>
                        <option value="05">Bhadra</option>
                        <option value="06">Aaswin</option>
                        <option value="07">Kartik</option>
                        <option value="08">Mangsir</option>
                        <option value="09">Paush</option>
                        <option value="10">Magh</option>
                        <option value="11">Falgun</option>
                        <option value="12">Chaitra</option>
                      </>
                    ) : (
                      <>
                        <option value="01">January</option>
                        <option value="02">February</option>
                        <option value="03">March</option>
                        <option value="04">April</option>
                        <option value="05">May</option>
                        <option value="06">June</option>
                        <option value="07">July</option>
                        <option value="08">August</option>
                        <option value="09">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                      </>
                    )}
                  </select>
                </div>
              )}

              {category === "1" && (
                <div className="col-md-3 col-sm-3 col-lg-3 sel-month">
                  <div className="text-start mb-1" style={{ fontSize: "12px" }}>
                    From Date
                  </div>
                  {DFlag === "N" ? (
                    <Calendar
                      className="form-control form-control-sm pt-0 pb-0 "
                      dateFormat="YYYY/MM/DD"
                      // defaultDate="2010/01/01"
                      theme="default"
                      language="en"
                      value={fromDate}
                      maxDate={getNepaliDate()}
                      onChange={handleFromDate}
                      name="date"
                      hideDefaultValue={true}
                      placeholder={fromDate}
                    />
                  ) : (
                    <input
                      type="date"
                      value={fromDate}
                      placeholder="Select a Date"
                      className="form-control form-control-sm "
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  )}
                </div>
              )}

              {category === "1" && (
                <div className="col-md-3 col-sm-3 col-lg-3 sel-month">
                  <div className="text-start mb-1" style={{ fontSize: "12px" }}>
                    To Date
                  </div>
                  {DFlag === "N" ? (
                    <Calendar
                      className="form-control form-control-sm pt-0 pb-0 "
                      dateFormat="YYYY/MM/DD"
                      // defaultDate="2010/01/01"
                      theme="default"
                      language="en"
                      // minDate={getNepaliDate()}
                      maxDate={getNepaliDate()}
                      value={toDate}
                      onChange={handleToDate}
                      name="date"
                      hideDefaultValue={true}
                      placeholder={toDate}
                    />
                  ) : (
                    <input
                      type="date"
                      value={toDate}
                      placeholder="Select a Date"
                      className="form-control form-control-sm "
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  )}
                </div>
              )}

              <div
                className={
                  category === "1"
                    ? "col-md-3 col-sm-3 col-lg-3 addatt-btn d-flex"
                    : "col-md-3 col-sm-3 col-lg-3 sel-month btnatt d-flex"
                }
              >
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
              {!category && (
                <div
                  className=" text-center d-flex flex-column justify-content-center align-items-center"
                  style={{ margin: "10% auto", width: "120px" }}
                >
                  <p className="initial-msg">Please provide input!</p>
                </div>
              )}
              {category === "1" && fromDate && toDate && (
                <DailyAttendance
                  fromDate={fromDate}
                  toDate={toDate}
                  DFlag={DFlag}
                  reload={reload}
                  appURL={appURL}
                />
              )}

              {category === "2" && month && (
                <MonthlyAttendance
                  month={month}
                  DFlag={DFlag}
                  reload={reload}
                  appURL={appURL}
                />
              )}
            </>
          </div>
        </>
      </div>
      {attPopup && (
        <AttendancePopup
          setAttPopup={setAttPopup}
          DFlag={DFlag}
          reload={reload}
          setReload={setReload}
        />
      )}
    </>
  );
}
