import React, { useContext, useEffect, useState } from "react";
import "./leaveNotePopup.css";
import CloseIcon from "../../images/CloseIcon.svg";
import { Fetchdata } from "../hooks/getData";
import AuthContext from "../context/auth-context";
import NepaliDate from "nepali-date-converter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import "@sbmdkl/nepali-datepicker-reactjs/dist/index.css";
import UpperbarContext from "../context/upperbar-context";

export default function LeaveNotePopup({
  setLeaveNotePopup,
  reload,
  setReload,
  DFlag,
}) {
  const initalvalue = {
    leaveType: "",
    dayType: "",
    LeaveTitle: "",
    LeaveDescription: "",
    assignedStaff: "",
  };

  const { appURL, sidePanelBg } = useContext(UpperbarContext);
  const { User } = useContext(AuthContext);
  const [formValues, setFormValues] = useState(initalvalue);
  const [formErrors, setformErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fieldWork, setFieldWork] = useState(false);
  const [leaveTList, setLeaveTList] = useState([]);
  const [orgStaffList, setOrgStaffList] = useState([]);
  const [minDate, setMinDate] = useState(null);

  useEffect(() => {
    const cur_date = new Date();
    const min_date = `${cur_date.getFullYear()}/${cur_date.getMonth()}/${cur_date.getDate()}`;
    setMinDate(min_date.toString());
  }, []);

  const getNepaliDate = () => {
    var news = new Date();
    var newss = news.toLocaleDateString();
    const nepDate = new NepaliDate(new Date(newss));
    var cm = nepDate.getMonth() + 1;

    var cd = nepDate.getDate() - 1;
    //
    let strDate = nepDate.getYear() + "-" + cm + "-" + cd;
    //
    return strDate;
  };

  const getEnglishDate = (date) => {
    let nDate = new NepaliDate(date);

    let eDate = nDate.getAD();

    let enMonth = eDate.month + 1;
    let enM = enMonth < 10 ? `0${enMonth}` : enMonth;

    let enDat = eDate.date < 10 ? `0${eDate.date}` : eDate.date;
    return `${eDate.year}-${enM}-${enDat}`;
  };

  const handleFromDate = ({ bsDate }) => {
    setFromDate(bsDate);
  };

  const handleToDate = ({ bsDate }) => {
    setToDate(bsDate);
  };

  //

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const closePopUp = (e) => {
    setLeaveNotePopup(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setformErrors(validate(formValues));
    setIsSubmit(true);
  };

  useEffect(() => {
    let cur_date = new Date();
    let en_date = `${cur_date.getMonth()}/${cur_date.getDate()}/${cur_date.getFullYear()}`;
    setMinDate(en_date);
  }, []);

  useEffect(() => {
    const dataForm = {
      FetchURL: `${appURL}api/leave-type?ComID=${User.CompanyId}&BranchID=${User.BranchId}`,
      Type: "GET",
    };

    Fetchdata(dataForm).then(function (result) {
      if (result.StatusCode === 200) {
        const postResult = result.LeaveList;
        setLeaveTList(postResult);
      } else {
      }
    });
  }, []);

  useEffect(() => {
    const dataForm = {
      FetchURL: `${appURL}api/org-staff?ComID=${User.CompanyId}&BranchID=${User.BranchId}&DepartmentId=${User.DepartmentID}&SubDepartmentId=${User.SubDepartmentID}`,
      Type: "GET",
    };

    Fetchdata(dataForm).then(function (result) {
      if (result.StatusCode === 200) {
        const postResult = result.OrganizationStaffs;
        setOrgStaffList(postResult);
      } else {
      }
    });
  }, []);

  const validate = (values) => {
    const errors = {};
    const ptn = /^\w+$/;
    const digitPtn = /[0-9]/;
    const alphaptn = /[a-z]/;
    const capalpha = /[A-Z]/;

    if (
      values.leaveType &&
      values.dayType &&
      values.LeaveTitle &&
      values.LeaveDescription &&
      values.assignedStaff
    ) {
      //code here
    } else {
      if (!values.leaveType) {
        errors.leaveType = "Required";
      }
      if (!values.dayType) {
        errors.dayType = "Required";
      }
      if (!values.assignedStaff) {
        errors.assignedStaff = "Required";
      }
      if (!values.LeaveTitle) {
        errors.LeaveTitle = "Required";
      }
      if (!values.LeaveDescription) {
        errors.LeaveDescription = "Required";
      }
      return errors;
    }
    return errors;
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      const dataForm = {
        ComID: User.CompanyId,
        UserID: User.UID,
        LeaveTypeID: formValues.leaveType,
        DayTypeID: formValues.dayType,
        Title: formValues.LeaveTitle,
        Cause: formValues.LeaveDescription,
        FromDate: DFlag === "N" ? getEnglishDate(fromDate) : fromDate,
        ToDate: DFlag === "N" ? getEnglishDate(toDate) : toDate,
        IsFieldWork: fieldWork ? 1 : 0,
        LeaveAssignedTo: formValues.assignedStaff,
        Notify: 0,
        FiscalID: User.FiscalId,
        BranchID: User.BranchId,
        FetchURL: `${appURL}api/create-leave`,
        Type: "POST",
      };

      Fetchdata(dataForm).then(function (result) {
        if (result.StatusCode === 200) {
          setReload(!reload);
          setLeaveNotePopup(false);
        } else {
          toast("Error: " + result.Message, {
            style: {
              color: "red",
              fontSize: "13px",
            },
          });
          setformErrors({
            errorv: "Please enter valid credentials",
          });
        }
      });

      setIsSubmit(false);
    }
  }, [formErrors]);

  //
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
        <div className="leavenotepopup-inner">
          <div className="popUpHeader ps-0 pe-0" style={sidePanelBg}>
            <div className="popUpTitle">Leave Note</div>
            <div className="popUpClose">
              <img
                className="popUpCloseIcon"
                src={CloseIcon}
                alt="CloseIcon"
                onClick={closePopUp}
              />
            </div>
          </div>
          <div className="lnotepopUpBody ps-3 pe-3">
            <div className="row text-start mt-2 ">
              <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="text-start mb-1" style={{ fontSize: "12px" }}>
                  Leave Type
                </div>
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example"
                  name="leaveType"
                  value={formValues.leaveType}
                  onChange={handleChange}
                >
                  <option value="" selected disabled>
                    Select Leave Type
                  </option>
                  {leaveTList.map((list) => (
                    <>
                      <option key={list.LeaveTypeID} value={list.LeaveTypeID}>
                        {list.Type}
                      </option>
                    </>
                  ))}
                </select>
                {formErrors.leaveType && (
                  <p className="errormsg">{formErrors.leaveType}</p>
                )}
              </div>
              <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="text-start mb-1" style={{ fontSize: "12px" }}>
                  Day Type
                </div>
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example"
                  name="dayType"
                  value={formValues.dayType}
                  onChange={handleChange}
                >
                  <option disabled value="" selected>
                    Select Day Type
                  </option>
                  <option value="1">Half Day</option>
                  <option value="2">Full Day</option>
                </select>
                {formErrors.dayType && (
                  <p className="errormsg">{formErrors.dayType}</p>
                )}
              </div>
            </div>

            <div className="row text-start ">
              <div className="form-group">
                <label htmlFor="cause" style={{ fontSize: "12px" }}>
                  Title
                </label>
                <input
                  id="cause"
                  style={{ fontSize: "13px" }}
                  type="text"
                  className="form-control form-control-sm "
                  name="LeaveTitle"
                  value={formValues.LeaveTitle}
                  onChange={handleChange}
                />
                {formErrors.LeaveTitle && (
                  <p className="errormsg">{formErrors.LeaveTitle}</p>
                )}
              </div>
            </div>

            <div className="row text-start ">
              <div className="form-group">
                <label htmlFor="desc" style={{ fontSize: "12px" }}>
                  Cause
                </label>
                <textarea
                  id="desc"
                  value={formValues.LeaveDescription}
                  onChange={handleChange}
                  style={{ fontSize: "13px" }}
                  class="form-control ps-2"
                  name="LeaveDescription"
                  rows="3"
                  cols="12"
                ></textarea>
                {formErrors.LeaveDescription && (
                  <p className="errormsg">{formErrors.LeaveDescription}</p>
                )}
              </div>
            </div>

            <div className="row text-start mt-1 ">
              <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="text-start mb-1" style={{ fontSize: "12px" }}>
                  From Date
                </div>
                {DFlag === "N" ? (
                  <Calendar
                    className="form-control form-control-sm pt-0 pb-0 from-date"
                    dateFormat="YYYY/MM/DD"
                    defaultDate="2010/01/01"
                    theme="default"
                    language="en"
                    value={fromDate}
                    minDate={getNepaliDate()}
                    onChange={handleFromDate}
                    name="date"
                    hideDefaultValue={true}
                    placeholder={"Select From Date"}
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
              <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="text-start mb-1" style={{ fontSize: "12px" }}>
                  To Date
                </div>
                {DFlag === "N" ? (
                  <Calendar
                    className="form-control form-control-sm pt-0 pb-0 "
                    dateFormat="YYYY/MM/DD"
                    defaultDate="2010/01/01"
                    theme="default"
                    language="en"
                    minDate={getNepaliDate()}
                    value={toDate}
                    onChange={handleToDate}
                    name="date"
                    hideDefaultValue={true}
                    placeholder={"Select To Date"}
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
            </div>

            <div className="row text-start ">
              <div className="form-group">
                <label style={{ fontSize: "12px" }}>Assigned To</label>
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example"
                  value={formValues.assignedStaff}
                  name="assignedStaff"
                  onChange={handleChange}
                >
                  <option disabled value="" selected>
                    Select Staff
                  </option>
                  {orgStaffList.map((list) => (
                    <>
                      <option key={list.StaffId} value={list.StaffId}>
                        {list.StaffName}
                      </option>
                    </>
                  ))}
                </select>
                {formErrors.assignedStaff && (
                  <p className="errormsg">{formErrors.assignedStaff}</p>
                )}
              </div>
            </div>

            <div className="row text-start mt-1">
              <div className="form-group">
                <div class="form-check" style={{ fontSize: "12px" }}>
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="fieldWork"
                    name="fieldWork"
                    checked={formValues.fieldWork}
                    onChange={() => setFieldWork(!fieldWork)}
                  />
                  <label
                    style={{ fontSize: "12px", cursor: "pointer" }}
                    class="form-check-label"
                    htmlFor="fieldWork"
                  >
                    Field Work
                  </label>
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
                  onClick={handleSubmit}
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
        </div>
      </div>
    </>
  );
}
