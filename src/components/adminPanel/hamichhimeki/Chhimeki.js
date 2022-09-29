import React, { useContext, useEffect, useRef, useState } from "react";
import "../../profile/profile.css";
import DataTable, { defaultThemes } from "react-data-table-component";
// import { Fetchdata } from "../../../hooks/getData";
import AuthContext from "../../context/auth-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { ShowImgPreview } from "../../../hooks/imagePreview";
import Spinner from "../../loading/spinner";
import UpperbarContext from "../../context/upperbar-context";
import HamiChhimekiContext from "../hamichhimekiState/HamiChhimekiContext";
import ChhimekiPopup from "./ChhimekiPopup";
import { ShowImgPreview } from "../../hooks/imagePreview";
import ChhimekiEditPopup from "./ChhimekiEditPopup";
import StaffContext from "../../adminPanel/organization/staffState/StaffContext";
import { FaRegCalendarAlt } from "react-icons/fa";

export default function Chhimeki() {
  const { fiscalYear, todayDate, appURL, darkText } =
    useContext(UpperbarContext);
  const { customStylesForImage } = useContext(StaffContext);

  const {
    chhimekiFormValue,
    setChhimekiFormValue,
    chhimekivalue,
    popup,
    setPopup,
    chhimekiFormError,
    setChhimekiFormError,
    isSubmit,
    setIsSubmit,
    loading,
    setLoading,
    image,
    setImage,
    isUploaded,
    setIsUploaded,
    typeFile,
    setTypeFile,
    closeChecked,
    setCloseChecked,
    pushNotice,
    setPushNotice,
    editPop,
    setEditPop,
    handleEdit,
    isEditSubmit,
    setIsEditSubmit,
    chmList,
    chhimekiList,
    deactivateDepart,
    deactivateAgree,
    chhimekiURL,
    originalList,
    setOriginalList,
    setChhimekiList,
  } = useContext(HamiChhimekiContext);

  const { User } = useContext(AuthContext);

  const [imgPrv, setImgPrv] = useState(false);
  const [imagePre, setImagePre] = useState("");

  const searchInput = useRef("");

  const addLeaveNote = (e) => {
    setPopup(true);

    setChhimekiFormValue(chhimekivalue);
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
      name: "Name",
      // grow: 0,
      center: true,
      selector: (row) => row.Name,
    },

    {
      name: "Address",
      // grow: 0,
      center: true,
      selector: (row) => row.Address,
    },
    {
      name: "Contact",
      center: true,
      // grow: 0,
      selector: (row) => row.Contact,
    },
    {
      name: "Member",
      center: true,
      // grow: 0,
      selector: (row) => row.NoOfUser,
    },
    {
      name: "Created Date",
      center: true,
      // grow: 0,
      selector: (row) => row.CreatedDate,
    },
    {
      name: "Allow",
      center: true,
      // grow: 0,
      selector: (row) => row.IsAllow,
    },
    {
      name: "Expiry Date",
      center: true,
      // grow: 0,
      selector: (row) => row.ExpiryDate,
    },

    {
      name: "Action",
      grow: 1,
      center: true,
      width: "250px",
      selector: (row) => {
        return (
          <>
            <div className="ln-verition d-flex">
              <button
                type="button"
                class="btn btn-sm"
                style={{ background: "var(--button-color)", color: "white" }}
                onClick={() => handleEdit(row)}
              >
                View{" "}
              </button>{" "}
              |
              <button
                type="button"
                class="btn btn-sm"
                style={{
                  background: "red",
                  color: "white",
                  width: "80px",
                }}
                onClick={() => changeStatus(row.ChhimekiID, row.Status)}
              >
                {checkStatus(row.Status)}
              </button>
              |
              <button
                type="button"
                class="btn btn-sm"
                style={{
                  background: "green",
                  color: "white",
                  width: "180px",
                }}
                onClick={() => changeAgree(row.ChhimekiID, row.IsAllow)}
              >
                {checkAgree(row.IsAllow)}
              </button>
            </div>
          </>
        );
      },
    },
  ];

  const changeStatus = (ID, IsActive) => {
    deactivateDepart(ID, IsActive);
  };

  const checkStatus = (IsActive) => {
    if (IsActive === 1) {
      return "Deactivate";
    } else if (IsActive === 0) {
      return "Activate";
    }
  };

  // For change agree and disagree

  const changeAgree = (repID, IsActive) => {
    deactivateAgree(repID, IsActive);
  };

  const checkAgree = (IsActive) => {
    if (IsActive === "Y") {
      return "Disagree";
    } else if (IsActive === "N") {
      return "Agree";
    }
  };

  const searchHandler = (e) => {
    e.preventDefault();

    const srchQuery = searchInput.current.value.toLowerCase();

    if (srchQuery) {
      let srchResult = originalList.filter((list) => {
        return list["Name"].toLowerCase().includes(srchQuery);
      });

      if (srchResult) {
        setChhimekiList(srchResult);
      } else {
        setChhimekiList({});
      }
    } else {
      setChhimekiList(originalList);
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
              Hami Chhimeki
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
            <div className="upper-dataTbl">
              <div className="btn-addlnote mb-3">
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

            <DataTable
              columns={columns}
              data={chhimekiList}
              customStyles={customStylesForImage}
              pagination
              fixedHeader
              fixedHeaderScrollHeight="410px"
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
          </div>
        </>
      </div>

      {popup && <ChhimekiPopup />}

      {editPop && <ChhimekiEditPopup />}
      {imgPrv &&
        ShowImgPreview({
          img: imagePre,
          setTrigger: setImgPrv,
        })}
    </>
  );
}
