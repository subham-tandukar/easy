import React, { useContext, useEffect, useState } from "react";
import "../../../leaveNotes/leaveNotePopup.css";
import "../../organization/department/DepartmentPopup.css";
import CloseIcon from "../../../../images/CloseIcon.svg";
import AuthContext from "../../../context/auth-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Fetchdata } from "../../../hooks/getData";
import UpperbarContext from "../../../context/upperbar-context";

export default function FiscalPopupEdit({
  setFiscalEditPopup,
  reload,
  setReload,
  fiscalFormValue,
  setFiscalFormValue,
  fiscalFormError,
  setFiscalFormError,
  fscList,
  isCurrent,
  setIsCurrent,
  titleId,
}) {
  const { User } = useContext(AuthContext);
  const { appURL } = useContext(UpperbarContext);
  const closePopUp = (e) => {
    setFiscalEditPopup(false);
    setFiscalFormError({});
  };

  const handleChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.type == "checkbox" ? target.checked : target.value;
    setFiscalFormValue({ ...fiscalFormValue, [name]: value });
  };

  const [isSubmit, setIsSubmit] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (!values.fiscal) {
      errors.fiscal = "Required";
    }
    if (!values.start) {
      errors.start = "Required";
    }
    if (!values.end) {
      errors.end = "Required";
    }

    return errors;
  };

  const formSubmit = (e) => {
    e.preventDefault();
    setFiscalFormError(validate(fiscalFormValue));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(fiscalFormError).length === 0 && isSubmit) {

      const dataForm = {
        ComID: User.CompanyId,
        StaffID: User.UID,
        FID: titleId,
        Flag: "U",
        FiscalYear: fiscalFormValue.fiscal,
        IsCurrent: isCurrent,
        StartDate: fiscalFormValue.start,
        EndDate: fiscalFormValue.end,
        BranchID: User.BranchId,
        FiscalID: User.FiscalId,
        FetchURL: `${appURL}api/admin/fiscal`,
        Type: "POST",
      };

      Fetchdata(dataForm).then(function (result) {

        if (result.StatusCode === 200) {
          setFiscalEditPopup(false);
          fscList();
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
  }, [fiscalFormError]);

  const handleOnChange = (e) => {
    setIsCurrent(!isCurrent);
    if (e.target.checked === true) {
      setIsCurrent(1);
    } else if (e.target.checked === false) {
      setIsCurrent(0);
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
        <div className="departmentpopup-inner ">
          <div className="popUpHeader ps-0 pe-0">
            <div className="popUpTitle">Fiscal Edit</div>
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
                    <label htmlFor="fiscal" style={{ fontSize: "12px" }}>
                      Fiscal Year<sup style={{ color: "red" }}>*</sup>
                    </label>
                    <input
                      id="fiscal"
                      style={{ fontSize: "13px" }}
                      type="text"
                      className="form-control form-control-sm "
                      name="fiscal"
                      value={fiscalFormValue.fiscal}
                      onChange={handleChange}
                    />
                    {fiscalFormError.fiscal && (
                      <p className="errormsg">{fiscalFormError.fiscal}</p>
                    )}
                  </div>
                </div>

                <div className="row text-start ">
                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="start" style={{ fontSize: "12px" }}>
                        Start Date <sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        id="start"
                        style={{ fontSize: "13px" }}
                        type="text"
                        className="form-control form-control-sm"
                        name="start"
                        value={fiscalFormValue.start}
                        onChange={handleChange}
                      />
                      {fiscalFormError.start && (
                        <p className="errormsg">{fiscalFormError.start}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="end" style={{ fontSize: "12px" }}>
                        End Date <sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        id="end"
                        style={{ fontSize: "13px" }}
                        type="text"
                        className="form-control form-control-sm"
                        name="end"
                        value={fiscalFormValue.end}
                        onChange={handleChange}
                      />
                      {fiscalFormError.end && (
                        <p className="errormsg">{fiscalFormError.end}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="checkbox-close">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="exampleCheck2"
                    name="closeChecked"
                    onChange={handleOnChange}
                    checked={isCurrent}
                    style={{ fontSize: "12px", marginTop: "7px" }}
                  />
                  <label
                    class="form-check-label"
                    for="exampleCheck2"
                    style={{ fontSize: "12px", paddingLeft: "4px" }}
                  >
                    Current
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
