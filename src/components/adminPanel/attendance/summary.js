import React, { useContext, useEffect, useRef, useState } from "react";
import "./summary.css";
import Spinner from "../../loading/spinner";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Fetchdata } from "../../hooks/getData";
import AuthContext from "../../context/auth-context";
import NepaliDate from "nepali-date-converter";
import UpperbarContext from "../../context/upperbar-context";
import AYearlySummary from "./yearlySummary";
import AMonthlySummary from "./monthSummary";
import { GetCurrMonth, GetCurrYear } from "../../hooks/dateConvertor";

export default function AdminSummary() {
  const { User } = useContext(AuthContext);
  const [category, setCategory] = useState("");
  const { fiscalYear, todayDate, appURL } = useContext(UpperbarContext);
  const [depList, setDepList] = useState([]);
  const [subDepList, setSubDepList] = useState([]);

  const [department, setDepartment] = useState("");
  const [subDepartment, setSubDepartment] = useState("");
  const [sYear, setSYear] = useState("");
  const [sMonth, setSMonth] = useState("");

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
    if (department && department !== "-1") {
      const dataForm = {
        ComID: User.CompanyId,
        StaffID: -1,
        DepartID: department,
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
  }, [department]);

  useEffect(() => {
    if (category) {
      if (category === "1") {
        setSYear(GetCurrYear());
      } else if (category === "2") {
        setSMonth(GetCurrMonth());
      }
    }
  }, [category]);

  function getNepaliDate(date) {
    const nepDate = new NepaliDate().getBS();
    // 
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
                <div className="text-start mb-1" style={{ fontSize: "12px" }}>
                  Category
                </div>
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example "
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setDepartment("-1");
                    setSubDepartment("-1");
                  }}
                >
                  <option disabled value="" selected>
                    Select Category
                  </option>
                  <option value="1">Yearly</option>
                  <option value="2">Month</option>
                </select>
              </div>

              <div className="col-md-4 col-sm-4 col-lg-3 sel-month">
                <div className="text-start mb-1" style={{ fontSize: "12px" }}>
                  Department
                </div>
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example "
                  name="deparment"
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    setSubDepartment("-1");
                  }}
                  value={department}
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

              {department !== "-1" && (
                <div className="col-md-3 col-sm-3 col-lg-3 sel-month">
                  <div className="text-start mb-1" style={{ fontSize: "12px" }}>
                    Sub-Department
                  </div>
                  <select
                    class="form-select form-select-sm"
                    aria-label="Default select example "
                    name="subDepartment"
                    onChange={(e) => {
                      setSubDepartment(e.target.value);
                    }}
                    value={subDepartment}
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

              {category === "2" && (
                <div className="col-md-3 col-sm-3 col-lg-3 sel-month">
                  <div className="text-start mb-1" style={{ fontSize: "12px" }}>
                    Month
                  </div>
                  <select
                    class="form-select form-select-sm"
                    aria-label="Default select example "
                    onChange={(e) => setSMonth(e.target.value)}
                    value={sMonth}
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
                <div className="col-md-4 col-sm-4 col-lg-3 sel-month">
                  <div className="text-start mb-1" style={{ fontSize: "12px" }}>
                    Year
                  </div>
                  <select
                    class="form-select form-select-sm"
                    aria-label="Default select example "
                    onChange={(e) => setSYear(e.target.value)}
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
              {category === "1" && sYear && department && subDepartment && (
                <AYearlySummary
                  year={sYear}
                  DFlag={DFlag}
                  department={department}
                  subDepartment={subDepartment}
                  appURL={appURL}
                />
              )}

              {category === "2" && sMonth && department && subDepartment && (
                <AMonthlySummary
                  month={sMonth}
                  DFlag={DFlag}
                  department={department}
                  subDepartment={subDepartment}
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
