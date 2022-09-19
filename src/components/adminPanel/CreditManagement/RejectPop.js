import React, { useContext, useEffect } from "react";
import CloseIcon from "../../../images/CloseIcon.svg";
import UpperbarContext from "../../context/upperbar-context";
import CreditManagementContext from "../CreditManagementState/CreditManagementContext";
import "./ApprovePop.css";

export default function RejectPop({ handleRejectTrue, handleRejectFalse }) {
  const { sidePanelBg } = useContext(UpperbarContext);
  const {
    rejectStatusFormError,
    setRejectStatusFormError,
    rejectIsSubmit,
    setRejectIsSubmit,
    rejectStatusFormValue,
    setRejectStatusFormValue,
    rejectstatusvalue,
  } = useContext(CreditManagementContext);

  const handleChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setRejectStatusFormValue({ ...rejectStatusFormValue, [name]: value });
  };
  const validate = (values) => {
    const errors = {};
    if (!values.remarks) {
      errors.remarks = "Required";
    }
    return errors;
  };

  const formNext = (e) => {
    e.preventDefault();
    setRejectStatusFormError(validate(rejectStatusFormValue));
    setRejectIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(rejectStatusFormError).length === 0 && rejectIsSubmit) {
      handleRejectTrue(rejectStatusFormValue);
    }
    setRejectIsSubmit(false);
  }, [rejectStatusFormError]);

  return (
    <>
      <div className="container confirm-popup">
        <div className="confirms-popup-inner ">
          <div className="popUpHeader ps-0 pe-0" style={sidePanelBg}>
            <div className="popUpDelTitle">Easy Office</div>
            <div className="popUpClose">
              <img
                style={{ paddingRight: "10px", cursor: "pointer" }}
                className="popUpCloseIcon"
                src={CloseIcon}
                alt="CloseIcon"
                onClick={handleRejectFalse}
              />
            </div>
          </div>

          <div className="confirms-body ps-3 pe-3">
            <div className="row text-start ">
              <div className="delText">Are you sure want to Reject this?</div>
            </div>
            <div className="col-md-12 col-sm-12 col-lg-12">
              <div className="form-group">
                <p
                  style={{
                    textAlign: "left",
                    fontSize: "12px",
                    marginTop: "9px",
                  }}
                >
                  Remarks<sup className="sup-col">*</sup>
                </p>

                <input
                  type="text"
                  value={rejectStatusFormValue.remarks}
                  onChange={handleChange}
                  name="remarks"
                  className="form-control form-control-sm mb-1"
                  id="remarks"
                />
                <p className="errormsg " style={{ textAlign: "left" }}>
                  {rejectStatusFormError.remarks}
                </p>
              </div>
            </div>
          </div>

          <div className="confirm-footer">
            <div className="row  mt-2 mb-2">
              <div>
                <button
                  type="button"
                  class="btn btn-sm me-2"
                  style={{ background: "#0079bf", color: "white" }}
                  onClick={formNext}
                >
                  Okay
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-danger me-3"
                  style={{ color: "white" }}
                  onClick={handleRejectFalse}
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
