import React, { useContext, useEffect, useState } from "react";
import "../../../leaveNotes/leaveNotePopup.css";
import "../../organization/department/DepartmentPopup.css";
import CloseIcon from "../../../../images/CloseIcon.svg";
import AuthContext from "../../../context/auth-context";
// import { Fetchdata } from "../../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Fetchdata } from "../../../hooks/getData";
import UpperbarContext from "../../../context/upperbar-context";

export default function HolidayPopupEdit({
  setHolidayEditPopup,
  reload,
  setReload,
  holidayFormValue,
  setHolidayFormValue,
  holidayFormError,
  setHolidayFormError,
  holiList,
  titleId,
}) {
  const { User } = useContext(AuthContext);
  const { appURL } = useContext(UpperbarContext);

  const closePopUp = (e) => {
    setHolidayEditPopup(false);
    setHolidayFormError({});
  };

  const handleChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.type == "checkbox" ? target.checked : target.value;
    setHolidayFormValue({ ...holidayFormValue, [name]: value });
  };

  const [isEditSubmit, setIsEditSubmit] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (!values.event) {
      errors.event = "Required";
    }
    if (!values.eventDate) {
      errors.eventDate = "Required";
    }

    return errors;
  };

  const formSubmit = (e) => {
    e.preventDefault();
    setHolidayFormError(validate(holidayFormValue));
    setIsEditSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(holidayFormError).length === 0 && isEditSubmit) {

      const dataForm = {
        ComID: User.CompanyId,
        StaffID: User.UID,
        Flag: "U",
        HolidayID: titleId,
        Name: holidayFormValue.event,
        EnglishDate: holidayFormValue.eventDate,
        BranchID: User.BranchId,
        FiscalID: User.FiscalId,
        FetchURL: `${appURL}api/admin/holiday`,
        Type: "POST",
      };

      Fetchdata(dataForm).then(function (result) {

        if (result.StatusCode === 200) {
          setHolidayEditPopup(false);
          holiList();
          toast(result.Message, {
            style: {
              color: "green",
              fontSize: "13px",
            },
          });
        } else {
          toast("Error: " + result.Message, {
            style: {
              color: "red",
              fontSize: "13px",
            },
          });
        }
      });

      setIsEditSubmit(false);
    }
  }, [holidayFormError]);

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
        <div className="departmentpopup-inner ">
          <div className="popUpHeader ps-0 pe-0">
            <div className="popUpTitle">Holiday Edit</div>
            <div className="popUpClose">
              <img
                className="popUpCloseIcon"
                src={CloseIcon}
                alt="CloseIcon"
                onClick={closePopUp}
              />
            </div>
          </div>
          <div className="departmentpopUpBody ps-3 pe-3">
            <div className="row text-start mt-2 ">
              <div className="col-md-12 col-sm-12 col-lg-12">
                <div className="row text-start ">
                  <div className="form-group">
                    <label htmlFor="event" style={{ fontSize: "12px" }}>
                      Title<sup style={{ color: "red" }}>*</sup>
                    </label>
                    <input
                      id="event"
                      style={{ fontSize: "13px" }}
                      type="text"
                      className="form-control form-control-sm "
                      name="event"
                      value={holidayFormValue.event}
                      onChange={handleChange}
                    />
                    {holidayFormError.event && (
                      <p className="errormsg">{holidayFormError.event}</p>
                    )}
                  </div>
                </div>

                <div className="row text-start ">
                  <div className="form-group">
                    <label htmlFor="eventDate" style={{ fontSize: "12px" }}>
                      Event Date <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <input
                      id="eventDate"
                      style={{ fontSize: "13px" }}
                      type="date"
                      className="form-control form-control-sm "
                      name="eventDate"
                      value={holidayFormValue.eventDate}
                      onChange={handleChange}
                    />
                    {holidayFormError.eventDate && (
                      <p className="errormsg">{holidayFormError.eventDate}</p>
                    )}
                  </div>
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
                  onClick={formSubmit}
                >
                  Update
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
