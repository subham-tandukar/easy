import React, { useContext, useEffect, useRef, useState } from "react";
import "../../../profile/profile.css";
import DataTable from "react-data-table-component";

import { Fetchdata } from "../../../hooks/getData";
import AuthContext from "../../../context/auth-context";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpperbarContext from "../../../context/upperbar-context";
import FollowTypePopup from "./FollowTypePopup";
import FollowTypeEditPopup from "./FollowTypeEditPopup";
import StaffContext from "../staffState/StaffContext";

export default function FollowType() {
    const { fiscalYear, todayDate, appURL } = useContext(UpperbarContext);
    const { customStyles } = useContext(StaffContext)
    const [followTypePopup, setFollowTypePopup] = useState(false);
    const [followTypeEditPopup, setFollowTypeEditPopup] = useState(false);
    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(true);
    const [originalList, setOriginalList] = useState(null);
    const searchInput = useRef("");

    const followTypeValue = {
        followType: "",
    };
    const [followTypeFormValue, setFollowTypeFormValue] = useState(followTypeValue);
    const [followTypeFormError, setFollowTypeFormError] = useState({});

    const { User } = useContext(AuthContext);

    const addLeaveNote = (e) => {
        setFollowTypePopup(true);

        setFollowTypeFormValue(followTypeValue);
    };

    const [titleId, setTitleID] = useState();
    const editPop = (datas) => {

        setFollowTypeEditPopup(true);
        setTitleID(datas.FollowTypeID);
        setFollowTypeFormValue({
            followType: datas.Name,
        });
    };

    //API to hit Follow Type status

    const stateInitial = [];
    const [newStat, setNewStat] = useState(stateInitial);

    const deactivateDepart = (ID, IsActive) => {
        const dataForm = {
            ComID: User.CompanyId,
            StaffID: User.UID,
            FollowTypeID: ID,
            Flag: "US",
            Status: IsActive,
            BranchID: User.BranchId,
            FetchURL: `${appURL}api/admin/follow-type`,
            Type: "POST",
        };
        if (IsActive === 1) {
            dataForm.Status = 0;
        } else {
            dataForm.Status = 1;
        }
        Fetchdata(dataForm).then(function (result) {

            if (result.StatusCode === 200) {
                followList();
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
            name: "Follow Type",
            center: true,
            // grow: 0,
            selector: (row) => row.Name,
        },
        {
            name: "Organization",
            center: true,
            // grow: 0,
            selector: (row) => row.NoOfOrg,
        },
        {
            name: "Person",
            // grow: 0,
            center: true,
            selector: (row) => row.NoOfPerson,
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

                                onClick={() => changeStatus(row.FollowTypeID, row.Status)}
                            >
                                {checkStatus(row.Status)}
                            </button>
                        </div>
                    </>
                );
            },
        },
    ];

    //API to hit follow Type list
    const [followTypeList, setFollowTypeList] = useState([]);

    useEffect(() => {
        followList();
    }, []);

    const followList = () => {
        const params = {
            ComID: User.CompanyId,
            StaffID: User.UID,
            Flag: "S",
            Status: -1,
            BranchID: User.BranchId,
            FiscalID: User.FiscalId,
            Type: "POST",
            FetchURL: `${appURL}api/admin/follow-type`,
        };

        Fetchdata(params).then(function (result) {

            if (result.StatusCode === 200) {
                const postResult = result.FlwTypeLst ? result.FlwTypeLst : "";
                setFollowTypeList(postResult);
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
                return (

                    list["Name"].toLowerCase().includes(srchQuery)
                );
            });

            if (srchResult) {

                setFollowTypeList(srchResult);
            } else {
                setFollowTypeList({});
            }
        } else {
            setFollowTypeList(originalList);
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
                        <div className="text-start  page-title">Follow Type</div>
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
                            data={followTypeList}
                            customStyles={customStyles}
                            pagination
                            fixedHeader
                            fixedHeaderScrollHeight="370px"
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
            {followTypePopup && (
                <FollowTypePopup
                    setFollowTypePopup={setFollowTypePopup}
                    reload={reload}
                    setReload={setReload}
                    followList={followList}
                    followTypeFormValue={followTypeFormValue}
                    setFollowTypeFormValue={setFollowTypeFormValue}
                    followTypeFormError={followTypeFormError}
                    setFollowTypeFormError={setFollowTypeFormError}
                />
            )}
            {followTypeEditPopup && (
                <FollowTypeEditPopup
                    setFollowTypeEditPopup={setFollowTypeEditPopup}
                    reload={reload}
                    setReload={setReload}
                    followList={followList}
                    followTypeFormValue={followTypeFormValue}
                    setFollowTypeFormValue={setFollowTypeFormValue}
                    followTypeFormError={followTypeFormError}
                    setFollowTypeFormError={setFollowTypeFormError}
                    titleId={titleId}
                />
            )}
        </>
    );
}
