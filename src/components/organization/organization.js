import React, { useContext, useEffect, useRef, useState } from "react";
import "./organization.css";
// import AttendancePopup from "./attendancePopup";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import "@sbmdkl/nepali-datepicker-reactjs/dist/index.css";
import NepaliDate from "nepali-date-converter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../loading/spinner";
import DataTable from "react-data-table-component";
import AuthContext from "../context/auth-context";
import { Fetchdata } from "../hooks/getData";
import UpperbarContext from "../context/upperbar-context";
import AddOrganization from "./addOrganizationPopup";
import {
  GetEnglishDate,
  GetFromDate,
  GetNepaliDate,
  GetToDate,
} from "../hooks/dateConvertor";
import StaffContext from "../adminPanel/organization/staffState/StaffContext";

export default function Organization() {
  const { customStyles } = useContext(StaffContext)
  const { User } = useContext(AuthContext);
  // const { orgFormValues, setOrgFormValues } = useContext(OrganizationContext);
  const initalvalue = {
    orgType: "-1",
    source: "-1",
    from: GetFromDate(),
    to: GetToDate(),
  };
  const [orgFormValues, setOrgFormValues] = useState(initalvalue);
  const [OrgTypeList, setOrgTypeList] = useState([]);
  const [leedSrcList, setLeedSrcList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [organizationList, setOrganizationList] = useState(null);
  const [originalList, setOriginalList] = useState(null);
  const [reload, setReload] = useState(false);
  const [addPopup, setAddPopup] = useState(false);
  const [DFlag, setDFlag] = useState("N");
  const { fiscalYear, todayDate, appURL } = useContext(UpperbarContext);
  const [initialLoad, setInitialLoad] = useState(true);

  const columns = [
    {
      name: "S.N.",
      // grow: 0,
      width: "55px",
      center: true,
      cell: (row, index) => index + 1,
    },
    {
      name: "Organization",
      // grow: 0,
      width: "190px",
      // center: true,
      selector: (row) => row.OrgName,
    },
    // { name: "Date", grow: 0, center: true, selector: (row) => row.LeaveTitle },
    {
      name: "Type",
      width: "150px",
      grow: 1,
      center: true,
      selector: (row) => row.OrgType,
    },
    {
      name: "Address",
      // grow: 2,
      selector: (row) => row.Address,
    },
    {
      name: "Contact",
      grow: 0,
      center: true,
      selector: (row) => row.Phone,
    },
    {
      name: "Source",
      grow: 0,
      center: true,
      selector: (row) => row.Source,
    },
    {
      name: "FollowUp",
      grow: 0,
      center: true,
      selector: (row) => row.FollowCount,
    },
    {
      name: "Leads",
      grow: 0,
      center: true,
      selector: (row) => row.LeadCount,
    },
    {
      name: "Support",
      grow: 0,
      center: true,
      selector: (row) => row.SupportCount,
    },
    // {
    //   name: "Client",
    //   grow: 0,
    //   center: true,
    //   selector: (row) => row.TotalDays,
    // },
    // {
    //   name: "Action",
    //   center: true,
    //   width: "200px",
    //   selector: (row) => {
    //     return (
    //       <>
    //         <div className="ln-verition d-flex">
    //           <button
    //             type="button"
    //             class="btn btn-sm "
    //             style={{
    //               background: "var(--button-color)",
    //               color: "white",
    //             }}
    //             // onClick={() => updateRequest(row)}
    //           >
    //             Edit
    //           </button>
    //           <span className="pt-1">|</span>
    //           {/* {row.LeaveVerified === "unverified" && ( */}
    //           <button
    //             type="button"
    //             class="btn btn-sm "
    //             style={{
    //               background: "var(--button-color)",
    //               color: "white",
    //             }}
    //             // onClick={() => updateRequest(row)}
    //           >
    //             Activate
    //           </button>
    //           {/* )} */}
    //         </div>
    //       </>
    //     );
    //   },
    // },
  ];

  const getNepaliDate = () => {
    var news = new Date();
    var newss = news.toLocaleDateString();
    const nepDate = new NepaliDate(new Date(newss));
    var cm = nepDate.getMonth() + 1;

    var cd = nepDate.getDate();
    // 
    let strDate = nepDate.getYear() + "-" + cm + "-" + cd;
    // 
    return strDate;
  };

  // 
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

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setOrgFormValues({ ...orgFormValues, [name]: value });
  };

  useEffect(() => {
    // 

    // orgFormValues.from = getNepaliDate();
    // 

    if (
      orgFormValues.from &&
      orgFormValues.to &&
      orgFormValues.source &&
      orgFormValues.orgType
    ) {
      let enFrom = GetEnglishDate(orgFormValues.from);


      let enTo = GetEnglishDate(orgFormValues.to);


      const params = {
        FetchURL: `${appURL}api/all-org-list?ComID=${User.CompanyId}&UserID=${User.UID}&IsOurClient=0&FromDate=${enFrom}&ToDate=${enTo}&SourceID=${orgFormValues.source}&OrgType=${orgFormValues.orgType}`,
        Type: "GET",
      };

      Fetchdata(params)
        .then(function (result) {
          if (result.StatusCode === 200) {

            const postResult = result.OrgList ? result.OrgList : "";
            setOrganizationList(postResult);
            setOriginalList(postResult);
            setInitialLoad(false);
            setLoading(false);
          } else {
            setOrganizationList([]);

            setInitialLoad(false);
            setLoading(false);
          }
        })
        .catch((err) => {
          setOrganizationList([]);
          setInitialLoad(false);
          setLoading(false);
        });
    }
  }, [
    reload,
    orgFormValues.from,
    orgFormValues.to,
    orgFormValues.source,
    orgFormValues.orgType,
  ]);


  // const addOrganization = (e) => {
  //   setAddPopup(true);
  // };

  const handleFromDate = ({ bsDate }) => {
    let name = "from";
    setOrgFormValues({ ...orgFormValues, [name]: bsDate });
  };

  const handleToDate = ({ bsDate }) => {
    let name = "to";
    setOrgFormValues({ ...orgFormValues, [name]: bsDate });
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
      <div className="container-fluid orglst-wrapper  mt-3 ps-4 pe-4">
        <div className="row mt-3">
          <div className="page-header">
            <div className="text-start  page-title">Organization</div>
            <div className="page-date">
              <div className="sec-content">
                Today's Date : {todayDate} <span>|</span> Fiscal Year :{" "}
                {fiscalYear.StartDate}
                <span>-</span>
                {fiscalYear.EndDate}
              </div>
            </div>
          </div>
          <hr className="title-hr" />
        </div>
        <>
          {" "}
          <div className="sec-dataTable">
            <div className="row mb-1 ">
              <div className="col-md-3 col-sm-3 col-lg-3 sel-month">
                <div className="text-start mb-1" style={{ fontSize: "12px" }}>
                  Organization
                </div>
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example "
                  name="orgType"
                  onChange={handleChange}
                  value={orgFormValues.orgType}
                >
                  <option disabled value="" selected>
                    Select Organization Type
                  </option>
                  <option value="-1">All</option>
                  {OrgTypeList.map((list) => (
                    <>
                      <option key={list.OrgTypeID} value={list.OrgTypeID}>
                        {list.OrgTypeName}
                      </option>
                    </>
                  ))}
                </select>
              </div>

              <div className="col-md-3 col-sm-3 col-lg-3 sel-month">
                <div className="text-start mb-1" style={{ fontSize: "12px" }}>
                  Source
                </div>
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example "
                  name="source"
                  onChange={handleChange}
                  value={orgFormValues.source}
                >
                  <option disabled value="" selected>
                    Select Source
                  </option>
                  <option value="-1">All</option>
                  {leedSrcList.map((list) => (
                    <>
                      <option key={list.SourceID} value={list.SourceID}>
                        {list.SourceName}
                      </option>
                    </>
                  ))}
                </select>
              </div>

              <div className="col-md-3 col-sm-3 col-lg-3 sel-month">
                <div className="text-start mb-1" style={{ fontSize: "12px" }}>
                  From Date
                </div>
                {DFlag === "N" ? (
                  <Calendar
                    className="form-control form-control-sm pt-0 pb-0 "
                    dateFormat="YYYY/MM/DD"
                    // defaultDate="2010/01/01"
                    theme="default"
                    language="en"
                    value={orgFormValues.from}
                    onChange={handleFromDate}
                    name="date"
                    hideDefaultValue={true}
                    placeholder={orgFormValues.from}
                  />
                ) : (
                  <input
                    type="date"
                    value={orgFormValues.from}
                    placeholder="Select a Date"
                    className="form-control form-control-sm "
                    name="from"
                    onChange={handleChange}
                  />
                )}
              </div>

              <div className="col-md-3 col-sm-3 col-lg-3 sel-month">
                <div className="text-start mb-1" style={{ fontSize: "12px" }}>
                  To Date
                </div>
                {DFlag === "N" ? (
                  <Calendar
                    className="form-control form-control-sm pt-0 pb-0 "
                    dateFormat="YYYY/MM/DD"
                    // defaultDate="2010/01/01"
                    theme="default"
                    language="en"
                    value={orgFormValues.to}
                    // minDate={getNepaliDate()}
                    onChange={handleToDate}
                    name="date"
                    hideDefaultValue={true}
                    placeholder={orgFormValues.to}
                  />
                ) : (
                  <input
                    type="date"
                    name="to"
                    value={orgFormValues.to}
                    placeholder="Select a Date"
                    className="form-control form-control-sm "
                    onChange={handleChange}
                  />
                )}
              </div>
            </div>

            {/* <div className="upper-dataTbl ">
              <div className="btn-addlnote mb-3">
                <button
                  type="button"
                  class="btn btn-sm"
                  style={{
                    background: "var(--button-color)",
                    color: "white",
                  }}
                  onClick={addOrganization}
                >
                  Add Organization
                </button>
              </div>
            </div> */}
            <>
              {initialLoad ? (
                <div
                  className=" text-center d-flex flex-column justify-content-center align-items-center"
                  style={{ margin: "10% auto", width: "120px" }}
                >
                  <p className="initial-msg">Please provide input!</p>
                </div>
              ) : (
                <>
                  {loading ? (
                    <Spinner />
                  ) : (
                    <>
                      {" "}
                      <DataTable
                        columns={columns}
                        data={organizationList}
                        customStyles={customStyles}
                        pagination
                        fixedHeader
                        fixedHeaderScrollHeight="335px"
                        highlightOnHover
                        pointerOnHover
                        progressPending={loading}
                        responsive
                        // subHeader
                        dense
                        striped
                        subHeaderComponent={
                          <>
                            <div className="upper-dataTbl">
                              {/* <div className="d-flex">
                        <p className="pe-2">Search</p>
                        <input
                          ref={searchInput}
                          type="text"
                          class="form-control form-control-sm searchField"
                          placeholder=""
                          onChange={searchHandler}
                        />
                      </div> */}
                            </div>
                          </>
                        }
                      />
                    </>
                  )}
                </>
              )}
            </>
          </div>
        </>
      </div>
      {addPopup && (
        <AddOrganization
          DFlag={DFlag}
          reload={reload}
          setReload={setReload}
          setAddPopup={setAddPopup}
        />
      )}
    </>
  );
}
