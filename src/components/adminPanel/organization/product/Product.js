import React, { useContext, useEffect, useRef, useState } from "react";
import "../../../profile/profile.css";
import DataTable from "react-data-table-component";
import { Fetchdata } from "../../../hooks/getData";
import AuthContext from "../../../context/auth-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductPopup from "./ProductPopup";
import ProductEditPopup from "./ProductEditPopup";
import { ShowImgPreview } from "../../../hooks/imagePreview";
import Spinner from "../../../loading/spinner";
import UpperbarContext from "../../../context/upperbar-context";
import StaffContext from "../staffState/StaffContext";
import { FaRegCalendarAlt } from "react-icons/fa";
export default function Product() {
  const { fiscalYear, todayDate, appURL, darkText } =
    useContext(UpperbarContext);
  const { customStylesForImage } = useContext(StaffContext);

  const [productPopup, setProductPopup] = useState(false);
  const [productEditPopup, setProductEditPopup] = useState(false);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [originalList, setOriginalList] = useState(null);
  const searchInput = useRef("");

  const [imgPrv, setImgPrv] = useState(false);
  const [imagePre, setImagePre] = useState("");

  const productValue = {
    productId: "",
    productName: "",
    description: "",
  };

  const [productFormValue, setProductFormValue] = useState(productValue);
  const [productFormError, setProductFormError] = useState({});

  const [isUploaded, setIsUploaded] = useState(false);
  const [typeFile, setTypeFile] = useState("");
  const [image, setImage] = useState("");

  const { User } = useContext(AuthContext);

  const addLeaveNote = (e) => {
    setProductPopup(true);

    setProductFormValue(productValue);
  };

  const [titleId, setTitleID] = useState();
  const editPop = (datas) => {
    setProductEditPopup(true);
    setTitleID(datas.ProdID);
    setProductFormValue({
      productId: datas.ProductID,
      productName: datas.Product,
      description: datas.Description,
    });
    setImage(datas.PImage);
  };

  //API to hit Department status

  const stateInitial = [];
  const [newStat, setNewStat] = useState(stateInitial);

  const deactivateDepart = (ID, IsActive) => {
    const dataForm = {
      ComID: User.CompanyId,
      StaffID: User.UID,
      ProdID: ID,
      Flag: "US",
      Status: IsActive,
      BranchID: User.BranchId,
      FiscalID: User.FiscalId,
      FetchURL: `${appURL}api/admin/product`,
      Type: "POST",
    };
    if (IsActive === 1) {
      dataForm.Status = 0;
    } else {
      dataForm.Status = 1;
    }
    Fetchdata(dataForm).then(function (result) {
      if (result.StatusCode === 200) {
        proList();
        let statsN = JSON.parse(JSON.stringify(newStat));
        let pitchStatus;

        if (dataForm.Status === 1) {
          pitchStatus = "Activated";
        } else if (dataForm.Status === 0) {
          pitchStatus = "Deactivated";
        }

        setNewStat(statsN);
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
  };

  const changeStatus = (ID, IsActive) => {
    deactivateDepart(ID, IsActive);
  };

  const checkStatus = (IsActive) => {
    if (IsActive === 1) {
      return "Deactivate";
    } else if (IsActive === 0) {
      return "Activate";
    }
  };

  const columns = [
    {
      name: "S.N.",
      grow: 0,
      center: true,
      cell: (row, index) => index + 1,
    },
    {
      name: "ProductID",
      // grow: 0,
      center: true,
      selector: (row) => row.ProductID,
    },
    {
      name: "Name",
      center: true,
      // grow: 0,
      selector: (row) => row.Product,
    },
    {
      name: "Image",
      // grow: 0,
      center: true,
      selector: (row) => {
        return (
          <>
            <div className="staffImg tl">
              <div className="staffContentLogo tl">
                <img
                  src={row.PImage}
                  alt="dp"
                  onClick={() => {
                    setImagePre(row.PImage);
                    setImgPrv(true);
                  }}
                />
              </div>
            </div>
          </>
        );
      },
    },

    {
      name: "Description",
      // grow: 0,
      center: true,
      selector: (row) => row.Description,
    },
    {
      name: "Lead",
      center: true,
      // grow: 0,
      selector: (row) => row.LeadCount,
    },
    {
      name: "Follow Up",
      center: true,
      // grow: 0,
      selector: (row) => row.FollowCount,
    },
    {
      name: "Support",
      center: true,
      // grow: 0,
      selector: (row) => row.SupportCount,
    },
    {
      name: "Action",
      // grow: 0,
      center: true,
      width: "200px",
      selector: (row) => {
        return (
          <>
            <div className="ln-verition d-flex">
              <button
                type="button"
                class="btn btn-sm editspan"
                onClick={() => editPop(row)}
              >
                View{" "}
              </button>{" "}
              <button
                type="button"
                class="btn btn-sm actvspan"
                onClick={() => changeStatus(row.ProdID, row.Status)}
              >
                {checkStatus(row.Status)}
              </button>
            </div>
          </>
        );
      },
    },
  ];

  //API to hit Product list
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    proList();
  }, []);

  const proList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: -1,
      Flag: "s",
      Type: "POST",
      BranchID: User.BranchId,
      FetchURL: `${appURL}api/admin/product`,
    };

    Fetchdata(params).then(function (result) {
      if (result.StatusCode === 200) {
        const postResult = result.ProductList ? result.ProductList : "";
        setProductList(postResult);
        setOriginalList(postResult);
        setLoading(false);
      } else {
        setLoading(false);
        setProductList({});
      }
    });
  };

  const searchHandler = (e) => {
    e.preventDefault();

    const srchQuery = searchInput.current.value.toLowerCase();
    if (srchQuery) {
      let srchResult = originalList.filter((list) => {
        return list["Product"].toLowerCase().includes(srchQuery);
      });

      if (srchResult) {
        setProductList(srchResult);
      } else {
        setProductList({});
      }
    } else {
      setProductList(originalList);
    }
  };

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
      <div className="container-fluid classatten-wrapper  mt-3 ps-4 pe-4">
        <div className="row mt-3">
          <div className="page-header">
            <div className="text-start  page-title" style={darkText}>
              Product
            </div>
            <div className="page-date">
              <div className="sec-content" style={darkText}>
                <FaRegCalendarAlt /> {todayDate} <span>|</span> Fiscal Year :{" "}
                {fiscalYear.StartDate}
                <span>-</span>
                {fiscalYear.EndDate}
              </div>
            </div>
          </div>
          <hr className="title-hr" />
        </div>
        <>
          <div className="sec-dataTable">
            <div className="upper-dataTbl">
              <div className="btn-addlnote mb-3">
                <button
                  type="button"
                  class="btn btn-sm"
                  style={{
                    background: "var(--button-color)",
                    color: "white",
                  }}
                  onClick={addLeaveNote}
                >
                  Add New
                </button>
              </div>
            </div>
            {loading ? (
              <Spinner />
            ) : (
              <DataTable
                columns={columns}
                data={productList}
                customStyles={customStylesForImage}
                pagination
                fixedHeader
                fixedHeaderScrollHeight="340px"
                highlightOnHover
                pointerOnHover
                responsive
                dense
                striped
                progressPending={loading}
                subHeader
                subHeaderComponent={
                  <>
                    <div className="upper-dataTbl">
                      <div className="d-flex">
                        <input
                          placeholder="Search"
                          ref={searchInput}
                          type="text"
                          className="form-control form-control-sm searchField"
                          onChange={searchHandler}
                        />
                      </div>
                    </div>
                  </>
                }
              />
            )}
          </div>
        </>
      </div>
      {productPopup && (
        <ProductPopup
          setProductPopup={setProductPopup}
          reload={reload}
          setReload={setReload}
          proList={proList}
          productFormValue={productFormValue}
          setProductFormValue={setProductFormValue}
          productFormError={productFormError}
          setProductFormError={setProductFormError}
          isUploaded={isUploaded}
          setIsUploaded={setIsUploaded}
          typeFile={typeFile}
          image={image}
          setTypeFile={setTypeFile}
          setImage={setImage}
        />
      )}

      {productEditPopup && (
        <ProductEditPopup
          setProductEditPopup={setProductEditPopup}
          reload={reload}
          setReload={setReload}
          proList={proList}
          productFormValue={productFormValue}
          setProductFormValue={setProductFormValue}
          productFormError={productFormError}
          setProductFormError={setProductFormError}
          isUploaded={isUploaded}
          setIsUploaded={setIsUploaded}
          typeFile={typeFile}
          image={image}
          setTypeFile={setTypeFile}
          setImage={setImage}
          titleId={titleId}
        />
      )}

      {imgPrv &&
        ShowImgPreview({
          img: imagePre,
          setTrigger: setImgPrv,
        })}
    </>
  );
}
