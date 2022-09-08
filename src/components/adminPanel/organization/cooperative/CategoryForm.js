import React, { useContext, useEffect, useRef, useState } from "react";
import "../../../leaveNotes/leaveNotePopup.css";
import "../subdepartment/SubdepartmentPopup.css";
import "../../../hooks/imagePreview.css";
import "../product/ProductPopup.css";
import "../../../hooks/imagePreview.css";
import "./CategoryPopup.css";
import AuthContext from "../../../context/auth-context";
import { Fetchdata } from "../../../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpperbarContext from "../../../context/upperbar-context";
import CooperativeContext from "../cooperativeState/CooperativeContext";
import DataTable from "react-data-table-component";
import CryptoJS from "crypto-js";

export default function CategoryForm() {
    const reactURL = process.env.REACT_APP_URL_ONE;
    const apisignature = process.env.REACT_APP_SIGNATURE;
    const { User } = useContext(AuthContext);
    const { appURL } = useContext(UpperbarContext);
    const {
        setCategoryPopup, categoryFormValue, setCategoryFormValue, categoryFormError, setCategoryFormError, categoryvalue, categorySubmit, setCategorySubmit, commissionList, setCommissionList, inputFields, setInputFields, originalList, searchCategory, catList
    } = useContext(CooperativeContext);

    const searchInput = useRef("");

    const closePopUp = (e) => {
        setCategoryPopup(false);
        setCategoryFormError({});
        setCategorySubmit(false);
        setCategoryFormValue(categoryvalue)
        setInputFields([])
    };

    const handleChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.type == "checkbox" ? target.checked : target.value;
        setCategoryFormValue({ ...categoryFormValue, [name]: value });
    };


    const formNext = (e) => {
        e.preventDefault();
        setCategoryFormError(validate(categoryFormValue));
        setCategorySubmit(true);
    };

    useEffect(() => {
        if (Object.keys(categoryFormError).length === 0 && categorySubmit) {
            fetchdata(categoryFormValue)
            setCategorySubmit(false);
        }
    }, [categoryFormError]);

    // const requestOptions = {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(dataForm)
    // };
    // fetch(`${reactURL}EasySoftOnlineData/api/sadmin/cooperative`, requestOptions)
    //     .then((result) => {
    //         result.json().then((resp) => {
    //             if (result.STATUS_CODE === "0") {
    //                 setCooperativePopup(false);
    //                 //   stfList();
    //                 toast(result.Message, {
    //                     style: {
    //                         color: "green",
    //                         fontSize: "13px",
    //                     },
    //                 });
    //             } else {
    //                 toast("Error: " + result.Message, {
    //                     style: {
    //                         color: "red",
    //                         fontSize: "13px",
    //                     },
    //                 });
    //             }

    //         })
    //     })








    const validate = (values) => {
        const errors = {};

        if (!values.categoryName) {
            errors.categoryName = "Required";
        }

        return errors;
    };




    const columns = [
        {
            name: "S.N.",
            grow: 0,
            center: true,
            cell: (row, index) => index + 1,
        },

        {
            name: "Operator",
            center: true,
            // grow: 0,
            selector: (row) => row.operatorName,
        },
        {
            name: "Comm. Type",
            // grow: 0,
            center: true,
            selector: (row) => row.catType === "P" ? "Percentage" : "Flat",

        },
        {
            name: "Commission",
            // grow: 0,
            center: true,
            selector: (row) => row.catType && row.catType === "P" ? row.pRate : row.fRate
        },

        {
            name: "Cooperative",
            center: true,
            // grow: 2,
            cell: (row) => {
                let list = row.operatorName;

                return (
                    <>
                        <div >
                            <input
                                type="number"
                                name={list}
                                onChange={(e) => handleFormChange([row, e.target.value, e])}
                                className="form-control form-control-sm"
                                style={{ width: "70px" }} min="0"

                                max={row.catType === "P" ? row.pRate : row.fRate} step="0.1" />

                        </div>

                    </>
                );
            },
        },

    ];


    const catValidation = (datas, cat) => {
        if (datas.catType === "P") {
            if (cat <= parseFloat(datas.pRate)) {
                return true;

            } else {

                return false;
            }

        }

        else if (datas.catType === "F") {

            if (cat <= parseFloat(datas.fRate)) {
                return true;
            } else {

                return false;
            }
        }
    }


    const handleFormChange = (data) => {
        let getId = data[0].operatorName;
        let optName = getId;

        let valResult = catValidation(data[0], parseFloat(data[1]))

        if (valResult) {

            let indexList = inputFields ? inputFields.findIndex((list) => list.operatorName === optName) : -1;

            if (indexList < 0) {
                setInputFields([
                    ...inputFields, {
                        operatorName: optName,
                        categoryType: data[0].catType,
                        flatRate: data[0].catType === "F" ? data[1] : 0,
                        percentageRate: data[0].catType === "P" ? data[1] : 0,
                    }
                ]);
            }
            else {
                if (data[0].catType === "F") {
                    inputFields[indexList].flatRate = data[1]
                }
                else if (data[0].catType === "P") {
                    inputFields[indexList].percentageRate = data[1];
                }

            }


        } else {

            let tagId = data[2].target.name;
            let tag = document.getElementsByName(tagId);
            // toast("Error Value Exceeded", {
            //     style: {
            //         color: "red",
            //         fontSize: "13px",
            //     },
            //     className: "",
            // });
            tag[0].value = "";
        }
    }




    const fetchdata = async () => {

        const dataForm = {
            IsEncryptReq: "N",
            TimeStamp: "2022-05-02T01:35:44.345",
            CoOperativeCode: "ADMIN",
            UserName: User.Username,
            flag: "I",
            categoryName: categoryFormValue.categoryName,
            IsCoOperative: "Y",
            categoryId: 0,
            CommissionDetails: inputFields

        }

        var key = CryptoJS.enc.Utf8.parse("D89035A6634F4C4786B947518F17A18A");
        var iv = CryptoJS.enc.Utf8.parse("EasyS0ftS0ftware");

        var encrypted = CryptoJS.AES.encrypt(
            JSON.stringify(dataForm),
            key, //dataForm
            {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            }
        );

        const dts = {
            EncrytedText: encrypted.toString(),
        };
        const response = await fetch(`${reactURL}MblPayPanel/Category/CreateCategory`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Signature: apisignature,
            },
            body: JSON.stringify(dts), //dts
        });
        const pay = await response.json();


        if (pay.statuS_CODE === "0") {
            // setCooperativePopup(false);
            catList();
            toast(pay.message, {
                style: {
                    color: "green",
                    fontSize: "13px",
                },
            });
        } else {
            toast(pay.message, {
                style: {
                    color: "red",
                    fontSize: "13px",
                },
            });
        }


    };


    const searchHandler = (e) => {
        e.preventDefault();

        const srchQuery = searchInput.current.value.toLowerCase();

        if (srchQuery) {

            let srchResult = searchCategory.filter((list) => {
                return list["operatorName"].toLowerCase().includes(srchQuery);
            });

            if (srchResult) {

                setCommissionList(srchResult);
            } else {
                setCommissionList({});
            }
        } else {
            setCommissionList(searchCategory);
        }
    };



    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
            />
            <div className="categorypopUpBody ps-3 pe-3">
                <div className="col-md-12 col-sm-12 col-lg-12">
                    <div className="row text-start">
                        <div className="form-group">
                            <label className="form-label" htmlFor="categoryName" style={{ fontSize: "12px" }}>Category Name<sup className="sup-col">*</sup></label>
                            <input type="text" className="form-control form-control-sm" onChange={handleChange} value={categoryFormValue.categoryName} id="categoryName" name="categoryName" />
                            <p className="errormsg " style={{ marginBottom: "0" }}>{categoryFormError.categoryName}</p>
                        </div>
                    </div>


                    {/* <div className="col-md-8 col-sm-8 col-lg-8">
                            <div className="form-group">
                                <label className="form-label" htmlFor="CoopName" style={{ fontSize: "12px" }}>Cooperative Name</label>
                                <input type="text" className="form-control form-control-sm mb-1" onChange={handleChange} value={cooperativeFormValue.CoopName} id="CoopName" name="CoopName" />
                            </div>
                        </div> */}
                    <DataTable
                        columns={columns}
                        data={commissionList}
                        pagination
                        fixedHeader
                        fixedHeaderScrollHeight="410px"
                        highlightOnHover
                        pointerOnHover
                        responsive
                        dense
                        striped
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

                </div>
            </div>



            <div className="ln-popUpFooter">
                <div className="row  mt-1 mb-1">
                    <div>
                        <button
                            type="button"
                            class="btn btn-sm me-2"
                            style={{ background: "var(--button-color)", color: "white" }}
                            onClick={formNext}
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
        </>
    );
}
