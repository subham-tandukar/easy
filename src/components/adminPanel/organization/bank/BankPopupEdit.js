import React, { useContext, useEffect, useState } from "react";
import "../../../leaveNotes/leaveNotePopup.css";
import "../../organization/department/DepartmentPopup.css";
import "./Bank.css";
import CloseIcon from "../../../../images/CloseIcon.svg";
import AuthContext from "../../../context/auth-context";
// import { Fetchdata } from "../../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Fetchdata } from "../../../hooks/getData";
import UpperbarContext from "../../../context/upperbar-context";

export default function BankPopupEdit({
  setBankEditPopup,
  reload,
  setReload,
  bankFormValue,
  setBankFormValue,
  bankFormError,
  setBankFormError,
  bnkList,
  titleId,
  chooseStaff,
}) {
  const { User } = useContext(AuthContext);
  const { appURL } = useContext(UpperbarContext);

  const closePopUp = (e) => {
    setBankEditPopup(false);
    setBankFormError({});
  };

  const handleChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.type == "checkbox" ? target.checked : target.value;
    if (name === "department") {
      bankFormValue.subDepartment = "";
      bankFormValue.staff = "";
    }
    if (name === "subDepartment") {
      bankFormValue.staff = "";
    }

    setBankFormValue({ ...bankFormValue, [name]: value });
  };

  const [isSubmit, setIsSubmit] = useState(false);

  const validate = (values) => {
    const errors = {};
    // if (!values.department) {
    //     errors.department = "Required";
    // }
    // if (!values.subDepartment) {
    //     errors.subDepartment = "Required";
    // }
    // if (!values.staff) {
    //     errors.staff = "Required";
    // }
    if (!values.bank) {
      errors.bank = "Required";
    }
    if (!values.accountName) {
      errors.accountName = "Required";
    }
    if (!values.accountNo) {
      errors.accountNo = "Required";
    }
    if (!values.branch) {
      errors.branch = "Required";
    }

    return errors;
  };

  const formSubmit = (e) => {
    e.preventDefault();
    setBankFormError(validate(bankFormValue));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(bankFormError).length === 0 && isSubmit) {

      const dataForm = {
        ComID: User.CompanyId,
        StaffID: User.UID,
        // UserID: bankFormValue.staff,
        UserID: chooseStaff,
        BankID: titleId,
        Flag: "U",
        BankName: bankFormValue.bank,
        AcName: bankFormValue.accountName,
        AcNo: bankFormValue.accountNo,
        Branch: bankFormValue.branch,
        BranchID: User.BranchId,
        FiscalID: User.FiscalId,
        Type: "POST",
        FetchURL: `${appURL}api/admin/u-bank`,
      };


      Fetchdata(dataForm).then(function (result) {

        if (result.StatusCode === 200) {
          setBankEditPopup(false);
          bnkList();
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
  }, [bankFormError]);

  //API to hit Department list
  // const [departmentList, setDepartmentList] = useState([])

  // useEffect(() => {
  //     deptList();
  // }, []);

  // const deptList = () => {
  //     const params = {
  //         ComID: User.CompanyId,
  //         StaffID: -1,
  //         Flag: "S",
  //         Status: 1,
  //         Type: "POST",
  //         BranchID: User.BranchId,
  //         FetchURL: "https://esnep.com/easyoffice/api/admin/department",
  //     };

  //     Fetchdata(params).then(function (result) {
  //         if (result.StatusCode === 200) {
  //             const postResult = result.list ? result.list : "";
  //             setDepartmentList(postResult);
  //         } else {
  //             setDepartmentList([]);
  //             
  //         }
  //     });
  // }

  // // API to hit Sub-Department list
  // const [subdepartmentList, setSubdepartmentList] = useState([])

  // useEffect(() => {
  //     subdeptList();
  // }, [bankFormValue.department]);

  // const subdeptList = () => {
  //     const params = {
  //         ComID: User.CompanyId,
  //         StaffID: -1,
  //         DepartID: bankFormValue.department,
  //         Flag: "S",
  //         Status: 1,
  //         Type: "POST",
  //         BranchID: User.BranchId,
  //         FetchURL: "https://esnep.com/easyoffice/api/admin/sub-department",
  //     };

  //     Fetchdata(params).then(function (result) {
  //         if (result.StatusCode === 200) {
  //             const postResult = result.SubDepList ? result.SubDepList : "";
  //             setSubdepartmentList(postResult);
  //         } else {
  //             setSubdepartmentList([]);
  //             
  //         }
  //     });
  // }
  // //API to get staff list

  // const [staffList, setStaffList] = useState([])

  // useEffect(() => {
  //     const dataForm = {
  //         FetchURL: `https://esnep.com/easyoffice/api/org-staff?ComID=${User.CompanyId}&BranchID=${User.BranchId}&DepartmentId=${bankFormValue.department}&SubDepartmentId=${bankFormValue.subDepartment}`,
  //         Type: "GET",
  //     };

  //     Fetchdata(dataForm).then(function (result) {
  //         
  //         if (result.StatusCode === 200) {
  //             
  //             const postResult = result.OrganizationStaffs;
  //             setStaffList(postResult);
  //         } else {
  //             
  //         }
  //     });
  // }, [bankFormValue.department, bankFormValue.subDepartment]);

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
            <div className="popUpTitle">Bank Edit</div>
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
                {/* <div className="row text-start ">
                                    <div className="col-md-6 col-sm-6 col-lg-6">
                                        <div className="form-group">
                                            <label htmlFor="department" style={{ fontSize: "12px" }}>
                                                Select Department <sup style={{ color: "red" }}>*</sup>
                                            </label>
                                            <select
                                                class="form-select form-select-sm"
                                                aria-label="Default select example"
                                                name="department"
                                                value={bankFormValue.department}
                                                onChange={handleChange}
                                            >
                                                <option disabled value="" selected>
                                                    Select Option
                                                </option>
                                                {departmentList.map((item) => (<option key={item.DepartmentID} value={item.DepartmentID}>{item.Department}</option>))}
                                            </select>
                                            {bankFormError.department && (
                                                <p className="errormsg">{bankFormError.department}</p>
                                            )}
                                        </div>
                                    </div>


                                    <div className="col-md-6 col-sm-6 col-lg-6">
                                        <div className="form-group">
                                            <label htmlFor="subDepartment" style={{ fontSize: "12px" }}>
                                                Select Sub Department <sup style={{ color: "red" }}>*</sup>
                                            </label>
                                            <select
                                                class="form-select form-select-sm"
                                                aria-label="Default select example"
                                                name="subDepartment"
                                                value={bankFormValue.subDepartment}
                                                onChange={handleChange}
                                            >
                                                <option disabled value="" selected>
                                                    Select Option
                                                </option>

                                                {subdepartmentList.map((item) => (<option key={item.SubDepartID} value={item.SubDepartID}>{item.SubDepartName}</option>))}
                                            </select>
                                            {bankFormError.subDepartment && (
                                                <p className="errormsg">{bankFormError.subDepartment}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>


                                <div className="row text-start ">
                                    <div className="form-group">
                                        <label htmlFor="staff" style={{ fontSize: "12px" }}>
                                            Select Staff <sup style={{ color: "red" }}>*</sup>
                                        </label>
                                        <select
                                            class="form-select form-select-sm"
                                            aria-label="Default select example"
                                            name="staff"
                                            value={bankFormValue.staff}
                                            onChange={handleChange}
                                        >
                                            <option disabled value="" selected>
                                                Select Option
                                            </option>
                                            {staffList.map((item) => (<option key={item.StaffId} value={item.StaffId}>{item.StaffName}</option>))}
                                        </select>
                                        {bankFormError.staff && (
                                            <p className="errormsg">{bankFormError.staff}</p>
                                        )}
                                    </div>
                                </div> */}

                <div className="row text-start ">
                  <div className="form-group">
                    <label htmlFor="bank" style={{ fontSize: "12px" }}>
                      Bank<sup style={{ color: "red" }}>*</sup>
                    </label>
                    <input
                      id="bank"
                      style={{ fontSize: "13px" }}
                      type="text"
                      className="form-control form-control-sm "
                      name="bank"
                      value={bankFormValue.bank}
                      onChange={handleChange}
                    />
                    {bankFormError.bank && (
                      <p className="errormsg">{bankFormError.bank}</p>
                    )}
                  </div>
                </div>

                <div className="row text-start ">
                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="accountName" style={{ fontSize: "12px" }}>
                        Account Name<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        id="accountName"
                        style={{ fontSize: "13px" }}
                        type="text"
                        className="form-control form-control-sm "
                        name="accountName"
                        value={bankFormValue.accountName}
                        onChange={handleChange}
                      />
                      {bankFormError.accountName && (
                        <p className="errormsg">{bankFormError.accountName}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="accountNo" style={{ fontSize: "12px" }}>
                        Account No.<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        id="accountNo"
                        style={{ fontSize: "13px" }}
                        type="text"
                        className="form-control form-control-sm "
                        name="accountNo"
                        value={bankFormValue.accountNo}
                        onChange={handleChange}
                      />
                      {bankFormError.accountNo && (
                        <p className="errormsg">{bankFormError.accountNo}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row text-start ">
                  <div className="form-group">
                    <label htmlFor="branch" style={{ fontSize: "12px" }}>
                      Branch<sup style={{ color: "red" }}>*</sup>
                    </label>
                    <input
                      id="branch"
                      style={{ fontSize: "13px" }}
                      type="text"
                      className="form-control form-control-sm "
                      name="branch"
                      value={bankFormValue.branch}
                      onChange={handleChange}
                    />
                    {bankFormError.branch && (
                      <p className="errormsg">{bankFormError.branch}</p>
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
