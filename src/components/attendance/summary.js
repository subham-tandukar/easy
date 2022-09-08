import React, { useContext, useEffect, useRef, useState } from "react";
import "./summary.css";
import Spinner from "../loading/spinner";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Fetchdata } from "../hooks/getData";
import AuthContext from "../context/auth-context";
import MonthlySummary from "./monthSummary";
import YearlySummary from "./yearlySummary";
import NepaliDate from "nepali-date-converter";
import UpperbarContext from "../context/upperbar-context";
import { GetCurrYear } from "../hooks/dateConvertor";

export default function Summary() {
  const [category, setCategory] = useState("");
  const { fiscalYear, todayDate, appURL } = useContext(UpperbarContext);
  const [loading, setLoading] = useState(true);
  const [sYear, setSYear] = useState(GetCurrYear());
  const [DFlag, setDFlag] = useState("N");

  const cur_year = new Date().getFullYear();
  const eYears = generateArrayOfYears(cur_year);

  const nYears = generateArrayOfNepYears(cur_year);

  function generateArrayOfYears(cur_year) {
    var max = cur_year;
    var min = 2021;
    var years = [];

    for (var i = max; i >= min; i--) {
      years.push(i);
    }
    return years;
  }

  function getNepaliDate(date) {
    const nepDate = new NepaliDate().getBS();

    return nepDate;
  }

  function generateArrayOfNepYears(cur_year) {
    let nCur_date = getNepaliDate(cur_year);
    var max = nCur_date.year;
    var min = 2078;
    var years = [];

    for (var i = max; i >= min; i--) {
      years.push(i);
    }
    return years;
  }

  return (
    <>
      <div className="container-fluid classatten-wrapper  mt-3 ps-4 pe-4">
        <div className="row mt-3">
          <div className="page-header">
            <div className="text-start  page-title">Attendance Summary </div>
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
              <div className="col-md-4 col-sm-4 col-lg-3">
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example "
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option disabled value="" selected>
                    Select Category
                  </option>
                  <option value="1">Yearly</option>
                  <option value="2">Month</option>
                </select>
              </div>
              {category === "2" && (
                <div className="col-md-4 col-sm-4 col-lg-3 sel-month">
                  <select
                    class="form-select form-select-sm"
                    aria-label="Default select example "
                    onChange={(e) => {
                      setSYear(e.target.value);
                      setLoading(true);
                    }}
                    value={sYear}
                  >
                    <option disabled value="" selected>
                      Select Year
                    </option>
                    {DFlag === "N"
                      ? nYears.map((list) => (
                        <>
                          <option key={list} value={list}>
                            {list}
                          </option>
                        </>
                      ))
                      : eYears.map((list) => (
                        <>
                          <option key={list} value={list}>
                            {list}
                          </option>
                        </>
                      ))}
                  </select>
                </div>
              )}
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
              {category === "1" && (
                <YearlySummary DFlag={DFlag} appURL={appURL} />
              )}

              {category === "2" && sYear && (
                <MonthlySummary
                  year={sYear}
                  DFlag={DFlag}
                  loading={loading}
                  setLoading={setLoading}
                  appURL={appURL}
                />
              )}
            </>
          </div>
        </>
      </div>
    </>
  );
}
