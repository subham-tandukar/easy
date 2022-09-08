import React, { useContext, useEffect, useState } from "react";
import "../../../leaveNotes/leaveNotePopup.css";
import "../subdepartment/SubdepartmentPopup.css";
import CloseIcon from "../../../../images/CloseIcon.svg";
import AuthContext from "../../../context/auth-context";
import { Fetchdata } from "../../../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpperbarContext from "../../../context/upperbar-context";

export default function DesignationPopup({
  setDesignationPopup,
  reload,
  setReload,
  designationFormValue,
  setDesignationFormValue,
  designationFormError,
  setDesignationFormError,
  desgList,
}) {
  const { User } = useContext(AuthContext);
  const { appURL } = useContext(UpperbarContext);
  const closePopUp = (e) => {
    setDesignationPopup(false);
    setDesignationFormError({});
  };

  const handleChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.type == "checkbox" ? target.checked : target.value;
    setDesignationFormValue({ ...designationFormValue, [name]: value });
  };

  const [isSubmit, setIsSubmit] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (!values.subdepartment) {
      errors.subdepartment = "Required";
    }
    if (!values.maxSalary) {
      errors.maxSalary = "Required";
    }
    if (!values.minSalary) {
      errors.minSalary = "Required";
    }
    if (!values.department) {
      errors.department = "Required";
    }
    if (!values.designation) {
      errors.designation = "Required";
    }

    return errors;
  };

  const formSubmit = (e) => {

    e.preventDefault();
    setDesignationFormError(validate(designationFormValue));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(designationFormError).length === 0 && isSubmit) {
      const dataForm = {
        ComID: User.CompanyId,
        StaffID: User.UID,
        DepartID: designationFormValue.department,
        SubDepartID: designationFormValue.subdepartment,
        Designation: designationFormValue.designation,
        MaxSal: designationFormValue.maxSalary,
        MinSal: designationFormValue.minSalary,
        Flag: "i",
        BranchID: User.BranchId,
        FiscalID: User.FiscalId,
        FetchURL: `${appURL}api/admin/designation`,
        Type: "POST",
      };
      Fetchdata(dataForm).then(function (result) {
        if (result.StatusCode === 200) {
          desgList();
          setDesignationPopup(false);
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
  }, [designationFormError]);

  //API to hit Department list
  const [departmentList, setDepartmentList] = useState([]);

  useEffect(() => {
    deptList();
  }, []);

  const deptList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: -1,
      Flag: "S",
      Status: 1,
      Type: "POST",
      BranchID: User.BranchId,
      FetchURL: `${appURL}api/admin/department`,
    };

    Fetchdata(params).then(function (result) {
      if (result.StatusCode === 200) {
        const postResult = result.list ? result.list : "";
        setDepartmentList(postResult);
      } else {
        setDepartmentList([]);

      }
    });
  };

  // API to hit Sub-Department list
  const [subdepartmentList, setSubdepartmentList] = useState([]);

  useEffect(() => {
    subdeptList();
  }, [designationFormValue.department]);


  const subdeptList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: -1,
      DepartID: designationFormValue.department,
      Flag: "S",
      Status: 1,
      Type: "POST",
      BranchID: User.BranchId,
      FetchURL: `${appURL}api/admin/sub-department`,
    };

    Fetchdata(params).then(function (result) {
      if (result.StatusCode === 200) {
        const postResult = result.SubDepList ? result.SubDepList : "";
        setSubdepartmentList(postResult);
      } else {
        setSubdepartmentList([]);

      }
    });
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
        <div className="subdepartmentpopup-inner ">
          <div className="popUpHeader ps-0 pe-0">
            <div className="popUpTitle">Designation</div>
            <div className="popUpClose">
              <img
                className="popUpCloseIcon"
                src={CloseIcon}
                alt="CloseIcon"
                onClick={closePopUp}
              />
            </div>
          </div>
          <div className="subdepartmentpopUpBody ps-3 pe-3">
            <div className="row text-start mt-2 ">
              <div className="col-md-12 col-sm-12 col-lg-12">
                <div className="row text-start ">
                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="department" style={{ fontSize: "12px" }}>
                        Select Department <sup style={{ color: "red" }}>*</sup>
                      </label>
                      <select
                        class="form-select form-select-sm"
                        aria-label="Default select example"
                        name="department"
                        value={designationFormValue.department}
                        onChange={handleChange}
                      >
                        <option disabled value="" selected>
                          Select Option
                        </option>

                        {departmentList.map((item) => (
                          <option
                            key={item.DepartmentID}
                            value={item.DepartmentID}
                          >
                            {item.Department}
                          </option>
                        ))}
                      </select>
                      {designationFormError.department && (
                        <p className="errormsg">
                          {designationFormError.department}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="form-group">
                      <label
                        htmlFor="subdepartment"
                        style={{ fontSize: "12px" }}
                      >
                        Select Sub Department{" "}
                        <sup style={{ color: "red" }}>*</sup>
                      </label>
                      <select
                        class="form-select form-select-sm"
                        aria-label="Default select example"
                        name="subdepartment"
                        value={designationFormValue.subdepartment}
                        onChange={handleChange}
                      >
                        <option disabled value="" selected>
                          Select Option
                        </option>

                        {subdepartmentList.map((item) => (
                          <option
                            key={item.SubDepartID}
                            value={item.SubDepartID}
                          >
                            {item.SubDepartName}
                          </option>
                        ))}
                      </select>
                      {designationFormError.subdepartment && (
                        <p className="errormsg">
                          {designationFormError.subdepartment}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row text-start ">
                  <div className="form-group">
                    <label htmlFor="designation" style={{ fontSize: "12px" }}>
                      Designation<sup style={{ color: "red" }}>*</sup>
                    </label>
                    <input
                      id="designation"
                      style={{ fontSize: "13px" }}
                      type="text"
                      className="form-control form-control-sm "
                      name="designation"
                      value={designationFormValue.designation}
                      onChange={handleChange}
                    />
                    {designationFormError.designation && (
                      <p className="errormsg">
                        {designationFormError.designation}
                      </p>
                    )}
                  </div>
                </div>

                <div className="row text-start ">
                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="maxSalary" style={{ fontSize: "12px" }}>
                        Max Salary<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        id="maxSalary"
                        style={{ fontSize: "13px" }}
                        type="text"
                        className="form-control form-control-sm "
                        name="maxSalary"
                        value={designationFormValue.maxSalary}
                        onChange={handleChange}
                      />
                      {designationFormError.maxSalary && (
                        <p className="errormsg">
                          {designationFormError.maxSalary}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="minSalary" style={{ fontSize: "12px" }}>
                        Min Salary<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        id="minSalary"
                        style={{ fontSize: "13px" }}
                        type="text"
                        className="form-control form-control-sm "
                        name="minSalary"
                        value={designationFormValue.minSalary}
                        onChange={handleChange}
                      />
                      {designationFormError.minSalary && (
                        <p className="errormsg">
                          {designationFormError.minSalary}
                        </p>
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
