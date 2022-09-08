import React, { useContext, useEffect, useState } from "react";
import "../../../leaveNotes/leaveNotePopup.css";
import "./DepartmentPopup.css";
import CloseIcon from "../../../../images/CloseIcon.svg";
import AuthContext from "../../../context/auth-context";
import { Fetchdata } from "../../../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpperbarContext from "../../../context/upperbar-context";

export default function DepartmentPopupEdit({
  setDepartmentEditPopup,
  reload,
  setReload,
  deptList,
  documentFormValue,
  setDocumentFormValue,
  departmentFormError,
  setDepartmentFormError,
  titleId,
}) {
  const { User } = useContext(AuthContext);
  const { appURL } = useContext(UpperbarContext);
  const closePopUp = (e) => {
    setDepartmentEditPopup(false);
    setDepartmentFormError({});
  };

  const handleChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.type == "checkbox" ? target.checked : target.value;
    setDocumentFormValue({ ...documentFormValue, [name]: value });
  };
  const [editIsSubmit, setEditIsSubmit] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (!values.title) {
      errors.title = "Required";
    }
    if (!values.head) {
      errors.head = "Required";
    }

    return errors;
  };

  const formSubmit = (e) => {
    e.preventDefault();
    setDepartmentFormError(validate(documentFormValue));
    setEditIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(departmentFormError).length === 0 && editIsSubmit) {
      const dataForm = {
        ComID: User.CompanyId,
        StaffID: User.UID,
        Department: documentFormValue.title,
        DepHeadID: documentFormValue.head,
        Flag: "U",
        BranchID: User.BranchId,
        FiscalID: User.FiscalId,
        DepartmentID: titleId,
        FetchURL: `${appURL}api/admin/department`,
        Type: "POST",
      };
      Fetchdata(dataForm).then(function (result) {

        if (result.StatusCode === 200) {
          setDepartmentEditPopup(false);
          deptList();
          toast(result.Message, {
            style: {
              color: "green",
              fontSize: "13px",
            },
          });
        } else {
          setDepartmentFormError({
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

      setEditIsSubmit(false);
    }
  }, [departmentFormError]);

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
            <div className="popUpTitle">Department Edit</div>
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
                    <label htmlFor="title" style={{ fontSize: "12px" }}>
                      Title<sup style={{ color: "red" }}>*</sup>
                    </label>
                    <input
                      id="title"
                      style={{ fontSize: "13px" }}
                      type="text"
                      className="form-control form-control-sm "
                      name="title"
                      value={documentFormValue.title}
                      onChange={handleChange}
                    />
                    {departmentFormError.title && (
                      <p className="errormsg">{departmentFormError.title}</p>
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
                      value={documentFormValue.head}
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
                    {departmentFormError.head && (
                      <p className="errormsg">{departmentFormError.head}</p>
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
