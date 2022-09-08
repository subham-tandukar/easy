import React, { useContext, useEffect, useRef, useState } from "react";
import "./holiday.css";
import Spinner from "../loading/spinner";
import { Fetchdata } from "../hooks/getData";
import DataTable from "react-data-table-component";
import AuthContext from "../context/auth-context";
import { ShowImgPreview } from "../hooks/imagePreview";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpperbarContext from "../context/upperbar-context";
import StaffContext from "../adminPanel/organization/staffState/StaffContext";


export default function Holiday() {
  const { customStyles } = useState(StaffContext)
  const { User } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [holidayList, setHolidayList] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [imgPrv, setImgPrv] = useState(false);
  const [ImgPreview, setImgPreview] = useState("");
  const searchInput = useRef("");
  const { fiscalYear, todayDate, appURL } = useContext(UpperbarContext);

  useEffect(() => {
    const params = {
      FetchURL: `${appURL}api/holiday?ComID=${User.CompanyId}&BranchID=${User.BranchId}`,
      Type: "GET",
    };

    Fetchdata(params)
      .then(function (result) {
        if (result.StatusCode === 200) {

          const postResult = result.Holidays ? result.Holidays : "";
          setHolidayList(postResult);
          setOriginalList(postResult);
          setLoading(false);
        } else {
          setHolidayList([]);

          setLoading(false);
        }
      })
      .catch((err) => {
        setHolidayList([]);
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
      name: "Event",
      grow: 1,
      // center: true,
      selector: (row) => row.Holiday,
    },
    // { name: "Date", grow: 0, center: true, selector: (row) => row.LeaveTitle },
    {
      name: "Date",
      grow: 1,
      center: true,
      selector: (row) => row.EnglishDate,
    },
    {
      name: "Date Remaining",
      grow: 1,
      center: true,
      selector: (row) => {
        return row.DaysRemaining === "Today"
          ? row.DaysRemaining
          : `${row.DaysRemaining} Days`;
      },
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

        setHolidayList(srchResult);
      } else {
        setHolidayList([]);
      }
    } else {
      setHolidayList(originalList);
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
            <div className="text-start  page-title">Holiday</div>
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
                data={holidayList}
                customStyles={customStyles}
                pagination
                fixedHeader
                fixedHeaderScrollHeight="350px"
                highlightOnHover
                pointerOnHover
                responsive
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
