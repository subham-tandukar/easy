import React, { useContext, useEffect, useState } from "react";
import "./changePassword.css";
import CloseIcon from "../../images/CloseIcon.svg";
import UpperbarContext from "../context/upperbar-context";
import AuthContext from "../context/auth-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Fetchdata } from "../hooks/getData";

export default function ChangePassword() {
  const { User } = useContext(AuthContext);
  const initalvalue = { oldPassword: "", newPassword: "" };
  const [formValues, setFormValues] = useState(initalvalue);
  const [formErrors, setformErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const { changePassPopup, setChangePassPopup, appURL } =
    useContext(UpperbarContext);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setformErrors(validate(formValues));
    setIsSubmit(true);
  };

  const closePopUp = () => {
    setChangePassPopup(false);
  };

  const validate = (values) => {
    const errors = {};
    const ptn = /^\w+$/;
    const digitPtn = /[0-9]/;
    const alphaptn = /[a-z]/;
    const capalpha = /[A-Z]/;

    if (values.oldPassword && values.newPassword) {
      //code here
    } else {
      if (!values.oldPassword) {
        errors.oldPassword = "Required";
      }
      if (!values.newPassword) {
        errors.newPassword = "Required";
      }
      return errors;
    }
    return errors;
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {



      const dataForm = {
        UserID: User.UID,
        OldPwd: formValues.oldPassword,
        NewPwd: formValues.newPassword,

        FetchURL: `${appURL}api/change-password`,
        Type: "POST",
      };

      Fetchdata(dataForm).then(function (result) {

        if (result.StatusCode === 200) {

          toast(result.Message, {
            style: {
              color: "green",
              fontSize: "13px",
            },
          });
          setChangePassPopup(false);
        } else {
          toast("Error: " + result.Message, {
            style: {
              color: "red",
              fontSize: "13px",
            },
          });

        }
      });

      setIsSubmit(false);
    }
  }, [formErrors]);

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
      <div className="container chgpasspopup-wrapper">
        <div className="chgpasspopup-inner ">
          <div className="popUpHeader ps-0 pe-0">
            <div className="popUpTitle">Change Password</div>
            <div className="popUpClose">
              <img
                className="popUpCloseIcon"
                src={CloseIcon}
                alt="CloseIcon"
                onClick={closePopUp}
              />
            </div>
          </div>
          <div className="chgpassBody ps-3 pe-3">
            <div className="row text-start mt-2">
              <div className="form-group">
                <label htmlFor="oldpass" style={{ fontSize: "12px" }}>
                  Old Password
                </label>
                <input
                  id="oldpass"
                  style={{ fontSize: "13px" }}
                  type="password"
                  className="form-control form-control-sm "
                  name="oldPassword"
                  value={formValues.oldPassword}
                  onChange={handleChange}
                />
                <p className="errormsg">{formErrors.oldPassword}</p>
              </div>
            </div>

            <div className="row text-start mt-2">
              <div className="form-group">
                <label htmlFor="newpass" style={{ fontSize: "12px" }}>
                  New Password
                </label>
                <input
                  id="newpass"
                  style={{ fontSize: "13px" }}
                  type="password"
                  className="form-control form-control-sm "
                  name="newPassword"
                  value={formValues.newPassword}
                  onChange={handleChange}
                />
                <p className="errormsg">{formErrors.newPassword}</p>
              </div>
            </div>
          </div>

          <div className="chgpopup-footer">
            <div className="row  mt-2 mb-2">
              <div>
                <button
                  type="button"
                  class="btn btn-sm me-2"
                  style={{ background: "var(--button-color)", color: "white" }}
                  onClick={handleSubmit}
                >
                  Submit
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-danger me-3"
                  style={{ color: "white" }}
                  onClick={closePopUp}
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
}
