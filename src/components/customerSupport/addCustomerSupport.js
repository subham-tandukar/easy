import React, { useContext, useEffect, useRef, useState } from "react";
import "./addCustomerSupport.css";
import CloseIcon from "../../images/CloseIcon.svg";
import Plus from "../../images/Plus.png";

import { Fetchdata } from "../hooks/getData";
import AuthContext from "../context/auth-context";
import NepaliDate from "nepali-date-converter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import "@sbmdkl/nepali-datepicker-reactjs/dist/index.css";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { Popover } from "@material-ui/core";

import {
  GetCurrTime,
  GetEnglishDate,
  GetNepaliDate,
  GetTwelveHourFormatTime,
} from "../hooks/dateConvertor";
import Spinner from "../loading/spinner";
import Select from "react-select";
import { BsInfoCircleFill } from "react-icons/bs";
import UpperbarContext from "../context/upperbar-context";

export default function AddCustomerSupport({
  setAddPopup,
  reload,
  setReload,
  DFlag,
}) {
  const initalvalue = {
    org: "",
    product: "",
    issue: "",
    issueDate: "",
    startTime: GetCurrTime(),
    endTime: GetCurrTime(),
    staff: "",
    status: "",
    medium: "",
    comment: "",
    remark: "",
    image: "",
  };

  const { appURL } = useContext(UpperbarContext);
  const { User } = useContext(AuthContext);
  const [formValues, setFormValues] = useState(initalvalue);
  const [formErrors, setformErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [orgList, setOrgList] = useState([]);
  const [orgStaffList, setOrgStaffList] = useState([]);
  const [orgPrdList, setOrgPrdList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isUploaded, setIsUploaded] = useState(false);
  const [typeFile, setTypeFile] = useState("");
  const [image, setImage] = useState("");
  const [selectOptions, setSelectOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [tooltipData, setTooltipData] = useState("");

  const [showPopOver, setShowPopOver] = useState(false);

  const getEnglishDate = (date) => {
    let nDate = new NepaliDate(date);

    let eDate = nDate.getAD();

    return `${eDate.year}-${eDate.month}-${eDate.date}`;
  };

  // function getCurrTime() {
  //   let date = new Date();
  //   // 
  //   let cur_time = date.toTimeString().split(" ")[0];
  //   return cur_time;
  // }
  // 

  // getCurrTime();

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const closePopUp = (e) => {
    setAddPopup(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setformErrors(validate(formValues));
    setIsSubmit(true);
  };

  useEffect(() => {
    const dataForm = {
      FetchURL: `${appURL}api/org-list?ComID=${User.CompanyId}&IsOurClient=0&UserID=${User.UID}`,
      Type: "GET",
    };

    Fetchdata(dataForm).then(function (result) {

      if (result.StatusCode === 200) {

        const postResult = result.OrgList;
        setOrgList(postResult);
      } else {

      }
    });
  }, []);

  useEffect(() => {
    if (orgList.length > 0 && loading) {
      orgList.map((list) => {
        let opt = {
          value: list.OrgId,
          label: list.OrgName,
        };
        selectOptions.push(opt);
      });
      setLoading(false);
    }
  }, [orgList]);


  useEffect(() => {
    const dataForm = {
      FetchURL: `${appURL}api/org-product?ComID=${User.CompanyId}&BranchID=${User.BranchId}`,
      Type: "GET",
    };

    Fetchdata(dataForm).then(function (result) {

      if (result.StatusCode === 200) {

        const postResult = result.OrganizationProducts;
        setOrgPrdList(postResult);
      } else {

      }
    });
  }, []);

  useEffect(() => {
    const dataForm = {
      FetchURL: `${appURL}api/org-staff?ComID=${User.CompanyId}&BranchID=${User.BranchId}&DepartmentId=${User.DepartmentID}&SubDepartmentId=${User.SubDepartmentID}`,
      Type: "GET",
    };

    Fetchdata(dataForm).then(function (result) {

      if (result.StatusCode === 200) {

        const postResult = result.OrganizationStaffs;
        setOrgStaffList(postResult);
      } else {

      }
    });
  }, []);

  const validate = (values) => {
    const errors = {};
    const ptn = /^\w+$/;
    const digitPtn = /[0-9]/;
    const alphaptn = /[a-z]/;
    const capalpha = /[A-Z]/;

    if (
      values.org &&
      values.product &&
      values.issue &&
      values.issueDate &&
      values.startTime &&
      values.endTime &&
      values.staff &&
      values.status &&
      values.medium
    ) {
      //code here
    } else {
      if (!values.org) {
        errors.org = "Required";
      }
      if (!values.product) {
        errors.product = "Required";
      }
      if (!values.issue) {
        errors.issue = "Required";
      }
      if (!values.issueDate) {
        errors.issueDate = "Required";
      }
      if (!values.startTime) {
        errors.startTime = "Required";
      }
      if (!values.endTime) {
        errors.endTime = "Required";
      }
      if (!values.staff) {
        errors.staff = "Required";
      }
      if (!values.status) {
        errors.status = "Required";
      }
      if (!values.medium) {
        errors.medium = "Required";
      }

      return errors;
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

  const handleIssueDate = ({ bsDate }) => {
    let name = "issueDate";
    setFormValues({ ...formValues, [name]: bsDate });
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {


      const dataForm = {
        ComID: User.CompanyId,
        UserID: User.UID,
        OrgID: formValues.org,
        ProductId: formValues.product,
        Issue: formValues.issue,
        IssueDate:
          DFlag === "N"
            ? GetEnglishDate(formValues.issueDate)
            : formValues.issueDate,
        StartTime: GetTwelveHourFormatTime(formValues.startTime),
        EndTime: GetTwelveHourFormatTime(formValues.endTime),
        Attachment: image ? image.split(",")[1] : null,
        AssignedTo: formValues.staff,
        SupportStatus: formValues.status,
        SupportMedium: formValues.medium,
        clientComment: formValues.comment,
        Remarks: formValues.remark,
        BranchID: User.BranchId,
        FiscalID: User.FiscalId,

        FetchURL: `${appURL}api/create-customer-support`,
        Type: "POST",
      };

      // 

      Fetchdata(dataForm).then(function (result) {

        if (result.StatusCode === 200) {

          setReload(!reload);
          toast(result.Message, {
            style: {
              color: "green",
              fontSize: "13px",
            },
          });
          setAddPopup(false);
        } else {
          toast("Error: " + result.Message, {
            style: {
              color: "red",
              fontSize: "13px",
            },
          });
          setformErrors({
            errorv: "Please enter valid credentials",
          });
        }
      });

      setIsSubmit(false);
    }
  }, [formErrors]);

  const handleSelectOrg = (e) => {

    setSelectedOptions(e.label);
    setSelectedId(e.value);
    setTooltipData("");

    let name = "org";
    setFormValues({ ...formValues, [name]: e.value });
  };

  const showTooltips = () => {
    // 
    if (selectedOptions && selectedId && tooltipData.length <= 0) {
      let srchResult = orgList.filter((list) => {
        return list.OrgId == selectedId;
      });

      setTooltipData(srchResult);
    }
    setShowPopOver(true);
  };

  const hideToolTips = () => {
    setShowPopOver(false);
  };

  const popContainer = () => {
    return (
      <div className="container popover-container">
        {/* <div className="popover-close">
          <img
            className="popoverCloseIcon"
            src={CloseIcon}
            alt="CloseIcon"
            onClick={() => setShowPopOver(false)}
          />
        </div> */}
        {tooltipData.length > 0 ? (
          <>
            <div className="popover-inner">
              <div className="row">
                <div className="col-md-6">
                  <div style={{ fontWeight: 600, fontSize: "14px" }}>
                    Organization
                  </div>
                  <div>{tooltipData[0].OrgName}</div>
                </div>
                <div className="col-md-6">
                  <div style={{ fontWeight: 600, fontSize: "14px" }}>Type</div>
                  <div>
                    {tooltipData[0].OrgType === null
                      ? "-"
                      : tooltipData[0].OrgType}
                  </div>
                </div>
              </div>

              <div className="row mt-1">
                <div className="col-md-6">
                  <div style={{ fontWeight: 600, fontSize: "14px" }}>
                    Address
                  </div>
                  <div>{tooltipData[0].Address}</div>
                </div>
                <div className="col-md-6">
                  <div style={{ fontWeight: 600, fontSize: "14px" }}>
                    Assigned To
                  </div>
                  <div>{tooltipData[0].StaffName}</div>
                </div>
              </div>

              <div className="row mt-1">
                <div className="col-md-6">
                  <div style={{ fontWeight: 600, fontSize: "14px" }}>
                    Contact Person
                  </div>
                  <div>{tooltipData[0].ContectPerson}</div>
                </div>
                <div className="col-md-6">
                  <div style={{ fontWeight: 600, fontSize: "14px" }}>
                    Contact
                  </div>
                  <div>{tooltipData[0].Phone}</div>
                </div>
              </div>

              <div className="row mt-1">
                <div className="col-md-4">
                  <div style={{ fontWeight: 600, fontSize: "14px" }}>Leed</div>
                  <div>{tooltipData[0].LeadCount}</div>
                </div>
                <div className="col-md-4">
                  <div style={{ fontWeight: 600, fontSize: "14px" }}>
                    Follow
                  </div>
                  <div>{tooltipData[0].FollowCount}</div>
                </div>
                <div className="col-md-4">
                  <div style={{ fontWeight: 600, fontSize: "14px" }}>
                    Support
                  </div>
                  <div>{tooltipData[0].SupportCount}</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="no-data">Please Select Organization</div>
        )}
      </div>
    );
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
        <div className="addcspopup-inner ">
          <div className="popUpHeader ps-0 pe-0">
            <div className="popUpTitle">Add Customer Support</div>
            <div className="popUpClose">
              <img
                className="popUpCloseIcon"
                src={CloseIcon}
                alt="CloseIcon"
                onClick={closePopUp}
              />
            </div>
          </div>
          {loading ? (
            <>
              <Spinner />
            </>
          ) : (
            <div className="addcspopupBody ps-3 pe-3">
              <div className="row text-start ">
                <div className="form-group">
                  <label htmlFor="orgName" style={{ fontSize: "12px" }}>
                    Organization <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <Select
                    defaultValue={selectedOptions}
                    onChange={handleSelectOrg}
                    name="orgName"
                    className="select-orgName"
                    options={selectOptions}
                    placeholder=""
                  />
                  <BsInfoCircleFill
                    size={18}
                    onMouseEnter={showTooltips}
                    onMouseLeave={hideToolTips}
                    className="org-tooltip"
                  />
                  {showPopOver && (
                    <div className="sec-popover">
                      {showPopOver && popContainer()}
                    </div>
                  )}

                  {formErrors.org && (
                    <p className="errormsg">{formErrors.org}</p>
                  )}
                </div>
              </div>

              <div className="row text-start ">
                <div className="form-group">
                  <label style={{ fontSize: "12px" }}>
                    Product <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <select
                    class="form-select form-select-sm"
                    aria-label="Default select example"
                    value={formValues.product}
                    name="product"
                    onChange={handleChange}
                  >
                    <option disabled value="" selected>
                      Select Product
                    </option>
                    {orgPrdList.map((list) => (
                      <>
                        <option key={list.ProductID} value={list.ProductID}>
                          {list.ProductName}
                        </option>
                      </>
                    ))}
                  </select>
                  {formErrors.product && (
                    <p className="errormsg">{formErrors.product}</p>
                  )}
                </div>
              </div>

              <div className="row text-start ">
                <div className="form-group">
                  <div className="form-group">
                    <label htmlFor="address" style={{ fontSize: "12px" }}>
                      Issue <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <input
                      id="address"
                      style={{ fontSize: "13px" }}
                      type="text"
                      className="form-control form-control-sm "
                      name="issue"
                      value={formValues.issue}
                      onChange={handleChange}
                    />
                    {formErrors.issue && (
                      <p className="errormsg">{formErrors.issue}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="row text-start mt-1 ">
                <div className="text-start mb-1" style={{ fontSize: "12px" }}>
                  Issue Date <sup style={{ color: "red" }}>*</sup>
                </div>
                {DFlag === "N" ? (
                  <Calendar
                    className="form-control form-control-sm pt-0 pb-0 "
                    dateFormat="YYYY/MM/DD"
                    defaultDate="2010/01/01"
                    theme="default"
                    language="en"
                    value={formValues.issueDate}
                    onChange={handleIssueDate}
                    name="issueDate"
                  // hideDefaultValue={true}
                  // placeholder={"Select Issue Date"}
                  />
                ) : (
                  <input
                    type="date"
                    value={formValues.enquiryDate}
                    placeholder="Select a Date"
                    className="form-control form-control-sm "
                    name="issueDate"
                    onChange={handleChange}
                  />
                )}
                {formErrors.issueDate && (
                  <p className="errormsg">{formErrors.issueDate}</p>
                )}
              </div>

              <div className="row text-start mt-1 ">
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="text-start mb-1" style={{ fontSize: "12px" }}>
                    Start Time <sup style={{ color: "red" }}>*</sup>
                  </div>
                  <input
                    type="time"
                    value={formValues.startTime}
                    // placeholder="Select Start Time"
                    className="form-control form-control-sm "
                    name="startTime"
                    onChange={handleChange}
                  />
                  {formErrors.startTime && (
                    <p className="errormsg">{formErrors.startTime}</p>
                  )}
                </div>
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="text-start mb-1" style={{ fontSize: "12px" }}>
                    End Time <sup style={{ color: "red" }}>*</sup>
                  </div>
                  <input
                    type="time"
                    value={formValues.endTime}
                    placeholder="Select End Time"
                    className="form-control form-control-sm "
                    name="endTime"
                    onChange={handleChange}
                  />
                  {formErrors.endTime && (
                    <p className="errormsg">{formErrors.endTime}</p>
                  )}
                </div>
              </div>

              <div className="row text-start ">
                <div className="form-group">
                  <label style={{ fontSize: "12px" }}>
                    Staff <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <select
                    class="form-select form-select-sm"
                    aria-label="Default select example"
                    value={formValues.staff}
                    name="staff"
                    onChange={handleChange}
                  >
                    <option disabled value="" selected>
                      Select Staff
                    </option>
                    {orgStaffList.map((list) => (
                      <>
                        <option key={list.StaffId} value={list.StaffId}>
                          {list.StaffName}
                        </option>
                      </>
                    ))}
                  </select>
                  {formErrors.staff && (
                    <p className="errormsg">{formErrors.staff}</p>
                  )}
                </div>
              </div>

              <div className="row text-start mt-1 ">
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="form-group">
                    <label htmlFor="landline" style={{ fontSize: "12px" }}>
                      Status <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <select
                      class="form-select form-select-sm"
                      aria-label="Default select example"
                      value={formValues.status}
                      name="status"
                      onChange={handleChange}
                    >
                      <option disabled value="" selected>
                        Select Status
                      </option>
                      <option value="1">Pending</option>
                      <option value="2">Success</option>
                      <option value="3">Failed</option>
                    </select>
                    {formErrors.status && (
                      <p className="errormsg">{formErrors.status}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="form-group">
                    <label htmlFor="mobile" style={{ fontSize: "12px" }}>
                      Medium <sup style={{ color: "red" }}>*</sup>
                    </label>

                    <select
                      class="form-select form-select-sm"
                      aria-label="Default select example"
                      value={formValues.medium}
                      name="medium"
                      onChange={handleChange}
                    >
                      <option disabled value="" selected>
                        Select Medium
                      </option>
                      <option value="1">Online</option>
                      <option value="2">Offline</option>
                    </select>
                    {formErrors.medium && (
                      <p className="errormsg">{formErrors.medium}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="row text-start ">
                <div className="form-group">
                  <label htmlFor="comment" style={{ fontSize: "12px" }}>
                    Client Comment
                  </label>
                  <textarea
                    id="comment"
                    value={formValues.comment}
                    onChange={handleChange}
                    style={{ fontSize: "13px" }}
                    class="form-control ps-2"
                    name="comment"
                    rows="3"
                    cols="12"
                  ></textarea>
                  {formErrors.comment && (
                    <p className="errormsg">{formErrors.comment}</p>
                  )}
                </div>
              </div>

              <div className="row text-start ">
                <div className="form-group">
                  <label htmlFor="remark" style={{ fontSize: "12px" }}>
                    Remark
                  </label>
                  <textarea
                    id="remark"
                    value={formValues.remark}
                    onChange={handleChange}
                    style={{ fontSize: "13px" }}
                    class="form-control ps-2"
                    name="remark"
                    rows="3"
                    cols="12"
                  ></textarea>
                  {formErrors.remark && (
                    <p className="errormsg">{formErrors.remark}</p>
                  )}
                </div>
              </div>

              <div className="row text-start mb-2">
                <div className="form-group">
                  <div className="form-group  ">
                    <div
                      className="form-label"
                      htmlFor="text"
                      style={{ fontSize: "12px" }}
                    >
                      Upload Image
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
            </div>
          )}
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
}
