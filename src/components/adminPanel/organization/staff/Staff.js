import React, { useContext, useEffect, useRef, useState } from "react";
import "../../../profile/profile.css";
import DataTable from "react-data-table-component";
import { Fetchdata } from "../../../hooks/getData";
import AuthContext from "../../../context/auth-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StaffPopup from "./StaffPopup";
import StaffContext from "../staffState/StaffContext";
import StaffEditPopup from "./StaffEditPopup";
import { ShowImgPreview } from "../../../hooks/imagePreview";
import Spinner from "../../../loading/spinner";
import UpperbarContext from "../../../context/upperbar-context";
import { FaRegCalendarAlt } from "react-icons/fa";
export default function Staff() {
  const { fiscalYear, todayDate, appURL, darkText } =
    useContext(UpperbarContext);

  const {
    staffPopup,
    setStaffPopup,
    staffEditPopup,
    setStaffEditPopup,
    setStaffFormValue,
    staffValue,
    staffList,
    editPop,
    deactivateDepart,
    originalList,
    setOriginalList,
    setStaffList,
    chooseDepartment,
    setChooseDepartment,
    chooseSubDepartment,
    setChooseSubDepartment,
    chooseDesignation,
    setChooseDesignation,
    loading,
    setLoading,
    customStylesForImage,
  } = useContext(StaffContext);

  const { User } = useContext(AuthContext);

  const [imgPrv, setImgPrv] = useState(false);
  const [imagePre, setImagePre] = useState("");

  const searchInput = useRef("");

  const addLeaveNote = (e) => {
    setStaffPopup(true);

    setStaffFormValue(staffValue);
  };

  const handleDepartment = (e) => {
    setChooseDesignation("");
    setChooseSubDepartment("");

    const target = e.target;
    const name = target.name;
    const value = target.value;
    setChooseDepartment(value);
  };

  const handleSubDepartment = (e) => {
    setChooseDesignation("");
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setChooseSubDepartment(value);
  };

  const handleDesignation = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setChooseDesignation(value);
  };

  const columns = [
    {
      name: "S.N.",
      grow: 0,
      center: true,
      cell: (row, index) => index + 1,
    },
    {
      name: "Image",
      // grow: 0,
      center: true,
      selector: (row) => {
        return (
          <>
            <div className="staffImg tl">
              <div className="staffContentLogo tl">
                <img
                  src={row.Image}
                  alt="dp"
                  onClick={() => {
                    setImagePre(row.Image);
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
      name: "User Code",
      center: true,
      // grow: 0,
      selector: (row) => row.UserCode,
    },
    {
      name: "Full Name",
      // grow: 0,
      center: true,
      selector: (row) => row.FirstName + " " + row.LastName,
    },

    {
      name: "Designation",
      // grow: 0,
      center: true,
      selector: (row) => row.Designation,
    },
    {
      name: "Enroll Date",
      center: true,
      // grow: 0,
      selector: (row) => row.EnrollDate,
    },
    {
      name: "Status",
      center: true,
      grow: 1,
      selector: (row) => {
        return (
          <div
            style={{
              padding: "4px",
              background: "var(--button-color)",
              color: "white",
              borderRadius: "5px",
            }}
          >
            {" "}
            {row.WorkingStatus}
          </div>
        );
      },
    },
    {
      name: "Action",
      // grow: 0,
      center: true,
      width: "200px",
      selector: (row) => {
        return (
          <>
            <div className="ln-verition d-flex">
              <button
                type="button"
                class="btn btn-sm editspan"
                onClick={() => editPop(row)}
              >
                View{" "}
              </button>{" "}
              <button
                type="button"
                class="btn btn-sm actvspan"
                onClick={() => changeStatus(row.UID, row.Status)}
              >
                {checkStatus(row.Status)}
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

  const searchHandler = (e) => {
    e.preventDefault();

    const srchQuery = searchInput.current.value.toLowerCase();

    if (srchQuery) {
      let srchResult = originalList.filter((list) => {
        return list["FirstName"].toLowerCase().includes(srchQuery);
      });

      if (srchResult) {
        setStaffList(srchResult);
      } else {
        setStaffList({});
      }
    } else {
      setStaffList(originalList);
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
  }, [chooseDepartment]);

  const subdeptList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: -1,
      DepartID: chooseDepartment,
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
  }, [chooseDepartment, chooseSubDepartment]);

  const desgList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: -1,
      DepartID: chooseDepartment,
      SubDepartID: chooseSubDepartment,
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
      <div className="container-fluid classatten-wrapper  mt-3 ps-4 pe-4">
        <div className="row mt-3">
          <div className="page-header">
            <div className="text-start  page-title" style={darkText}>
              Staff
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
            {loading ? (
              <Spinner />
            ) : (
              <DataTable
                columns={columns}
                data={staffList}
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
                    <div className="upper-dataTbl me-2">
                      <select
                        style={{ fontSize: "11px" }}
                        name="snotifiaction"
                        value={chooseDepartment}
                        onChange={handleDepartment}
                        className="form-control form-control-sm searchField"
                      >
                        <option
                          value=""
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

                    <div className="upper-dataTbl me-2">
                      <select
                        style={{ fontSize: "11px" }}
                        name="snotifiaction"
                        value={chooseSubDepartment}
                        onChange={handleSubDepartment}
                        className="form-control form-control-sm searchField"
                      >
                        <option
                          value=""
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

                    <div className="upper-dataTbl me-2">
                      <select
                        style={{ fontSize: "11px" }}
                        name="snotifiaction"
                        value={chooseDesignation}
                        onChange={handleDesignation}
                        className="form-control form-control-sm searchField"
                      >
                        <option
                          value=""
                          disabled
                          selected
                          style={{ fontSize: "11px" }}
                        >
                          Select Designation
                        </option>
                        <option value="-1">All</option>
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
            )}
          </div>
        </>
      </div>

      {staffPopup && <StaffPopup />}

      {staffEditPopup && <StaffEditPopup />}
      {imgPrv &&
        ShowImgPreview({
          img: imagePre,
          setTrigger: setImgPrv,
        })}
    </>
  );
}
