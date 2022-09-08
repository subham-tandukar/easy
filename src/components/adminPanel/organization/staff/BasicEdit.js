import React, { useContext, useEffect, useState } from "react";
import "../../../leaveNotes/leaveNotePopup.css";
import "../subdepartment/SubdepartmentPopup.css";
import CloseIcon from "../../../../images/CloseIcon.svg";
import "../../../hooks/imagePreview.css";
import "../product/ProductPopup.css";
import Plus from "../../../../images/Plus.png";
import AuthContext from "../../../context/auth-context";
import { Fetchdata } from "../../../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StaffContext from "../staffState/StaffContext";
import UpperbarContext from "../../../context/upperbar-context";

export default function Basic() {
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
    isUploaded,
    setIsUploaded,
    typeFile,
    setTypeFile,
    image,
    setImage,
    editIsSubmit,
    setEditIsSubmit,
    checkedList,
    setCheckedList,
    managerChecked,
    setManagerChecked,
    notWorking,
    setNotWorking,
    editFinalSubmit,
    setEditFinalSubmit,
    departmentList,
    designationList,
    subdepartmentList,
    titleId,
    stfList,
    shiftList,
  } = useContext(StaffContext);

  const closePopUp = (e) => {
    setStaffEditPopup(false);
    setManagerChecked(false);
    setStaffFormError({});
    setStaffFormValue({
      firstName: "",
      middleName: "",
      lastName: "",
      userID: "",
      userCode: "",
      deviceCode: "",
      mobileCode: "",
      userName: "",
      password: "",
      email: "",
      contact: "",
      phone: "",
      address: "",
      district: "",
      dateOfBirth: "",
      citizenshipNo: "",
      pan: "",
      gender: "",
      blood: "",
      religion: "",
      marital: "",
      enrollDate: "",
      leaveDate: "",
      jobType: "",
      selectShift: "",
      shiftType: "",
      grade: "",
      department: "",
      subDepartment: "",
      designation: "",
      days: "",
    });
  };

  const handleChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.type == "checkbox" ? target.checked : target.value;
    if (name === "department") {
      staffFormValue.subDepartment = "";
      staffFormValue.designation = "";
    }
    if (name === "subDepartment") {
      staffFormValue.designation = "";
    }
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



  const formNext = (e) => {


    handleCheckList();
    e.preventDefault();
    setStaffFormError(validate(staffFormValue));
    setEditIsSubmit(true);
  };
  useEffect(() => {
    if (Object.keys(staffFormError).length === 0 && editIsSubmit) {
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
        MaritialStatus:
          staffFormValue.marital !== " " ? staffFormValue.marital : " ",
        Image: image !== null ? image.split(",")[1] : "",
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
        // WorkingDays: staffFormValue.days !== " " ? staffFormValue.days : " ",
        WorkingDays: "",
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

    setEditIsSubmit(false);
  }, [staffFormError]);



  const validate = (values) => {
    const errors = {};
    const numv = /^[0-9]+$/i;
    const digits = /^\d{10}$/;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.firstName) {
      errors.firstName = "Required";
    }
    if (!values.lastName) {
      errors.lastName = "Required";
    }
    if (!values.userCode) {
      errors.userCode = "Required";
    }
    if (!values.deviceCode) {
      errors.deviceCode = "Required";
    } else if (!numv.test(values.deviceCode)) {
      errors.deviceCode = "Must be digits";
    }
    if (!values.mobileCode) {
      errors.mobileCode = "Required";
    }
    if (!values.userName) {
      errors.userName = "Required";
    }

    if (!values.address) {
      errors.address = "Required";
    }
    if (!values.district) {
      errors.district = "Required";
    }
    if (!values.citizenshipNo) {
      errors.citizenshipNo = "Required";
    }
    if (!values.dateOfBirth) {
      errors.dateOfBirth = "Required";
    }
    if (!values.gender) {
      errors.gender = "Required";
    }
    if (!values.blood) {
      errors.blood = "Required";
    }
    if (!values.religion) {
      errors.religion = "Required";
    }

    if (!values.marital) {
      errors.marital = "Required";
    }
    if (values.email.length === 0) {
      setEditIsSubmit(true);
    } else if (!regex.test(values.email)) {
      errors.email = "This is not a valid email format";
    }
    if (!values.contact) {
      errors.contact = "Required";
    } else if (!numv.test(values.contact)) {
      errors.contact = "Must be digits";
    } else if (!digits.test(values.contact)) {
      errors.contact = "Must be 10 digits";
    }
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

  function handleImageChange(e) {
    if (e.target.files && e.target.files[0]) {
      setTypeFile(e.target.files[0].type);
      let reader = new FileReader();

      reader.onload = function (e) {
        setImage(e.target.result);
        setIsUploaded(true);
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  }

  return (
    <>
      <div className="staffpopUpBody ps-3 pe-3">
        <div className="col-md-12 col-sm-12 col-lg-12">
          <div className="row text-start ">
            <div className="col-md-4 col-sm-4 col-lg-4">
              <div className="form-group">
                <label htmlFor="firstName" style={{ fontSize: "12px" }}>
                  First Name<sup style={{ color: "red" }}>*</sup>
                </label>
                <input
                  id="firstName"
                  style={{ fontSize: "13px" }}
                  type="text"
                  className="form-control form-control-sm "
                  name="firstName"
                  value={staffFormValue.firstName}
                  onChange={handleChange}
                />
                {staffFormError.firstName && (
                  <p className="errormsg">{staffFormError.firstName}</p>
                )}
              </div>
            </div>

            <div className="col-md-4 col-sm-4 col-lg-4">
              <div className="form-group">
                <label htmlFor="middleName" style={{ fontSize: "12px" }}>
                  Middle Name
                </label>
                <input
                  id="middleName"
                  style={{ fontSize: "13px" }}
                  type="text"
                  className="form-control form-control-sm "
                  name="middleName"
                  value={staffFormValue.middleName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-md-4 col-sm-4 col-lg-4">
              <div className="form-group">
                <label htmlFor="lastName" style={{ fontSize: "12px" }}>
                  Last Name<sup style={{ color: "red" }}>*</sup>
                </label>
                <input
                  id="lastName"
                  style={{ fontSize: "13px" }}
                  type="text"
                  className="form-control form-control-sm "
                  name="lastName"
                  value={staffFormValue.lastName}
                  onChange={handleChange}
                />
                {staffFormError.lastName && (
                  <p className="errormsg">{staffFormError.lastName}</p>
                )}
              </div>
            </div>
          </div>

          <div className="row text-start ">
            <div className="col-md-3 col-sm-3 col-lg-3">
              <div className="form-group">
                <label htmlFor="userID" style={{ fontSize: "12px" }}>
                  User ID
                </label>
                <input
                  id="userID"
                  style={{ fontSize: "13px" }}
                  type="text"
                  className="form-control form-control-sm"
                  name="userID"
                  value={staffFormValue.userID}
                  onChange={handleChange}
                />
                {staffFormError.userID && (
                  <p className="errormsg">{staffFormError.userID}</p>
                )}
              </div>
            </div>

            <div className="col-md-3 col-sm-3 col-lg-3">
              <div className="form-group">
                <label htmlFor="userCode" style={{ fontSize: "12px" }}>
                  User Code<sup style={{ color: "red" }}>*</sup>
                </label>
                <input
                  id="userCode"
                  style={{ fontSize: "13px" }}
                  type="text"
                  className="form-control form-control-sm "
                  name="userCode"
                  value={staffFormValue.userCode}
                  onChange={handleChange}
                />
                {staffFormError.userCode && (
                  <p className="errormsg">{staffFormError.userCode}</p>
                )}
              </div>
            </div>

            <div className="col-md-3 col-sm-3 col-lg-3">
              <div className="form-group">
                <label htmlFor="deviceCode" style={{ fontSize: "12px" }}>
                  Device Code<sup style={{ color: "red" }}>*</sup>
                </label>
                <input
                  id="deviceCode"
                  style={{ fontSize: "13px" }}
                  type="text"
                  className="form-control form-control-sm "
                  name="deviceCode"
                  value={staffFormValue.deviceCode}
                  onChange={handleChange}
                />
                {staffFormError.deviceCode && (
                  <p className="errormsg">{staffFormError.deviceCode}</p>
                )}
              </div>
            </div>

            <div className="col-md-3 col-sm-3 col-lg-3">
              <div className="form-group">
                <label htmlFor="mobileCode" style={{ fontSize: "12px" }}>
                  Mobile Code<sup style={{ color: "red" }}>*</sup>
                </label>
                <input
                  id="mobileCode"
                  style={{ fontSize: "13px" }}
                  type="text"
                  className="form-control form-control-sm "
                  name="mobileCode"
                  value={staffFormValue.mobileCode}
                  onChange={handleChange}
                />
                {staffFormError.mobileCode && (
                  <p className="errormsg">{staffFormError.mobileCode}</p>
                )}
              </div>
            </div>
          </div>

          <div className="row text-start ">
            <div className="col-md-6 col-sm-6 col-lg-6">
              <div className="form-group">
                <label htmlFor="userName" style={{ fontSize: "12px" }}>
                  UserName <sup style={{ color: "red" }}>*</sup>
                </label>
                <input
                  id="userName"
                  style={{ fontSize: "13px" }}
                  type="text"
                  className="form-control form-control-sm"
                  name="userName"
                  value={staffFormValue.userName}
                  onChange={handleChange}
                />
                {staffFormError.userName && (
                  <p className="errormsg">{staffFormError.userName}</p>
                )}
              </div>
            </div>

            <div className="col-md-6 col-sm-6 col-lg-6">
              <div className="form-group">
                <label htmlFor="password" style={{ fontSize: "12px" }}>
                  Password<sup style={{ color: "red" }}>*</sup>
                </label>
                <input
                  id="password"
                  style={{ fontSize: "13px" }}
                  type="password"
                  className="form-control form-control-sm "
                  name="password"
                  value={staffFormValue.password}
                  onChange={handleChange}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="row text-start ">
            <div className="col-md-4 col-sm-4 col-lg-4">
              <div className="form-group">
                <label htmlFor="email" style={{ fontSize: "12px" }}>
                  Email
                </label>
                <input
                  id="email"
                  style={{ fontSize: "13px" }}
                  type="text"
                  className="form-control form-control-sm "
                  name="email"
                  value={staffFormValue.email}
                  onChange={handleChange}
                />
                {staffFormError.email && (
                  <p className="errormsg">{staffFormError.email}</p>
                )}
              </div>
            </div>

            <div className="col-md-4 col-sm-4 col-lg-4">
              <div className="form-group">
                <label htmlFor="contact" style={{ fontSize: "12px" }}>
                  Contact<sup style={{ color: "red" }}>*</sup>
                </label>
                <input
                  id="contact"
                  style={{ fontSize: "13px" }}
                  type="text"
                  className="form-control form-control-sm "
                  name="contact"
                  value={staffFormValue.contact}
                  onChange={handleChange}
                />
                {staffFormError.contact && (
                  <p className="errormsg">{staffFormError.contact}</p>
                )}
              </div>
            </div>

            <div className="col-md-4 col-sm-4 col-lg-4">
              <div className="form-group">
                <label htmlFor="phone" style={{ fontSize: "12px" }}>
                  Phone
                </label>
                <input
                  id="phone"
                  style={{ fontSize: "13px" }}
                  type="text"
                  className="form-control form-control-sm "
                  name="phone"
                  value={staffFormValue.phone}
                  onChange={handleChange}
                />
                {staffFormError.phone && (
                  <p className="errormsg">{staffFormError.phone}</p>
                )}
              </div>
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
                  value={staffFormValue.address}
                  onChange={handleChange}
                />
                {staffFormError.address && (
                  <p className="errormsg">{staffFormError.address}</p>
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
                  value={staffFormValue.district}
                  onChange={handleChange}
                >
                  <option disabled value="" selected>
                    Select Option
                  </option>
                  <option value="1">Kathmandu</option>
                  {/* {departmentList.map((item) => (<option key={item.DepartmentID} value={item.DepartmentID}>{item.Department}</option>))} */}
                </select>
                {staffFormError.district && (
                  <p className="errormsg">{staffFormError.district}</p>
                )}
              </div>
            </div>
          </div>

          <div className="row text-start ">
            <div className="col-md-4 col-sm-4 col-lg-4">
              <div className="form-group">
                <label htmlFor="dateOfBirth" style={{ fontSize: "12px" }}>
                  Date Of Birth<sup style={{ color: "red" }}>*</sup>
                </label>
                <input
                  id="dateOfBirth"
                  style={{ fontSize: "13px" }}
                  type="date"
                  className="form-control form-control-sm "
                  name="dateOfBirth"
                  value={staffFormValue.dateOfBirth}
                  onChange={handleChange}
                />
                {staffFormError.dateOfBirth && (
                  <p className="errormsg">{staffFormError.dateOfBirth}</p>
                )}
              </div>
            </div>

            <div className="col-md-4 col-sm-4 col-lg-4">
              <div className="form-group">
                <label htmlFor="citizenshipNo" style={{ fontSize: "12px" }}>
                  Citizenship No.<sup style={{ color: "red" }}>*</sup>
                </label>
                <input
                  id="citizenshipNo"
                  style={{ fontSize: "13px" }}
                  type="text"
                  className="form-control form-control-sm "
                  name="citizenshipNo"
                  value={staffFormValue.citizenshipNo}
                  onChange={handleChange}
                />
                {staffFormError.citizenshipNo && (
                  <p className="errormsg">{staffFormError.citizenshipNo}</p>
                )}
              </div>
            </div>

            <div className="col-md-4 col-sm-4 col-lg-4">
              <div className="form-group">
                <label htmlFor="pan" style={{ fontSize: "12px" }}>
                  PAN
                </label>
                <input
                  id="pan"
                  style={{ fontSize: "13px" }}
                  type="text"
                  className="form-control form-control-sm "
                  name="pan"
                  value={staffFormValue.pan}
                  onChange={handleChange}
                />
                {staffFormError.pan && (
                  <p className="errormsg">{staffFormError.pan}</p>
                )}
              </div>
            </div>
          </div>

          <div className="row text-start ">
            <div className="col-md-3 col-sm-3 col-lg-3">
              <div className="form-group">
                <label htmlFor="gender" style={{ fontSize: "12px" }}>
                  Gender <sup style={{ color: "red" }}>*</sup>
                </label>
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example"
                  name="gender"
                  value={staffFormValue.gender}
                  onChange={handleChange}
                >
                  <option disabled value="" selected>
                    Select Option
                  </option>
                  <option value="1">Male</option>
                  <option value="2">Female</option>
                  <option value="3">Other</option>
                </select>
                {staffFormError.gender && (
                  <p className="errormsg">{staffFormError.gender}</p>
                )}
              </div>
            </div>

            <div className="col-md-3 col-sm-3 col-lg-3">
              <div className="form-group">
                <label htmlFor="blood" style={{ fontSize: "12px" }}>
                  Blood Group <sup style={{ color: "red" }}>*</sup>
                </label>
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example"
                  name="blood"
                  value={staffFormValue.blood}
                  onChange={handleChange}
                >
                  <option disabled value="" selected>
                    Select Option
                  </option>
                  <option value="1">A +ve</option>
                  <option value="2">A -ve</option>
                  <option value="3">B +ve</option>
                  <option value="4">B -ve</option>
                  <option value="5">AB +ve</option>
                  <option value="6">AB -ve</option>
                  <option value="7">O +ve</option>
                  <option value="8">O -ve</option>
                </select>
                {staffFormError.blood && (
                  <p className="errormsg">{staffFormError.blood}</p>
                )}
              </div>
            </div>

            <div className="col-md-3 col-sm-3 col-lg-3">
              <div className="form-group">
                <label htmlFor="religion" style={{ fontSize: "12px" }}>
                  Religion <sup style={{ color: "red" }}>*</sup>
                </label>
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example"
                  name="religion"
                  value={staffFormValue.religion}
                  onChange={handleChange}
                >
                  <option disabled value="" selected>
                    Select Option
                  </option>
                  <option value="1">Hindu</option>
                  <option value="2">Buddhist</option>
                  <option value="3">Christian</option>
                  <option value="4">Islam</option>
                </select>
                {staffFormError.religion && (
                  <p className="errormsg">{staffFormError.religion}</p>
                )}
              </div>
            </div>

            <div className="col-md-3 col-sm-3 col-lg-3">
              <div className="form-group">
                <label htmlFor="marital" style={{ fontSize: "12px" }}>
                  Marital Status <sup style={{ color: "red" }}>*</sup>
                </label>
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example"
                  name="marital"
                  value={staffFormValue.marital}
                  onChange={handleChange}
                >
                  <option disabled value="" selected>
                    Select Option
                  </option>
                  <option value="1">Single</option>
                  <option value="2">Married</option>
                  <option value="3">Widowed</option>
                  <option value="4">Divorced</option>
                </select>
                {staffFormError.marital && (
                  <p className="errormsg">{staffFormError.marital}</p>
                )}
              </div>
            </div>
          </div>

          <div className="row text-start ">
            <div className="col-md-4 offset-4 col-sm-4 col-lg-4">
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
                  disabled={!notWorking}
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
                  {shiftList.map((item) => (
                    <option key={item.ShiftID} value={item.ShiftID}>
                      {item.Shift}
                    </option>
                  ))}
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

          <div className="form-group  ">
            <div
              className="form-label"
              htmlFor="text"
              style={{ fontSize: "12px", textAlign: "left" }}
            >
              Upload Image
            </div>

            <div className="BoxUpload">
              <div className="image-upload">
                {!image ? (
                  <>
                    <label htmlFor="upload-input">
                      <img
                        src={Plus}
                        draggable={"false"}
                        alt="placeholder"
                        style={{ width: 90, height: 100, paddingTop: "10px" }}
                      />
                    </label>

                    <input
                      id="upload-input"
                      type="file"
                      accept=".jpg,.jpeg,.gif,.png,.mov,.mp4"
                      onChange={handleImageChange}
                      name="image"
                    />
                  </>
                ) : (
                  <div className="ImagePreview">
                    <img
                      className="close-icon"
                      src={CloseIcon}
                      alt="CloseIcon"
                      onClick={() => {
                        setIsUploaded(false);
                        setImage(null);
                      }}
                    />

                    <img
                      id="uploaded-image"
                      src={image}
                      draggable={false}
                      alt="uploaded-img"
                    />
                  </div>
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

            {/* <input
                            type="checkbox"
                            className="form-check-input"
                            id="exampleCheck3"
                            name="notWorking"
                            onChange={handleWorkingChange}
                            style={{ marginLeft: "10px" }}
                        />
                        <label class="form-check-label" for="exampleCheck3" style={{ fontSize: "14px" }}>
                            Not Working
                        </label> */}
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
              onClick={formNext}
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
    </>
  );
}
