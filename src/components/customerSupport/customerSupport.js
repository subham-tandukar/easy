import React, { useContext, useEffect, useRef, useState } from "react";
import "./customerSupport.css";
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
import AddCustomerSupport from "./addCustomerSupport";
import StaffContext from "../adminPanel/organization/staffState/StaffContext";

export default function CustomerSupport() {
  const { User } = useContext(AuthContext);
  const { customStylesForImage } = useContext(StaffContext)

  const initalvalue = {
    product: "-1",
    orgType: "-1",
    status: "-1",
    medium: "-1",
    from: GetFromDate(),
    to: GetToDate(),
  };
  const [formValues, setFormValues] = useState(initalvalue);
  const [OrgTypeList, setOrgTypeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [originalList, setOriginalList] = useState([]);
  const [cSupportList, setCSupportList] = useState([]);
  const [reload, setReload] = useState(false);
  const [addPopup, setAddPopup] = useState(false);
  const [DFlag, setDFlag] = useState("N");
  const { fiscalYear, todayDate, appURL } = useContext(UpperbarContext);
  const [initialLoad, setInitialLoad] = useState(true);
  const [orgPrdList, setOrgPrdList] = useState([]);

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
      width: "150px",
      // center: true,
      selector: (row) => row.OrganizationName,
    },
    // { name: "Date", grow: 0, center: true, selector: (row) => row.LeaveTitle },
    {
      name: "Product",
      width: "150px",
      grow: 1,
      center: true,
      selector: (row) => row.ProductName,
    },
    {
      name: "Issue",
      // grow: 2,
      selector: (row) => row.Issue,
    },
    {
      name: "Date",
      // grow: 0,
      center: true,
      selector: (row) => row.IssueDate,
    },
    {
      name: "Start",
      // grow: 0,
      center: true,
      selector: (row) => row.StartTime,
    },
    {
      name: "End",
      // grow: 0,
      center: true,
      selector: (row) => row.EndTime,
    },
    {
      name: "Status",
      grow: 0,
      center: true,
      selector: (row) => row.SupportStatus,
    },
    {
      name: "Medium",
      grow: 0,
      center: true,
      selector: (row) => row.SupportMedium,
    },
    {
      name: "Assigned To",
      // grow: 0,
      width: "200px",
      center: true,
      selector: (row) => row.StaffName,
    },

    // {
    //   name: "Client Comment",
    //   grow: 0,
    //   center: true,
    //   selector: (row) => row.LeadCount,
    // },
    // {
    //   name: "Remark",
    //   grow: 0,
    //   center: true,
    //   selector: (row) => row.LeadCount,
    // },
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
    //             View
    //           </button>
    //           {/* <span className="pt-1">|</span> */}
    //           {/* {row.LeaveVerified === "unverified" && ( */}
    //           {/* <button
    //             type="button"
    //             class="btn btn-sm "
    //             style={{
    //               background: "var(--button-color)",
    //               color: "white",
    //             }}
    //             // onClick={() => updateRequest(row)}
    //           >
    //             Activate
    //           </button> */}
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

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  useEffect(() => {
    // 
    if (formValues.from && formValues.to) {
      let enFrom =
        DFlag === "N" ? GetEnglishDate(formValues.from) : formValues.from;


      let enTo = DFlag === "N" ? GetEnglishDate(formValues.to) : formValues.to;


      const params = {
        FetchURL: `${appURL}api/csupport-list?ComID=${User.CompanyId}&UserID=${User.UID}&OrgID=${formValues.orgType}&Supportstatus=${formValues.status}&Supportmedium=${formValues.medium}&Fromdate=${enFrom}&Todate=${enTo}&ProductID=${formValues.product}`,
        Type: "GET",
      };

      Fetchdata(params)
        .then(function (result) {
          if (result.StatusCode === 200) {

            const postResult = result.Customerlist ? result.Customerlist : "";
            setCSupportList(postResult);
            setOriginalList(postResult);
            setInitialLoad(false);
            setLoading(false);
          } else {
            setCSupportList([]);

            setInitialLoad(false);
            setLoading(false);
          }
        })
        .catch((err) => {
          setCSupportList([]);
          setInitialLoad(false);
          setLoading(false);
        });
    }
  }, [
    reload,
    formValues.from,
    formValues.to,
    formValues.status,
    formValues.medium,
    formValues.orgType,
    formValues.product,
  ]);

  const addFollowUp = (e) => {
    setAddPopup(true);
  };

  const handleFromDate = ({ bsDate }) => {
    let name = "from";
    setFormValues({ ...formValues, [name]: bsDate });
  };

  const handleToDate = ({ bsDate }) => {
    let name = "to";
    setFormValues({ ...formValues, [name]: bsDate });
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
            <div className="text-start  page-title">Customer Support</div>
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
          <div className="sec-dataTable">
            <div className="row mb-1 ">
              <div className="col-md-2 col-sm-2 col-lg-2 sel-month">
                <div className="text-start mb-1" style={{ fontSize: "12px" }}>
                  Organization
                </div>
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example "
                  name="orgType"
                  onChange={handleChange}
                  value={formValues.orgType}
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
                <div className="text-start mb-1" style={{ fontSize: "12px" }}>
                  Product
                </div>
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
                  <option value="-1">All</option>
                  {orgPrdList.map((list) => (
                    <>
                      <option key={list.ProductID} value={list.ProductID}>
                        {list.ProductName}
                      </option>
                    </>
                  ))}
                </select>
              </div>

              <div className="col-md-2 col-sm-2 col-lg-2 sel-month">
                <div className="text-start mb-1" style={{ fontSize: "12px" }}>
                  Status
                </div>
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example "
                  name="status"
                  onChange={handleChange}
                  value={formValues.status}
                >
                  <option disabled value="" selected>
                    Select Support Status
                  </option>
                  <option value="-1">All</option>
                  <option value="1">Pending</option>
                  <option value="2">Success</option>
                  <option value="3">Failed</option>
                </select>
              </div>

              <div className="col-md-2 col-sm-2 col-lg-2 sel-month">
                <div className="text-start mb-1" style={{ fontSize: "12px" }}>
                  Medium
                </div>
                <select
                  class="form-select form-select-sm"
                  aria-label="Default select example "
                  name="medium"
                  onChange={handleChange}
                  value={formValues.medium}
                >
                  <option disabled value="" selected>
                    Select Support Medium
                  </option>
                  <option value="-1">All</option>
                  <option value="1">Online</option>
                  <option value="2">Offline</option>
                </select>
              </div>

              <div className="col-md-2 col-sm-2 col-lg-2 sel-month">
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
                    value={formValues.from}
                    onChange={handleFromDate}
                    name="from"
                    hideDefaultValue={true}
                    placeholder={formValues.from}
                  />
                ) : (
                  <input
                    type="date"
                    value={formValues.from}
                    placeholder="Select a Date"
                    className="form-control form-control-sm "
                    name="from"
                    onChange={handleChange}
                  />
                )}
              </div>

              <div className="col-md-2 col-sm-2 col-lg-2 sel-month">
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
                    value={formValues.to}
                    // minDate={getNepaliDate()}
                    onChange={handleToDate}
                    name="to"
                    hideDefaultValue={true}
                    placeholder={formValues.to}
                  />
                ) : (
                  <input
                    type="date"
                    name="to"
                    value={formValues.to}
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
                  Add Customer Support
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
                        data={cSupportList}
                        customStyles={customStylesForImage}
                        pagination
                        fixedHeader
                        fixedHeaderScrollHeight="335px"
                        highlightOnHover
                        pointerOnHover
                        progressPending={loading}
                        responsive
                        dense
                        striped
                      //   subHeader
                      //   subHeaderComponent={
                      //     <>
                      //       <div className="upper-dataTbl">
                      //         {/* <div className="d-flex">
                      //   <p className="pe-2">Search</p>
                      //   <input
                      //     ref={searchInput}
                      //     type="text"
                      //     class="form-control form-control-sm searchField"
                      //     placeholder=""
                      //     onChange={searchHandler}
                      //   />
                      // </div> */}
                      //       </div>
                      //     </>
                      //   }
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
        <AddCustomerSupport
          DFlag={DFlag}
          reload={reload}
          setReload={setReload}
          setAddPopup={setAddPopup}
        />
      )}
    </>
  );
}
