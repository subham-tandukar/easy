import React, { useState, useEffect } from "react";
import { Fetchdata } from "../../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import ClientManagementContext from "./ClientManagementContext";


function ClientManagementState(props) {
    const chhimekiURL = process.env.REACT_APP_URL_TWO;

    //This is all about collector(client Management)

    const [popup, setPopup] = useState(false);
    // const [editPop, setEditPop] = useState(false);
    const [collectorFormError, setCollectorFormError] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    // const [isEditSubmit, setIsEditSubmit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showBalance, setShowBalance] = useState(false);


    const collectorvalue = {
        coopCode: "",
        coopName: "",
        address: "",
        telephone: "",
        logo: "",
    };

    const [collectorFormValue, setCollectorFormValue] = useState(collectorvalue);


    const [originalList, setOriginalList] = useState(null);



    //API to hit Chhimeki List


    // const [chhimekiList, setChhimekiList] = useState([])

    // useEffect(() => {
    //     chmList();
    // }, []);

    // const chmList = () => {
    //     const params = {
    //         Flag: "S",
    //         IsAllow: "-1",
    //         CreatedBy: 1,
    //         CType: 1,
    //         Type: "POST",
    //         FetchURL: `${chhimekiURL}/api/sadmin/chhimeki-info`,
    //     };

    //     Fetchdata(params).then(function (result) {
    //         
    //         if (result.StatusCode === 200) {
    //             const postResult = result.ChhimekiLst ? result.ChhimekiLst : "";
    //             setLoading(false);
    //             setChhimekiList(postResult);
    //             setOriginalList(postResult);
    //         } else {
    //             setChhimekiList([]);
    //         }
    //     });
    // }

    // const [titleId, setTitleID] = useState()

    // const handleEdit = (datas) => {
    //     
    //     setEditPop(true);
    //     setTitleID(datas.ChhimekiID)
    //     easyList()
    // }

    //API to hit Chhimeki Info

    // const [staffInfoList, setStaffInfoList] = useState([])

    // useEffect(() => {
    //     easyList();
    // }, [titleId]);

    // const easyList = () => {
    //     const params = {
    //         ChhimekiID: titleId,
    //         Flag: "SI",
    //         FetchURL: `${chhimekiURL}/api/sadmin/chhimeki-info`,
    //         Type: "POST"
    //     };

    //     Fetchdata(params).then(function (result) {
    //         if (result.StatusCode === 200) {
    //             const data = result.ChhimekiLst[0] ? result.ChhimekiLst[0] : "";
    //             
    //             setChhimekiFormValue({
    //                 chhimekiID: data.ChhimekiID,
    //                 name: data.Name,
    //                 address: data.Address,
    //                 contact: data.Contact,
    //                 email: data.Email,
    //                 about: data.About,
    //                 website: data.Website,
    //                 facebook: data.Facebook,
    //                 establishDate: data.EstablishDate,
    //                 head: data.Adakshya,
    //                 latitude: data.Latitude,
    //                 longitude: data.Longitude,
    //                 expiryDate: data.ExpiryDate,
    //                 allowStatus: data.IsAllow,
    //                 serverKey: data.ServerKey,
    //                 senderID: data.SenderID
    //             })
    //             setImage(data.Logo)

    //         } else {

    //             
    //         }
    //     });
    // }


    //API to hit Staff status

    // const stateInitial = [];
    // const [newStat, setNewStat] = useState(stateInitial);

    // const deactivateDepart = (ID, IsActive) => {
    //     
    //     const dataForm = {
    //         ChhimekiID: ID,
    //         Flag: "US",
    //         Status: IsActive,
    //         UpdatedBy: "1",
    //         CType: "1",
    //         FetchURL: `${chhimekiURL}/api/sadmin/chhimeki-info`,
    //         Type: "POST",
    //     }
    //     if (IsActive === 1) {
    //         dataForm.Status = 0
    //     } else {
    //         dataForm.Status = 1
    //     }
    //     Fetchdata(dataForm).then(function (result) {
    //         
    //         if (result.StatusCode === 200) {
    //             chmList();
    //             let statsN = JSON.parse(JSON.stringify(newStat));
    //             let pitchStatus;

    //             if (dataForm.Status === 1) {
    //                 pitchStatus = "Activated";

    //             } else if (dataForm.Status === 0) {
    //                 pitchStatus = "Deactivated";
    //             }
    //             
    //             setNewStat(statsN)
    //             toast(result.Message, {
    //                 style: {
    //                     color: "green",
    //                     fontSize: "13px",
    //                 },
    //             });

    //         } else {
    //             toast("Error: " + result.Message, {
    //                 style: {
    //                     color: "red",
    //                     fontSize: "13px",
    //                 },
    //             });

    //         }
    //     });
    // }





    return (
        <ClientManagementContext.Provider
            value={{
                popup, setPopup, collectorFormError, setCollectorFormError, isSubmit, setIsSubmit, showBalance, setShowBalance, collectorFormValue, setCollectorFormValue, collectorvalue

            }}
        >
            {props.children}
        </ClientManagementContext.Provider>
    );
}
export default ClientManagementState;
