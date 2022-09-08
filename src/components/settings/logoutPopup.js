import { useContext, useState } from "react";
import AuthContext from "../context/auth-context";
import { useNavigate } from "react-router-dom";
import UpperbarContext from "../context/upperbar-context";
import "./logoutPopup.css";
import CloseIcon from "../../images/CloseIcon.svg";

export const ShowLogoutPopup = () => {
  const { logout } = useContext(AuthContext);
  let navigate = useNavigate();
  const { sidebarLogout, setSidebarLogout } = useContext(UpperbarContext);

  const logoutHandler = (e) => {
    localStorage.clear();
    sessionStorage.clear();
    logout();
    setSidebarLogout(false);
    navigate("/login");
  };

  return (
    <>
      <div className="container-fluid p-0 logoutPopup-wrapper">
        <div className="logoutpopup-inner">
          <div className="row">
            <div className="col-md-12 col-lg-12 col-sm-12">
              <div className="popUpHeader ps-0 pe-0">
                <div className="popUpTitle">Easy Software</div>
                <div className="popUpClose">
                  <img
                    className="popUpCloseIcon"
                    src={CloseIcon}
                    alt="CloseIcon"
                    onClick={() => {
                      setSidebarLogout(false);
                    }}
                  />
                </div>
              </div>

              <div className="logoutpopup-body text-start ps-3">
                Do you want to Logout ?
              </div>
              <div className="logoutpopup-footer mt-4">
                <button
                  type="button"
                  class="btn btn-sm ps-4 pe-4 me-2 ms-3"
                  style={{
                    backgroundColor: "var(--button-color)",
                    color: "white",
                  }}
                  onClick={logoutHandler}
                >
                  Logout
                </button>
                <button
                  type="button"
                  class="btn btn-light btn-sm ps-4 pe-4 me-3"
                  onClick={() => {
                    setSidebarLogout(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
