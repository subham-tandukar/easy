import React, { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import CloseIcon from "../../images/CloseIcon.svg";
import Plus from "../../images/Plus.png";
import UpperbarContext from "../context/upperbar-context";
import CreditManagementContext from "../adminPanel/CreditManagementState/CreditManagementContext";
import { Fetchdata } from "../hooks/getData";
import AuthContext from "../context/auth-context";
import NepaliDate from "nepali-date-converter";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import "@sbmdkl/nepali-datepicker-reactjs/dist/index.css";
import StaffContext from "../adminPanel/organization/staffState/StaffContext";
import { GetEnglishDate } from "../hooks/dateConvertor";

const NotificationPopup = ({
  setNotificationPopup,
  //   crList,
  notificationValues,
  setNotificationValues,
  notificationErrors,
  setNotificationErrors,
  DFlag,
  submit,
  setSubmit,
  // fetchNotification,
  // image,
  // setImage,

  //   chooseCooperative,
}) => {
  const {
    // departmentList,
    // subdepartmentList,
    // designationList,
    staffList,
    notifyList,
  } = useContext(StaffContext);
  const { User } = useContext(AuthContext);
  const { sidePanelBg, mainBg, darkText, appURL } = useContext(UpperbarContext);
  const [isUploaded, setIsUploaded] = useState(false);

  const [typeFile, setTypeFile] = useState("");
  const [image, setImage] = useState("");

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

  const validate = (values) => {
    const errors = {};

    if (!values.title) {
      errors.title = "Required";
    }
    if (!values.description) {
      errors.description = "Required";
    }
    if (!values.pubDate) {
      errors.pubDate = "Required";
    }

    if (notificationValues.all === "d") {
      if (!values.department) {
        errors.department = "Required";
      }
    }
    if (notificationValues.all === "s") {
      if (!values.department) {
        errors.department = "Required";
      }
      if (!values.subDepartment) {
        errors.subDepartment = "Required";
      }
    }
    if (notificationValues.all === "i") {
      if (!values.department) {
        errors.department = "Required";
      }
      if (!values.subDepartment) {
        errors.subDepartment = "Required";
      }
      if (!values.staff) {
        errors.staff = "Required";
      }
    }
    if (notificationValues.all === "de") {
      if (!values.department) {
        errors.department = "Required";
      }
      if (!values.subDepartment) {
        errors.subDepartment = "Required";
      }
      if (!values.designation) {
        errors.designation = "Required";
      }
    }

    return errors;
  };

  const handleChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setNotificationValues({ ...notificationValues, [name]: value });
  };
  const handle = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setNotificationValues({ ...notificationValues, [name]: value });
    setNotificationErrors({});
  };

  const handleIssueDate = ({ bsDate }) => {
    let name = "pubDate";
    setNotificationValues({ ...notificationValues, [name]: bsDate });
  };

  const closePopUp = () => {
    setNotificationPopup(false);
    setNotificationErrors({});
    setNotificationValues("");
    setImage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setNotificationErrors(validate(notificationValues));
    setSubmit(true);

    console.log("ok");
  };

  useEffect(() => {
    if (Object.keys(notificationErrors).length === 0 && submit) {
      const dataForm = {
        ComID: User.CompanyId,
        Flag: "I",
        StaffID: User.UID,
        NFlag: notificationValues.all,
        Title: notificationValues.title,
        Description: notificationValues.description,
        Image: image !== null ? image.split(",")[1] : "",
        AcBtn: notificationValues.actionButton,
        AcUrl: notificationValues.actionUrl,
        PublishedDate:
          DFlag === "N"
            ? GetEnglishDate(notificationValues.pubDate)
            : notificationValues.pubDate,
        UserID: User.UID,
        DepartmentID: notificationValues.department,
        SubDepartmentID: notificationValues.subDepartment,
        DesignationID: notificationValues.designation,
        BranchID: User.BranchId,
        FiscalID: User.FiscalId,
        NotificationID: 1,
        FetchURL: `${appURL}api/admin/notification`,
        Type: "POST",
      };
      Fetchdata(dataForm).then(function (resp) {
        console.log("data", resp);
        if (resp.StatusCode === 200) {
          setNotificationPopup(false);
          notifyList();
          toast(resp.Message, {
            style: {
              color: "green",
              fontSize: "13px",
            },
          });
        } else {
          
          toast("Error: " + resp.Message, {
            style: {
              color: "red",
              fontSize: "13px",
            },
          });
        }
      });
      setSubmit(false);
      setImage("");
    }
  }, [notificationErrors]);

 

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

  // API to hit Sub-Department list
  const [subdepartmentList, setSubdepartmentList] = useState([]);

  useEffect(() => {
    subdeptList();
  }, [notificationValues.department]);

  const subdeptList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: -1,
      DepartID: notificationValues.department,
      Flag: "S",
      Type: "POST",
      Status: 1,
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

  //API to hit Designation list
  const [designationList, setDesignationList] = useState([]);

  useEffect(() => {
    desgList();
  }, [notificationValues.department, notificationValues.subDepartment]);

  const desgList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: -1,
      DepartID: notificationValues.department,
      SubDepartID: notificationValues.subDepartment,
      Flag: "S",
      Type: "POST",
      Status: 1,
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
      <div className="container addcspopup-wrapper">
        <div className="addcspopup-inner bg" style={mainBg}>
          <div className="popUpHeader ps-0 pe-0" style={sidePanelBg}>
            <div className="popUpTitle">Add Notification</div>
            <div className="popUpClose">
              <img
                className="popUpCloseIcon"
                src={CloseIcon}
                alt="CloseIcon"
                onClick={closePopUp}
              />
            </div>
          </div>
          {/* {loading ? (
            <>
              <Spinner />
            </>
          ) : ( */}
          <div className="addcspopupBody ps-3 pe-3 mt-2">
            <div className="row text-start ">
              <div className="form-group">
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example"
                  value={notificationValues.all}
                  name="all"
                  onChange={handle}
                >
                  <option value="a">All</option>
                  <option value="d">Department Wise</option>
                  <option value="s">Sub Department Wise</option>
                  <option value="i">Individual</option>
                  <option value="de">Designation</option>
                </select>
              </div>
            </div>

            {notificationValues.all === "d" && (
              <div className="row text-start mt-2">
                <div className="form-group">
                  <select
                    class="form-select form-select-sm"
                    aria-label="Default select example"
                    name="department"
                    value={notificationValues.department}
                    onChange={handleChange}
                  >
                    <option disabled value="0" selected>
                      Select Department <sup style={{ color: "red" }}>*</sup>
                    </option>
                    {departmentList.map((list) => (
                      <option key={list.DepartmentID} value={list.DepartmentID}>
                        {list.Department}
                      </option>
                    ))}
                  </select>
                  {notificationErrors.department && (
                    <p className="errormsg">{notificationErrors.department}</p>
                  )}
                </div>
              </div>
            )}

            {notificationValues.all === "s" && (
              <div className="row text-start mt-2">
                <div className="col-6">
                  <div className="form-group">
                    <select
                      class="form-select form-select-sm"
                      aria-label="Default select example"
                      name="department"
                      value={notificationValues.department}
                      onChange={handleChange}
                    >
                      <option disabled value="0" selected>
                        Select Department <sup style={{ color: "red" }}>*</sup>
                      </option>
                      {departmentList.map((list) => (
                        <option
                          key={list.DepartmentID}
                          value={list.DepartmentID}
                        >
                          {list.Department}
                        </option>
                      ))}
                    </select>
                    {notificationErrors.department && (
                      <p className="errormsg">
                        {notificationErrors.department}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <select
                      class="form-select form-select-sm"
                      aria-label="Default select example"
                      name="subDepartment"
                      value={notificationValues.subDepartment}
                      onChange={handleChange}
                    >
                      <option disabled value="0" selected>
                        Select Sub Department{" "}
                        <sup style={{ color: "red" }}>*</sup>
                      </option>
                      {subdepartmentList.map((list) => (
                        <option
                          key={list.SubDepartHeadID}
                          value={list.SubDepartHeadID}
                        >
                          {list.SubDepartHead}
                        </option>
                      ))}
                    </select>
                    {notificationErrors.subDepartment && (
                      <p className="errormsg">
                        {notificationErrors.subDepartment}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {notificationValues.all === "i" && (
              <>
                <div className="row text-start mt-2">
                  <div className="col-6">
                    <div className="form-group">
                      <select
                        class="form-select form-select-sm"
                        aria-label="Default select example"
                        name="department"
                        value={notificationValues.department}
                        onChange={handleChange}
                      >
                        <option disabled value="0" selected>
                          Select Department{" "}
                          <sup style={{ color: "red" }}>*</sup>
                        </option>
                        {departmentList.map((list) => (
                          <option
                            key={list.DepartmentID}
                            value={list.DepartmentID}
                          >
                            {list.Department}
                          </option>
                        ))}
                      </select>
                      {notificationErrors.department && (
                        <p className="errormsg">
                          {notificationErrors.department}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <select
                        class="form-select form-select-sm"
                        aria-label="Default select example"
                        name="subDepartment"
                        value={notificationValues.subDepartment}
                        onChange={handleChange}
                      >
                        <option disabled value="0" selected>
                          Select Sub Department{" "}
                          <sup style={{ color: "red" }}>*</sup>
                        </option>
                        {subdepartmentList.map((list) => (
                          <option
                            key={list.SubDepartID}
                            value={list.SubDepartID}
                          >
                            {list.SubDepartName}
                          </option>
                        ))}
                      </select>
                      {notificationErrors.subDepartment && (
                        <p className="errormsg">
                          {notificationErrors.subDepartment}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row text-start mt-2">
                  <div className="form-group">
                    <select
                      class="form-select form-select-sm"
                      aria-label="Default select example"
                      name="staff"
                      value={notificationValues.staff}
                      onChange={handleChange}
                    >
                      <option disabled value="0" selected>
                        Select Staff <sup style={{ color: "red" }}>*</sup>
                      </option>
                      {staffList.map((list) => (
                        <option key={list.StaffID} value={list.StaffID}>
                          {list.StaffName}
                        </option>
                      ))}
                    </select>
                    {notificationErrors.staff && (
                      <p className="errormsg">{notificationErrors.staff}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {notificationValues.all === "de" && (
              <>
                <div className="row text-start mt-2">
                  <div className="col-6">
                    <div className="form-group">
                      <select
                        class="form-select form-select-sm"
                        aria-label="Default select example"
                        name="department"
                        value={notificationValues.department}
                        onChange={handleChange}
                      >
                        <option disabled value="0" selected>
                          Select Department{" "}
                          <sup style={{ color: "red" }}>*</sup>
                        </option>
                        {departmentList.map((list) => (
                          <option
                            key={list.DepartmentID}
                            value={list.DepartmentID}
                          >
                            {list.Department}
                          </option>
                        ))}
                      </select>
                      {notificationErrors.department && (
                        <p className="errormsg">
                          {notificationErrors.department}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <select
                        class="form-select form-select-sm"
                        aria-label="Default select example"
                        name="subDepartment"
                        value={notificationValues.subDepartment}
                        onChange={handleChange}
                      >
                        <option disabled value="0" selected>
                          Select Sub Department{" "}
                          <sup style={{ color: "red" }}>*</sup>
                        </option>
                        {subdepartmentList.map((list) => (
                          <option
                            key={list.SubDepartID}
                            value={list.SubDepartID}
                          >
                            {list.SubDepartName}
                          </option>
                        ))}
                      </select>
                      {notificationErrors.subDepartment && (
                        <p className="errormsg">
                          {notificationErrors.subDepartment}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row text-start mt-2">
                  <div className="form-group">
                    <select
                      class="form-select form-select-sm"
                      aria-label="Default select example"
                      name="designation"
                      value={notificationValues.designation}
                      onChange={handleChange}
                    >
                      <option disabled value="0" selected>
                        Select Designation <sup style={{ color: "red" }}>*</sup>
                      </option>
                      {designationList.map((list) => (
                        <option
                          key={list.DesignationID}
                          value={list.DesignationID}
                        >
                          {list.Designation}
                        </option>
                      ))}
                    </select>
                    {notificationErrors.designation && (
                      <p className="errormsg">
                        {notificationErrors.designation}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="row text-start ">
              <div className="form-group">
                <label htmlFor="title" style={darkText}>
                  Title <sup style={{ color: "red" }}>*</sup>
                </label>
                <input
                  id="title"
                  name="title"
                  value={notificationValues.title}
                  onChange={handleChange}
                  style={{ fontSize: "13px" }}
                  type="text"
                  className="form-control form-control-sm "
                />
                {notificationErrors.title && (
                  <p className="errormsg">{notificationErrors.title}</p>
                )}
              </div>
            </div>

            <div className="row text-start ">
              <div className="form-group">
                <label htmlFor="description" style={darkText}>
                  Description <sup style={{ color: "red" }}>*</sup>
                </label>
                <textarea
                  id="description"
                  value={notificationValues.description}
                  onChange={handleChange}
                  style={{ fontSize: "13px" }}
                  class="form-control ps-2"
                  name="description"
                  rows="3"
                  cols="12"
                ></textarea>
                {notificationErrors.description && (
                  <p className="errormsg">{notificationErrors.description}</p>
                )}
              </div>
            </div>

            <div className="row text-start ">
              <div className="col-6">
                <div className="form-group">
                  <label htmlFor="actionButton" style={darkText}>
                    Action Button
                  </label>
                  <input
                    id="actionButton"
                    name="actionButton"
                    value={notificationValues.actionButton}
                    onChange={handleChange}
                    style={{ fontSize: "13px" }}
                    type="text"
                    className="form-control form-control-sm "
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label htmlFor="actionUrl" style={darkText}>
                    Action URL
                  </label>
                  <input
                    id="actionUrl"
                    name="actionUrl"
                    value={notificationValues.actionUrl}
                    onChange={handleChange}
                    style={{ fontSize: "13px" }}
                    type="text"
                    className="form-control form-control-sm "
                  />
                </div>
              </div>
            </div>

            <div className="row text-start mt-1 ">
              <div className="text-start mb-1" style={{ fontSize: "12px" }}>
                Publish Date <sup style={{ color: "red" }}>*</sup>
              </div>
              {DFlag === "N" ? (
                <Calendar
                  className="form-control form-control-sm pt-0 pb-0 "
                  dateFormat="YYYY/MM/DD"
                  // defaultDate="2010/01/01"
                  theme="default"
                  language="en"
                  value={notificationValues.pubDate}
                  onChange={handleIssueDate}
                  name="pubDate"
                  //   hideDefaultValue={true}
                  //   placeholder={"Select Publish Date"}
                />
              ) : (
                <input
                  type="date"
                  value={notificationValues.pubDate}
                  placeholder="Select a Date"
                  className="form-control form-control-sm "
                  name="pubDate"
                  onChange={handleChange}
                />
              )}
              {notificationErrors.pubDate && (
                <p className="errormsg">{notificationErrors.pubDate}</p>
              )}
            </div>

            <div className="row text-start mb-2">
              <div className="form-group">
                <div className="form-group  ">
                  <div className="form-label" htmlFor="text" style={darkText}>
                    Add Image
                  </div>

                  <div className="BoxUpload">
                    <div className="image-upload">
                      {!isUploaded ? (
                        <>
                          <label htmlFor="upload-input">
                            <img
                              src={Plus}
                              draggable={"false"}
                              alt="placeholder"
                              style={{
                                width: 90,
                                height: 100,
                                paddingTop: "10px",
                              }}
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
              </div>
            </div>

            <div className="row text-start mt-1">
              <div className="form-group">
                <div class="form-check" style={darkText}>
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value="0"
                    id="fieldWork"
                    name="fieldWork"
                    checked={notificationValues.fieldWork}
                    // onChange={() => setFieldWork(!fieldWork)}
                  />
                  <label
                    style={{ fontSize: "12px", cursor: "pointer" }}
                    class="form-check-label"
                    htmlFor="fieldWork"
                  >
                    Notify Users
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* //   )} */}
          <div className="addcspopupFooter">
            <div className="row  mt-1 mb-1">
              <div>
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
        </div>
      </div>
    </>
  );
};

export default NotificationPopup;
