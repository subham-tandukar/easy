import React, { useContext, useEffect, useRef, useState } from "react";
import "./userActivity.css";
import Spinner from "../loading/spinner";
import { Fetchdata } from "../hooks/getData";
import DataTable from "react-data-table-component";
import AuthContext from "../context/auth-context";
import { ShowImgPreview } from "../hooks/imagePreview";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpperbarContext from "../context/upperbar-context";
import { GetNepaliDate } from "../hooks/dateConvertor";
import StaffContext from "../adminPanel/organization/staffState/StaffContext";

export default function UserActivity() {
  const { customStyles } = useContext(StaffContext)
  const { User } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [activityList, setActivityList] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [imgPrv, setImgPrv] = useState(false);
  const [ImgPreview, setImgPreview] = useState("");
  const searchInput = useRef("");
  const [DFlag, setDFlag] = useState("N");
  const { fiscalYear, todayDate } = useContext(UpperbarContext);

  useEffect(() => {
    const params = {
      FetchURL: `https://esnep.com/easyoffice/api/user-activity?ComID=${User.CompanyId}&UserID=${User.UID}&BranchID=${User.BranchId}&FiscalID=${User.FiscalId}`,
      Type: "GET",
    };

    Fetchdata(params)
      .then(function (result) {
        if (result.StatusCode === 200) {

          const postResult = result.UserAct ? result.UserAct : "";
          setActivityList(postResult);
          setOriginalList(postResult);
          setLoading(false);
        } else {
          setActivityList([]);

          setLoading(false);
        }
      })
      .catch((err) => {
        setActivityList([]);
        setLoading(false);
      });
  }, []);

  const columns = [
    {
      name: "S.N.",
      // grow: 0,
      width: "55px",
      center: true,
      cell: (row, index) => index + 1,
    },
    {
      name: "Date",
      center: true,
      width: "150px",
      selector: (row) =>
        DFlag === "N" ? GetNepaliDate(row.AcDate) : row.AcDate,
    },
    // { name: "Date", grow: 0, center: true, selector: (row) => row.LeaveTitle },
    {
      name: "Time",
      center: true,
      width: "150px",
      selector: (row) => row.AcTime,
    },
    {
      name: "Activity",
      //   grow: 1,
      //   width: "550px",
      center: true,
      selector: (row) => row.Remarks,
    },
  ];

  const searchHandler = (e) => {
    e.preventDefault();

    const srchQuery = searchInput.current.value.toLowerCase();
    if (srchQuery) {

      let srchResult = originalList.filter((list) => {
        return list["Holiday"].toLowerCase().includes(srchQuery);
      });

      if (srchResult) {

        setActivityList(srchResult);
      } else {
        setActivityList([]);
      }
    } else {
      setActivityList(originalList);
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
            <div className="text-start  page-title">User Activity</div>
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
        {loading ? (
          <Spinner />
        ) : (
          <>
            {" "}
            <div className="sec-dataTable">
              <DataTable
                columns={columns}
                data={activityList}
                customStyles={customStyles}
                pagination
                fixedHeader
                fixedHeaderScrollHeight="440px"
                highlightOnHover
                pointerOnHover
                responsive
                dense
                striped
              // subHeader
              // subHeaderComponent={
              //   <>
              //     <div className="upper-dataTbl">
              //       <div className="d-flex">
              //         {/* <p className="pe-2">Search</p> */}
              //         <input
              //           ref={searchInput}
              //           type="text"
              //           class="form-control form-control-sm searchField"
              //           placeholder="Search"
              //           onChange={searchHandler}
              //         />
              //       </div>
              //     </div>
              //   </>
              // }
              />
            </div>
          </>
        )}
      </div>
      {imgPrv &&
        ShowImgPreview({
          img: ImgPreview,
          setTrigger: setImgPrv,
        })}
    </>
  );
}
