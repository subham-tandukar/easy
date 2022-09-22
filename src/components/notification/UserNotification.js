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

export default function UserNotification() {
  const {
    customStyles,

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
    // chooseNotifyFlag,
    setChooseNotifyDepartment,
    setChooseNotifyDesignation,
    // setChooseNotifyFlag,
    setChooseNotifySubDepartment,
    loading,
    setLoading,
    // notifyOriginalList,
    // fetchNotification,
    // image1,
    // setImage1,
  } = useContext(StaffContext);
  const { User } = useContext(AuthContext);
  const [notificationList, setNotificationList] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [imgPrv, setImgPrv] = useState(false);
  const [ImgPreview, setImgPreview] = useState("");
  const [selected_notification, setSelectedNotification] = useState("");
  const [viewPopup, setViewPopup] = useState(false);

  const [submit, setSubmit] = useState(false);
  const searchInput = useRef("");
  const { fiscalYear, todayDate, appURL, userDetails } =
    useContext(UpperbarContext);

  useEffect(() => {
    const params = {
      FetchURL: `${appURL}api/notification-list?ComID=${User.CompanyId}&UserID=21`,
      Type: "GET",
    };

    Fetchdata(params)
      .then(function (result) {
        if (result.StatusCode === 200) {
          const postResult = result.NotificationList
            ? result.NotificationList
            : "";

          setNotificationList(postResult);
          setOriginalList(postResult);
          // console.log(notificationList, "A");
          setLoading(false);
        } else {
          setNotificationList([]);
          setLoading(false);
        }
      })
      .catch((err) => {
        setNotificationList([]);
        setLoading(false);
      });
  }, []);

  // sessionStorage.setItem("NotificationList", JSON.stringify(notificationList));

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
      selector: (row) =>
          {
            return DFlag === "N"
              ? GetNepaliDate(row.PublishedDate)
              : row.PublishedDate;
          },
        // row.PublishedDate,
    },
    {
      name: "Created By",
      // grow: 0,
      center: true,
      selector: (row) => row.CreatedBy,
    },

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
                class="btn btn-sm notispan"
                onClick={() => {
                  setSelectedNotification(row);
                  setViewPopup(true);
                }}
              >
                View
              </button>
            </div>
          </>
        );
      },
    },
  ];

  const searchHandler = (e) => {
    e.preventDefault();

    const srchQuery = searchInput.current.value.toLowerCase();
    if (srchQuery) {
      let srchResult = originalList.filter((list) => {
        return list["Title"].toLowerCase().includes(srchQuery);
      });

      if (srchResult) {
        setNotificationList(srchResult);
      } else {
        setNotificationList([]);
      }
    } else {
      setNotificationList(originalList);
    }
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
            <div className="text-start  page-title">All Notification</div>
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
                    <div className="upper-dataTbl">
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
    </>
  );
}
