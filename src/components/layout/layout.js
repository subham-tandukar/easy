import { useState, useEffect, useContext } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Upperbar from "./upperbar";
import "./layout.css";
import "../../css/abs.css";
import UpperbarContext from "../context/upperbar-context";
import { Fetchdata } from "../hooks/getData";

export default function Layout(props) {
  const [sidebarController, setSidebarController] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const {
    logoutAlert,
    sidebarLogout,
    setSidebarLogout,
    changePassPopup,
    setChangePassPopup,
    fiscalYear,
    setFiscalYear,
    appURL,
  } = useContext(UpperbarContext);
  const [userDetails, setUserDetails] = useState("");

  useEffect(() => {
    const cur_user = localStorage.getItem("token");

    cur_user.length && setUserDetails(JSON.parse(cur_user));
  }, []);

  //
  useEffect(() => {}, [sidebarController]);

  useEffect(() => {
    const data = {
      FetchURL: `${appURL}api/fiscal-year?ComID=${userDetails.CompanyId}&BranchID=${userDetails.BranchId}`,
      Type: "GET",
    };

    Fetchdata(data)
      .then(function (result) {
        if (result.StatusCode === 200) {
          const postResult = result.FiscalYearlst[0]
            ? result.FiscalYearlst[0]
            : "";
          setFiscalYear(postResult);
        } else {
          setFiscalYear([]);
        }
      })
      .catch((err) => {
        setFiscalYear([]);
      });
  }, [userDetails]);

  useEffect(() => {
    window.addEventListener("resize", (e) => {
      setWindowWidth(window.innerWidth);
    });

    if (windowWidth < 1100) {
      setChangePassPopup(false);
      setSidebarLogout(false);
      setSidebarController(false);
    } else {
      setSidebarController(true);
    }
  }, [windowWidth]);

  return (
    <>
      <div className="layout-wrapper">
        {sidebarController && (
          <Sidebar
            windowWidth={windowWidth}
            sidebarController={sidebarController}
            setSidebarController={setSidebarController}
            userDetails={userDetails}
            logoutAlert={logoutAlert}
          />
        )}
        <Upperbar
          windowWidth={windowWidth}
          sidebarController={sidebarController}
          setSidebarController={setSidebarController}
          userDetails={userDetails}
          logoutAlert={logoutAlert}
        />
        <div className="side__content">
          {/* <div className="dynamic-content"> */}
          {/* <Outlet /> */}
          {props.children}
        </div>
        {/* </div> */}
        {/* </div> */}
      </div>
    </>
  );
}
