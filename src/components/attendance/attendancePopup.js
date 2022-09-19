import React, { useContext, useEffect, useState } from "react";
import "./attendancePopup.css";
import CloseIcon from "../../images/CloseIcon.svg";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import "@sbmdkl/nepali-datepicker-reactjs/dist/index.css";
import { Fetchdata } from "../hooks/getData";
import AuthContext from "../context/auth-context";
import NepaliDate from "nepali-date-converter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  GetEnglishDate,
  GetTwelveHourFormatTime,
} from "../hooks/dateConvertor";
import UpperbarContext from "../context/upperbar-context";

export default function AttendancePopup({
  setAttPopup,
  reload,
  setReload,
  DFlag,
}) {
  const initalvalue = {
    date: "",
    time: "",
    status: "",
  };
  const { appURL, sidePanelBg } = useContext(UpperbarContext);
  const { User } = useContext(AuthContext);
  const [formValues, setFormValues] = useState(initalvalue);
  const [formErrors, setformErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [fieldWork, setFieldWork] = useState(false);

  //

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "time") {
      return setFormValues({
        ...formValues,
        [name]: GetTwelveHourFormatTime(value),
      });
    }
    setFormValues({ ...formValues, [name]: value });
  };

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

  const closePopUp = (e) => {
    setAttPopup(false);
  };

  const handleDateChange = ({ bsDate }) => {
    formValues.date = bsDate;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setformErrors(validate(formValues));
    setIsSubmit(true);
  };

  const validate = (values) => {
    const errors = {};
    const ptn = /^\w+$/;
    const digitPtn = /[0-9]/;
    const alphaptn = /[a-z]/;
    const capalpha = /[A-Z]/;

    if (
      values.date &&
      values.time &&
      values.status &&
      values.LeaveDescription &&
      values.assignedStaff
    ) {
      //code here
    } else {
      if (!values.date) {
        errors.date = "Required";
      }
      if (!values.time) {
        errors.time = "Required";
      }
      if (!values.status) {
        errors.status = "Required";
      }
      return errors;
    }
    return errors;
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      const dataForm = {
        // ComID: User.CompanyId,
        // UserID: User.UID,
        // DepartmentID: User.DepartmentID,
        // SubDepartmentID: User.SubDepartmentID,
        // DesignationID: User.DesignationID,
        // AttenDate:
        //   DFlag === "N" ? getEnglishDate(formValues.date) : formValues.date,
        // AttenTime: formValues.time,
        // AttenStatus: formValues.status,
        // AttenPlace: fieldWork ? 2 : 1,
        // FiscalID: User.FiscalId,
        // BrachID: User.BranchId,

        ComID: User.CompanyId,
        UserID: User.UID,
        DepartmentID: User.DepartmentID,
        SubDepartmentID: User.SubDepartmentID,
        DesignationID: User.DesignationID,
        AttenDate:
          DFlag === "N" ? GetEnglishDate(formValues.date) : formValues.date,
        AttenTime: formValues.time,
        AttenStatus: formValues.status,
        AttenPlace: fieldWork ? 2 : 1,
        AttenVia: 2,
        FiscalID: User.FiscalId,
        BrachID: User.BranchId,

        FetchURL: `${appURL}api/create-attendance`,
        Type: "POST",
      };

      Fetchdata(dataForm).then(function (result) {
        if (result.StatusCode === 200) {
          setReload(!reload);
          toast(result.Message, {
            style: {
              color: "green",
              fontSize: "13px",
            },
          });
          setAttPopup(false);
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
      <div className="container attpopup-wrapper">
        <div className="attpopup-inner ">
          <div className="popUpHeader ps-0 pe-0" style={sidePanelBg}>
            <div className="popUpTitle">Add Attendance</div>
            <div className="popUpClose">
              <img
                className="popUpCloseIcon"
                src={CloseIcon}
                alt="CloseIcon"
                onClick={closePopUp}
              />
            </div>
          </div>
          <div className="attpopupBody ps-3 pe-3">
            <div className="row text-start mt-2 ">
              <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="text-start mb-1" style={{ fontSize: "12px" }}>
                  Date
                </div>
                {DFlag === "N" ? (
                  <Calendar
                    className="form-control form-control-sm pt-0 pb-0 from-date"
                    dateFormat="YYYY/MM/DD"
                    defaultDate="2010/01/01"
                    theme="default"
                    language="en"
                    value={formValues.date}
                    minDate={getNepaliDate()}
                    onChange={handleDateChange}
                    name="date"
                    hideDefaultValue={true}
                    placeholder={"Select From Date"}
                  />
                ) : (
                  <input
                    type="date"
                    value={formValues.date}
                    placeholder="Select a Date"
                    className="form-control form-control-sm "
                    onChange={handleChange}
                  />
                )}
                {formErrors.date && (
                  <p className="errormsg">{formErrors.date}</p>
                )}
              </div>
              <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="text-start mb-1" style={{ fontSize: "12px" }}>
                  Time
                </div>
                <input
                  type="time"
                  name="time"
                  placeholder="Select Time"
                  className="form-control form-control-sm "
                  onChange={handleChange}
                />
                {formErrors.time && (
                  <p className="errormsg">{formErrors.time}</p>
                )}
              </div>
            </div>

            <div className="row text-start ">
              <div className="form-group">
                <label style={{ fontSize: "12px" }}>Status</label>
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example"
                  value={formValues.status}
                  name="status"
                  onChange={handleChange}
                >
                  <option disabled value="" selected>
                    Select Status
                  </option>
                  <option value="1">Check In</option>
                  <option value="2">Check Out</option>
                </select>
                {formErrors.status && (
                  <p className="errormsg">{formErrors.status}</p>
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
                    Work From Home
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="attpopupFooter">
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
