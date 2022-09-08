import React, { useContext, useEffect, useState } from "react";
import "../../../leaveNotes/leaveNotePopup.css";
import "../../organization/department/DepartmentPopup.css";
import CloseIcon from "../../../../images/CloseIcon.svg";
import AuthContext from "../../../context/auth-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Fetchdata } from "../../../hooks/getData";
import UpperbarContext from "../../../context/upperbar-context";

export default function BranchPopup({
  setBranchPopup,
  reload,
  setReload,
  branchFormValue,
  setBranchFormValue,
  branchFormError,
  setBranchFormError,
  brnchList,
}) {
  const { User } = useContext(AuthContext);
  const { appURL } = useContext(UpperbarContext);

  const closePopUp = (e) => {
    setBranchPopup(false);
    setBranchFormError({});
  };

  const handleChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.type == "checkbox" ? target.checked : target.value;
    setBranchFormValue({ ...branchFormValue, [name]: value });
  };

  const [isSubmit, setIsSubmit] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = "Required";
    }
    if (!values.address) {
      errors.address = "Required";
    }
    if (!values.district) {
      errors.district = "Required";
    }

    return errors;
  };

  const formSubmit = (e) => {
    e.preventDefault();
    setBranchFormError(validate(branchFormValue));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(branchFormError).length === 0 && isSubmit) {

      const dataForm = {
        ComID: User.CompanyId,
        StaffID: User.UID,
        Flag: "I",
        Name: branchFormValue.name,
        Address: branchFormValue.address,
        District: branchFormValue.district,
        FiscalID: User.FiscalId,
        FetchURL: `${appURL}api/admin/branch`,
        Type: "POST",
      };

      Fetchdata(dataForm).then(function (result) {

        if (result.StatusCode === 200) {
          setBranchPopup(false);
          brnchList();
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
  }, [branchFormError]);

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
            <div className="popUpTitle">Branch</div>
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
                    <label htmlFor="name" style={{ fontSize: "12px" }}>
                      Branch Name<sup style={{ color: "red" }}>*</sup>
                    </label>
                    <input
                      id="name"
                      style={{ fontSize: "13px" }}
                      type="text"
                      className="form-control form-control-sm "
                      name="name"
                      value={branchFormValue.name}
                      onChange={handleChange}
                    />
                    {branchFormError.name && (
                      <p className="errormsg">{branchFormError.name}</p>
                    )}
                  </div>
                </div>

                <div className="row text-start ">
                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="address" style={{ fontSize: "12px" }}>
                        Address <sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        id="address"
                        style={{ fontSize: "13px" }}
                        type="text"
                        className="form-control form-control-sm"
                        name="address"
                        value={branchFormValue.address}
                        onChange={handleChange}
                      />
                      {branchFormError.address && (
                        <p className="errormsg">{branchFormError.address}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="district" style={{ fontSize: "12px" }}>
                        Select District <sup style={{ color: "red" }}>*</sup>
                      </label>
                      <select
                        class="form-select form-select-sm"
                        aria-label="Default select example"
                        name="district"
                        value={branchFormValue.district}
                        onChange={handleChange}
                      >
                        <option disabled value="" selected>
                          Select Option
                        </option>
                        <option value="1">Kathmandu</option>
                        {/* {departmentList.map((item) => (<option key={item.DepartmentID} value={item.DepartmentID}>{item.Department}</option>))} */}
                      </select>
                      {branchFormError.district && (
                        <p className="errormsg">{branchFormError.district}</p>
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
