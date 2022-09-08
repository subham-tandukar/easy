import React, { useContext, useEffect, useState } from "react";
import "../../../leaveNotes/leaveNotePopup.css";
import "../../organization/department/DepartmentPopup.css";
import "../bank/Bank.css";
import CloseIcon from "../../../../images/CloseIcon.svg";
import AuthContext from "../../../context/auth-context";
// import { Fetchdata } from "../../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Fetchdata } from "../../../hooks/getData";
import UpperbarContext from "../../../context/upperbar-context";

export default function JobPopup({
  setJobPopup,
  reload,
  setReload,
  jobFormValue,
  setJobFormValue,
  jobFormError,
  setJobFormError,
  setNotWorking,
  notWorking,
  jobInfoList,
}) {
  const { User } = useContext(AuthContext);
  const { appURL } = useContext(UpperbarContext);
  const closePopUp = (e) => {
    setJobPopup(false);
    setJobFormError({});
  };

  const handleChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.type == "checkbox" ? target.checked : target.value;
    if (name === "department") {
      jobFormValue.subDepartment = "";
      jobFormValue.staff = "";
      jobFormValue.designation = "";
    }
    if (name === "subDepartment") {
      jobFormValue.staff = "";
      jobFormValue.designation = "";
    }

    setJobFormValue({ ...jobFormValue, [name]: value });
  };
  const handleWorkingChange = (e) => {
    setNotWorking(!notWorking);
  };

  const [isSubmit, setIsSubmit] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (!values.department) {
      errors.department = "Required";
    }
    if (!values.subDepartment) {
      errors.subDepartment = "Required";
    }
    if (!values.staff) {
      errors.staff = "Required";
    }
    if (!values.grade) {
      errors.grade = "Required";
    }
    if (!values.designation) {
      errors.designation = "Required";
    }
    if (!values.job) {
      errors.job = "Required";
    }

    return errors;
  };

  const formSubmit = (e) => {
    e.preventDefault();
    setJobFormError(validate(jobFormValue));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(jobFormError).length === 0 && isSubmit) {

      const dataForm = {
        //     ComID: User.CompanyId,
        //     StaffID: User.UID,
        //     UserID: bankFormValue.staff,
        //     Flag: "I",
        //     BankName: bankFormValue.bank,
        //     AcName: bankFormValue.accountName,
        //     AcNo: bankFormValue.accountNo,
        //     Branch: bankFormValue.branch,
        //     BranchID: User.BranchId,
        //     FiscalID: User.FiscalId,

        ComID: User.CompanyId,
        StaffID: User.UID,
        Flag: "I",
        UserID: jobFormValue.staff,
        DesignationID: jobFormValue.designation,
        DepartmentID: jobFormValue.department,
        SubDepartmentID: jobFormValue.subDepartment,
        GradeID: jobFormValue.grade,
        JobType: jobFormValue.job,
        WorkingStatus: notWorking ? 2 : 1,
        StartDate: jobFormValue.startDate,
        EndDate: jobFormValue.endDate,
        BranchID: User.BranchId,
        FiscalID: User.FiscalId,
        Type: "POST",
        FetchURL: `${appURL}api/admin/u-job-inf`,
      };


      Fetchdata(dataForm).then(function (result) {

        if (result.StatusCode === 200) {
          setJobPopup(false);
          jobInfoList();
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
  }, [jobFormError]);

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
  }, [jobFormValue.department]);

  const subdeptList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: -1,
      DepartID: jobFormValue.department,
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
  //API to get staff list

  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    const dataForm = {
      FetchURL: `${appURL}api/org-staff?ComID=${User.CompanyId}&BranchID=${User.BranchId}&DepartmentId=${jobFormValue.department}&SubDepartmentId=${jobFormValue.subDepartment}`,
      Type: "GET",
    };

    Fetchdata(dataForm).then(function (result) {

      if (result.StatusCode === 200) {

        const postResult = result.OrganizationStaffs;
        setStaffList(postResult);
      } else {

      }
    });
  }, [jobFormValue.department, jobFormValue.subDepartment]);

  //API to hit Designation list
  const [designationList, setDesignationList] = useState([]);

  useEffect(() => {
    desgList();
  }, [jobFormValue.department, jobFormValue.subDepartment]);

  const desgList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: -1,
      DepartID: jobFormValue.department,
      SubDepartID: jobFormValue.subDepartment,
      Flag: "S",
      Status: -1,
      Type: "POST",
      BranchID: User.BranchId,
      FetchURL: `${appURL}api/admin/designation`,
    };

    Fetchdata(params).then(function (result) {

      if (result.StatusCode === 200) {
        const postResult = result.DesignationList ? result.DesignationList : "";
        setDesignationList(postResult);
      } else {
        setDesignationList([]);
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
        <div className="bankpopup-inner ">
          <div className="popUpHeader ps-0 pe-0">
            <div className="popUpTitle">Job Information</div>
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
                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="department" style={{ fontSize: "12px" }}>
                        Select Department <sup style={{ color: "red" }}>*</sup>
                      </label>
                      <select
                        class="form-select form-select-sm"
                        aria-label="Default select example"
                        name="department"
                        value={jobFormValue.department}
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
                      {jobFormError.department && (
                        <p className="errormsg">{jobFormError.department}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="form-group">
                      <label
                        htmlFor="subDepartment"
                        style={{ fontSize: "12px" }}
                      >
                        Select Sub Department{" "}
                        <sup style={{ color: "red" }}>*</sup>
                      </label>
                      <select
                        class="form-select form-select-sm"
                        aria-label="Default select example"
                        name="subDepartment"
                        value={jobFormValue.subDepartment}
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
                      {jobFormError.subDepartment && (
                        <p className="errormsg">{jobFormError.subDepartment}</p>
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
                      value={jobFormValue.staff}
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
                    {jobFormError.staff && (
                      <p className="errormsg">{jobFormError.staff}</p>
                    )}
                  </div>
                </div>

                <div className="row text-start ">
                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="designation" style={{ fontSize: "12px" }}>
                        Select Designation <sup style={{ color: "red" }}>*</sup>
                      </label>
                      <select
                        class="form-select form-select-sm"
                        aria-label="Default select example"
                        name="designation"
                        value={jobFormValue.designation}
                        onChange={handleChange}
                      >
                        <option disabled value="" selected>
                          Select Option
                        </option>
                        {designationList.map((item) => (
                          <option
                            key={item.DesignationID}
                            value={item.DesignationID}
                          >
                            {item.Designation}
                          </option>
                        ))}
                      </select>
                      {jobFormError.designation && (
                        <p className="errormsg">{jobFormError.designation}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="grade" style={{ fontSize: "12px" }}>
                        Select Grade <sup style={{ color: "red" }}>*</sup>
                      </label>
                      <select
                        class="form-select form-select-sm"
                        aria-label="Default select example"
                        name="grade"
                        value={jobFormValue.grade}
                        onChange={handleChange}
                      >
                        <option disabled value="" selected>
                          Select Option
                        </option>
                        <option value="1">A</option>
                      </select>
                      {jobFormError.grade && (
                        <p className="errormsg">{jobFormError.grade}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row text-start ">
                  <div className="form-group">
                    <label htmlFor="job" style={{ fontSize: "12px" }}>
                      Select Job Type <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <select
                      class="form-select form-select-sm"
                      aria-label="Default select example"
                      name="job"
                      value={jobFormValue.job}
                      onChange={handleChange}
                    >
                      <option disabled value="" selected>
                        Select Option
                      </option>
                      <option value="1">Full Time</option>
                      <option value="2">Part Time</option>
                      <option value="3">Intern</option>
                      <option value="4">Paid Intern</option>
                      <option value="5">Freelance</option>
                      <option value="6">Contract</option>
                      <option value="7">Training</option>
                    </select>
                    {jobFormError.job && (
                      <p className="errormsg">{jobFormError.job}</p>
                    )}
                  </div>
                </div>

                <div className="row text-start ">
                  <div className="col-md-4 offset-6 col-sm-4 col-lg-4">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="exampleCheck3"
                      name="notWorking"
                      onChange={handleWorkingChange}
                      checked={notWorking}
                      style={{ marginTop: "10px" }}
                    />
                    <label
                      class="form-check-label"
                      for="exampleCheck3"
                      style={{ fontSize: "14px", marginTop: "8px" }}
                    >
                      Not Working
                    </label>
                  </div>
                </div>

                <div className="row text-start ">
                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="startDate" style={{ fontSize: "12px" }}>
                        Start Date<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        id="startDate"
                        style={{ fontSize: "13px" }}
                        type="date"
                        className="form-control form-control-sm "
                        name="startDate"
                        value={jobFormValue.startDate}
                        onChange={handleChange}
                      />
                      {jobFormError.startDate && (
                        <p className="errormsg">{jobFormError.startDate}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="endDate" style={{ fontSize: "12px" }}>
                        End Date<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        id="endDate"
                        style={{ fontSize: "13px" }}
                        type="date"
                        className="form-control form-control-sm "
                        name="endDate"
                        value={jobFormValue.endDate}
                        onChange={handleChange}
                        disabled={!notWorking}
                      />
                      {jobFormError.endDate && (
                        <p className="errormsg">{jobFormError.endDate}</p>
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
