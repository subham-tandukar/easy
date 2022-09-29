import React, { useContext, useEffect, useRef, useState } from "react";
import "../../../profile/profile.css";
import DataTable from "react-data-table-component";
import { Fetchdata } from "../../../hooks/getData";
import AuthContext from "../../../context/auth-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShowImgPreview } from "../../../hooks/imagePreview";
import Spinner from "../../../loading/spinner";
import UpperbarContext from "../../../context/upperbar-context";
import CooperativeContext from "../cooperativeState/CooperativeContext";
import CooperativePopup from "./CooperativePopup";
import CooperativeEditPopup from "./CooperativeEditPopup";
import CategoryPopup from "./CategoryPopup";
import AssignCommissionPopup from "./AssignCommissionPopup";
import StaffContext from "../staffState/StaffContext";
import { FaRegCalendarAlt } from "react-icons/fa";

export default function Cooperative() {
  const { fiscalYear, todayDate, appURL, darkText } =
    useContext(UpperbarContext);
  const { customStylesForImage } = useContext(StaffContext);

  const {
    cooperativePopup,
    setCooperativePopup,
    cooperativeEditPopup,
    setCooperativeEditPopup,
    isSubmit,
    setIsSubmit,
    editIsSubmit,
    setEditIsSubmit,
    originalList,
    setOriginalList,
    allowApp,
    setAllowApp,
    loading,
    setLoading,
    cooperativeFormValue,
    setCooperativeFormValue,
    cooperativeFormError,
    setCooperativeFormError,
    cooperativevalue,
    editPop,
    cooperativeList,
    categoryPopup,
    setCategoryPopup,
    setAssignPopup,
    assignPopup,
    setCooperativeList,
    deactivateDepart,
    setCooCode,
    paidOption,
    setPaidOption,
    utilityOption,
    setUtilityOption,
    creditLimit,
    setCreditLimit,
    expiredOption,
    setExpiredOption,
    liveOption,
    setLiveoption,
    device,
    setDevice,
    status,
    setStatus,
    setAssignFormValue,
  } = useContext(CooperativeContext);

  const { User } = useContext(AuthContext);

  //   const [imgPrv, setImgPrv] = useState(false);
  //   const [imagePre, setImagePre] = useState("");

  //handle Changes for drop down in Cooperative list

  const handlePaidOption = (e) => {
    const target = e.target;
    const value = target.value;
    setPaidOption(value);
  };
  const handleUtlityOption = (e) => {
    const target = e.target;
    const value = target.value;
    setUtilityOption(value);
  };
  const handleCreditLimit = (e) => {
    const target = e.target;
    const value = target.value;
    setCreditLimit(value);
  };
  const handleExpiredOption = (e) => {
    const target = e.target;
    const value = target.value;
    setExpiredOption(value);
  };
  const handleLiveOption = (e) => {
    const target = e.target;
    const value = target.value;
    setLiveoption(value);
  };
  const handleDevice = (e) => {
    const target = e.target;
    const value = target.value;
    setDevice(value);
  };
  const handleStatus = (e) => {
    const target = e.target;
    const value = target.value;
    setStatus(value);
  };

  //handle changes in drop down in cooperative lidt end

  const searchInput = useRef("");

  const addLeaveNote = (e) => {
    setCooperativePopup(true);

    setCooperativeFormValue(cooperativevalue);
  };
  const addCategory = (e) => {
    setCategoryPopup(true);

    // setCooperativeFormValue(cooperativevalue);
  };

  const assignCommission = (data) => {
    setCooCode(data[0]);
    setAssignFormValue({
      assignComm: data[1],
    });
    setAssignPopup(true);
  };

  const [imgPrv, setImgPrv] = useState(false);
  const [imagePre, setImagePre] = useState("");

  const changeStatus = (ID, IsActive, coopcode) => {
    deactivateDepart(ID, IsActive, coopcode);
  };

  const checkStatus = (IsActive) => {
    if (IsActive === "Y") {
      return "Disallow";
    } else if (IsActive === "N") {
      return "Allow";
    }
  };

  const columns = [
    {
      name: "S.N.",
      grow: 0,
      center: true,
      cell: (row, index) => index + 1,
    },

    {
      name: "Logo",
      center: true,
      // grow: 0,
      selector: (row) => {
        return (
          <>
            <div className="staffContentLogo tl">
              <div className="staffImg tl">
                <img
                  src={row.Logo}
                  alt=""
                  onClick={() => {
                    setImagePre(row.Logo);
                    setImgPrv(true);
                  }}
                />
              </div>
            </div>
          </>
        );
      },
    },
    {
      name: "Coop. Code",
      // grow: 0,
      center: true,
      selector: (row) => row.cooperativeCode,
    },

    {
      name: "Coop. Name",
      // grow: 0,
      center: true,
      selector: (row) => row.cooperativeName,
    },
    {
      name: "Contact",
      center: true,
      // grow: 0,
      selector: (row) => row.contact,
    },
    {
      name: "Credit Limit",
      center: true,
      // grow: 0,
      selector: (row) => row.creditLimit,
    },
    {
      name: "No. of User",
      center: true,
      // grow: 0,
      selector: (row) => row.numOfUser,
    },
    {
      name: "Expiry Date",
      center: true,
      // grow: 0,
      selector: (row) => row.expiryDate,
    },
    {
      name: "Allow App",
      center: true,
      // grow: 0,
      selector: (row) => row.allowApp,
    },

    {
      name: "Action",
      grow: 4,
      center: true,
      width: "300px",
      selector: (row) => {
        return (
          <>
            <div className="ln-verition d-flex">
              <button
                type="button"
                class="btn btn-sm"
                style={{
                  background: "green",
                  color: "white",
                  width: "100px",
                }}
                onClick={() =>
                  assignCommission([row.cooperativeCode, row.categoryID])
                }
              >
                Assign Comm.{" "}
              </button>
              |
              <button
                type="button"
                class="btn btn-sm"
                style={{ background: "var(--button-color)", color: "white" }}
                onClick={() => editPop(row)}
              >
                View{" "}
              </button>{" "}
              |
              <button
                type="button"
                class="btn btn-sm"
                style={{ background: "var(--button-color)", color: "white" }}
                onClick={() =>
                  changeStatus(row.staffID, row.allowApp, row.cooperativeCode)
                }
              >
                {checkStatus(row.allowApp)}
              </button>{" "}
              |
              <button
                type="button"
                class="btn btn-sm"
                style={{ background: "var(--button-color)", color: "white" }}
                // onClick={() => changeAgree(row.SubDepartID, row.Status)}
              >
                Agree{" "}
              </button>{" "}
            </div>
          </>
        );
      },
    },
  ];

  //   const changeStatus = (ID, IsActive) => {
  //     deactivateDepart(ID, IsActive);
  //   };

  //   const checkStatus = (IsActive) => {
  //     if (IsActive === 1) {
  //       return "Deactivate";
  //     } else if (IsActive === 0) {
  //       return "Activate";
  //     }
  //   };

  const searchHandler = (e) => {
    e.preventDefault();

    const srchQuery = searchInput.current.value.toLowerCase();

    if (srchQuery) {
      let srchResult = originalList.filter((list) => {
        return list["cooperativeName"].toLowerCase().includes(srchQuery);
      });

      if (srchResult) {
        setCooperativeList(srchResult);
      } else {
        setCooperativeList({});
      }
    } else {
      setCooperativeList(originalList);
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
      <div className="container-fluid classatten-wrapper  mt-3 ps-4 pe-4">
        <div className="row mt-3">
          <div className="page-header">
            <div className="text-start  page-title" style={darkText}>
              Cooperative
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
            <div className="upper-btn">
              <div className="btn-addlnote mb-2 ">
                <button
                  type="button"
                  class="btn btn-sm"
                  style={{
                    background: "var(--button-color)",
                    color: "white",
                    marginRight: "3px",
                  }}
                  onClick={addCategory}
                >
                  Add Category
                </button>
              </div>

              <div className="btn-addlnote mb-2">
                <button
                  type="button"
                  class="btn btn-sm"
                  style={{
                    background: "var(--button-color)",
                    color: "white",
                  }}
                  onClick={addLeaveNote}
                >
                  Add New
                </button>
              </div>
            </div>
            {loading ? (
              <Spinner />
            ) : (
              <DataTable
                columns={columns}
                data={cooperativeList}
                customStyles={customStylesForImage}
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
                    <div className="col-md-2 col-sm-2 col-lg-2 me-2">
                      <label style={darkText} className="d-block uk-text-left">
                        Paid Option
                      </label>
                      <select
                        style={{ fontSize: "11px" }}
                        name="paidOption"
                        className="form-select form-select-sm"
                        aria-label="Default select example "
                        value={paidOption}
                        onChange={handlePaidOption}
                      >
                        <option
                          selected
                          disabled
                          value=""
                          style={{ fontSize: "11px" }}
                        >
                          Select Paid Option
                        </option>
                        <option value="-1">All</option>
                        <option value="Y">Yes</option>
                        <option value="N">No</option>
                      </select>
                    </div>

                    <div className="col-md-2 col-sm-2 col-lg-2 me-2">
                      <label style={darkText} className="d-block uk-text-left">
                        Utility Option
                      </label>
                      <select
                        style={{ fontSize: "11px" }}
                        name="utilityOption"
                        className="form-select form-select-sm"
                        aria-label="Default select example "
                        value={utilityOption}
                        onChange={handleUtlityOption}
                      >
                        <option
                          selected
                          disabled
                          value=""
                          style={{ fontSize: "11px" }}
                        >
                          Select Utility Option
                        </option>
                        <option value="-1">All</option>
                        <option value="Y">Yes</option>
                        <option value="N">No</option>
                      </select>
                    </div>

                    <div className="col-md-2 col-sm-2 col-lg-2 me-2">
                      <label style={darkText} className="d-block uk-text-left">
                        Credit Limit
                      </label>
                      <select
                        style={{ fontSize: "11px" }}
                        name="creditLimit"
                        className="form-select form-select-sm"
                        aria-label="Default select example "
                        value={creditLimit}
                        onChange={handleCreditLimit}
                      >
                        <option
                          selected
                          disabled
                          value=""
                          style={{ fontSize: "11px" }}
                        >
                          Select Credit Limit
                        </option>
                        <option value="-1">All</option>
                        <option value="L5K">Less than 5K</option>
                      </select>
                    </div>

                    <div className="col-md-2 col-sm-2 col-lg-2 me-2">
                      <label style={darkText} className="d-block uk-text-left">
                        Expiry Date
                      </label>
                      <select
                        style={{ fontSize: "11px" }}
                        name="expiredOption"
                        className="form-select form-select-sm"
                        aria-label="Default select example "
                        value={expiredOption}
                        onChange={handleExpiredOption}
                      >
                        <option
                          selected
                          disabled
                          value=""
                          style={{ fontSize: "11px" }}
                        >
                          Select Expiry Option
                        </option>
                        <option value="-1">All</option>
                        <option value="Y">Yes</option>
                        <option value="N">No</option>
                      </select>
                    </div>

                    <div className="col-md-2 col-sm-2 col-lg-2 me-2">
                      <label style={darkText} className="d-block uk-text-left">
                        Live
                      </label>
                      <select
                        style={{ fontSize: "11px" }}
                        name="liveOption"
                        className="form-select form-select-sm"
                        aria-label="Default select example "
                        value={liveOption}
                        onChange={handleLiveOption}
                      >
                        <option
                          selected
                          disabled
                          value=""
                          style={{ fontSize: "11px" }}
                        >
                          Select Live Option
                        </option>
                        <option value="-1">All</option>
                        <option value="Y">Yes</option>
                        <option value="N">No</option>
                      </select>
                    </div>

                    <div className="col-md-2 col-sm-2 col-lg-2 me-2">
                      <label style={darkText} className="d-block uk-text-left">
                        Status
                      </label>
                      <select
                        style={{ fontSize: "11px" }}
                        name="status"
                        className="form-select form-select-sm"
                        aria-label="Default select example "
                        value={status}
                        onChange={handleStatus}
                      >
                        <option
                          selected
                          disabled
                          value=""
                          style={{ fontSize: "11px" }}
                        >
                          Select Status
                        </option>
                        <option value="-1">All</option>
                        <option value="Y">Yes</option>
                        <option value="N">No</option>
                        <option value="R">Rejected</option>
                      </select>
                    </div>

                    <div className="col-md-2 col-sm-2 col-lg-2 me-2">
                      <label style={darkText} className="d-block uk-text-left">
                        Device
                      </label>
                      <select
                        style={{ fontSize: "11px" }}
                        name="device"
                        className="form-select form-select-sm"
                        aria-label="Default select example "
                        value={device}
                        onChange={handleDevice}
                      >
                        <option
                          selected
                          disabled
                          value=""
                          style={{ fontSize: "11px" }}
                        >
                          Select Device
                        </option>
                        <option value="-1">All</option>
                        <option value="A">Android</option>
                        <option value="I">IOS</option>
                      </select>
                    </div>

                    <div className="col-md-2 col-sm-2 col-lg-2 ">
                      <div className="d-flex" style={{ paddingTop: "15px" }}>
                        <input
                          placeholder="Search"
                          ref={searchInput}
                          type="text"
                          className="form-control form-control-sm searchField"
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

      {cooperativePopup && <CooperativePopup />}

      {cooperativeEditPopup && <CooperativeEditPopup />}
      {categoryPopup && <CategoryPopup />}
      {assignPopup && <AssignCommissionPopup />}
      {imgPrv &&
        ShowImgPreview({
          img: imagePre,
          setTrigger: setImgPrv,
        })}
    </>
  );
}
