import NepaliDate from "nepali-date-converter";
import React, { useState } from "react";

const UpperbarContext = React.createContext();

export const UpperbarContextProvider = (props) => {
  const appURL = process.env.REACT_APP_URL;
  const [logoutDropdown, setLogoutDropdown] = useState(null);
  const [logoutAlert, setLogoutAlert] = useState(false);
  const [sidebarLogout, setSidebarLogout] = useState(false);
  const [changePassPopup, setChangePassPopup] = useState(false);

  const [fiscalYear, setFiscalYear] = useState([]);
  const [todayDate] = useState(getNepaliDate());

  function getNepaliDate() {
    let date = new NepaliDate().getBS();
    let tm = date.month + 1 < 10 ? `0${date.month + 1}` : `${date.month + 1}`;
    let td = date.date < 10 ? `0${date.date}` : `${date.date}`;
    // if (date.month < 10) {
    //   if (date.date < 10) {
    //     return `${date.year}/0${date.month + 1}/0${date.date}`;
    //   } else {
    //     return `${date.year}/0${date.month + 1}/0${date.date}`;
    //   }
    // } else {
    //   return `${date.year}/${date.month + 1}/${date.date}`;
    // }
    return `${date.year}/${tm}/${td}`;
  }

  const [mode, setMode] = useState("light");
  const [themeText, setThemeText] = useState("Enable dark mode");
  const [sideMenu, setSideMenu] = useState(false);
  const [padding, setPadding] = useState(true);
  const darkText = { color: mode === "light" ? "#000" : "#fff" };
  const darkBg = { background: mode === "light" ? "#fff" : "#040412" };
  const darkBg2 = { background: mode === "light" ? "#e6edf7" : "#0b0b45" };
  const sidePanelBg = { background: mode === "light" ? "#004aad" : "#0b0b45" };
  const mainBg = { background: mode === "light" ? "#fff" : "#040423" };
  const [reload, setReload] = useState();
  const toggletheme = () => {
    if (mode === "light") {
      setMode("dark");
      setThemeText("Enable light mode");
    } else {
      setMode("light");
      setThemeText("Enable dark mode");
    }
  };

  return (
    <UpperbarContext.Provider
      value={{
        logoutDropdown,
        setLogoutDropdown,
        logoutAlert,
        setLogoutAlert,
        sidebarLogout,
        setSidebarLogout,
        changePassPopup,
        setChangePassPopup,
        fiscalYear,
        setFiscalYear,
        todayDate,
        appURL,
        mode,
        setMode,
        themeText,
        setThemeText,
        toggletheme,
        sideMenu,
        setSideMenu,
        padding,
        setPadding,
        darkText,
        darkBg,
        darkBg2,
        sidePanelBg,
        mainBg,
        reload,
        setReload,
      }}
    >
      {props.children}
    </UpperbarContext.Provider>
  );
};

export default UpperbarContext;
