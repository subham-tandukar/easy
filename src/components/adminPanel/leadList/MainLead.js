import React, { useContext, useEffect, useRef, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import UpperbarContext from "../../context/upperbar-context";
import AddOrganization from "../../organization/addOrganizationPopup";
import LeadList from "./LeadList";
import LeadSummary from "./LeadSummary";


export default function MainLead() {
    const { fiscalYear, todayDate, appURL } = useContext(UpperbarContext);

    const [reload, setReload] = useState(false);
    const [addPopup, setAddPopup] = useState(false);
    const [DFlag, setDFlag] = useState("N");


    const addOrganization = (e) => {
        setAddPopup(true);
    };

    const [activeTab, setActiveTab] = useState({
        tab1: true,
        tab2: false,

    });
    const handleTab1 = () => {
        setActiveTab({
            tab1: true,
            tab2: false,
        });
    };
    const handleTab2 = () => {
        setActiveTab({
            tab1: false,
            tab2: true,
        });
    };



    return (
        <>
            <div className="container-fluid classatten-wrapper  mt-3 ps-4 pe-4">
                <div className="row mt-3">
                    <div className="page-header">
                        <div className="text-start  page-title">Lead List</div>
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
                {/* <div className="sec-dataTable"> */}

                <div className="tabview">
                    <div className="insidePopup--div">
                        <ul>
                            <li
                                className={activeTab.tab1 === true ? "active" : ""}
                                onClick={handleTab1}
                            >
                                <i className="fa fa-file-text-o icon"></i>Lead Report{" "}
                            </li>
                            <li
                                className={activeTab.tab2 === true ? "active" : ""}
                                onClick={handleTab2}
                            >
                                <i className="fa fa-file-text-o icon"></i>Lead Summary{" "}
                            </li>
                        </ul>
                    </div>

                    <div className="add--btn">
                        <button
                            type="button"
                            class="btn btn-sm"
                            style={{
                                background: "var(--button-color)",
                                color: "white",
                            }}
                            onClick={addOrganization}
                        >
                            Add Organization
                        </button>
                    </div>

                </div>
                <div>
                    {activeTab.tab1 && <LeadList />}
                    {activeTab.tab2 && <LeadSummary />}
                </div>
            </div>

            {/* </div> */}

            {addPopup && (
                <AddOrganization
                    DFlag={DFlag}
                    reload={reload}
                    setReload={setReload}
                    setAddPopup={setAddPopup}
                />
            )}

        </>
    );
}
