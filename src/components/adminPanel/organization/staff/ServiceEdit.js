import React, { useContext, useEffect, useState } from "react";
import "../../../leaveNotes/leaveNotePopup.css";
import "../subdepartment/SubdepartmentPopup.css";
import CloseIcon from "../../../../images/CloseIcon.svg";
import "../../../hooks/imagePreview.css";
import "../product/ProductPopup.css";
import "./Staff.css";
import AuthContext from "../../../context/auth-context";
import { Fetchdata } from "../../../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StaffContext from "../staffState/StaffContext";
import UpperbarContext from "../../../context/upperbar-context";

export default function Service() {
  const { User } = useContext(AuthContext);
  const { appURL } = useContext(UpperbarContext);
  const {
    staffPopup,
    setStaffPopup,
    staffEditPopup,
    setStaffEditPopup,
    currentStep,
    setStep,
    staffFormValue,
    setStaffFormValue,
    staffFormError,
    setStaffFormError,
    staffValue,
    checkedList,
    setCheckedList,
    managerChecked,
    setManagerChecked,
    notWorking,
    setNotWorking,
    image,
    editFinalSubmit,
    setEditFinalSubmit,
    departmentList,
    designationList,
    subdepartmentList,
    titleId,
    stfList,
  } = useContext(StaffContext);

  const closePopUp = (e) => {
    setStaffEditPopup(false);
    setStaffFormError({});
    setStep(1);
  };

  const handleChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.type == "checkbox" ? target.checked : target.value;
    setStaffFormValue({ ...staffFormValue, [name]: value });
  };

  const handleChecked = (e) => {
    let indexList = checkedList ? checkedList.indexOf(e.target.value) : -1;
    if (indexList === -1) {
      checkedList.push(e.target.value);
    } else {
      setCheckedList(checkedList.filter((list) => list !== e.target.value));
    }
  };

  const handleCheckList = (e) => {
    staffFormValue.days = checkedList;
  };

  const handleOnChange = (e) => {
    setManagerChecked(!managerChecked);
    if (e.target.checked === true) {
      setManagerChecked(1);
    } else if (e.target.checked === false) {
      setManagerChecked(0);
    }
  };

  const handleWorkingChange = (e) => {
    setNotWorking(!notWorking);
    // if (e.target.checked === true) {
    //     setNotWorking(2)
    // }
    // else if (e.target.checked === false) {
    //     setNotWorking(1)
    // }
  };

  const handleSubmit = (e) => {

    handleCheckList();
    e.preventDefault();
    setStaffFormError(validate(staffFormValue));
    setEditFinalSubmit(true);
  };
  useEffect(() => {
    if (Object.keys(staffFormError).length === 0 && editFinalSubmit) {
      const dataForm = {
        ComID: User.CompanyId,
        Flag: "U",
        StaffID: User.UID,
        UID: titleId,
        UserID: staffFormValue.userID !== " " ? staffFormValue.userID : " ",
        UserCode:
          staffFormValue.userCode !== " " ? staffFormValue.userCode : " ",
        DeviceCode:
          staffFormValue.deviceCode !== " " ? staffFormValue.deviceCode : " ",
        MobileID:
          staffFormValue.mobileCode !== " " ? staffFormValue.mobileCode : " ",
        FirstName:
          staffFormValue.firstName !== " " ? staffFormValue.firstName : " ",
        MiddleName:
          staffFormValue.middleName !== "" ? staffFormValue.middleName : " ",
        LastName:
          staffFormValue.lastName !== " " ? staffFormValue.lastName : " ",
        UserName:
          staffFormValue.userName !== " " ? staffFormValue.userName : " ",
        // Password: staffFormValue.password !== " " ? staffFormValue.password : " ",
        Email: staffFormValue.email !== " " ? staffFormValue.email : " ",
        Contact: staffFormValue.contact !== " " ? staffFormValue.contact : " ",
        Phone: staffFormValue.phone !== " " ? staffFormValue.phone : " ",
        Address: staffFormValue.address !== " " ? staffFormValue.address : " ",
        District:
          staffFormValue.district !== " " ? staffFormValue.district : " ",
        DateOfBirth:
          staffFormValue.dateOfBirth !== " " ? staffFormValue.dateOfBirth : " ",
        CitizenshipNo:
          staffFormValue.citizenshipNo !== " "
            ? staffFormValue.citizenshipNo
            : " ",
        PAN: staffFormValue.pan !== " " ? staffFormValue.pan : " ",
        Gender: staffFormValue.gender !== " " ? staffFormValue.gender : " ",
        BloodGroup: staffFormValue.blood !== " " ? staffFormValue.blood : " ",
        Religion:
          staffFormValue.religion !== " " ? staffFormValue.religion : " ",
        MaritalStatus:
          staffFormValue.marital !== " " ? staffFormValue.marital : " ",
        Image: image !== " " ? image : " ",
        EnrollDate:
          staffFormValue.enrollDate !== " " ? staffFormValue.enrollDate : " ",
        WorkingStatus: notWorking ? 2 : 1,
        LeavedDate:
          staffFormValue.leaveDate !== " " ? staffFormValue.leaveDate : " ",
        JobType: staffFormValue.jobType !== " " ? staffFormValue.jobType : " ",
        Shift:
          staffFormValue.selectShift !== " " ? staffFormValue.selectShift : " ",
        ShiftType:
          staffFormValue.shiftType !== " " ? staffFormValue.shiftType : " ",
        Grade: staffFormValue.grade !== " " ? staffFormValue.grade : " ",
        Department:
          staffFormValue.department !== " " ? staffFormValue.department : " ",
        SubDepartment:
          staffFormValue.subDepartment !== " "
            ? staffFormValue.subDepartment
            : " ",
        Designation:
          staffFormValue.designation !== " " ? staffFormValue.designation : " ",
        WorkingDays: staffFormValue.days !== " " ? staffFormValue.days : " ",
        IsManager: managerChecked !== " " ? managerChecked : 0,
        FiscalID: User.FiscalId,
        BranchID: User.BranchId,
        FetchURL: `${appURL}api/admin/user`,
        Type: "POST",
      };
      Fetchdata(dataForm).then(function (result) {

        if (result.StatusCode === 200) {
          setStaffEditPopup(false);
          stfList();
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
    }
    setEditFinalSubmit(false);
  }, [staffFormError]);

  const validate = (values) => {
    const errors = {};

    if (!values.enrollDate) {
      errors.enrollDate = "Required";
    }
    if (!values.jobType) {
      errors.jobType = "Required";
    }
    if (!values.selectShift) {
      errors.selectShift = "Required";
    }
    if (!values.shiftType) {
      errors.shiftType = "Required";
    }
    if (!values.department) {
      errors.department = "Required";
    }
    if (!values.subDepartment) {
      errors.subDepartment = "Required";
    }
    if (!values.designation) {
      errors.designation = "Required";
    }

    return errors;
  };

  return (
    <>
      <div className="staffpopUpBody ps-3 pe-3">
        <div className="col-md-12 col-sm-12 col-lg-12">
          <div className="row text-start ">
            <div className="col-md-4 col-sm-4 col-lg-4">
              <div className="form-group">
                <label htmlFor="enrollDate" style={{ fontSize: "12px" }}>
                  Enroll Date<sup style={{ color: "red" }}>*</sup>
                </label>
                <input
                  id="enrollDate"
                  style={{ fontSize: "13px" }}
                  type="date"
                  className="form-control form-control-sm "
                  name="enrollDate"
                  value={staffFormValue.enrollDate}
                  onChange={handleChange}
                />
                {staffFormError.enrollDate && (
                  <p className="errormsg">{staffFormError.enrollDate}</p>
                )}
              </div>
            </div>

            <div className="col-md-4 col-sm-4 col-lg-4">
              <div className="form-group">
                <label htmlFor="leaveDate" style={{ fontSize: "12px" }}>
                  Leave Date
                </label>
                <input
                  id="leaveDate"
                  style={{ fontSize: "13px" }}
                  type="date"
                  className="form-control form-control-sm "
                  name="leaveDate"
                  value={staffFormValue.leaveDate}
                  onChange={handleChange}
                  disabled={notWorking}
                />
                {staffFormError.leaveDate && (
                  <p className="errormsg">{staffFormError.leaveDate}</p>
                )}
              </div>
            </div>

            <div className="col-md-4 col-sm-4 col-lg-4">
              <div className="form-group">
                <label htmlFor="jobType" style={{ fontSize: "12px" }}>
                  Select Job Type <sup style={{ color: "red" }}>*</sup>
                </label>
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example"
                  name="jobType"
                  value={staffFormValue.jobType}
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
                {staffFormError.jobType && (
                  <p className="errormsg">{staffFormError.jobType}</p>
                )}
              </div>
            </div>
          </div>

          <div className="row text-start ">
            <div className="col-md-4 col-sm-4 col-lg-4">
              <div className="form-group">
                <label htmlFor="selectShift" style={{ fontSize: "12px" }}>
                  Select Shift <sup style={{ color: "red" }}>*</sup>
                </label>
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example"
                  name="selectShift"
                  value={staffFormValue.selectShift}
                  onChange={handleChange}
                >
                  <option disabled value="" selected>
                    Select Option
                  </option>
                  <option value="1">Morning</option>
                </select>
                {staffFormError.selectShift && (
                  <p className="errormsg">{staffFormError.selectShift}</p>
                )}
              </div>
            </div>

            <div className="col-md-4 col-sm-4 col-lg-4">
              <div className="form-group">
                <label htmlFor="shiftType" style={{ fontSize: "12px" }}>
                  Select Shift Type <sup style={{ color: "red" }}>*</sup>
                </label>
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example"
                  name="shiftType"
                  value={staffFormValue.shiftType}
                  onChange={handleChange}
                >
                  <option disabled value="" selected>
                    Select Option
                  </option>
                  <option value="1">Weekly</option>
                  <option value="2">Monthly</option>
                  <option value="3">Yearly</option>
                </select>
                {staffFormError.shiftType && (
                  <p className="errormsg">{staffFormError.shiftType}</p>
                )}
              </div>
            </div>

            <div className="col-md-4 col-sm-4 col-lg-4">
              <div className="form-group">
                <label htmlFor="grade" style={{ fontSize: "12px" }}>
                  Select Grade<sup style={{ color: "red" }}>*</sup>
                </label>
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example"
                  name="grade"
                  value={staffFormValue.grade}
                  onChange={handleChange}
                >
                  <option disabled value="" selected>
                    Select Option
                  </option>
                  <option value="0">A</option>
                </select>
                {staffFormError.grade && (
                  <p className="errormsg">{staffFormError.grade}</p>
                )}
              </div>
            </div>
          </div>

          <div className="row text-start ">
            <div className="col-md-4 col-sm-4 col-lg-4">
              <div className="form-group">
                <label htmlFor="department" style={{ fontSize: "12px" }}>
                  Select Department <sup style={{ color: "red" }}>*</sup>
                </label>
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example"
                  name="department"
                  value={staffFormValue.department}
                  onChange={handleChange}
                >
                  <option disabled value="" selected>
                    Select Option
                  </option>

                  {departmentList.map((item) => (
                    <option key={item.DepartmentID} value={item.DepartmentID}>
                      {item.Department}
                    </option>
                  ))}
                </select>
                {staffFormError.department && (
                  <p className="errormsg">{staffFormError.department}</p>
                )}
              </div>
            </div>

            <div className="col-md-4 col-sm-4 col-lg-4">
              <div className="form-group">
                <label htmlFor="subDepartment" style={{ fontSize: "12px" }}>
                  Select Sub Department <sup style={{ color: "red" }}>*</sup>
                </label>
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example"
                  name="subDepartment"
                  value={staffFormValue.subDepartment}
                  onChange={handleChange}
                >
                  <option disabled value="" selected>
                    Select Option
                  </option>

                  {subdepartmentList.map((item) => (
                    <option key={item.SubDepartID} value={item.SubDepartID}>
                      {item.SubDepartName}
                    </option>
                  ))}
                </select>
                {staffFormError.subDepartment && (
                  <p className="errormsg">{staffFormError.subDepartment}</p>
                )}
              </div>
            </div>

            <div className="col-md-4 col-sm-4 col-lg-4">
              <div className="form-group">
                <label htmlFor="designation" style={{ fontSize: "12px" }}>
                  Select Designation<sup style={{ color: "red" }}>*</sup>
                </label>
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example"
                  name="designation"
                  value={staffFormValue.designation}
                  onChange={handleChange}
                >
                  <option disabled value="" selected>
                    Select Option
                  </option>

                  {designationList.map((item) => (
                    <option key={item.DesignationID} value={item.DesignationID}>
                      {item.Designation}
                    </option>
                  ))}
                </select>
                {staffFormError.designation && (
                  <p className="errormsg">{staffFormError.designation}</p>
                )}
              </div>
            </div>
          </div>
          <div className="form-group">
            <div style={{ textAlign: "left" }}>
              <label className="form-label" htmlFor="purpose">
                Working Days<sup style={{ color: "red" }}>*</sup>
              </label>
            </div>

            <div className="do-flex">
              <div class="feature">
                <input
                  type="checkbox"
                  id="feature"
                  value="Sunday"
                  onChange={handleChecked}
                  checked={staffFormValue.days.indexOf("Sunday")}
                />
                <div>
                  <span style={{ fontSize: "13px" }}>Sun</span>
                </div>
              </div>

              <div class="feature">
                <input
                  type="checkbox"
                  id="feature"
                  value="Monday"
                  onChange={handleChecked}
                  checked={staffFormValue.days.indexOf("Monday")}
                />
                <div>
                  <span style={{ fontSize: "13px" }}>Mon</span>
                </div>
              </div>

              <div class="feature">
                <input
                  type="checkbox"
                  id="feature"
                  value="Tuesday"
                  onChange={handleChecked}
                  checked={staffFormValue.days.indexOf("Tuesday")}
                />
                <div>
                  <span style={{ fontSize: "13px" }}>Tue</span>
                </div>
              </div>

              <div class="feature">
                <input
                  type="checkbox"
                  id="feature"
                  value="Wednesday"
                  onChange={handleChecked}
                  checked={staffFormValue.days.indexOf("Wednesday")}
                />
                <div>
                  <span style={{ fontSize: "13px" }}>Wed</span>
                </div>
              </div>

              <div class="feature">
                <input
                  type="checkbox"
                  id="feature"
                  value="Thursday"
                  onChange={handleChecked}
                  checked={staffFormValue.days.indexOf("Thursday")}
                />
                <div>
                  <span style={{ fontSize: "13px" }}>Thurs</span>
                </div>
              </div>

              <div class="feature">
                <input
                  type="checkbox"
                  id="feature"
                  value="Friday"
                  onChange={handleChecked}
                  checked={staffFormValue.days.indexOf("Friday")}
                />
                <div>
                  <span style={{ fontSize: "13px" }}>Fri</span>
                </div>
              </div>

              <div class="feature">
                <input
                  type="checkbox"
                  id="feature"
                  value="Saturday"
                  onChange={handleChecked}
                  checked={staffFormValue.days.indexOf("Saturday")}
                />
                <div>
                  <span style={{ fontSize: "13px" }}>Sat</span>
                </div>
              </div>
            </div>

            <p className="errormsg ">{staffFormError.days}</p>
          </div>

          <div className="checkbox-close">
            <input
              type="checkbox"
              className="form-check-input"
              id="exampleCheck2"
              name="closeChecked"
              onChange={handleOnChange}
              checked={managerChecked}
            />
            <label
              class="form-check-label"
              for="exampleCheck2"
              style={{ fontSize: "14px" }}
            >
              Manager
            </label>

            <input
              type="checkbox"
              className="form-check-input"
              id="exampleCheck3"
              name="notWorking"
              onChange={handleWorkingChange}
              checked={notWorking}
              style={{ marginLeft: "10px" }}
            />
            <label
              class="form-check-label"
              for="exampleCheck3"
              style={{ fontSize: "14px" }}
            >
              Not Working
            </label>
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
              onClick={() => setStep(1)}
            >
              Previous
            </button>
            <button
              type="button"
              class="btn btn-sm me-2"
              style={{ background: "var(--button-color)", color: "white" }}
              onClick={handleSubmit}
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
    </>
  );
}
