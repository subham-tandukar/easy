import React, { useContext, useEffect, useState } from "react";
import "../../../leaveNotes/leaveNotePopup.css";
import "../subdepartment/SubdepartmentPopup.css";
import CloseIcon from "../../../../images/CloseIcon.svg";
import Plus from "../../../../images/Plus.png";
import "../../../hooks/imagePreview.css";
import "../product/ProductPopup.css";
import AuthContext from "../../../context/auth-context";
import { Fetchdata } from "../../../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpperbarContext from "../../../context/upperbar-context";

export default function LeaveEditPopup({
  setLeaveEditPopup,
  reload,
  setReload,
  leaveFormValue,
  setLeaveFormValue,
  leaveFormError,
  setLeaveFormError,
  isCarry,
  setIsCarry,
  leavList,
  titleId,
}) {
  const { User } = useContext(AuthContext);
  const { appURL } = useContext(UpperbarContext);

  const closePopUp = (e) => {
    setLeaveEditPopup(false);
    setLeaveFormError({});
  };

  const handleChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.type == "checkbox" ? target.checked : target.value;
    setLeaveFormValue({ ...leaveFormValue, [name]: value });
  };

  const [isSubmit, setIsSubmit] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (!values.description) {
      errors.description = "Required";
    }
    if (!values.name) {
      errors.name = "Required";
    }
    if (!values.type) {
      errors.type = "Required";
    }
    if (!values.balance) {
      errors.balance = "Required";
    }
    if (!values.gender) {
      errors.gender = "Required";
    }

    return errors;
  };

  const formSubmit = (e) => {

    e.preventDefault();
    setLeaveFormError(validate(leaveFormValue));
    setIsSubmit(true);

  };

  useEffect(() => {
    if (Object.keys(leaveFormError).length === 0 && isSubmit) {


      const dataForm = {
        ComID: User.CompanyId,
        StaffID: User.UID,
        Flag: "U",
        LeaveID: titleId,
        Name: leaveFormValue.name,
        Balance: leaveFormValue.balance.toString(),
        IsPaid: leaveFormValue.type,
        IsCarryable: isCarry,
        Gender: leaveFormValue.gender,
        Description: leaveFormValue.description,
        BranchID: User.BranchId,
        FiscalID: User.FiscalId,
        FetchURL: `${appURL}api/admin/u-leave-type`,
        Type: "POST",
      };
      Fetchdata(dataForm).then(function (result) {

        if (result.StatusCode === 200) {
          leavList();
          setLeaveEditPopup(false);
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
  }, [leaveFormError]);

  const handleOnChange = (e) => {
    setIsCarry(!isCarry);
    if (e.target.checked === true) {
      setIsCarry(1);
    } else if (e.target.checked === false) {
      setIsCarry(0);
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
      <div className="container leavenotepopup-wrapper">
        <div className="productpopup-inner ">
          <div className="popUpHeader ps-0 pe-0">
            <div className="popUpTitle">Leave Type</div>
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
                    <label htmlFor="name" style={{ fontSize: "12px" }}>
                      Name<sup style={{ color: "red" }}>*</sup>
                    </label>
                    <input
                      id="name"
                      style={{ fontSize: "13px" }}
                      type="text"
                      className="form-control form-control-sm"
                      name="name"
                      value={leaveFormValue.name}
                      onChange={handleChange}
                    />
                    {leaveFormError.name && (
                      <p className="errormsg">{leaveFormError.name}</p>
                    )}
                  </div>
                </div>

                <div className="row text-start ">
                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="balance" style={{ fontSize: "12px" }}>
                        Balance<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        id="balance"
                        style={{ fontSize: "13px" }}
                        type="text"
                        className="form-control form-control-sm "
                        name="balance"
                        value={leaveFormValue.balance}
                        onChange={handleChange}
                      />
                      {leaveFormError.balance && (
                        <p className="errormsg">{leaveFormError.balance}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="type" style={{ fontSize: "12px" }}>
                        Type<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <select
                        class="form-select form-select-sm"
                        aria-label="Default select example"
                        name="type"
                        value={leaveFormValue.type}
                        onChange={handleChange}
                      >
                        <option disabled value="" selected>
                          Select Option
                        </option>
                        <option value="1">Paid</option>
                        <option value="0">Unpaid</option>
                      </select>
                      {leaveFormError.type && (
                        <p className="errormsg">{leaveFormError.type}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="gender" style={{ fontSize: "12px" }}>
                        Gender<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <select
                        class="form-select form-select-sm"
                        aria-label="Default select example"
                        name="gender"
                        value={leaveFormValue.gender}
                        onChange={handleChange}
                      >
                        <option disabled value="" selected>
                          Select Option
                        </option>
                        <option value="1">Male</option>
                        <option value="2">Female</option>
                        <option value="3">Both</option>
                      </select>
                      {leaveFormError.gender && (
                        <p className="errormsg">{leaveFormError.gender}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row text-start ">
                  <div className="form-group">
                    <label htmlFor="description" style={{ fontSize: "12px" }}>
                      Description<sup style={{ color: "red" }}>*</sup>
                    </label>
                    <textarea
                      id="description"
                      style={{ fontSize: "13px" }}
                      rows="2"
                      className="form-control form-control-sm"
                      name="description"
                      value={leaveFormValue.description}
                      onChange={handleChange}
                    />
                    {leaveFormError.description && (
                      <p className="errormsg">{leaveFormError.description}</p>
                    )}
                  </div>
                </div>

                <div className="checkbox-close">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="exampleCheck2"
                    name="closeChecked"
                    onChange={handleOnChange}
                    checked={isCarry}
                    style={{ fontSize: "12px", marginTop: "7px" }}
                  />
                  <label
                    class="form-check-label"
                    for="exampleCheck2"
                    style={{ fontSize: "12px", paddingLeft: "4px" }}
                  >
                    Carryable
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
