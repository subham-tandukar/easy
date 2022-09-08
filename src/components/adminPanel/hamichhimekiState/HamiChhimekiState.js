import React, { useState, useEffect, useContext } from "react";
import { Fetchdata } from "../../hooks/getData";
import HamiChhimekiContext from "./HamiChhimekiContext";
import { ToastContainer, toast } from "react-toastify";


function HamiChhimekiState(props) {
    const chhimekiURL = process.env.REACT_APP_URL_TWO;
    const [closeChecked, setCloseChecked] = useState(false);

    const [popup, setPopup] = useState(false);
    const [editPop, setEditPop] = useState(false);
    const [chhimekiFormError, setChhimekiFormError] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [isEditSubmit, setIsEditSubmit] = useState(false);
    const [loading, setLoading] = useState(true);


    const chhimekivalue = {
        chhimekiID: "",
        name: "",
        address: "",
        contact: "",
        email: "",
        about: "",
        website: "",
        facebook: "",
        establishDate: "",
        head: "",
        latitude: "",
        longitude: "",
        expiryDate: "",
        allowStatus: "",
        serverKey: "",
        senderID: ""
    };

    const [chhimekiFormValue, setChhimekiFormValue] = useState(chhimekivalue);
    const [image, setImage] = useState("")
    const [isUploaded, setIsUploaded] = useState(false);
    const [typeFile, setTypeFile] = useState("");
    const [pushNotice, setPushNotice] = useState(false);

    const [originalList, setOriginalList] = useState(null);



    //API to hit Chhimeki List


    const [chhimekiList, setChhimekiList] = useState([])

    useEffect(() => {
        chmList();
    }, []);

    const chmList = () => {
        const params = {
            Flag: "S",
            IsAllow: "-1",
            CreatedBy: 1,
            CType: 1,
            Type: "POST",
            FetchURL: `${chhimekiURL}/api/sadmin/chhimeki-info`,
        };

        Fetchdata(params).then(function (result) {

            if (result.StatusCode === 200) {
                const postResult = result.ChhimekiLst ? result.ChhimekiLst : "";
                setLoading(false);
                setChhimekiList(postResult);
                setOriginalList(postResult);
            } else {
                setChhimekiList([]);
            }
        });
    }

    const [titleId, setTitleID] = useState()

    const handleEdit = (datas) => {

        setEditPop(true);
        setTitleID(datas.ChhimekiID)
        easyList()
    }

    //API to hit Chhimeki Info

    // const [staffInfoList, setStaffInfoList] = useState([])

    useEffect(() => {
        easyList();
    }, [titleId]);

    const easyList = () => {
        const params = {
            ChhimekiID: titleId,
            Flag: "SI",
            FetchURL: `${chhimekiURL}/api/sadmin/chhimeki-info`,
            Type: "POST"
        };

        Fetchdata(params).then(function (result) {
            if (result.StatusCode === 200) {
                const data = result.ChhimekiLst[0] ? result.ChhimekiLst[0] : "";

                setChhimekiFormValue({
                    chhimekiID: data.ChhimekiID,
                    name: data.Name,
                    address: data.Address,
                    contact: data.Contact,
                    email: data.Email,
                    about: data.About,
                    website: data.Website,
                    facebook: data.Facebook,
                    establishDate: data.EstablishDate,
                    head: data.Adakshya,
                    latitude: data.Latitude,
                    longitude: data.Longitude,
                    expiryDate: data.ExpiryDate,
                    allowStatus: data.IsAllow,
                    serverKey: data.ServerKey,
                    senderID: data.SenderID
                })
                setImage(data.Logo)

            } else {


            }
        });
    }


    //API to hit Staff status

    const stateInitial = [];
    const [newStat, setNewStat] = useState(stateInitial);

    const deactivateDepart = (ID, IsActive) => {

        const dataForm = {
            ChhimekiID: ID,
            Flag: "US",
            Status: IsActive,
            UpdatedBy: "1",
            CType: "1",
            FetchURL: `${chhimekiURL}/api/sadmin/chhimeki-info`,
            Type: "POST",
        }
        if (IsActive === 1) {
            dataForm.Status = 0
        } else {
            dataForm.Status = 1
        }
        Fetchdata(dataForm).then(function (result) {

            if (result.StatusCode === 200) {
                chmList();
                let statsN = JSON.parse(JSON.stringify(newStat));
                let pitchStatus;

                if (dataForm.Status === 1) {
                    pitchStatus = "Activated";

                } else if (dataForm.Status === 0) {
                    pitchStatus = "Deactivated";
                }

                setNewStat(statsN)
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
    }


    //API to hit Agree/Disagree status

    const stateInitials = [];
    const [newStats, setNewStats] = useState(stateInitials);

    const deactivateAgree = (ID, IsActive) => {

        const dataForm = {
            ChhimekiID: ID,
            Flag: "ia",
            IsAllow: IsActive,
            UpdatedBy: "1",
            CType: "1",
            FetchURL: `${chhimekiURL}/api/sadmin/chhimeki-info`,
            Type: "POST",
        }
        if (IsActive === "Y") {
            dataForm.IsAllow = "N"
        } else {
            dataForm.IsAllow = "Y"
        }
        Fetchdata(dataForm).then(function (result) {

            if (result.StatusCode === 200) {
                chmList();
                let statsN = JSON.parse(JSON.stringify(newStats));
                let pitchStatus;

                if (dataForm.IsAllow === "Y") {
                    pitchStatus = "Agree";

                } else if (dataForm.IsAllow === "N") {
                    pitchStatus = "Disagree";
                }

                setNewStats(statsN)
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
    }


    return (
        <HamiChhimekiContext.Provider
            value={{
                chhimekiFormValue, setChhimekiFormValue, chhimekivalue, popup, setPopup, chhimekiFormError, setChhimekiFormError, isSubmit, setIsSubmit, loading, setLoading, image, setImage, isUploaded, setIsUploaded, typeFile, setTypeFile, closeChecked, setCloseChecked, pushNotice, setPushNotice, editPop, setEditPop, handleEdit, isEditSubmit, setIsEditSubmit, chmList, chhimekiList, deactivateDepart, deactivateAgree, chhimekiURL, originalList, setOriginalList, setChhimekiList
            }}
        >
            {props.children}
        </HamiChhimekiContext.Provider>
    );
}
export default HamiChhimekiState;
