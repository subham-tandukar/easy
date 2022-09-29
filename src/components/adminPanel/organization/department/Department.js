import React, { useContext, useEffect, useRef, useState } from "react";
import "../../../profile/profile.css";
import DataTable from "react-data-table-component";
import DepartmentPopup from "./DepartmentPopup";
import { Fetchdata } from "../../../hooks/getData";
import AuthContext from "../../../context/auth-context";
import DepartmentPopupEdit from "./DepartmentPopupEdit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../../loading/spinner";
import UpperbarContext from "../../../context/upperbar-context";
import StaffContext from "../staffState/StaffContext";
import { FaRegCalendarAlt } from "react-icons/fa";
export default function Department() {
  const { fiscalYear, todayDate, appURL, darkText } =
    useContext(UpperbarContext);
  const { customStyles } = useContext(StaffContext);

  const [departmentPopup, setDepartmentPopup] = useState(false);
  const [departmentEditPopup, setDepartmentEditPopup] = useState(false);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [originalList, setOriginalList] = useState(null);
  const searchInput = useRef("");

  const documentValue = {
    title: "",
    head: "",
  };
  const [documentFormValue, setDocumentFormValue] = useState(documentValue);
  const [departmentFormError, setDepartmentFormError] = useState({});

  const { User } = useContext(AuthContext);

  const addLeaveNote = (e) => {
    setDepartmentPopup(true);

    setDocumentFormValue(documentValue);
  };

  const [titleId, setTitleID] = useState();
  const editPop = (datas) => {
    setDepartmentEditPopup(true);
    setTitleID(datas.DepartmentID);
    setDocumentFormValue({
      title: datas.Department,
      head: datas.DepartHeadID,
    });
  };

  //API to hit Department status

  const stateInitial = [];
  const [newStat, setNewStat] = useState(stateInitial);

  const deactivateDepart = (ID, IsActive) => {
    const dataForm = {
      ComID: User.CompanyId,
      StaffID: User.UID,
      DepartmentID: ID,
      Flag: "US",
      Status: IsActive,
      BranchID: User.BranchId,
      FiscalID: User.FiscalId,
      FetchURL: `${appURL}api/admin/department`,
      Type: "POST",
    };
    if (IsActive === 1) {
      dataForm.Status = 0;
    } else {
      dataForm.Status = 1;
    }
    Fetchdata(dataForm).then(function (result) {
      if (result.StatusCode === 200) {
        deptList();
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
      // center: true,
      // grow: 0,
      width: "200px",
      selector: (row) => row.Department,
    },
    {
      name: "Head",
      center: true,
      // grow: 0,
      selector: (row) => row.DepartHead,
    },
    {
      name: "Sub Department",
      // grow: 0,
      center: true,
      selector: (row) => row.NoOfSubDepart,
    },
    {
      name: "Designation",
      // grow: 0,
      center: true,
      selector: (row) => row.NoOfDesign,
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
                onClick={() => changeStatus(row.DepartmentID, row.Status)}
              >
                {checkStatus(row.Status)}
              </button>
            </div>
          </>
        );
      },
    },
  ];

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
      Status: -1,
      BranchID: User.BranchId,
      FetchURL: `${appURL}api/admin/department`,
    };

    Fetchdata(params).then(function (result) {
      if (result.StatusCode === 200) {
        const postResult = result.list ? result.list : "";
        setLoading(false);
        setDepartmentList(postResult);
        setOriginalList(postResult);
      } else {
        setLoading(false);
      }
    });
  };

  // API to hit Sub-Department list
  const [subdepartmentList, setSubdepartmentList] = useState([]);

  useEffect(() => {
    subdeptList();
  }, []);

  const subdeptList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: -1,
      DepartID: "1",
      Flag: "S",
      Type: "POST",
      BranchID: User.BranchId,
      FetchURL: `${appURL}api/admin/sub-department`,
    };

    Fetchdata(params).then(function (result) {
      if (result.StatusCode === 200) {
        const postResult = result.SubDepList ? result.SubDepList : "";
        setSubdepartmentList(postResult);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  };

  const searchHandler = (e) => {
    e.preventDefault();

    const srchQuery = searchInput.current.value.toLowerCase();
    if (srchQuery) {
      let srchResult = originalList.filter((list) => {
        return list["Department"].toLowerCase().includes(srchQuery);
      });

      if (srchResult) {
        setDepartmentList(srchResult);
      } else {
        setDepartmentList({});
      }
    } else {
      setDepartmentList(originalList);
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
              Department
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
                data={departmentList}
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
      {departmentPopup && (
        <DepartmentPopup
          setDepartmentPopup={setDepartmentPopup}
          reload={reload}
          setReload={setReload}
          deptList={deptList}
          documentFormValue={documentFormValue}
          setDocumentFormValue={setDocumentFormValue}
          departmentFormError={departmentFormError}
          setDepartmentFormError={setDepartmentFormError}
        />
      )}
      {departmentEditPopup && (
        <DepartmentPopupEdit
          setDepartmentEditPopup={setDepartmentEditPopup}
          reload={reload}
          setReload={setReload}
          deptList={deptList}
          documentFormValue={documentFormValue}
          setDocumentFormValue={setDocumentFormValue}
          departmentFormError={departmentFormError}
          setDepartmentFormError={setDepartmentFormError}
          titleId={titleId}
        />
      )}
    </>
  );
}
