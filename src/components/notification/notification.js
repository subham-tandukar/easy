import React, { useContext, useEffect, useRef, useState } from "react";
import "./notification.css";
import Spinner from "../loading/spinner";
import { Fetchdata } from "../hooks/getData";
import DataTable from "react-data-table-component";
import AuthContext from "../context/auth-context";
import { ShowImgPreview } from "../hooks/imagePreview";
import NepaliDate from "nepali-date-converter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewNotificationPopup from "./viewNotificationPopup";
import UpperbarContext from "../context/upperbar-context";
import { GetNepaliDate } from "../hooks/dateConvertor";
import StaffContext from "../adminPanel/organization/staffState/StaffContext";
import NotificationPopup from "./NotificationPopup";
import EditNotificationPopup from "./editNotificationPopup";
import { FaRegCalendarAlt } from "react-icons/fa";

export default function Notification() {
  const {
    customStyles,
    notificationList,
    setNotificationList,
    notificationValues,
    setNotificationValues,
    notificationErrors,
    setNotificationErrors,
    notificationPopup,
    setNotificationPopup,
    handleEdit,
    DFlag,
    setDFlag,
    editPopup,
    setEditPopup,
    deactivateNotify,
    chooseNotifyDepartment,
    chooseNotifySubDepartment,
    chooseNotifyDesignation,
    chooseNotifyFlag,
    setChooseNotifyDepartment,
    setChooseNotifyDesignation,
    setChooseNotifyFlag,
    setChooseNotifySubDepartment,
    loading,
    setLoading,
    notifyOriginalList,
  } = useContext(StaffContext);
  const { User } = useContext(AuthContext);

  const [imgPrv, setImgPrv] = useState(false);
  const [ImgPreview, setImgPreview] = useState("");
  const [selected_notification, setSelectedNotification] = useState("");
  const [viewPopup, setViewPopup] = useState(false);

  const [submit, setSubmit] = useState(false);
  const searchInput = useRef("");
  const { fiscalYear, todayDate, appURL, userDetails, darkText } =
    useContext(UpperbarContext);

  const addNotification = () => {
    setNotificationPopup(true);
    setNotificationValues("");
    setNotificationErrors({});
  };

  const handleAll = (e) => {
    setChooseNotifyDepartment("0");
    setChooseNotifyDesignation("0");
    setChooseNotifySubDepartment("0");

    const target = e.target;
    const name = target.name;
    const value = target.value;
    setChooseNotifyFlag(value);
  };
  const handleDepartment = (e) => {
    setChooseNotifyDesignation("0");
    setChooseNotifySubDepartment("0");

    const target = e.target;
    const name = target.name;
    const value = target.value;
    setChooseNotifyDepartment(value);
  };

  const handleSubDepartment = (e) => {
    setChooseNotifyDesignation("0");
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setChooseNotifySubDepartment(value);
  };

  const handleDesignation = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setChooseNotifyDesignation(value);
  };

  const columns = [
    {
      name: "S.N.",
      // grow: 0,
      width: "55px",
      center: true,
      cell: (row, index) => index + 1,
    },
    {
      name: "Title",
      // grow: 0,
      // center: true,
      selector: (row) => row.Title,
    },
    // { name: "Date", grow: 0, center: true, selector: (row) => row.LeaveTitle },
    {
      name: "Description",
      // grow: 1,
      width: "350px",
      // center: true,
      selector: (row) => row.Description,
    },
    {
      name: "Date",
      // grow: 1,
      center: true,
      selector: (row) => {
        return DFlag === "N"
          ? GetNepaliDate(row.PublishedDate)
          : row.PublishedDate;
      },
      // row.PublishedDate,
    },
    // {
    //   name: "Created By",
    //   // grow: 0,
    //   center: true,
    //   selector: (row) => row.CreatedBy,
    // },

    {
      name: "Action",
      center: true,
      width: "200px",
      selector: (row) => {
        return (
          <>
            <div className="ln-verition d-flex">
              {/* {row.Image !== "-" && (
                <button
                  type="button"
                  class="btn btn-sm"
                  style={{
                    background: "var(--button-color)",
                    color: "white",
                  }}
                  onClick={() => {
                    setImgPreview(row.Image);
                    setImgPrv(true);
                  }}
                >
                  View Image
                </button>
              )} */}
              {/* <span className="pt-1">|</span> */}
              <button
                type="button"
                class="btn my-1 btn-sm notispan"
                onClick={() => {
                  setSelectedNotification(row);
                  setViewPopup(true);
                }}
              >
                View
              </button>
              <button
                type="button"
                class="ms-2 my-1 btn btn-sm notispan bg-success"
                onClick={() => {
                  handleEdit(row);
                }}
              >
                Edit
              </button>
              <button
                type="button"
                class="btn btn-sm my-1 actvspan ms-2"
                onClick={() => changeStatus(row.NotificationID, row.Status)}
              >
                {checkStatus(row.Status)}
              </button>
              {/* <span className="pt-1">|</span>
              {row.AcBtn !== "-" && row.RedUrl !== "-" && (
                <button
                  type="button"
                  class="btn btn-sm"
                  style={{
                    background: "var(--button-color)",
                    color: "white",
                  }}
                  // onClick={addLeaveNote}
                >
                  Action
                </button>
              )} */}
            </div>
          </>
        );
      },
    },
  ];

  const changeStatus = (ID, IsActive) => {
    deactivateNotify(ID, IsActive);
  };

  const checkStatus = (IsActive) => {
    if (IsActive === 1) {
      return "Deactivate";
    } else if (IsActive === 0) {
      return "Activate";
    }
  };

  const searchHandler = (e) => {
    e.preventDefault();

    const srchQuery = searchInput.current.value.toLowerCase();
    if (srchQuery) {
      let srchResult = notifyOriginalList.filter((list) => {
        return list["Title"].toLowerCase().includes(srchQuery);
      });

      if (srchResult) {
        setNotificationList(srchResult);
      } else {
        setNotificationList([]);
      }
    } else {
      setNotificationList(notifyOriginalList);
    }
  };

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
  }, [chooseNotifyDepartment]);

  const subdeptList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: -1,
      DepartID: chooseNotifyDepartment,
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
  }, [chooseNotifyDepartment, chooseNotifySubDepartment]);

  const desgList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: -1,
      DepartID: chooseNotifyDepartment,
      SubDepartID: chooseNotifySubDepartment,
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
      <div className="container-fluid notification-wrapper mt-3 ps-4 pe-4">
        <div className="row ">
          <div className="page-header">
            <div className="text-start  page-title" style={darkText}>
              All Notification
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
            {loading ? (
              <>
                <Spinner />
              </>
            ) : (
              <DataTable
                columns={columns}
                data={notificationList}
                customStyles={customStyles}
                pagination
                fixedHeader
                fixedHeaderScrollHeight="350px"
                highlightOnHover
                pointerOnHover
                responsive
                // progressPending={loading}
                dense
                striped
                subHeader
                subHeaderComponent={
                  <>
                    <div className="uk-flex uk-flex-wrap">
                      <div className="upper-dataTbl me-2 mb-2">
                        <select
                          style={{ fontSize: "11px" }}
                          name="all"
                          value={chooseNotifyFlag}
                          onChange={handleAll}
                          className="form-control form-control-sm searchField"
                        >
                          <option value="a">All</option>
                          <option value="d">Department Wise</option>
                          <option value="s">Sub Department Wise</option>
                          {/* <option value="i">Individual</option> */}
                          <option value="de">Designation</option>
                        </select>
                      </div>
                      {chooseNotifyFlag === "d" && (
                        <div className="upper-dataTbl me-2 mb-2">
                          <select
                            style={{ fontSize: "11px" }}
                            name="department"
                            value={chooseNotifyDepartment}
                            onChange={handleDepartment}
                            className="form-control form-control-sm searchField"
                          >
                            <option
                              value="0"
                              disabled
                              selected
                              style={{ fontSize: "11px" }}
                            >
                              Select Department
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
                        </div>
                      )}

                      {chooseNotifyFlag === "s" && (
                        <>
                          <div className="upper-dataTbl me-2 mb-2">
                            <select
                              style={{ fontSize: "11px" }}
                              name="department"
                              value={chooseNotifyDepartment}
                              onChange={handleDepartment}
                              className="form-control form-control-sm searchField"
                            >
                              <option
                                value="0"
                                disabled
                                selected
                                style={{ fontSize: "11px" }}
                              >
                                Select Department
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
                          </div>
                          <div className="upper-dataTbl me-2 mb-2">
                            <select
                              style={{ fontSize: "11px" }}
                              name="subDepartment"
                              value={chooseNotifySubDepartment}
                              onChange={handleSubDepartment}
                              className="form-control form-control-sm searchField"
                            >
                              <option
                                value="0"
                                disabled
                                selected
                                style={{ fontSize: "11px" }}
                              >
                                Select Sub Department
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
                          </div>
                        </>
                      )}

                      {chooseNotifyFlag === "de" && (
                        <>
                          <div className="upper-dataTbl me-2 mb-2">
                            <select
                              style={{ fontSize: "11px" }}
                              name="department"
                              value={chooseNotifyDepartment}
                              onChange={handleDepartment}
                              className="form-control form-control-sm searchField"
                            >
                              <option
                                value="0"
                                disabled
                                selected
                                style={{ fontSize: "11px" }}
                              >
                                Select Department
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
                          </div>
                          <div className="upper-dataTbl me-2 mb-2">
                            <select
                              style={{ fontSize: "11px" }}
                              name="subDepartment"
                              value={chooseNotifySubDepartment}
                              onChange={handleSubDepartment}
                              className="form-control form-control-sm searchField"
                            >
                              <option
                                value="0"
                                disabled
                                selected
                                style={{ fontSize: "11px" }}
                              >
                                Select Sub Department
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
                          </div>

                          <div className="upper-dataTbl me-2 mb-2">
                            <select
                              style={{ fontSize: "11px" }}
                              name="designation"
                              value={chooseNotifyDesignation}
                              onChange={handleDesignation}
                              className="form-control form-control-sm searchField"
                            >
                              <option
                                value="0"
                                disabled
                                selected
                                style={{ fontSize: "11px" }}
                              >
                                Select Designation
                              </option>
                              {/* <option value="-1">All</option> */}
                              {designationList.map((item) => (
                                <option
                                  key={item.DesignationID}
                                  value={item.DesignationID}
                                >
                                  {item.Designation}
                                </option>
                              ))}
                            </select>
                          </div>
                        </>
                      )}

                      <div className="upper-dataTbl mb-2 me-2">
                        <div className="d-flex">
                          {/* <p className="pe-2">Search</p> */}
                          <input
                            ref={searchInput}
                            type="text"
                            class="form-control form-control-sm searchField"
                            placeholder="Search"
                            onChange={searchHandler}
                          />
                        </div>
                      </div>

                      {userDetails.IsManager !== 0 && (
                        <div className="upper-dataTbl">
                          <div className="btn-addlnote me-2 mb-2 mb-2">
                            <button
                              type="button"
                              class="btn btn-sm"
                              style={{
                                background: "var(--button-color)",
                                color: "white",
                              }}
                              onClick={addNotification}
                            >
                              Add Notification
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                }
              />
            )}
          </div>
        </>
      </div>
      {imgPrv &&
        ShowImgPreview({
          img: ImgPreview,
          setTrigger: setImgPrv,
        })}

      {selected_notification && viewPopup && (
        <ViewNotificationPopup
          notification={selected_notification}
          setViewPopup={setViewPopup}
          DFlag={DFlag}
        />
      )}

      {editPopup && (
        <EditNotificationPopup
          setEditPopup={setEditPopup}
          DFlag={DFlag}
          notificationValues={notificationValues}
          setNotificationValues={setNotificationValues}
          notificationErrors={notificationErrors}
          setNotificationErrors={setNotificationErrors}
        />
      )}

      {notificationPopup && (
        <NotificationPopup
          setNotificationPopup={setNotificationPopup}
          // crList={crList}
          DFlag={DFlag}
          notificationValues={notificationValues}
          setNotificationValues={setNotificationValues}
          notificationErrors={notificationErrors}
          setNotificationErrors={setNotificationErrors}
          submit={submit}
          setSubmit={setSubmit}
          // fetchNotification={fetchNotification}
          // image1={image1}
          // setImage1={setImage1}
          // chooseCooperative={chooseCooperative}
        />
      )}
    </>
  );
}
