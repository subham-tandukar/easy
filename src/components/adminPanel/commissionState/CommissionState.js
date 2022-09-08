import React, { useState, useEffect, useContext } from "react";
import { Fetchdata } from "../../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import CommissionContext from "./CommissionContext";
import CryptoJS from "crypto-js";
import AuthContext from "../../context/auth-context";
import CooperativeContext from "../organization/cooperativeState/CooperativeContext";
const apisignature = process.env.REACT_APP_SIGNATURE;


function CommissionState(props) {
    const reactURL = process.env.REACT_APP_URL_ONE;


    const [popup, setPopup] = useState(false);
    const [commissionFormError, setCommissionFormError] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [loading, setLoading] = useState(true);

    const [inputFields, setInputFields] = useState([]);
    const [chooseGateway, setChooseGateway] = useState("KHALTI");
    const { User } = useContext(AuthContext);
    const { getList } = useContext(CooperativeContext)



    const commissionvalue = {
        gateway: "",
        operator: "",
        commissionType: "",
        rate: "",
    };

    const [commissionFormValue, setCommissionFormValue] = useState(commissionvalue);
    const [originalList, setOriginalList] = useState(null);

    //API to hit dropdown in commission form && for operator list
    //API to hit Cooperative list
    const [operatorList, setOperatorList] = useState([]);

    useEffect(() => {
        oprList();
    }, []);

    const oprList = () => {
        const params = {
            Type: "POST",
            FetchURL: `${reactURL}MblPayPanel/Category/GetOperatorList`,
        };


        Fetchdata(params).then(function (result) {

            if (result.statuS_CODE === "0") {
                const postResult = result.lstOperator ? result.lstOperator : "";
                setOperatorList(postResult);
                setLoading(false);
            } else {
                setLoading(false);
                setOperatorList([]);

            }
        });

    };

    //API to add commission form

    const fetchdata = async () => {

        const dataForm = {
            Flag: "I",
            categoryName: commissionFormValue.gateway,
            operatorName: commissionFormValue.operator,
            categoryType: commissionFormValue.commissionType,
            flatRate: commissionFormValue.commissionType === "F" ? commissionFormValue.rate : "0.0",
            percentageRate: commissionFormValue.commissionType === "P" ? commissionFormValue.rate : "0.0",
            IsEncryptReq: "N",
            TimeStamp: "2022-05-02T01:35:44.345"
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
        const response = await fetch(`${reactURL}MblPayPanel/Category/CreateAdminCategory`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Signature: apisignature,
            },
            body: JSON.stringify(dts), //dts
        });
        const pay = await response.json();


        if (pay.statuS_CODE === "0") {
            comList();
            getList();
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

    //API to hit Cooperative list
    const [commissionList, setCommissionList] = useState([]);

    useEffect(() => {
        comList();
    }, [chooseGateway]);

    const comList = () => {
        const params = {
            Type: "POST",
            FetchURL: `${reactURL}MblPayPanel/Category/GetOperatorDetails?CategoryID=${chooseGateway}`,
        };


        Fetchdata(params).then(function (result) {

            if (result.statuS_CODE === "0") {
                const postResult = result.lstOperatordtl ? result.lstOperatordtl : "";
                setCommissionList(postResult);
                setOriginalList(postResult);
                setLoading(false);
            } else {
                setLoading(false);
                setCommissionList([]);

            }
        });

    };

    //FOr update bulk input fields

    const [catId, setCatId] = useState("")


    const updatedata = async () => {

        const dataForm = {
            IsEncryptReq: "N",
            TimeStamp: "2022-05-02T01:35:44.345",
            CoOperativeCode: "ADMIN",
            UserName: User.Username,
            flag: "U",
            categoryId: catId,
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
        const response = await fetch(`${reactURL}MblPayPanel/Category/UpdateCategoryDetails`, {
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
            //   coopList();
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






    return (
        <CommissionContext.Provider
            value={{
                commissionFormValue, setCommissionFormValue, commissionvalue, popup, setPopup, commissionFormError, setCommissionFormError, isSubmit, setIsSubmit, loading, setLoading, originalList, setOriginalList, operatorList, reactURL, fetchdata, commissionList, setCommissionList, inputFields, setInputFields, chooseGateway, setChooseGateway, updatedata, setCatId
            }}
        >
            {props.children}
        </CommissionContext.Provider>
    );
}
export default CommissionState;
