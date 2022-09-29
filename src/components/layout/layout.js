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
    sideMenu,
    mode,
    mainBg,
    userDetails,
    setUserDetails,
  } = useContext(UpperbarContext);

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

  // useEffect(() => {
  //   window.addEventListener("resize", (e) => {
  //     setWindowWidth(window.innerWidth);
  //   });

  //   if (windowWidth < 960) {
  //     setChangePassPopup(false);
  //     setSidebarLogout(false);
  //     setSidebarController(false);
  //   } else {
  //     setSidebarController(true);
  //   }
  // }, [windowWidth]);

  // for toggle dark mode
  if (mode === "light") {
    $(".pro-sidebar-inner").css({ background: "#004aad" });
    $(".pro-inner-list-item").css({ background: "#004aad" });
    $(".fwKvpK").css({ background: "#fff" });
    $(".fwKvpK").css({ color: "#555" });
    $(".MuiButton-label").css({ color: "#555" });
    $(".rdt_TableCol").css({ borderLeft: "1px solid #e1e2e3" });
    $(".rdt_TableCell").css({ borderLeft: "1px solid #e1e2e3" });
    $(".rdt_TableRow").css({
      borderLeft: "1px solid #e1e2e3",
      borderBottom: "1px solid #e1e2e3",
    });
    $(".rdt_TableCol ").css({ background: "#fafbfc" });
    $(".rdt_TableRow").css({ background: "#fff" });
    $(".TUEFO").css({ background: "#fff" });
    $(".rdt_Pagination").css({ background: "#fff" });
    $(".rdt_Pagination").css({ color: "#555" });
    $(".rdt_TableCol ").css({ color: "#212529" });
    $(".rdt_TableRow ").css({ color: "#212529" });
    $(".bvxQGL:disabled ").css({ color: "rgba(0,0,0,.18)" });
    $(".bvxQGL:disabled ").css({ fill: "rgba(0,0,0,.18)" });
    $(".bvxQGL").css({ color: "rgba(0,0,0,.18)" });
    $(".bvxQGL").css({ fill: "rgba(0,0,0,.18)" });
  } else {
    $(".pro-sidebar-inner").css({ background: "#0b0b45" });
    $(".pro-inner-list-item").css({ background: "#0b0b45" });
    $(".fwKvpK").css({ background: "#040423" });
    $(".fwKvpK").css({ color: "#fff" });
    $(".rdt_TableCol").css({ borderLeft: "1px solid #fff" });
    $(".rdt_TableCell").css({ borderLeft: "1px solid #fff" });
    $(".rdt_TableRow").css({
      borderLeft: "1px solid #fff",
      borderBottom: "1px solid #fff",
    });
    $(".MuiButton-label").css({ color: "#fff" });
    $(".rdt_TableCol ").css({ background: "#040412" });
    $(".TUEFO ").css({ background: "#040423" });
    $(".rdt_TableRow").css({ background: "#040423" });
    $(".rdt_Pagination").css({ background: "#040423" });
    $(".rdt_Pagination").css({ color: "#fff" });
    $(".rdt_TableCol ").css({ color: "#fff" });
    $(".rdt_TableRow ").css({ color: "#fff" });
    $(".bvxQGL:disabled ").css({ color: "rgba(255,255,255,.18)" });
    $(".bvxQGL:disabled ").css({ fill: "rgba(255,255,255,.18)" });
    $(".bvxQGL").css({ color: "rgba(255,255,255,.18)" });
    $(".bvxQGL").css({ fill: "rgba(255,255,255,.18)" });
  }

  return (
    <>
      <div className="layout-wrapper">
        <Sidebar
          // windowWidth={windowWidth}
          // sidebarController={sidebarController}
          // setSidebarController={setSidebarController}
          userDetails={userDetails}
          logoutAlert={logoutAlert}
        />

        <Upperbar
          sideMenu={sideMenu}
          windowWidth={windowWidth}
          sidebarController={sidebarController}
          setSidebarController={setSidebarController}
          userDetails={userDetails}
          logoutAlert={logoutAlert}
        />
        <div className="side__content pb-5" style={mainBg}>
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
