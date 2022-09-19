import React, { useContext, useEffect, useRef, useState } from "react";
import "./addFollowUp.css";
import CloseIcon from "../../images/CloseIcon.svg";
import { Fetchdata } from "../hooks/getData";
import AuthContext from "../context/auth-context";
import NepaliDate from "nepali-date-converter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import "@sbmdkl/nepali-datepicker-reactjs/dist/index.css";
import {
  GetCurrTime,
  GetEnglishDate,
  GetNepaliDate,
  GetTwelveHourFormatTime,
} from "../hooks/dateConvertor";
import Spinner from "../loading/spinner";
import Select from "react-select";
import { MultiSelect } from "react-multi-select-component";
import { BsInfoCircleFill } from "react-icons/bs";
import UpperbarContext from "../context/upperbar-context";

export default function AddFollowUp({ setAddPopup, reload, setReload, DFlag }) {
  const initalvalue = {
    orgName: "",
    product: "",
    followfor: "",
    followDate: "",
    followtime: "",
    followStaff: "",
    followRemark: "",
    followStatus: "",
    quote: "",
  };

  const { appURL, sidePanelBg } = useContext(UpperbarContext);
  const { User } = useContext(AuthContext);
  const [formValues, setFormValues] = useState(initalvalue);
  const [formErrors, setformErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [orgStaffList, setOrgStaffList] = useState([]);
  const [orgPrdList, setOrgPrdList] = useState([]);
  const [followTList, setFollowTList] = useState([]);
  const [orgList, setOrgList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectOptions, setSelectOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [tooltipData, setTooltipData] = useState("");
  const [showPopOver, setShowPopOver] = useState(false);

  //

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
    if (orgList.length > 0) {
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
      FetchURL: `${appURL}api/follow-type?ComID=${User.CompanyId}&BranchID=${User.BranchId}`,
      Type: "GET",
    };

    Fetchdata(dataForm).then(function (result) {
      if (result.StatusCode === 200) {
        const postResult = result.FollowupType;
        setFollowTList(postResult);
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
      values.orgName &&
      values.followfor &&
      values.followDate &&
      values.followtime &&
      values.followStaff &&
      values.followStatus &&
      values.product &&
      values.quote
    ) {
      //code here
    } else {
      if (!values.orgName) {
        errors.orgName = "Required";
      }
      if (!values.followfor) {
        errors.followfor = "Required";
      }
      if (!values.followDate) {
        errors.followDate = "Required";
      }
      if (!values.followtime) {
        errors.followtime = "Required";
      }
      if (!values.followStaff) {
        errors.followStaff = "Required";
      }
      if (!values.followStatus) {
        errors.followStatus = "Required";
      }
      if (!values.product) {
        errors.product = "Required";
      }
      if (!values.quote) {
        errors.quote = "Required";
      }
      return errors;
    }

    return errors;
  };

  const handleFollowDate = ({ bsDate }) => {
    let name = "followDate";
    setFormValues({ ...formValues, [name]: bsDate });
  };

  const handleSelectOrg = (e) => {
    setSelectedOptions(e.label);
    setSelectedId(e.value);
    setTooltipData("");

    let name = "orgName";
    setFormValues({ ...formValues, [name]: e.value });
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      const dataForm = {
        ComID: User.CompanyId,
        UserID: User.UID,
        ContactID: formValues.orgName,
        ToType: 1,
        ProductId: formValues.product,
        FollowDate:
          DFlag === "N" && formValues.followDate
            ? GetEnglishDate(formValues.followDate)
            : formValues.followDate,
        FollowTime: GetTwelveHourFormatTime(formValues.followtime),
        StaffID: formValues.followStaff,
        Remarks: formValues.followRemark,
        FollowStatus: formValues.followStatus,
        FollowType: formValues.followfor,
        BranchID: User.BranchId,
        FiscalID: User.FiscalId,

        FetchURL: "https://esnep.com/easyoffice/api/create-follow-up",
        Type: "POST",
      };

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
      <div className="container addfollowpopup-wrapper">
        <div className="addfollowpopup-inner ">
          <div className="popUpHeader ps-0 pe-0" style={sidePanelBg}>
            <div className="popUpTitle">Add FollowUp</div>
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
            <div className="addfollowpopupBody ps-3 pe-3">
              <div className="row text-start ">
                <div className="form-group">
                  <label htmlFor="orgName" style={{ fontSize: "12px" }}>
                    Organization Name <sup style={{ color: "red" }}>*</sup>
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

                  {formErrors.orgName && (
                    <p className="errormsg">{formErrors.orgName}</p>
                  )}
                </div>
              </div>
              <div className="row text-start mt-1 ">
                <div className="col-md-6 col-sm-6 col-lg-6">
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
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="form-group">
                    <label style={{ fontSize: "12px" }}>
                      Staff <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <select
                      class="form-select form-select-sm"
                      aria-label="Default select example"
                      value={formValues.followStaff}
                      name="followStaff"
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
                    {formErrors.followStaff && (
                      <p className="errormsg">{formErrors.followStaff}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="row text-start mt-1 ">
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="form-group">
                    <label style={{ fontSize: "12px" }}>
                      Select Follow for <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <select
                      class="form-select form-select-sm"
                      aria-label="Default select example"
                      value={formValues.followfor}
                      name="followfor"
                      onChange={handleChange}
                    >
                      <option disabled value="" selected>
                        Select Follow For
                      </option>
                      {followTList.map((list) => (
                        <>
                          <option
                            key={list.FollowTypeID}
                            value={list.FollowTypeID}
                          >
                            {list.FollowTypeName}
                          </option>
                        </>
                      ))}
                    </select>
                    {formErrors.followfor && (
                      <p className="errormsg">{formErrors.followfor}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="form-group">
                    <label style={{ fontSize: "12px" }}>
                      Follow Status <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <select
                      class="form-select form-select-sm"
                      aria-label="Default select example"
                      value={formValues.followStatus}
                      name="followStatus"
                      onChange={handleChange}
                    >
                      <option disabled value="" selected>
                        Select Follow Status
                      </option>
                      <option value="1">Pending</option>
                      <option value="2">Success</option>
                      <option value="3">Failed</option>
                    </select>
                    {formErrors.followStatus && (
                      <p className="errormsg">{formErrors.followStatus}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="row text-start ">
                <div className="form-group">
                  <label htmlFor="quote" style={{ fontSize: "12px" }}>
                    Quote Price <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <input
                    type="text"
                    value={formValues.quote}
                    placeholder=""
                    className="form-control form-control-sm "
                    name="quote"
                    id="quote"
                    onChange={handleChange}
                  />
                  {formErrors.quote && (
                    <p className="errormsg">{formErrors.quote}</p>
                  )}
                </div>
              </div>

              <div className="row text-start mt-1 ">
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="text-start mb-1" style={{ fontSize: "12px" }}>
                    Follow Date <sup style={{ color: "red" }}>*</sup>
                  </div>
                  {DFlag === "N" ? (
                    <Calendar
                      className="form-control form-control-sm pt-0 pb-0 "
                      dateFormat="YYYY/MM/DD"
                      // defaultDate="2010/01/01"
                      theme="default"
                      language="en"
                      value={formValues.followDate}
                      onChange={handleFollowDate}
                      name="followDate"
                      hideDefaultValue={true}
                      placeholder={"Select Follow Date"}
                    />
                  ) : (
                    <input
                      type="date"
                      value={formValues.followDate}
                      placeholder="Select a Date"
                      className="form-control form-control-sm "
                      name="followDate"
                      onChange={handleChange}
                    />
                  )}
                  {formErrors.followDate && (
                    <p className="errormsg">{formErrors.followDate}</p>
                  )}
                </div>
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="text-start mb-1" style={{ fontSize: "12px" }}>
                    Follow Time <sup style={{ color: "red" }}>*</sup>
                  </div>
                  <input
                    type="time"
                    value={formValues.followtime}
                    placeholder="Select Follow Time"
                    className="form-control form-control-sm "
                    name="followtime"
                    onChange={handleChange}
                  />
                  {formErrors.followtime && (
                    <p className="errormsg">{formErrors.followtime}</p>
                  )}
                </div>
              </div>

              <div className="row text-start ">
                <div className="form-group">
                  <label htmlFor="remark" style={{ fontSize: "12px" }}>
                    Remark
                  </label>
                  <textarea
                    id="followRemark"
                    value={formValues.followRemark}
                    onChange={handleChange}
                    style={{ fontSize: "13px" }}
                    class="form-control ps-2"
                    name="followRemark"
                    rows="3"
                    cols="12"
                  ></textarea>
                  {formErrors.followRemark && (
                    <p className="errormsg">{formErrors.followRemark}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="addfollowpopupFooter">
            <div className="row  mt-1 mb-1">
              <div>
                <button
                  type="button"
                  class="btn btn-sm me-2"
                  style={{
                    background: "var(--button-color)",
                    color: "white",
                  }}
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
