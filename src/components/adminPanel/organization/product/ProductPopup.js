import React, { useContext, useEffect, useState } from "react";
import "../../../leaveNotes/leaveNotePopup.css";
import "../subdepartment/SubdepartmentPopup.css";
import CloseIcon from "../../../../images/CloseIcon.svg";
import Plus from "../../../../images/Plus.png";
import "../../../hooks/imagePreview.css";
import "./ProductPopup.css";
import AuthContext from "../../../context/auth-context";
import { Fetchdata } from "../../../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpperbarContext from "../../../context/upperbar-context";

export default function ProductPopup({
  setProductPopup,
  reload,
  setReload,
  productFormValue,
  setProductFormValue,
  productFormError,
  setProductFormError,
  isUploaded,
  setIsUploaded,
  typeFile,
  image,
  setTypeFile,
  setImage,
  proList,
}) {
  const { User } = useContext(AuthContext);
  const { appURL } = useContext(UpperbarContext);
  const closePopUp = (e) => {
    setProductPopup(false);
    setProductFormError({});
  };

  const handleChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.type == "checkbox" ? target.checked : target.value;
    setProductFormValue({ ...productFormValue, [name]: value });
  };

  const [isSubmit, setIsSubmit] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (!values.description) {
      errors.description = "Required";
    }
    if (!values.productId) {
      errors.productId = "Required";
    }
    if (!values.productName) {
      errors.productName = "Required";
    }

    return errors;
  };

  const formSubmit = (e) => {

    e.preventDefault();
    setProductFormError(validate(productFormValue));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(productFormError).length === 0 && isSubmit) {
      const dataForm = {
        ComID: User.CompanyId,
        StaffID: User.UID,
        Flag: "i",
        ProductID: productFormValue.productId,
        Product: productFormValue.productName,
        PImage: image !== null ? image.split(",")[1] : "",
        Description: productFormValue.description,
        BranchID: User.BranchId,
        FiscalID: User.FiscalId,
        FetchURL: `${appURL}api/admin/product`,
        Type: "POST",
      };
      Fetchdata(dataForm).then(function (result) {

        if (result.StatusCode === 200) {
          proList();
          setProductPopup(false);
          toast(result.Message, {
            style: {
              color: "green",
              fontSize: "13px",
            },
          });
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
  }, [productFormError]);

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
      <div className="container leavenotepopup-wrapper">
        <div className="productpopup-inner ">
          <div className="popUpHeader ps-0 pe-0">
            <div className="popUpTitle">Product</div>
            <div className="popUpClose">
              <img
                className="popUpCloseIcon"
                src={CloseIcon}
                alt="CloseIcon"
                onClick={closePopUp}
              />
            </div>
          </div>
          <div className="productpopUpBody ps-3 pe-3">
            <div className="row text-start mt-2 ">
              <div className="col-md-12 col-sm-12 col-lg-12">
                <div className="row text-start ">
                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="productId" style={{ fontSize: "12px" }}>
                        Product ID<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        id="productId"
                        style={{ fontSize: "13px" }}
                        type="text"
                        className="form-control form-control-sm "
                        name="productId"
                        value={productFormValue.productId}
                        onChange={handleChange}
                      />
                      {productFormError.productId && (
                        <p className="errormsg">{productFormError.productId}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="productName" style={{ fontSize: "12px" }}>
                        Product Name<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        id="productName"
                        style={{ fontSize: "13px" }}
                        type="text"
                        className="form-control form-control-sm "
                        name="productName"
                        value={productFormValue.productName}
                        onChange={handleChange}
                      />
                      {productFormError.productName && (
                        <p className="errormsg">
                          {productFormError.productName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row text-start ">
                  <div className="form-group">
                    <label htmlFor="description" style={{ fontSize: "12px" }}>
                      Description<sup style={{ color: "red" }}>*</sup>
                    </label>
                    <input
                      id="description"
                      style={{ fontSize: "13px" }}
                      type="textarea"
                      row="2"
                      className="form-control form-control-sm"
                      name="description"
                      value={productFormValue.description}
                      onChange={handleChange}
                    />
                    {productFormError.description && (
                      <p className="errormsg">{productFormError.description}</p>
                    )}
                  </div>
                </div>

                <div className="form-group  ">
                  <div
                    className="form-label"
                    htmlFor="text"
                    style={{ fontSize: "12px" }}
                  >
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
          <div className="ln-popUpFooter">
            <div className="row  mt-1 mb-1">
              <div>
                <button
                  type="button"
                  class="btn btn-sm me-2"
                  style={{ background: "var(--button-color)", color: "white" }}
                  onClick={formSubmit}
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
