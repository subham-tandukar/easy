import React, { useContext, useEffect, useState } from "react";
import "../../../leaveNotes/leaveNotePopup.css";
import "../subdepartment/SubdepartmentPopup.css";
import CloseIcon from "../../../../images/CloseIcon.svg";
import "../../../hooks/imagePreview.css";
import "../product/ProductPopup.css";
import AuthContext from "../../../context/auth-context";
import { Fetchdata } from "../../../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpperbarContext from "../../../context/upperbar-context";

export default function ShiftPopup({
  setShiftPopup,
  reload,
  setReload,
  shiftFormValue,
  setShiftFormValue,
  shiftFormError,
  setShiftFormError,
  shftList,
}) {
  const { User } = useContext(AuthContext);
  const { appURL } = useContext(UpperbarContext);
  const closePopUp = (e) => {
    setShiftPopup(false);
    setShiftFormError({});
  };

  const handleChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.type == "checkbox" ? target.checked : target.value;
    setShiftFormValue({ ...shiftFormValue, [name]: value });
  };

  const [isSubmit, setIsSubmit] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (!values.lunchStart) {
      errors.lunchStart = "Required";
    }
    if (!values.lunchEnd) {
      errors.lunchEnd = "Required";
    }
    if (!values.shifts) {
      errors.shifts = "Required";
    }
    if (!values.shiftEnd) {
      errors.shiftEnd = "Required";
    }
    if (!values.shiftStart) {
      errors.shiftStart = "Required";
    }
    if (!values.allowLateIn) {
      errors.allowLateIn = "Required";
    }
    if (!values.allowEarlyOut) {
      errors.allowEarlyOut = "Required";
    }
    if (!values.hdHour) {
      errors.hdHour = "Required";
    }

    return errors;
  };

  const formSubmit = (e) => {

    e.preventDefault();
    setShiftFormError(validate(shiftFormValue));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(shiftFormError).length === 0 && isSubmit) {
      const dataForm = {
        ComID: User.CompanyId,
        StaffID: User.UID.toString(),
        Flag: "I",
        Shift: shiftFormValue.shifts,
        Start: shiftFormValue.shiftStart,
        End: shiftFormValue.shiftEnd,
        HDHour: shiftFormValue.hdHour,
        AllowLateIn: shiftFormValue.allowLateIn,
        AllowEarlyOut: shiftFormValue.allowEarlyOut,
        LaunchStart: shiftFormValue.lunchStart,
        LaunchEnd: shiftFormValue.lunchEnd,
        FiscalID: User.FiscalId.toString(),
        BranchID: User.BranchId.toString(),
        // ComID: "ES25",
        // StaffID: "1",
        // Flag: "I",
        // Shift: "Day Shift9",
        // Start: "01:00 ",
        // End: "01:00 ",
        // HDHour: "5",
        // AllowLateIn: "01:10 ",
        // AllowEarlyOut: "02:00 ",
        // LaunchStart: "01:00",
        // LaunchEnd: "01:00 ",
        // FiscalID: "1",
        // BranchID: "1",
        FetchURL: `${appURL}api/admin/shift`,
        Type: "POST",
      };

      Fetchdata(dataForm).then(function (result) {
        if (result.StatusCode === 200) {
          shftList();
          setShiftPopup(false);
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

      setIsSubmit(false);
    }
  }, [shiftFormError]);

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
        <div className="shiftpopup-inner ">
          <div className="popUpHeader ps-0 pe-0">
            <div className="popUpTitle">Shift</div>
            <div className="popUpClose">
              <img
                className="popUpCloseIcon"
                src={CloseIcon}
                alt="CloseIcon"
                onClick={closePopUp}
              />
            </div>
          </div>
          <div className="productpopUpBody ps-3 pe-3">
            <div className="row text-start mt-2 ">
              <div className="col-md-12 col-sm-12 col-lg-12">
                <div className="row text-start ">
                  <div className="form-group">
                    <label htmlFor="shifts" style={{ fontSize: "12px" }}>
                      Shift<sup style={{ color: "red" }}>*</sup>
                    </label>
                    <input
                      id="shifts"
                      style={{ fontSize: "13px" }}
                      type="text"
                      className="form-control form-control-sm "
                      name="shifts"
                      value={shiftFormValue.shifts}
                      onChange={handleChange}
                    />
                    {shiftFormError.shifts && (
                      <p className="errormsg">{shiftFormError.shifts}</p>
                    )}
                  </div>
                </div>

                <div className="row text-start ">
                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="shiftStart" style={{ fontSize: "12px" }}>
                        Shift Start<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        id="shiftStart"
                        style={{ fontSize: "13px" }}
                        type="time"
                        className="form-control form-control-sm "
                        name="shiftStart"
                        value={shiftFormValue.shiftStart}
                        onChange={handleChange}
                      />
                      {shiftFormError.shiftStart && (
                        <p className="errormsg">{shiftFormError.shiftStart}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="shiftEnd" style={{ fontSize: "12px" }}>
                        Shift End<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        id="shiftEnd"
                        style={{ fontSize: "13px" }}
                        type="time"
                        className="form-control form-control-sm "
                        name="shiftEnd"
                        value={shiftFormValue.shiftEnd}
                        onChange={handleChange}
                      />
                      {shiftFormError.shiftEnd && (
                        <p className="errormsg">{shiftFormError.shiftEnd}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row text-start ">
                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="allowLateIn" style={{ fontSize: "12px" }}>
                        Allow Late In<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        id="allowLateIn"
                        style={{ fontSize: "13px" }}
                        type="time"
                        className="form-control form-control-sm "
                        name="allowLateIn"
                        value={shiftFormValue.allowLateIn}
                        onChange={handleChange}
                      />
                      {shiftFormError.allowLateIn && (
                        <p className="errormsg">{shiftFormError.allowLateIn}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="form-group">
                      <label
                        htmlFor="allowEarlyOut"
                        style={{ fontSize: "12px" }}
                      >
                        Allow Early Out<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        id="allowEarlyOut"
                        style={{ fontSize: "13px" }}
                        type="time"
                        className="form-control form-control-sm "
                        name="allowEarlyOut"
                        value={shiftFormValue.allowEarlyOut}
                        onChange={handleChange}
                      />
                      {shiftFormError.allowEarlyOut && (
                        <p className="errormsg">
                          {shiftFormError.allowEarlyOut}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row text-start ">
                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="lunchStart" style={{ fontSize: "12px" }}>
                        Lunch Start<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        id="lunchStart"
                        style={{ fontSize: "13px" }}
                        type="time"
                        className="form-control form-control-sm "
                        name="lunchStart"
                        value={shiftFormValue.lunchStart}
                        onChange={handleChange}
                      />
                      {shiftFormError.lunchStart && (
                        <p className="errormsg">{shiftFormError.lunchStart}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="lunchEnd" style={{ fontSize: "12px" }}>
                        Lunch End<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        id="lunchEnd"
                        style={{ fontSize: "13px" }}
                        type="time"
                        className="form-control form-control-sm "
                        name="lunchEnd"
                        value={shiftFormValue.lunchEnd}
                        onChange={handleChange}
                      />
                      {shiftFormError.lunchEnd && (
                        <p className="errormsg">{shiftFormError.lunchEnd}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row text-start ">
                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="hdHour" style={{ fontSize: "12px" }}>
                        HD Hour <sup style={{ color: "red" }}>*</sup>
                      </label>
                      <select
                        class="form-select form-select-sm"
                        aria-label="Default select example"
                        name="hdHour"
                        value={shiftFormValue.hdHour}
                        onChange={handleChange}
                      >
                        <option disabled value="" selected>
                          Select Option
                        </option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                      {shiftFormError.hdHour && (
                        <p className="errormsg">{shiftFormError.hdHour}</p>
                      )}
                    </div>
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
