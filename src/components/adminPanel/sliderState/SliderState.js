import React, { useState, useEffect, useContext } from "react";
import { Fetchdata } from "../../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import SliderContext from "./SliderContext";
import CooperativeContext from "../organization/cooperativeState/CooperativeContext";
import CryptoJS from "crypto-js";


function SliderState(props) {
    const apisignature = process.env.REACT_APP_SIGNATURE;
    const [popup, setPopup] = useState(false);
    const { reactURL } = useContext(CooperativeContext)
    const [sliderFormError, setSliderFormError] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    const [image, setImage] = useState("");
    const [isUploaded, setIsUploaded] = useState(false);
    const [typeFile, setTypeFile] = useState("");

    const [loading, setLoading] = useState(true)
    const [originalList, setOriginalList] = useState("")

    const slidervalue = {
        order: '',

    };

    const [sliderFormValue, setSliderFormValue] = useState(slidervalue);

    //API to insert Slider data
    const fetchdata = async () => {

        const dataForm = {
            CoOperativeCode: "-1",
            SliderOrder: "1",
            SliderImgName: "Image.jpg",
            IsActive: "A",
            SliderImg: image !== null ? image.split(',')[1] : "",
        }


        const response = await fetch(`${reactURL}MblPayPanel/CoOperative/AddSlider`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataForm), //dts
        });
        const pay = await response.json();


        if (pay.statuS_CODE === "0") {
            getSliderList();
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

    const [sliderList, setSliderList] = useState([])

    //API to hit Slider list

    useEffect(() => {
        getSliderList();
    }, [])

    const getSliderList = () => {
        const listForm = {
            CoOperativeCode: "-1",
            ID: "",
            IsEncryptReq: "N",
            TimeStamp: "2022-05-02T01:35:44.345"

        };
        var key = CryptoJS.enc.Utf8.parse("D89035A6634F4C4786B947518F17A18A");
        var iv = CryptoJS.enc.Utf8.parse("EasyS0ftS0ftware");

        var encrypted = CryptoJS.AES.encrypt(
            JSON.stringify(listForm),
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

        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Signature: apisignature,
            },
            body: JSON.stringify(dts)
        };
        fetch(`${reactURL}MblPayPanel/CoOperative/GetSliderList`, requestOptions)
            .then((result) => {
                result.json().then((resp) => {

                    if (resp.statuS_CODE === "0") {
                        setSliderList(resp.sliderImgLst)
                        setOriginalList(resp.sliderImgLst)
                        setLoading(false)
                    }
                    else if (resp.statuS_CODE === "1") {
                        setSliderList({})
                        setLoading(false)

                    }
                })
            })
    };

    //Everything to pop up and delete the slider list
    const [delPopup, setDelPopup] = useState({
        show: false, // initial values set to false and null
        data: null,
    });

    const [Acdata, setACData] = useState()

    // To delete the Account List




    const handleDelete = async (data) => {

        setACData(data)

        setDelPopup({
            show: true,
            data,
        });

    };

    // This will perform the deletion and hide the Confirmation Box


    const handleDeleteTrue = async () => {

        const dataForm = {
            CoOperativeCode: "-1",
            ID: Acdata,
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


        const response = await fetch(`${reactURL}MblPayPanel/CoOperative/DeleteSlider`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Signature: apisignature
            },
            body: JSON.stringify(dts), //dts
        });
        const tole = await response.json();


        if (tole.statuS_CODE === "0") {
            getSliderList()
            toast(tole.message, {
                style: {
                    color: "green",
                    fontSize: "13px",
                },
            });
        } else if (tole.statuS_CODE === "1") {
            toast(tole.message, {
                style: {
                    color: "red",
                    fontSize: "13px",
                },
            });
        }
        setDelPopup({
            show: false,
            data: null,

        });
    };

    // This will just hide the Confirmation Box when user clicks "No"/"Cancel"

    const handleDeleteFalse = () => {
        setDelPopup({
            show: false,
            data: null,
        });
    };



    //Everything to pop up and delete the slider list ends









    return (
        <SliderContext.Provider
            value={{
                popup, setPopup, image, setImage, isUploaded, setIsUploaded, typeFile, setTypeFile, sliderFormError, setSliderFormError, isSubmit, setIsSubmit, loading, setLoading, originalList, setOriginalList, slidervalue, sliderFormValue, setSliderFormValue, fetchdata, sliderList, delPopup, handleDelete, handleDeleteTrue, handleDeleteFalse, setSliderList

            }}
        >
            {props.children}
        </SliderContext.Provider>
    );
}
export default SliderState;
