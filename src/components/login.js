import React, { useState, useEffect, useContext, useRef } from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "../css/login.css";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import bankingimage from "../images/banking.png";
import AuthContext from "./context/auth-context";
import { Fetchdata } from "./hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpperbarContext from "./context/upperbar-context";

import logo from "../images/logo.png";
import loginImg from "../images/login-img.png";
import { FaRegEye, FaRegEyeSlash, FaUserCircle } from "react-icons/fa";
import { BsFillKeyFill } from "react-icons/bs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import "swiper/css/bundle";

export default function Login() {
  const { appURL } = useContext(UpperbarContext);
  const { login } = useContext(AuthContext);
  const initialvalue = { ComID: "", UserName: "", Password: "" };
  const [formValues, setFormValues] = useState(initialvalue);
  const [formErrors, setformErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [border1, setBorder1] = useState(false);
  const [border2, setBorder2] = useState(false);

  const inputRef1 = useRef();
  const inputRef2 = useRef();

  const [color, setColor] = useState({
    color: "",
  });

  const [passwordType, setPasswordType] = useState("password");

  const date = new Date();
  let year = date.getFullYear();

  let navigate = useNavigate();

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

  let location = useLocation();

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      const dataForm = {
        // SchID: "PS0011",
        // PwdCode: "PS1626",
        // UserName: "PS1626",
        // AuthToken: "PS1626",
        // IMEI_Code: "IMEI_Code",
        // MacID: "MacID",

        // SchID: "PS0011",
        // PwdCode: "PS1015",
        // UserName: "PS1015",
        // AuthToken: "PS1015",
        // IMEI_Code: "IMEI_Code",
        // MacID: "MacID",

        // ComID: formValues.ComID,
        ComID: "ES25",
        UserName: formValues.UserName,
        Password: formValues.Password,
        NotificationToken: "265b357b6100dfe8",
        DeviceId: "265b357b6100dfe8",
        FetchURL: `${appURL}api/login`,
        Type: "POST",
      };

      Fetchdata(dataForm).then(function (result) {
        if (result.StatusCode === 200) {
          const postResult = result.Logins[0];
          // postResult.push(formValues.ComID);
          // postResult.CompanyId = formValues.ComID;
          postResult.CompanyId = "ES25";
          postResult.Username = formValues.UserName;

          localStorage.setItem("token", JSON.stringify(postResult));
          sessionStorage.setItem("token", JSON.stringify(postResult));
          login(postResult);
          navigate("/");
        } else {
          toast("Error: " + result.Message, {
            style: {
              color: "#ff4949",
              fontSize: "13px",
            },
          });
          setformErrors({
            errorv: "Please enter valid credentials",
          });
        }
      });

      setIsSubmit(false);
    }
  }, [formErrors]);

  const validate = (values) => {
    const errors = {};
    const ptn = /^\w+$/;
    const digitPtn = /[0-9]/;
    const alphaptn = /[a-z]/;
    const capalpha = /[A-Z]/;

    if (values.UserName && values.Password) {
      // if (!ptn.test(values.UserName)) {
      //
      //   errors.UserName =
      //     "Username must contain only letters, numbers and underscores";
      //   formValues.UserName = "";
      // } else if (values.Password.length < 8) {
      //
      //   errors.Password = "Password must contain at least eight characters";
      //   formValues.Password = "";
      // } else if (values.Password === values.UserName) {
      //
      //   errors.Password = "Password must be different from Username";
      //   formValues.Password = "";
      // } else if (!digitPtn.test(values.Password)) {
      //
      //   errors.password = "Password must contain at least one number (0-9)";
      //   formValues.Password = "";
      // } else if (!alphaptn.test(values.Password)) {
      //
      //   errors.Password =
      //     "Password must contain at least one lowercase letter (a-z)";
      //   formValues.Password = "";
      // } else if (!capalpha.test(values.Password)) {
      //
      //   errors.Password =
      //     "Password must contain at least one uppercase letter (A-Z)";
      //   formValues.Password = "";
      // }
    } else {
      // if (!values.ComID) {
      //   errors.ComID = "Company ID is required";
      // }
      if (!values.Password) {
        errors.Password = "Password  is required";
        inputRef2.current.focus();
        setBorder2(true);
        setColor({
          color: "#ff4949",
          fontSize: "13px",
        });
      }
      if (!values.UserName) {
        errors.UserName = "Username is required";
        inputRef1.current.focus();
        setBorder1(true);
        setColor({
          color: "#ff4949",
          fontSize: "13px",
        });
      }
      return errors;
    }
    return errors;
  };

  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  const showPassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
    } else {
      setPasswordType("password");
    }
  };

  return isLoggedIn ? (
    <Navigate to="/" replace state={{ from: location }} />
  ) : (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
      />

      <div className="login-container">
        <div className="uk-container uk-container-expand uk-margin-top uk-margin-bottom">
          <img
            src={logo}
            alt="logo"
            style={{ height: "60px" }}
            className="uk-margin-left"
          />
        </div>

        <section className="login__page uk-container">
          <div className="uk-grid uk-child-width-1-2">
            <div className="login-img-wrapper">
              <section className="login__img">
                <div className="txt">
                  <h1>
                    Welcome to the <br /> <span>Easy</span> Software
                  </h1>
                </div>

                <div className="slider-img">
                  <Swiper
                    className="mySwiper"
                    pagination={{
                      clickable: true,
                    }}
                    modules={[Pagination]}
                  >
                    <SwiperSlide className="swiper-slide">
                      <img src={loginImg} alt="image" />
                    </SwiperSlide>
                    <SwiperSlide className="swiper-slide">
                      <img src={loginImg} alt="image" />
                    </SwiperSlide>
                    <SwiperSlide className="swiper-slide">
                      <img src={loginImg} alt="image" />
                    </SwiperSlide>
                  </Swiper>
                </div>
              </section>
            </div>

            <div className="login-form-wrapper">
              <section className="login__form">
                <h3>
                  Login <span>Now!</span>
                </h3>
                <h5>Enter your valid credentials below.</h5>
                <form>
                  <p className="errormsg"> {formErrors.errorv}</p>

                  <div className="username-input">
                    <div className="uk-position-relative">
                      <input
                        type="text"
                        className={`uk-input ${border1 ? "border1" : ""}`}
                        name="UserName"
                        value={formValues.UserName}
                        onChange={handleChange}
                        autoComplete="off"
                        id="name"
                        placeholder="Username"
                        onKeyPress={() => {
                          setBorder1(false);
                        }}
                        ref={inputRef1}
                        required
                      />
                      <span className="username-icon">
                        <FaUserCircle color="#0049ae" size="1.5rem" />
                      </span>
                    </div>
                    <span style={color}>{formErrors.UserName}</span>
                  </div>

                  <div className="password-input">
                    <div className="uk-position-relative">
                      <input
                        type={passwordType}
                        className={`uk-input ${border2 ? "border2" : ""}`}
                        name="Password"
                        value={formValues.Password}
                        onChange={handleChange}
                        id="pass"
                        placeholder="Password"
                        onKeyPress={() => {
                          setBorder2(false);
                        }}
                        ref={inputRef2}
                        required
                      />
                      <span className="password-icon">
                        <BsFillKeyFill color="#0049ae" size="1.5rem" />
                      </span>
                      <span
                        className="toggle-password"
                        uk-toggle="target: .toggle"
                        onClick={showPassword}
                      >
                        <i className="toggle" title="Show Password">
                          <FaRegEyeSlash />
                        </i>
                        <i className="toggle" title="Hide Password" hidden>
                          <FaRegEye />
                        </i>
                      </span>
                    </div>
                    <span style={color}>{formErrors.Password}</span>
                  </div>

                  <button
                    type="submit"
                    className="uk-button"
                    onClick={handleSubmit}
                    disabled={formErrors.length === 0 && isSubmit}
                  >
                    {formErrors.length === 0 && isSubmit ? (
                      <span>Loading ...</span>
                    ) : (
                      <span>Login</span>
                    )}
                  </button>
                </form>
              </section>
            </div>
          </div>
        </section>

        <span className="copyright">
          {" "}
          &copy; {year} Easy Software Pvt. Ltd. All Rights Reserved
        </span>
      </div>

      {/* <div className="container login-container">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-6 login-form-1 ">
            <div className="text-center">
              <h5>Log in</h5>

              <p style={{ fontSize: "13px" }}>
                Enter your valid credentials below
              </p>
            </div>

            <p className="errormsg"> {formErrors.errorv}</p>
            <div className="form-group">
              <label
                style={{ fontSize: "13px", marginBottom: "8px" }}
                htmlFor="cid"
              >
                Company ID
              </label>
              <input
                id="cid"
                type="text"
                className="form-control form-control-sm loginForm"
                name="ComID"
                value={formValues.ComID}
                onChange={handleChange}
                placeholder="Enter your Company ID"
              />
              <p className="errormsg">{formErrors.ComID}</p>
            </div>
            <div className="form-group">
              <label
                style={{ fontSize: "13px", marginBottom: "8px" }}
                htmlFor="name"
              >
                Username
              </label>
              <input
                id="name"
                type="text"
                className="form-control form-control-sm loginForm"
                name="UserName"
                value={formValues.UserName}
                onChange={handleChange}
                placeholder="Enter your Username"
              />
              <p className="errormsg">{formErrors.UserName}</p>
            </div>
            <div className="form-group">
              <label
                style={{ fontSize: "13px", marginBottom: "8px" }}
                htmlFor="pass"
              >
                Password
              </label>
              <input
                id="pass"
                type="password"
                className="form-control form-control-sm loginForm"
                name="Password"
                value={formValues.Password}
                onChange={handleChange}
                placeholder="Enter your Password"
              />
              <p className="errormsg">{formErrors.Password}</p>
            </div>
            <div className="form-group ">
              <button
                style={{ fontSize: "13px" }}
                onClick={handleSubmit}
                className="btnSubmit loginForm"
                disabled={formErrors.length === 0 && isSubmit}
              >
                {formErrors.length === 0 && isSubmit ? (
                  <span>Loading ...</span>
                ) : (
                  <span>Login</span>
                )}
              </button>
            </div>

            <div className="text-center  mt-4">
              <p style={{ fontSize: "13px" }}>
                By{" "}
                <a
                  style={{ cursor: "pointer" }}
                  onClick={() => openInNewTab("https://easysoftware.com.np/")}
                >
                  <span style={{ color: "red" }}>Easy</span>{" "}
                  <span style={{ color: "#3498db" }}>Software</span>
                </a>
              </p>
            </div>
          </div>
          <div className="col-lg-6 col-md- 6 col-sm-6 login-form-2 text-center">
            <h3>Welcome to the easy software</h3>
            <h6>Banking Software</h6>
            <OwlCarousel items={1} margin={20} autoplay={true}>
              <div className="item">
                <img src={bankingimage} />{" "}
              </div>
              <div className="item">
                <img src={bankingimage} />
              </div>
              <div className="item">
                <img src={bankingimage} />
              </div>
            </OwlCarousel>
            <p>@ {year} Easy Software Pvt. Ltd. All Rights Reserved</p>
          </div>
        </div>
      </div> */}
    </>
  );
}
