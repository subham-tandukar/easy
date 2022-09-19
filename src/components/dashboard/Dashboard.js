import React, { useContext } from "react";
import Bargraph from "./Bargraph";
import Employee from "./Employee";
import PieChart from "./PieChart";
import ProjectDetails from "./ProjectDetails";
import Statistics from "./Statistics";
import TodayAbsent from "./TodayAbsent";
import "./dashboard.css";
import { VscCalendar } from "react-icons/vsc";
import UpperbarContext from "../context/upperbar-context";
const todayDate = new Date().toLocaleDateString();
const Dashboard = () => {
  const { mode } = useContext(UpperbarContext);

  // useEffect(() => {
  //   document.querySelectorAll(".side__content").forEach((el) => {
  //     el.classList.add("padding");
  //   });
  // }, []);

  return (
    <>
      <section className="ps-4 pe-4">
        <div className="uk-flex uk-flex-between uk-flex-wrap uk-flex-middle head">
          <div className="uk-margin-right">
            <p
              className="uk-text-bold"
              style={{ color: mode === "light" ? "#000" : "#fff" }}
            >
              Welcome!
            </p>
          </div>

          <div className="uk-margin-left">
            <p style={{ color: mode === "light" ? "#000" : "#fff" }}>
              <VscCalendar /> {todayDate} | Fiscal Year: 2079-2080
            </p>
          </div>
        </div>
        <div className="uk-grid uk-grid-match uk-child-width-1-2@m dashboard-wrapper">
          <div className="dasboard-wrap">
            <Employee />
          </div>
          <div className="dasboard-wrap">
            <ProjectDetails />
          </div>
          <div className="dasboard-wrap">
            <Bargraph />
          </div>

          <div className="dasboard-wrap">
            <PieChart />
          </div>

          <div className="uk-flex-middle dasboard-wrap">
            <TodayAbsent />
          </div>

          <div className="dasboard-wrap">
            <Statistics />
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
