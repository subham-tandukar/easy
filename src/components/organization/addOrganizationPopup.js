import React, { useContext, useEffect, useState } from "react";
import "./addOrganization.css";
import CloseIcon from "../../images/CloseIcon.svg";
import PlusIcon from "../../images/Plus.png";

import { Fetchdata } from "../hooks/getData";
import AuthContext from "../context/auth-context";
import NepaliDate from "nepali-date-converter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import "@sbmdkl/nepali-datepicker-reactjs/dist/index.css";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import {
  GetCurrTime,
  GetEnglishDate,
  GetNepaliDate,
  GetTwelveHourFormatTime,
} from "../hooks/dateConvertor";
import { MultiSelect } from "react-multi-select-component";
import Spinner from "../loading/spinner";
import UpperbarContext from "../context/upperbar-context";

export default function AddOrganization({
  setAddPopup,
  reload,
  setReload,
  DFlag,
}) {
  const initalvalue = {
    orgName: "",
    orgType: "",
    address: "",
    district: "",
    cPerson: "",
    landline: "",
    mobile: "",
    source: "",
    email: "",
    pan: "",
    website: "",
    username: "",
    latitude: "",
    longitude: "",
    cSystem: "",
    followfor: "",
    followDate: "",
    followtime: "",
    followStaff: "",
    followRemark: "",
    leedStatus: "",
    enquiryDate: "",
    enquiryTime: GetCurrTime(),
    leedStaff: "",
    leedRemark: "",
    quote: "",
    cloudBack: "",
    smsService: "",
    attSystem: "",
    software: "",
  };

  const { appURL, sidePanelBg } = useContext(UpperbarContext);
  const { User } = useContext(AuthContext);
  const [formValues, setFormValues] = useState(initalvalue);
  const [formErrors, setformErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [OrgTypeList, setOrgTypeList] = useState([]);
  const [orgStaffList, setOrgStaffList] = useState([]);
  const [leedSrcList, setLeedSrcList] = useState([]);
  const [orgPrdList, setOrgPrdList] = useState([]);
  const [followTList, setFollowTList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [viewMore, setViewMore] = useState(false);
  const [followUpInfo, setFollowUpInfo] = useState(false);

  const [selectPrdOpts, setSelectPrdOpts] = useState([]);
  const [selectedPrdOptions, setSelectedPrdOptions] = useState([]);

  console.log(selectedPrdOptions);

  const [toggleSystem, setToggleSystem] = useState({
    webToggle: false,
    softToggle: false,
    smsToggle: false,
    cBckToggle: false,
    attSystemToggle: false,
  });

  const [mediumType, setMediumType] = useState("");

  //

  const handleToggleSystem = (e) => {
    const { name } = e.target;
    //
    setToggleSystem({ ...toggleSystem, [name]: !toggleSystem[name] });
    if (name === "webToggle") {
      formValues.website = "";
    }
    if (name === "softToggle") {
      formValues.software = "";
    }
    if (name === "smsToggle") {
      formValues.smsService = "";
    }
    if (name === "cBckToggle") {
      formValues.cloudBack = "";
    }
    if (name === "attSystem") {
      formValues.attSystem = "";
    }
  };

  const getEnglishDate = (date) => {
    let nDate = new NepaliDate(date);

    let eDate = nDate.getAD();

    return `${eDate.year}-${eDate.month}-${eDate.date}`;
  };

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
      FetchURL: `${appURL}api/org-type?ComID=${User.CompanyId}&BranchID=${User.BranchId}`,
      Type: "GET",
    };

    Fetchdata(dataForm).then(function (result) {
      if (result.StatusCode === 200) {
        const postResult = result.OrganizationTypes;
        setOrgTypeList(postResult);
      } else {
      }
    });
  }, []);

  useEffect(() => {
    const dataForm = {
      FetchURL: `${appURL}api/lead-source?ComID=${User.CompanyId}&BranchID=${User.BranchId}`,
      Type: "GET",
    };

    Fetchdata(dataForm).then(function (result) {
      if (result.StatusCode === 200) {
        const postResult = result.LeadSources;
        setLeedSrcList(postResult);
      } else {
      }
    });
  }, []);

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
    if (orgPrdList.length > 0) {
      orgPrdList.map((list) => {
        let opt = {
          value: list.ProductID,
          label: list.ProductName,
        };
        selectPrdOpts.push(opt);
      });
      setLoading(false);
    }
  }, [orgPrdList]);

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
    if (followUpInfo) {
      if (
        values.orgName &&
        values.orgType &&
        values.address &&
        values.district &&
        values.cPerson &&
        values.mobile &&
        values.source &&
        values.followfor &&
        values.followDate &&
        values.followtime &&
        values.followStaff &&
        values.leedStatus &&
        values.enquiryDate &&
        values.enquiryTime &&
        selectedPrdOptions.length > 0 &&
        values.leedStaff &&
        values.leedRemark &&
        values.quote &&
        toggleSystem.webToggle &&
        toggleSystem.attSystemToggle &&
        toggleSystem.cBckToggle &&
        toggleSystem.smsToggle &&
        toggleSystem.softToggle &&
        mediumType
      ) {
        //code here
      } else {
        if (!values.orgName) {
          errors.orgName = "Required";
        }
        if (!values.orgType) {
          errors.orgType = "Required";
        }
        if (!values.address) {
          errors.address = "Required";
        }
        if (!values.district) {
          errors.district = "Required";
        }
        if (!values.cPerson) {
          errors.cPerson = "Required";
        }
        if (!values.mobile) {
          errors.mobile = "Required";
        }
        if (!values.source) {
          errors.source = "Required";
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
        if (!values.leedStatus) {
          errors.leedStatus = "Required";
        }
        if (!values.leedStaff) {
          errors.leedStaff = "Required";
        }
        if (!values.enquiryDate) {
          errors.enquiryDate = "Required";
        }
        if (!values.enquiryTime) {
          errors.enquiryTime = "Required";
        }
        if (selectedPrdOptions.length <= 0) {
          errors.product = "Required";
        }
        if (!values.leedRemark) {
          errors.leedRemark = "Required";
        }
        if (!values.quote) {
          errors.quote = "Required";
        }
        if (!mediumType) {
          errors.mediumType = "Required";
        }
        if (!values.cloudBack && toggleSystem.cBckToggle) {
          errors.cloudBack = "Required";
        }
        if (!values.smsService && toggleSystem.smsToggle) {
          errors.smsService = "Required";
        }
        if (!values.attSystem && toggleSystem.attSystemToggle) {
          errors.attSystem = "Required";
        }
        if (!values.software && toggleSystem.softToggle) {
          errors.software = "Required";
        }
        if (!values.website && toggleSystem.webToggle) {
          errors.website = "Required";
        }
        return errors;
      }
    } else {
      if (
        values.orgName &&
        values.orgType &&
        values.address &&
        values.district &&
        values.cPerson &&
        values.mobile &&
        values.source &&
        values.leedStatus &&
        values.enquiryDate &&
        values.enquiryTime &&
        selectedPrdOptions.length > 0 &&
        values.leedStaff &&
        values.leedRemark &&
        toggleSystem.webToggle &&
        toggleSystem.attSystemToggle &&
        toggleSystem.cBckToggle &&
        toggleSystem.smsToggle &&
        toggleSystem.softToggle &&
        mediumType
      ) {
        //code here
      } else {
        if (!values.orgName) {
          errors.orgName = "Required";
        }
        if (!values.orgType) {
          errors.orgType = "Required";
        }
        if (!values.address) {
          errors.address = "Required";
        }
        if (!values.district) {
          errors.district = "Required";
        }
        if (!values.cPerson) {
          errors.cPerson = "Required";
        }
        if (!values.mobile) {
          errors.mobile = "Required";
        }
        if (!values.source) {
          errors.source = "Required";
        }
        if (!values.leedStatus) {
          errors.leedStatus = "Required";
        }
        if (!values.leedStaff) {
          errors.leedStaff = "Required";
        }
        if (!values.enquiryDate) {
          errors.enquiryDate = "Required";
        }
        if (!values.enquiryTime) {
          errors.enquiryTime = "Required";
        }
        if (selectedPrdOptions.length <= 0) {
          errors.product = "Required";
        }
        if (!values.leedRemark) {
          errors.leedRemark = "Required";
        }
        if (!mediumType) {
          errors.mediumType = "Required";
        }
        if (!values.cloudBack && toggleSystem.cBckToggle) {
          errors.cloudBack = "Required";
        }
        if (!values.smsService && toggleSystem.smsToggle) {
          errors.smsService = "Required";
        }
        if (!values.attSystem && toggleSystem.attSystemToggle) {
          errors.attSystem = "Required";
        }
        if (!values.software && toggleSystem.softToggle) {
          errors.software = "Required";
        }
        if (!values.website && toggleSystem.webToggle) {
          errors.website = "Required";
        }
        return errors;
      }
    }
    return errors;
  };

  const handleEnquriyDate = ({ bsDate }) => {
    let name = "enquiryDate";
    setFormValues({ ...formValues, [name]: bsDate });
  };

  const handleFollowDate = ({ bsDate }) => {
    let name = "followDate";
    setFormValues({ ...formValues, [name]: bsDate });
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      let prdList = "";
      selectedPrdOptions.map((list) => {
        // selectedPrdList = selectedPrdList.concat(list.value);
        if (prdList === "") {
          prdList = prdList.concat(list.value);
        } else {
          prdList = prdList.concat(`,${list.value}`);
        }
      });
      const dataForm = {
        ComID: User.CompanyId,
        UserID: User.UID,
        OrgName: formValues.orgName,
        OrgType: parseInt(formValues.orgType),
        Address: formValues.address,
        District: parseInt(formValues.district),
        Landline: formValues.landline,
        ContactPerson: formValues.cPerson,
        Phone: formValues.landline,
        PersonContact: formValues.mobile,
        Email: formValues.email,
        PAN: formValues.pan,
        Website: formValues.website,
        Fb: formValues.username,
        Latitude: formValues.latitude ? formValues.latitude : "0",
        Longitude: formValues.longitude ? formValues.longitude : "0",

        CurrentSoftware: toggleSystem.softToggle ? formValues.software : "-1",
        CurrentAttend: toggleSystem.attSystemToggle
          ? formValues.attSystem
          : "-1",
        CurrentSms: toggleSystem.smsToggle ? formValues.smsService : "-1",
        CurrentCloud: toggleSystem.cBckToggle ? formValues.cloudBack : "-1",
        ClientType: mediumType,
        QuotePrice: formValues.quote,
        IFlag: followUpInfo ? "LF" : "L",
        SourceID: parseInt(formValues.source),
        ProductID: prdList,
        LeadStatus: parseInt(formValues.leedStatus),
        LAssignedTo: parseInt(formValues.leedStaff),
        EnquiryDate:
          DFlag === "N"
            ? GetNepaliDate(formValues.enquiryDate)
            : formValues.enquiryDate,
        // EnquiryDate: formValues.enquiryDate,
        EnquiryTime: GetTwelveHourFormatTime(formValues.enquiryTime),
        LRemarks: formValues.leedRemark,
        IsOurClient: 0,
        FollowType: formValues.followfor ? formValues.followfor : 0,
        FollowDate:
          DFlag === "N" && formValues.followDate
            ? GetEnglishDate(formValues.followDate)
            : formValues.followDate,
        // FollowDate: formValues.followDate,
        FollowTime: formValues.followtime
          ? GetTwelveHourFormatTime(formValues.followtime)
          : "",
        FAssignedTo: formValues.followStaff
          ? parseInt(formValues.followStaff)
          : 0,
        FRemarks: formValues.followRemark,
        BranchID: User.BranchId,
        FiscalID: User.FiscalId,

        FetchURL: `${appURL}api/create-org`,
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

  //

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
      <div className="container addorgpopup-wrapper">
        <div className="addorgpopup-inner ">
          <div className="popUpHeader ps-0 pe-0" style={sidePanelBg}>
            <div className="popUpTitle">Add Organization</div>
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
            <div className="addorgpopUpBody ps-3 pe-3">
              <div className="row text-start ">
                <div className="form-group">
                  <label htmlFor="orgName" style={{ fontSize: "12px" }}>
                    Organization Name <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <input
                    id="orgName"
                    style={{ fontSize: "13px" }}
                    type="text"
                    className="form-control form-control-sm "
                    name="orgName"
                    value={formValues.orgName}
                    onChange={handleChange}
                  />
                  {formErrors.orgName && (
                    <p className="errormsg">{formErrors.orgName}</p>
                  )}
                </div>
              </div>

              <div className="row text-start ">
                <div className="form-group">
                  <label style={{ fontSize: "12px" }}>
                    Organization Type <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <select
                    class="form-select form-select-sm"
                    aria-label="Default select example"
                    value={formValues.orgType}
                    name="orgType"
                    onChange={handleChange}
                  >
                    <option disabled value="" selected>
                      Select Organization Type
                    </option>
                    {OrgTypeList.map((list) => (
                      <>
                        <option key={list.OrgTypeID} value={list.OrgTypeID}>
                          {list.OrgTypeName}
                        </option>
                      </>
                    ))}
                  </select>
                  {formErrors.orgType && (
                    <p className="errormsg">{formErrors.orgType}</p>
                  )}
                </div>
              </div>

              <div className="row text-start mt-1 ">
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="form-group">
                    <label htmlFor="address" style={{ fontSize: "12px" }}>
                      Address <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <input
                      id="address"
                      style={{ fontSize: "13px" }}
                      type="text"
                      className="form-control form-control-sm "
                      name="address"
                      value={formValues.address}
                      onChange={handleChange}
                    />
                    {formErrors.address && (
                      <p className="errormsg">{formErrors.address}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="form-group">
                    <label style={{ fontSize: "12px" }}>
                      District <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <select
                      class="form-select form-select-sm"
                      aria-label="Default select example"
                      value={formValues.district}
                      name="district"
                      onChange={handleChange}
                    >
                      <option disabled value="" selected>
                        Select District
                      </option>
                      <option value="1">Kathmandu</option>
                      <option value="2">Bhaktapur</option>
                      <option value="3">Lalitpur</option>
                    </select>
                    {formErrors.district && (
                      <p className="errormsg">{formErrors.district}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="row text-start ">
                <div className="form-group">
                  <label htmlFor="cPerson" style={{ fontSize: "12px" }}>
                    Contact Person <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <input
                    id="cPerson"
                    style={{ fontSize: "13px" }}
                    type="text"
                    className="form-control form-control-sm "
                    name="cPerson"
                    value={formValues.cPerson}
                    onChange={handleChange}
                  />
                  {formErrors.cPerson && (
                    <p className="errormsg">{formErrors.cPerson}</p>
                  )}
                </div>
              </div>

              <div className="row text-start mt-1 ">
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="form-group">
                    <label htmlFor="landline" style={{ fontSize: "12px" }}>
                      LandLine
                    </label>
                    <input
                      id="landline"
                      style={{ fontSize: "13px" }}
                      type="text"
                      className="form-control form-control-sm "
                      name="landline"
                      value={formValues.landline}
                      onChange={handleChange}
                    />
                    {formErrors.landline && (
                      <p className="errormsg">{formErrors.landline}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="form-group">
                    <label htmlFor="mobile" style={{ fontSize: "12px" }}>
                      Mobile <sup style={{ color: "red" }}>*</sup>
                    </label>

                    <input
                      id="mobile"
                      style={{ fontSize: "13px" }}
                      type="text"
                      className="form-control form-control-sm "
                      name="mobile"
                      value={formValues.mobile}
                      onChange={handleChange}
                    />
                    {formErrors.mobile && (
                      <p className="errormsg">{formErrors.mobile}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="sec-scroll text-start mt-2 ">
                <div className="scrollBox">
                  <div className="scrollItem col-md-4 col-sm-4 col-lg-4 col-5 me-2">
                    <div className="sItemUpper">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="web"
                        name="webToggle"
                        checked={toggleSystem.webToggle}
                        onClick={handleToggleSystem}
                      />
                      <label
                        htmlFor="web"
                        className="item-label ms-1"
                        style={{ fontSize: "12px", cursor: "pointer" }}
                      >
                        Website
                      </label>
                    </div>
                    <div className="sItemLower">
                      <input
                        id="website"
                        style={{ fontSize: "13px" }}
                        type="text"
                        className="form-control form-control-sm "
                        name="website"
                        disabled={!toggleSystem.webToggle}
                        value={formValues.website}
                        onChange={handleChange}
                      />
                      {formErrors.website && (
                        <p className="errormsg">{formErrors.website}</p>
                      )}
                    </div>
                  </div>

                  <div className="scrollItem col-md-4 col-sm-4 col-lg-4 col-5 me-2">
                    <div className="sItemUpper">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="soft"
                        name="softToggle"
                        checked={toggleSystem.softToggle}
                        onClick={handleToggleSystem}
                      />
                      <label
                        htmlFor="soft"
                        className="item-label ms-1"
                        style={{ fontSize: "12px", cursor: "pointer" }}
                      >
                        Software
                      </label>
                    </div>
                    <div className="sItemLower">
                      <input
                        id="software"
                        style={{ fontSize: "13px" }}
                        type="text"
                        className="form-control form-control-sm "
                        name="software"
                        value={formValues.software}
                        onChange={handleChange}
                        disabled={!toggleSystem.softToggle}
                      />
                      {formErrors.software && (
                        <p className="errormsg">{formErrors.software}</p>
                      )}
                    </div>
                  </div>

                  <div className="scrollItem col-md-4 col-sm-4 col-lg-4 col-6 me-2">
                    <div className="sItemUpper">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="attSys"
                        name="attSystemToggle"
                        checked={toggleSystem.attSystemToggle}
                        onClick={handleToggleSystem}
                      />
                      <label
                        htmlFor="attSys"
                        className="item-label ms-1"
                        style={{ fontSize: "12px", cursor: "pointer" }}
                      >
                        Attendance System
                      </label>
                    </div>
                    <div className="sItemLower">
                      <input
                        id="attSystem"
                        style={{ fontSize: "13px" }}
                        type="text"
                        className="form-control form-control-sm "
                        name="attSystem"
                        value={formValues.attSystem}
                        onChange={handleChange}
                        disabled={!toggleSystem.attSystemToggle}
                      />
                      {formErrors.attSystem && (
                        <p className="errormsg">{formErrors.attSystem}</p>
                      )}
                    </div>
                  </div>

                  <div className="scrollItem col-md-4 col-sm-4 col-lg-4 col-5 me-2">
                    <div className="sItemUpper">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="smsS"
                        name="smsToggle"
                        checked={toggleSystem.smsToggle}
                        onClick={handleToggleSystem}
                      />
                      <label
                        htmlFor="smsS"
                        className="item-label ms-1"
                        style={{ fontSize: "12px", cursor: "pointer" }}
                      >
                        SMS Service
                      </label>
                    </div>
                    <div className="sItemLower">
                      <input
                        id="smsService"
                        style={{ fontSize: "13px" }}
                        type="text"
                        className="form-control form-control-sm "
                        name="smsService"
                        value={formValues.smsService}
                        disabled={!toggleSystem.smsToggle}
                        onChange={handleChange}
                      />
                      {formErrors.smsService && (
                        <p className="errormsg">{formErrors.smsService}</p>
                      )}
                    </div>
                  </div>

                  <div className="scrollItem col-md-4 col-sm-4 col-lg-4 col-5 me-2">
                    <div className="sItemUpper">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="cBckup"
                        name="cBckToggle"
                        style={{ fontSize: "14px" }}
                        checked={toggleSystem.cBckToggle}
                        onClick={handleToggleSystem}
                      />
                      <label
                        htmlFor="cBckup"
                        className="item-label ms-1"
                        style={{
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        Cloud BackUp
                      </label>
                    </div>
                    <div className="sItemLower">
                      <input
                        id="cloudBack"
                        style={{ fontSize: "13px" }}
                        type="text"
                        className="form-control form-control-sm "
                        name="cloudBack"
                        value={formValues.cloudBack}
                        disabled={!toggleSystem.cBckToggle}
                        onChange={handleChange}
                      />
                      {formErrors.cloudBack && (
                        <p className="errormsg">{formErrors.cloudBack}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row text-start mt-2 ">
                <div className="type-medium">
                  <div
                    className="type-text me-2"
                    style={{
                      fontSize: "14px",
                    }}
                  >
                    Type :
                  </div>

                  <div className="medium-radio">
                    <input
                      class="form-check-input"
                      type="radio"
                      value="0"
                      id="off"
                      name="mediumType"
                      style={{ fontSize: "14px" }}
                      onClick={() => setMediumType("0")}
                      // checked={toggleSystem.cBckToggle}
                      // onClick={handleToggleSystem}
                    />
                    <label
                      htmlFor="off"
                      className="item-label ms-1"
                      style={{
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      Offline
                    </label>
                  </div>

                  <div className="medium-radio">
                    <input
                      class="form-check-input"
                      type="radio"
                      value="1"
                      id="on"
                      name="mediumType"
                      style={{ fontSize: "14px" }}
                      onClick={() => setMediumType("1")}
                      // checked={toggleSystem.cBckToggle}
                      // onClick={handleToggleSystem}
                    />
                    <label
                      htmlFor="on"
                      className="item-label ms-1"
                      style={{
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      Online
                    </label>
                  </div>

                  <div className="medium-radio">
                    <input
                      class="form-check-input"
                      type="radio"
                      value="2"
                      id="bth"
                      name="mediumType"
                      style={{ fontSize: "14px" }}
                      // checked={toggleSystem.cBckToggle}
                      // onClick={handleToggleSystem}
                      onClick={() => setMediumType("2")}
                    />
                    <label
                      htmlFor="bth"
                      className="item-label ms-1"
                      style={{
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      Both
                    </label>
                  </div>
                </div>
                {formErrors.mediumType && (
                  <p className="errormsg">{formErrors.mediumType}</p>
                )}
              </div>

              {/* view more */}

              <div className="row text-start mt-2 ">
                <div>
                  <button
                    class="btn btn-primary btn-viewMore"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseExample"
                    aria-expanded="false"
                    aria-controls="collapseExample"
                    onClick={() => setViewMore(!viewMore)}
                    style={{
                      color: "white",
                      backgroundColor: "var(--button-color)",
                    }}
                  >
                    View More{" "}
                    {viewMore ? (
                      <FaAngleUp size={18} />
                    ) : (
                      <FaAngleDown size={18} />
                    )}
                  </button>
                </div>

                <div class="collapse" id="collapseExample">
                  <div
                    class="card card-body"
                    style={{ border: "none", padding: "0" }}
                  >
                    <div className="row text-start ">
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
                          value={formValues.email}
                          onChange={handleChange}
                        />
                        {formErrors.email && (
                          <p className="errormsg">{formErrors.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="row text-start mt-1 ">
                      <div className="col-md-6 col-sm-6 col-lg-6">
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
                            value={formValues.pan}
                            onChange={handleChange}
                          />
                          {formErrors.pan && (
                            <p className="errormsg">{formErrors.pan}</p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-6 col-lg-6">
                        <div className="form-group">
                          <label
                            htmlFor="username"
                            style={{ fontSize: "12px" }}
                          >
                            User Name
                          </label>
                          <div class="input-group">
                            <span
                              style={{ fontSize: "13px" }}
                              class="input-group-text "
                              id="basic-addon3"
                            >
                              facebook.com/
                            </span>
                            <input
                              type="text"
                              id="username"
                              style={{ fontSize: "13px" }}
                              class="form-control form-control-sm"
                              aria-describedby="basic-addon3"
                              name="username"
                              onChange={handleChange}
                            />
                          </div>
                          {formErrors.username && (
                            <p className="errormsg">{formErrors.username}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row text-start mt-1 ">
                      <div className="col-md-6 col-sm-6 col-lg-6">
                        <div className="form-group">
                          <label
                            htmlFor="latitude"
                            style={{ fontSize: "12px" }}
                          >
                            Latitude
                          </label>
                          <input
                            id="latitude"
                            style={{ fontSize: "13px" }}
                            type="text"
                            className="form-control form-control-sm "
                            name="latitude"
                            value={formValues.latitude}
                            onChange={handleChange}
                          />
                          {formErrors.latitude && (
                            <p className="errormsg">{formErrors.latitude}</p>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6 col-sm-6 col-lg-6">
                        <div className="form-group">
                          <label
                            htmlFor="longitude"
                            style={{ fontSize: "12px" }}
                          >
                            Longitude
                          </label>
                          <input
                            id="longitude"
                            style={{ fontSize: "13px" }}
                            type="text"
                            className="form-control form-control-sm "
                            name="longitude"
                            value={formValues.longitude}
                            onChange={handleChange}
                          />
                          {formErrors.longitude && (
                            <p className="errormsg">{formErrors.longitude}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row text-start mt-2 ">
                <label
                  htmlFor="landline"
                  style={{ fontSize: "14px", fontWeight: "600" }}
                >
                  Leeds Information
                </label>
              </div>

              <div className="row text-start mt-1 ">
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="form-group">
                    <label style={{ fontSize: "12px" }}>
                      Source<sup style={{ color: "red" }}>*</sup>
                    </label>
                    <select
                      class="form-select form-select-sm"
                      aria-label="Default select example"
                      value={formValues.source}
                      name="source"
                      onChange={handleChange}
                    >
                      <option disabled value="" selected>
                        Select Source
                      </option>
                      {leedSrcList.map((list) => (
                        <>
                          <option key={list.SourceID} value={list.SourceID}>
                            {list.SourceName}
                          </option>
                        </>
                      ))}
                    </select>
                    {formErrors.source && (
                      <p className="errormsg">{formErrors.source}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="form-group">
                    <label style={{ fontSize: "12px" }}>
                      Product <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <MultiSelect
                      options={selectPrdOpts}
                      value={selectedPrdOptions}
                      onChange={setSelectedPrdOptions}
                      labelledBy="Select Product"
                      hasSelectAll={false}
                    />
                    {formErrors.product && (
                      <p className="errormsg">{formErrors.product}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="row text-start mt-1 ">
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="form-group">
                    <label style={{ fontSize: "12px" }}>
                      Leed Status <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <select
                      class="form-select form-select-sm"
                      aria-label="Default select example"
                      value={formValues.leedStatus}
                      name="leedStatus"
                      onChange={handleChange}
                    >
                      <option disabled value="" selected>
                        Select Status
                      </option>
                      <option value="1">Pending</option>
                      <option value="2">Success</option>
                      <option value="3">Failed</option>
                    </select>
                    {formErrors.leedStatus && (
                      <p className="errormsg">{formErrors.leedStatus}</p>
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
                      value={formValues.leedStaff}
                      name="leedStaff"
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
                    {formErrors.leedStaff && (
                      <p className="errormsg">{formErrors.leedStaff}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="row text-start mt-1 ">
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="text-start mb-1" style={{ fontSize: "12px" }}>
                    Enquiry Date <sup style={{ color: "red" }}>*</sup>
                  </div>
                  {DFlag === "N" ? (
                    <Calendar
                      className="form-control form-control-sm pt-0 pb-0 "
                      dateFormat="YYYY/MM/DD"
                      // defaultDate="2010/01/01"
                      theme="default"
                      language="en"
                      value={formValues.enquiryDate}
                      onChange={handleEnquriyDate}
                      name="enquiryDate"
                      // hideDefaultValue={true}
                      // placeholder={"Select From Date"}
                    />
                  ) : (
                    <input
                      type="date"
                      value={formValues.enquiryDate}
                      placeholder="Select a Date"
                      className="form-control form-control-sm "
                      name="enquiryDate"
                      onChange={handleChange}
                    />
                  )}
                  {formErrors.enquiryDate && (
                    <p className="errormsg">{formErrors.enquiryDate}</p>
                  )}
                </div>
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="text-start mb-1" style={{ fontSize: "12px" }}>
                    Enquiry Time <sup style={{ color: "red" }}>*</sup>
                  </div>
                  <input
                    type="time"
                    value={formValues.enquiryTime}
                    placeholder="Select Follow Time"
                    className="form-control form-control-sm "
                    name="enquiryTime"
                    onChange={handleChange}
                  />
                  {formErrors.enquiryTime && (
                    <p className="errormsg">{formErrors.enquiryTime}</p>
                  )}
                </div>
              </div>

              <div className="row text-start ">
                <div className="form-group">
                  <label htmlFor="remark" style={{ fontSize: "12px" }}>
                    Remark <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <textarea
                    id="leedRemark"
                    value={formValues.leedRemark}
                    onChange={handleChange}
                    style={{ fontSize: "13px" }}
                    class="form-control ps-2"
                    name="leedRemark"
                    rows="3"
                    cols="12"
                  ></textarea>
                  {formErrors.leedRemark && (
                    <p className="errormsg">{formErrors.leedRemark}</p>
                  )}
                </div>
              </div>

              {/* followUp */}
              <div className="row text-start mt-1">
                <div className="form-group">
                  <div class="form-check" style={{ fontSize: "14px" }}>
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="fieldWork"
                      name="fieldWork"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseFollowup"
                      aria-expanded="false"
                      aria-controls="collapseFollowup"
                      onChange={() => {
                        setFollowUpInfo(!followUpInfo);
                        formValues.followfor = "";
                        formValues.followDate = "";
                        formValues.followtime = "";
                        formValues.followStaff = "";
                        formValues.remark = "";
                        formValues.quote = "";
                      }}
                      // checked={formValues.fieldWork}
                      // onChange={() => setFieldWork(!fieldWork)}
                    />
                    <label
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                      class="form-check-label"
                      htmlFor="fieldWork"
                    >
                      Follow Up Information
                    </label>
                  </div>
                </div>
              </div>

              <div class="collapse mb-1" id="collapseFollowup">
                <div
                  class="card card-body"
                  style={{ border: "none", padding: "0" }}
                >
                  <div className="row text-start ">
                    <div className="col-md-6 col-sm-6 col-lg-6">
                      <div className="form-group">
                        <label style={{ fontSize: "12px" }}>
                          Quote Price <sup style={{ color: "red" }}>*</sup>
                        </label>
                        <input
                          id="quote"
                          style={{ fontSize: "13px" }}
                          type="number"
                          className="form-control form-control-sm "
                          name="quote"
                          value={formValues.quote}
                          onChange={handleChange}
                        />
                        {formErrors.quote && (
                          <p className="errormsg">{formErrors.quote}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6 col-sm-6 col-lg-6">
                      <div className="form-group">
                        <label style={{ fontSize: "12px" }}>
                          Select Follow for{" "}
                          <sup style={{ color: "red" }}>*</sup>
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
                  </div>

                  <div className="row text-start mt-1 ">
                    <div className="col-md-6 col-sm-6 col-lg-6">
                      <div
                        className="text-start mb-1"
                        style={{ fontSize: "12px" }}
                      >
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
                          placeholder={"Select From Date"}
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
                      <div
                        className="text-start mb-1"
                        style={{ fontSize: "12px" }}
                      >
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
              </div>
            </div>
          )}
          <div className="addorgFooter">
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
