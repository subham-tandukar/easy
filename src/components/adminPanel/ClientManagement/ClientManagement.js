import React, { useContext, useEffect, useRef, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import UpperbarContext from "../../context/upperbar-context";
import ClientManagementContext from "../clientManagementState/ClientManagementContext";
import Collector from "./Collector";
import "./ClientManagement.css";
import ClientManagementPopup from "./ClientManagementPopup";
import { FaRegCalendarAlt } from "react-icons/fa";

export default function ClientManagement() {
  const { fiscalYear, todayDate, appURL, darkText } =
    useContext(UpperbarContext);
  const { setCollectorFormValue, collectorvalue, setPopup, popup } = useContext(
    ClientManagementContext
  );

  const addLeaveNote = (e) => {
    setPopup(true);

    setCollectorFormValue(collectorvalue);
  };

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
      tab4: false,
    });
  };
  const handleTab2 = () => {
    setActiveTab({
      tab1: false,
      tab2: true,
      tab3: false,
      tab4: false,
    });
  };
  const handleTab3 = () => {
    setActiveTab({
      tab1: false,
      tab2: false,
      tab3: true,
      tab4: false,
    });
  };
  const handleTab4 = () => {
    setActiveTab({
      tab1: false,
      tab2: false,
      tab3: false,
      tab4: true,
    });
  };

  return (
    <>
      <div className="container-fluid classatten-wrapper  mt-3 ps-4 pe-4">
        <div className="row mt-3">
          <div className="page-header">
            <div className="text-start  page-title" style={darkText}>
              Client Management
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
        {/* <div className="sec-dataTable"> */}

        <div className="tabview">
          <div className="insidePopup--div">
            <ul>
              <li
                className={activeTab.tab1 === true ? "active" : ""}
                onClick={handleTab1}
              >
                <i className="fa fa-file-text-o icon"></i>ES Pay{" "}
              </li>
              <li
                className={activeTab.tab2 === true ? "active" : ""}
                onClick={handleTab2}
              >
                <i className="fa fa-file-text-o icon"></i>Smart Collecter{" "}
              </li>
              <li
                className={activeTab.tab3 === true ? "active" : ""}
                onClick={handleTab3}
              >
                <i className="fa fa-file-text-o icon"></i>Collector{" "}
              </li>
              <li
                className={activeTab.tab4 === true ? "active" : ""}
                onClick={handleTab4}
              >
                <i className="fa fa-file-text-o icon"></i>School{" "}
              </li>
            </ul>
          </div>

          <div className="add--btn">
            <button
              type="button"
              className="btn btn-sm"
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
        <div>
          {/* {activeTab.tab1 && <TopupReport />}
                        {activeTab.tab2 && <OperatorSummary />}
                         {activeTab.tab4 && <CooperativeSummary />} */}
          {activeTab.tab3 && <Collector />}
        </div>
      </div>

      {/* </div> */}

      {popup && <ClientManagementPopup />}
    </>
  );
}
