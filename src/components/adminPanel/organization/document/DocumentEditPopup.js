import React, { useContext, useEffect, useState } from "react";
import "../../../leaveNotes/leaveNotePopup.css";
import "../../organization/department/DepartmentPopup.css";
import CloseIcon from "../../../../images/CloseIcon.svg";
import Plus from "../../../../images/Plus.png";
import AuthContext from "../../../context/auth-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Fetchdata } from "../../../hooks/getData";
import UpperbarContext from "../../../context/upperbar-context";

export default function DocumentEditPopup({
  setDocumentEditPopup,
  reload,
  setReload,
  documentFormValue,
  setDocumentFormValue,
  documentFormError,
  setDocumentFormError,
  isUploaded,
  setIsUploaded,
  typeFile,
  image,
  setTypeFile,
  setImage,
}) {
  const { User } = useContext(AuthContext);
  const { appURL } = useContext(UpperbarContext);

  const closePopUp = (e) => {
    setDocumentEditPopup(false);
    setDocumentFormError({});
  };

  const handleChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.type == "checkbox" ? target.checked : target.value;
    if (name === "department") {
      documentFormValue.subDepartment = "";
      documentFormValue.staff = "";
    }
    if (name === "subDepartment") {
      documentFormValue.staff = "";
    }

    setDocumentFormValue({ ...documentFormValue, [name]: value });
  };

  const [isSubmit, setIsSubmit] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (!values.department) {
      errors.department = "Required";
    }
    if (!values.subDepartment) {
      errors.subDepartment = "Required";
    }
    if (!values.staff) {
      errors.staff = "Required";
    }
    if (!values.fileName) {
      errors.fileName = "Required";
    }
    if (!values.radio) {
      errors.radio = "Required";
    }
    if (!values.url) {
      errors.url = "Required";
    }

    return errors;
  };

  const formSubmit = (e) => {
    e.preventDefault();
    setDocumentFormError(validate(documentFormValue));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(documentFormError).length === 0 && isSubmit) {

      // const dataForm = {

      //     ComID: User.CompanyId,
      //     StaffID: User.UID,
      //     UserID: bankFormValue.staff,
      //     Flag: "I",
      //     BankName: bankFormValue.bank,
      //     AcName: bankFormValue.accountName,
      //     AcNo: bankFormValue.accountNo,
      //     Branch: bankFormValue.branch,
      //     BranchID: User.BranchId,
      //     FiscalID: User.FiscalId,
      //     Type: "POST",
      //     FetchURL: "https://esnep.com/easyoffice/api/admin/u-bank",
      // }

      // 
      // Fetchdata(dataForm).then(function (result) {
      //     
      //     if (result.StatusCode === 200) {
      //         setBankPopup(false);
      //         bnkList();
      //         toast(result.Message, {
      //             style: {
      //                 color: "green",
      //                 fontSize: "13px",
      //             },
      //         });
      //     } else {

      //         toast("Error: " + result.Message, {
      //             style: {
      //                 color: "red",
      //                 fontSize: "13px",
      //             },
      //         });
      //     }
      // });

      setIsSubmit(false);
    }
  }, [documentFormError]);

  //API to hit Department list
  const [departmentList, setDepartmentList] = useState([]);

  useEffect(() => {
    deptList();
  }, []);

  const deptList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: -1,
      Flag: "S",
      Status: 1,
      Type: "POST",
      BranchID: User.BranchId,
      FetchURL: `${appURL}api/admin/department`,
    };

    Fetchdata(params).then(function (result) {
      if (result.StatusCode === 200) {
        const postResult = result.list ? result.list : "";
        setDepartmentList(postResult);
      } else {
        setDepartmentList([]);

      }
    });
  };

  // API to hit Sub-Department list
  const [subdepartmentList, setSubdepartmentList] = useState([]);

  useEffect(() => {
    subdeptList();
  }, [documentFormValue.department]);

  const subdeptList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: -1,
      DepartID: documentFormValue.department,
      Flag: "S",
      Status: 1,
      Type: "POST",
      BranchID: User.BranchId,
      FetchURL: `${appURL}api/admin/sub-department`,
    };

    Fetchdata(params).then(function (result) {
      if (result.StatusCode === 200) {
        const postResult = result.SubDepList ? result.SubDepList : "";
        setSubdepartmentList(postResult);
      } else {
        setSubdepartmentList([]);

      }
    });
  };
  //API to get staff list

  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    const dataForm = {
      FetchURL: `${appURL}api/org-staff?ComID=${User.CompanyId}&BranchID=${User.BranchId}&DepartmentId=${documentFormValue.department}&SubDepartmentId=${documentFormValue.subDepartment}`,
      Type: "GET",
    };

    Fetchdata(dataForm).then(function (result) {

      if (result.StatusCode === 200) {

        const postResult = result.OrganizationStaffs;
        setStaffList(postResult);
      } else {

      }
    });
  }, [documentFormValue.department, documentFormValue.subDepartment]);

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
        <div className="bankpopup-inner ">
          <div className="popUpHeader ps-0 pe-0">
            <div className="popUpTitle">Document Edit</div>
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
                      <label htmlFor="department" style={{ fontSize: "12px" }}>
                        Select Department <sup style={{ color: "red" }}>*</sup>
                      </label>
                      <select
                        class="form-select form-select-sm"
                        aria-label="Default select example"
                        name="department"
                        value={documentFormValue.department}
                        onChange={handleChange}
                      >
                        <option disabled value="" selected>
                          Select Option
                        </option>
                        {departmentList.map((item) => (
                          <option
                            key={item.DepartmentID}
                            value={item.DepartmentID}
                          >
                            {item.Department}
                          </option>
                        ))}
                      </select>
                      {documentFormError.department && (
                        <p className="errormsg">
                          {documentFormError.department}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="form-group">
                      <label
                        htmlFor="subDepartment"
                        style={{ fontSize: "12px" }}
                      >
                        Select Sub Department{" "}
                        <sup style={{ color: "red" }}>*</sup>
                      </label>
                      <select
                        class="form-select form-select-sm"
                        aria-label="Default select example"
                        name="subDepartment"
                        value={documentFormValue.subDepartment}
                        onChange={handleChange}
                      >
                        <option disabled value="" selected>
                          Select Option
                        </option>

                        {subdepartmentList.map((item) => (
                          <option
                            key={item.SubDepartID}
                            value={item.SubDepartID}
                          >
                            {item.SubDepartName}
                          </option>
                        ))}
                      </select>
                      {documentFormError.subDepartment && (
                        <p className="errormsg">
                          {documentFormError.subDepartment}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row text-start ">
                  <div className="form-group">
                    <label htmlFor="staff" style={{ fontSize: "12px" }}>
                      Select Staff <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <select
                      class="form-select form-select-sm"
                      aria-label="Default select example"
                      name="staff"
                      value={documentFormValue.staff}
                      onChange={handleChange}
                    >
                      <option disabled value="" selected>
                        Select Option
                      </option>
                      {staffList.map((item) => (
                        <option key={item.StaffId} value={item.StaffId}>
                          {item.StaffName}
                        </option>
                      ))}
                    </select>
                    {documentFormError.staff && (
                      <p className="errormsg">{documentFormError.staff}</p>
                    )}
                  </div>
                </div>

                <div className="row text-start ">
                  <div className="form-group">
                    <label htmlFor="fileName" style={{ fontSize: "12px" }}>
                      File Name<sup style={{ color: "red" }}>*</sup>
                    </label>
                    <input
                      id="fileName"
                      style={{ fontSize: "13px" }}
                      type="text"
                      className="form-control form-control-sm "
                      name="fileName"
                      value={documentFormValue.fileName}
                      onChange={handleChange}
                    />
                    {documentFormError.fileName && (
                      <p className="errormsg">{documentFormError.fileName}</p>
                    )}
                  </div>
                </div>

                <div className="row text-start ">
                  <div className="form-group">
                    <input
                      id="link"
                      style={{ fontSize: "13px" }}
                      type="radio"
                      // className="form-control form-control-sm "
                      name="radio"
                      value="url"
                      onChange={handleChange}
                      checked={documentFormValue.radio === "url"}
                    />
                    <label
                      for="link"
                      style={{
                        fontSize: "12px",
                        paddingLeft: "5px",
                        paddingRight: "5px",
                      }}
                    >
                      URL
                    </label>

                    <input
                      id="image"
                      style={{ fontSize: "12px" }}
                      type="radio"
                      name="radio"
                      value="image"
                      onChange={handleChange}
                      checked={documentFormValue.radio === "image"}
                    />
                    <label
                      for="image"
                      style={{ fontSize: "12px", paddingLeft: "5px" }}
                    >
                      File
                    </label>

                    {documentFormError.radio && (
                      <p className="errormsg">{documentFormError.radio}</p>
                    )}
                  </div>
                </div>

                {documentFormValue.radio === "url" && (
                  <div className="row text-start ">
                    <div className="form-group">
                      <label htmlFor="url" style={{ fontSize: "12px" }}>
                        URL
                      </label>
                      <input
                        id="url"
                        style={{ fontSize: "13px" }}
                        type="text"
                        className="form-control form-control-sm "
                        name="url"
                        value={documentFormValue.url}
                        onChange={handleChange}
                      />
                      {documentFormError.url && (
                        <p className="errormsg">{documentFormError.url}</p>
                      )}
                    </div>
                  </div>
                )}

                {documentFormValue.radio === "image" && (
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
                )}
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
                  Update
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
