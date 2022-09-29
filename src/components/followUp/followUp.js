import React, { useContext, useEffect, useRef, useState } from "react";
import "./followUp.css";
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
import {
  GetEnglishDate,
  GetFromDate,
  GetNepaliDate,
  GetToDate,
} from "../hooks/dateConvertor";
import AddFollowUp from "./addFollowUp";
import StaffContext from "../adminPanel/organization/staffState/StaffContext";
import { FaRegCalendarAlt } from "react-icons/fa";

export default function FollowUp() {
  const { customStyles } = useContext(StaffContext);
  const { User } = useContext(AuthContext);
  const initalFollowvalue = {
    followStatus: "-1",
    followType: "-1",
    orgType: "-1",
    client: "-1",
    from: GetFromDate(),
    to: GetToDate(),
  };

  const [followFormValues, setFollowFormValues] = useState(initalFollowvalue);
  const [OrgTypeList, setOrgTypeList] = useState([]);
  const [followTList, setFollowTList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followUpList, setFollowUpList] = useState(null);
  const [originalList, setOriginalList] = useState(null);
  const [reload, setReload] = useState(false);
  const [addPopup, setAddPopup] = useState(false);
  const [DFlag, setDFlag] = useState("N");
  const { fiscalYear, todayDate, appURL, darkText } =
    useContext(UpperbarContext);
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
      name: "Name",
      // grow: 0,
      width: "120px",
      // center: true,
      selector: (row) => row.ContactName,
    },
    {
      name: "Product",
      // grow: 0,
      center: true,
      width: "200px",
      selector: (row) => row.Product,
    },
    // { name: "Date", grow: 0, center: true, selector: (row) => row.LeaveTitle },
    // {
    //   name: "Type",
    //   width: "150px",
    //   grow: 1,
    //   center: true,
    //   selector: (row) => row.followTypeName,
    // },

    {
      name: "Follow For",
      // grow: 0,
      center: true,
      selector: (row) => row.FollowTypeName,
    },
    {
      name: "Follow Date",
      center: true,
      width: "120px",
      selector: (row) => row.FollowDate,
    },
    {
      name: "Follow Time",
      center: true,
      width: "120px",
      selector: (row) => row.FollowTime,
    },
    {
      name: "Follow Status",
      center: true,
      width: "120px",
      // grow: 2,
      selector: (row) => row.FollowStatus,
    },
    {
      name: "Assigned To",
      center: true,
      width: "120px",
      selector: (row) => row.StaffName,
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

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFollowFormValues({ ...followFormValues, [name]: value });
  };

  useEffect(() => {
    //
    if (followFormValues.from && followFormValues.to) {
      let enFrom =
        DFlag === "N"
          ? GetEnglishDate(followFormValues.from)
          : followFormValues.from;

      let enTo =
        DFlag === "N"
          ? GetEnglishDate(followFormValues.to)
          : followFormValues.to;

      const params = {
        FetchURL: `${appURL}api/follow-list?ComID=${User.CompanyId}&UserID=${User.UID}&IsOurClient=${followFormValues.client}&FromDate=${enFrom}&ToDate=${enTo}&OrgType=${followFormValues.orgType}&FollowType=${followFormValues.followType}&FollowStatus=${followFormValues.followStatus}&ToType=1`,
        Type: "GET",
      };

      Fetchdata(params)
        .then(function (result) {
          if (result.StatusCode === 200) {
            const postResult = result.FollowupLists ? result.FollowupLists : "";
            setFollowUpList(postResult);
            setOriginalList(postResult);
            setInitialLoad(false);
            setLoading(false);
          } else {
            setFollowUpList([]);

            setInitialLoad(false);
            setLoading(false);
          }
        })
        .catch((err) => {
          setFollowUpList([]);
          setInitialLoad(false);
          setLoading(false);
        });
    }
  }, [
    reload,
    followFormValues.from,
    followFormValues.to,
    followFormValues.followStatus,
    followFormValues.followType,
    followFormValues.client,
    followFormValues.orgType,
  ]);

  const addFollowUp = (e) => {
    setAddPopup(true);
  };

  const handleFromDate = ({ bsDate }) => {
    let name = "from";
    setFollowFormValues({ ...followFormValues, [name]: bsDate });
  };

  const handleToDate = ({ bsDate }) => {
    let name = "to";
    setFollowFormValues({ ...followFormValues, [name]: bsDate });
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
      <div className="container-fluid flwlst-wrapper  mt-3 ps-4 pe-4">
        <div className="row mt-3">
          <div className="page-header">
            <div className="text-start  page-title" style={darkText}>
              FollowUp
            </div>
            <div className="page-date">
              <div className="sec-content" style={darkText}>
                <FaRegCalendarAlt /> {todayDate} <span>|</span> Fiscal Year :{" "}
                {fiscalYear.StartDate}
                <span>-</span>
                {fiscalYear.EndDate}
              </div>
            </div>
          </div>
          <hr className="title-hr" />
        </div>
        <>
          <div className="sec-dataTable">
            <div className="row mb-1 ">
              <div className="col-md-2 col-sm-2 col-lg-2 sel-month">
                <div className="text-start mb-1" style={darkText}>
                  Status
                </div>
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example "
                  name="followStatus"
                  onChange={handleChange}
                  value={followFormValues.followStatus}
                >
                  <option disabled value="" selected>
                    Select Follow Status
                  </option>
                  <option value="-1">All</option>
                  <option value="1">Pending</option>
                  <option value="2">Success</option>
                  <option value="3">Failed</option>
                </select>
              </div>

              <div className="col-md-2 col-sm-2 col-lg-2 sel-month">
                <div className="text-start mb-1" style={darkText}>
                  Type
                </div>
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example "
                  name="followType"
                  onChange={handleChange}
                  value={followFormValues.followType}
                >
                  <option disabled value="" selected>
                    Select Follow Type
                  </option>
                  <option value="-1">All</option>
                  {followTList.map((list) => (
                    <>
                      <option key={list.FollowTypeID} value={list.FollowTypeID}>
                        {list.FollowTypeName}
                      </option>
                    </>
                  ))}
                </select>
              </div>

              <div className="col-md-2 col-sm-2 col-lg-2 sel-month">
                <div className="text-start mb-1" style={darkText}>
                  Organization
                </div>
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example "
                  name="orgType"
                  onChange={handleChange}
                  value={followFormValues.orgType}
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

              <div className="col-md-2 col-sm-2 col-lg-2 sel-month">
                <div className="text-start mb-1" style={darkText}>
                  Client Type
                </div>
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example "
                  name="client"
                  onChange={handleChange}
                  value={followFormValues.client}
                >
                  <option disabled value="" selected>
                    Select Client Type
                  </option>
                  <option value="-1">All</option>
                  <option value="0">Not Our Client</option>
                  <option value="1">Our Client</option>
                </select>
              </div>

              <div className="col-md-2 col-sm-2 col-lg-2 sel-month">
                <div className="text-start mb-1" style={darkText}>
                  From Date
                </div>
                {DFlag === "N" ? (
                  <Calendar
                    className="form-control form-control-sm pt-0 pb-0 "
                    dateFormat="YYYY/MM/DD"
                    // defaultDate="2010/01/01"
                    theme="default"
                    language="en"
                    value={followFormValues.from}
                    onChange={handleFromDate}
                    name="from"
                    hideDefaultValue={true}
                    placeholder={followFormValues.from}
                  />
                ) : (
                  <input
                    type="date"
                    value={followFormValues.from}
                    placeholder="Select a Date"
                    className="form-control form-control-sm "
                    name="from"
                    onChange={handleChange}
                  />
                )}
              </div>

              <div className="col-md-2 col-sm-2 col-lg-2 sel-month">
                <div className="text-start mb-1" style={darkText}>
                  To Date
                </div>
                {DFlag === "N" ? (
                  <Calendar
                    className="form-control form-control-sm pt-0 pb-0 "
                    dateFormat="YYYY/MM/DD"
                    // defaultDate="2010/01/01"
                    theme="default"
                    language="en"
                    value={followFormValues.to}
                    // minDate={getNepaliDate()}
                    onChange={handleToDate}
                    name="to"
                    hideDefaultValue={true}
                    placeholder={followFormValues.to}
                  />
                ) : (
                  <input
                    type="date"
                    name="to"
                    value={followFormValues.to}
                    placeholder="Select a Date"
                    className="form-control form-control-sm "
                    onChange={handleChange}
                  />
                )}
              </div>
            </div>
            <div className="upper-dataTbl">
              <div className="btn-addlnote mb-3">
                <button
                  type="button"
                  class="btn btn-sm"
                  style={{
                    background: "var(--button-color)",
                    color: "white",
                  }}
                  onClick={addFollowUp}
                >
                  Add FollowUp
                </button>
              </div>
            </div>
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
                        data={followUpList}
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
        <AddFollowUp
          DFlag={DFlag}
          reload={reload}
          setReload={setReload}
          setAddPopup={setAddPopup}
        />
      )}
    </>
  );
}
