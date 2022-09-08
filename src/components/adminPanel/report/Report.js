import React, { useContext, useEffect, useRef, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import UpperbarContext from "../../context/upperbar-context";
import CooperativeSummary from "../CooperativeSummary/CooperativeSummary";
import InternalFund from "./topupReport/InternalFund";
import OperatorSummary from "./topupReport/OperatorSummary";
import TopupReport from "./topupReport/TopupReport";

export default function Report() {
    const { fiscalYear, todayDate, appURL } = useContext(UpperbarContext);
    

    const [activeTab, setActiveTab] = useState({
        tab1: true,
        tab2: false,
        tab3: false,
        tab4: false,
    });
    const handleTab1 = () => {
        setActiveTab({
            tab1: true,
            tab2: false,
            tab3: false,
            tab4: false
        });
    };
    const handleTab2 = () => {
        setActiveTab({
            tab1: false,
            tab2: true,
            tab3: false,
            tab4: false
        });
    };
    const handleTab3 = () => {
        setActiveTab({
            tab1: false,
            tab2: false,
            tab3: true,
            tab4: false
        });
    };
    const handleTab4 = () => {
        setActiveTab({
            tab1: false,
            tab2: false,
            tab3: false,
            tab4: true
        });
    };


    return (
        <>
            <div className="container-fluid classatten-wrapper  mt-3 ps-4 pe-4">
                <div className="row mt-3">
                    <div className="page-header">
                        <div className="text-start  page-title">Report</div>
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

                <div className="insidePopup">
                    <ul>
                        <li
                            className={activeTab.tab1 === true ? "active" : ""}
                            onClick={handleTab1}
                        >
                            <i className="fa fa-file-text-o icon"></i>Topup Report{" "}
                        </li>
                        <li
                            className={activeTab.tab2 === true ? "active" : ""}
                            onClick={handleTab2}
                        >
                            <i className="fa fa-file-text-o icon"></i>Operator Summary{" "}
                        </li>
                        <li
                            className={activeTab.tab3 === true ? "active" : ""}
                            onClick={handleTab3}
                        >
                            <i className="fa fa-file-text-o icon"></i>Internal Fund Transfer{" "}
                        </li>
                        <li
                            className={activeTab.tab4 === true ? "active" : ""}
                            onClick={handleTab4}
                        >
                            <i className="fa fa-file-text-o icon"></i>Cooperative Summary{" "}
                        </li>
                    </ul>
                </div>
                <div>
                    {activeTab.tab1 && <TopupReport />}
                    {activeTab.tab2 && <OperatorSummary />}
                    {activeTab.tab3 && <InternalFund />}
                    {activeTab.tab4 && <CooperativeSummary />}

                </div>
            </div>

            {/* </div> */}



        </>
    );
}
