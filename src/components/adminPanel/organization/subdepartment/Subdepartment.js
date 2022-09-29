import React, { useContext, useEffect, useRef, useState } from "react";
import "../../../profile/profile.css";
import DataTable from "react-data-table-component";
import { Fetchdata } from "../../../hooks/getData";
import AuthContext from "../../../context/auth-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SubdepartmentPopup from "./SubdepartmentPopup";
import SubdepartmentPopupEdit from "./SubdepartmentPopupEdit";
import Spinner from "../../../loading/spinner";
import UpperbarContext from "../../../context/upperbar-context";
import StaffContext from "../staffState/StaffContext";
import { FaRegCalendarAlt } from "react-icons/fa";
export default function Subdepartment() {
  const { customStyles } = useContext(StaffContext);
  const { fiscalYear, todayDate, appURL, darkText } =
    useContext(UpperbarContext);
  const [subdepartmentPopup, setSubdepartmentPopup] = useState(false);
  const [departmentEditPopup, setDepartmentEditPopup] = useState(false);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [originalList, setOriginalList] = useState(null);
  const searchInput = useRef("");

  const [choose, setChoose] = useState("");

  const subdepartmentValue = {
    subdepartment: "",
    department: "",
    head: "",
  };
  const [subdepartmentFormValue, setSubdepartmentFormValue] =
    useState(subdepartmentValue);
  const [subdepartmentFormError, setSubdepartmentFormError] = useState({});

  const { User } = useContext(AuthContext);

  const addLeaveNote = (e) => {
    setSubdepartmentPopup(true);
    setSubdepartmentFormValue({});
  };

  const [titleId, setTitleID] = useState();
  const editPop = (datas) => {
    setDepartmentEditPopup(true);
    setTitleID(datas.SubDepartID);
    setSubdepartmentFormValue({
      subdepartment: datas.SubDepartName,
      department: datas.DepartmentID,
      head: datas.SubDepartHeadID,
    });
  };

  //API to hit Department status

  const stateInitial = [];
  const [newStat, setNewStat] = useState(stateInitial);

  const deactivateDepart = (ID, IsActive) => {
    const dataForm = {
      ComID: User.CompanyId,
      StaffID: User.UID,
      SubDepartID: ID,
      Flag: "US",
      Status: IsActive,
      BranchID: User.BranchId,
      FiscalID: User.FiscalId,
      FetchURL: `${appURL}api/admin/sub-department`,
      Type: "POST",
    };
    if (IsActive === 1) {
      dataForm.Status = 0;
    } else {
      dataForm.Status = 1;
    }
    Fetchdata(dataForm).then(function (result) {
      if (result.StatusCode === 200) {
        subdeptList();
        let statsN = JSON.parse(JSON.stringify(newStat));
        let pitchStatus;

        if (dataForm.Status === 1) {
          pitchStatus = "Activated";
        } else if (dataForm.Status === 0) {
          pitchStatus = "Deactivated";
        }

        setNewStat(statsN);
        toast(result.Message, {
          style: {
            color: "green",
            fontSize: "13px",
          },
        });
      } else {
        toast("Error: " + result.Message, {
          style: {
            color: "red",
            fontSize: "13px",
          },
        });
      }
    });
  };

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

  const columns = [
    {
      name: "S.N.",
      grow: 0,
      center: true,
      cell: (row, index) => index + 1,
    },
    {
      name: "Department",
      center: true,
      // grow: 0,
      selector: (row) => row.Department,
    },
    {
      name: "Sub Department",
      // grow: 0,
      center: true,
      selector: (row) => row.SubDepartName,
    },
    {
      name: "Head",
      // grow: 0,
      center: true,
      selector: (row) => row.SubDepartHead,
    },
    {
      name: "Designation",
      // grow: 0,
      center: true,
      selector: (row) => row.NoOfDesig,
    },
    {
      name: "Staff",
      // grow: 0,
      center: true,
      selector: (row) => row.NoOfStaff,
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
                onClick={() => changeStatus(row.SubDepartID, row.Status)}
              >
                {checkStatus(row.Status)}
              </button>
            </div>
          </>
        );
      },
    },
  ];

  // API to hit Sub-Department list
  const [subdepartmentList, setSubdepartmentList] = useState([]);

  useEffect(() => {
    subdeptList();
  }, [choose]);

  const subdeptList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: -1,
      DepartID: choose,
      Flag: "S",
      Type: "POST",
      Status: -1,
      BranchID: User.BranchId,
      FetchURL: `${appURL}api/admin/sub-department`,
    };

    Fetchdata(params).then(function (result) {
      if (result.StatusCode === 200) {
        const postResult = result.SubDepList ? result.SubDepList : "";
        setLoading(false);
        setSubdepartmentList(postResult);
        setOriginalList(postResult);
      } else {
        setLoading(false);
        setSubdepartmentList([]);
      }
    });
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
        setOriginalList(postResult);
        setLoading(false);
      } else {
        setLoading(true);
      }
    });
  };

  const searchHandler = (e) => {
    e.preventDefault();

    const srchQuery = searchInput.current.value.toLowerCase();
    if (srchQuery) {
      let srchResult = originalList.filter((list) => {
        return list["SubDepartName"].toLowerCase().includes(srchQuery);
      });

      if (srchResult) {
        setSubdepartmentList(srchResult);
      } else {
        setSubdepartmentList({});
      }
    } else {
      setSubdepartmentList(originalList);
    }
  };

  const handleChanges = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setChoose(value);
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
              Sub Department
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
              <div
                className="btn-addlnote mb-3"
                style={{ marginRight: "18px" }}
              >
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
                data={subdepartmentList}
                customStyles={customStyles}
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
                        value={choose}
                        onChange={handleChanges}
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
      {subdepartmentPopup && (
        <SubdepartmentPopup
          setSubdepartmentPopup={setSubdepartmentPopup}
          reload={reload}
          setReload={setReload}
          subdepartmentFormValue={subdepartmentFormValue}
          setSubdepartmentFormValue={setSubdepartmentFormValue}
          subdepartmentFormError={subdepartmentFormError}
          setSubdepartmentFormError={setSubdepartmentFormError}
          subdeptList={subdeptList}
        />
      )}
      {departmentEditPopup && (
        <SubdepartmentPopupEdit
          setDepartmentEditPopup={setDepartmentEditPopup}
          reload={reload}
          setReload={setReload}
          titleId={titleId}
          subdepartmentFormValue={subdepartmentFormValue}
          setSubdepartmentFormValue={setSubdepartmentFormValue}
          subdepartmentFormError={subdepartmentFormError}
          setSubdepartmentFormError={setSubdepartmentFormError}
          subdeptList={subdeptList}
        />
      )}
    </>
  );
}
