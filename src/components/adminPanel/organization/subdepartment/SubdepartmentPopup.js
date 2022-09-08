import React, { useContext, useEffect, useState } from "react";
import "../../../leaveNotes/leaveNotePopup.css";
import "./SubdepartmentPopup.css";
import CloseIcon from "../../../../images/CloseIcon.svg";
import AuthContext from "../../../context/auth-context";
import { Fetchdata } from "../../../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpperbarContext from "../../../context/upperbar-context";

export default function SubdepartmentPopup({
  setSubdepartmentPopup,
  reload,
  setReload,
  subdepartmentFormValue,
  setSubdepartmentFormValue,
  subdepartmentFormError,
  setSubdepartmentFormError,
  subdeptList,
}) {
  const { User } = useContext(AuthContext);
  const { appURL } = useContext(UpperbarContext);
  const closePopUp = (e) => {
    setSubdepartmentPopup(false);
    setSubdepartmentFormError({});
  };

  const handleChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.type == "checkbox" ? target.checked : target.value;
    setSubdepartmentFormValue({ ...subdepartmentFormValue, [name]: value });
  };

  const [isSubmit, setIsSubmit] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (!values.subdepartment) {
      errors.subdepartment = "Required";
    }
    if (!values.head) {
      errors.head = "Required";
    }
    if (!values.department) {
      errors.department = "Required";
    }

    return errors;
  };

  const formSubmit = (e) => {
    e.preventDefault();
    setSubdepartmentFormError(validate(subdepartmentFormValue));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(subdepartmentFormError).length === 0 && isSubmit) {
      const dataForm = {
        ComID: User.CompanyId,
        StaffID: User.UID,
        DepartID: subdepartmentFormValue.department,
        SubDepartName: subdepartmentFormValue.subdepartment,
        SubDepHeadID: subdepartmentFormValue.head,
        Flag: "i",
        BranchID: User.BranchId,
        FiscalID: User.FiscalId,
        FetchURL: `${appURL}api/admin/sub-department`,
        Type: "POST",
      };
      Fetchdata(dataForm).then(function (result) {
        if (result.StatusCode === 200) {
          setSubdepartmentPopup(false);
          subdeptList();
          toast(result.Message, {
            style: {
              color: "green",
              fontSize: "13px",
            },
          });
        } else {
          setSubdepartmentFormError({
            errorv: "Please enter valid credentials",
          });
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
  }, [subdepartmentFormError]);

  //API to get staff list

  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    const dataForm = {
      FetchURL: `${appURL}api/org-staff?ComID=${User.CompanyId}&BranchID=${User.BranchId}&DepartmentId=-1&SubDepartmentId=-1`,
      Type: "GET",
    };

    Fetchdata(dataForm).then(function (result) {
      if (result.StatusCode === 200) {
        const postResult = result.OrganizationStaffs;
        setStaffList(postResult);
      } else {

      }
    });
  }, []);

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
      Type: "POST",
      Status: 1,
      BranchID: User.BranchId,
      FetchURL: `${appURL}api/admin/department`,
    };

    Fetchdata(params).then(function (result) {
      if (result.StatusCode === 200) {
        const postResult = result.list ? result.list : "";
        setDepartmentList(postResult);
      } else {

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
            <div className="popUpTitle">Sub Department</div>
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
                  <div className="form-group">
                    <label htmlFor="department" style={{ fontSize: "12px" }}>
                      Select Department <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <select
                      class="form-select form-select-sm"
                      aria-label="Default select example"
                      name="department"
                      value={subdepartmentFormValue.department}
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
                    {subdepartmentFormError.department && (
                      <p className="errormsg">
                        {subdepartmentFormError.department}
                      </p>
                    )}
                  </div>
                </div>

                <div className="row text-start ">
                  <div className="form-group">
                    <label htmlFor="subdepartment" style={{ fontSize: "12px" }}>
                      Sub Department<sup style={{ color: "red" }}>*</sup>
                    </label>
                    <input
                      id="subdepartment"
                      style={{ fontSize: "13px" }}
                      type="text"
                      className="form-control form-control-sm "
                      name="subdepartment"
                      value={subdepartmentFormValue.subdepartment}
                      onChange={handleChange}
                    />
                    {subdepartmentFormError.subdepartment && (
                      <p className="errormsg">
                        {subdepartmentFormError.subdepartment}
                      </p>
                    )}
                  </div>
                </div>

                <div className="row text-start ">
                  <div className="form-group">
                    <label htmlFor="head" style={{ fontSize: "12px" }}>
                      Select Head <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <select
                      class="form-select form-select-sm"
                      aria-label="Default select example"
                      name="head"
                      value={subdepartmentFormValue.head}
                      onChange={handleChange}
                    >
                      <option disabled value="" selected>
                        Select Option
                      </option>
                      {staffList.map((item) => (
                        <option key={item.StaffId} value={item.StaffId}>
                          {item.StaffName}
                        </option>
                      ))}
                    </select>
                    {subdepartmentFormError.head && (
                      <p className="errormsg">{subdepartmentFormError.head}</p>
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
