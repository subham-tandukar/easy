import React, { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import CloseIcon from "../../images/CloseIcon.svg";
import Plus from "../../images/Plus.png";
import UpperbarContext from "../context/upperbar-context";
import CreditManagementContext from "../adminPanel/CreditManagementState/CreditManagementContext";
import { Fetchdata } from "../hooks/getData";
import AuthContext from "../context/auth-context";

const CreditPopup = ({
  setCreditPopup,
  crList,
  creditValues,
  setCreditValues,
  creditErrors,
  setCreditErrors,
  chooseCooperative,
  reload,
  setReload,
}) => {
  const { User } = useContext(AuthContext);
  const { sidePanelBg, mainBg, darkText, appURL } = useContext(UpperbarContext);
  const [isUploaded, setIsUploaded] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [typeFile, setTypeFile] = useState("");
  const [image, setImage] = useState("");

  function handleImageChange(e) {
    if (e.target.files && e.target.files[0]) {
      setTypeFile(e.target.files[0].type);
      let reader = new FileReader();

      reader.onload = function (e) {
        setImage(e.target.result);
        setIsUploaded(true);
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  }

  const validate = (values) => {
    const errors = {};
    if (values.creditAmt && values.remark) {
    } else {
      if (!values.creditAmt) {
        errors.creditAmt = "Required";
      }

      if (!values.remark) {
        errors.remark = "Required";
      }
    }

    return errors;
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setCreditValues({ ...creditValues, [name]: value });
  };

  const closePopUp = () => {
    setCreditPopup(false);
    setCreditErrors({});
    setCreditValues("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCreditErrors(validate(creditValues));
    setSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(creditErrors).length === 0 && submit) {
      const dataForm = {
        Flag: "i",
        CoOperativeCode: chooseCooperative,
        UserName: User.Username,
        CreditAmt: creditValues.creditAmt,
        Remarks: creditValues.remark,
        Attachment: null,
        FetchURL: "https://esnep.com/MblPayPanel/CoOperative/CreditManagement",
        Type: "POST",
      };
      Fetchdata(dataForm).then(function (resp) {
        console.log("data", resp);
        if (resp.statuS_CODE === "0") {
          setCreditPopup(false);
          crList();
          toast(resp.message, {
            style: {
              color: "green",
              fontSize: "13px",
            },
          });
        } else {
          setCreditErrors({
            errorv: "Please enter valid credentials",
          });
          toast("Error: " + resp.message, {
            style: {
              color: "red",
              fontSize: "13px",
            },
          });
        }
      });

      setSubmit(false);
    }
  }, [creditErrors]);

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
      <div className="container addcspopup-wrapper">
        <div className="addcspopup-inner bg" style={mainBg}>
          <div className="popUpHeader ps-0 pe-0" style={sidePanelBg}>
            <div className="popUpTitle">Add Credit</div>
            <div className="popUpClose">
              <img
                className="popUpCloseIcon"
                src={CloseIcon}
                alt="CloseIcon"
                onClick={closePopUp}
              />
            </div>
          </div>
          {/* {loading ? (
            <>
              <Spinner />
            </>
          ) : ( */}
          <div className="addcspopupBody ps-3 pe-3 mt-2">
            <div className="row text-start ">
              <div className="form-group">
                <div className="form-group">
                  <label htmlFor="creditAmt" style={darkText}>
                    Credit Amount <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <input
                    id="creditAmt"
                    name="creditAmt"
                    value={creditValues.creditAmt}
                    onChange={handleChange}
                    style={{ fontSize: "13px" }}
                    type="text"
                    className="form-control form-control-sm "
                  />
                  {creditErrors.creditAmt && (
                    <p className="errormsg">{creditErrors.creditAmt}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="row text-start ">
              <div className="form-group">
                <label htmlFor="remark" style={darkText}>
                  Remark
                </label>
                <textarea
                  id="remark"
                  value={creditValues.remark}
                  onChange={handleChange}
                  style={{ fontSize: "13px" }}
                  class="form-control ps-2"
                  name="remark"
                  rows="3"
                  cols="12"
                ></textarea>
                {creditErrors.remark && (
                  <p className="errormsg">{creditErrors.remark}</p>
                )}
              </div>
            </div>

            <div className="row text-start mb-2">
              <div className="form-group">
                <div className="form-group  ">
                  <div className="form-label" htmlFor="text" style={darkText}>
                    Upload Image
                  </div>

                  <div className="BoxUpload">
                    <div className="image-upload">
                      {!isUploaded ? (
                        <>
                          <label htmlFor="upload-input">
                            <img
                              src={Plus}
                              draggable={"false"}
                              alt="placeholder"
                              style={{
                                width: 90,
                                height: 100,
                                paddingTop: "10px",
                              }}
                            />
                          </label>

                          <input
                            id="upload-input"
                            type="file"
                            accept=".jpg,.jpeg,.gif,.png,.mov,.mp4"
                            onChange={handleImageChange}
                            name="image"
                          />
                        </>
                      ) : (
                        <div className="ImagePreview">
                          <img
                            className="close-icon"
                            src={CloseIcon}
                            alt="CloseIcon"
                            onClick={() => {
                              setIsUploaded(false);
                              setImage(null);
                            }}
                          />

                          <img
                            id="uploaded-image"
                            src={image}
                            draggable={false}
                            alt="uploaded-img"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* //   )} */}
          <div className="addcspopupFooter">
            <div className="row  mt-1 mb-1">
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
};

export default CreditPopup;
