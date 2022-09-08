import React, { useState, useEffect, useContext } from "react";
import { Fetchdata } from "../../../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import AuthContext from "../../../context/auth-context";
import UpperbarContext from "../../../context/upperbar-context";
import CooperativeContext from "./CooperativeContext";
import CryptoJS from "crypto-js";

function CooperativeState(props) {
    const reactURL = process.env.REACT_APP_URL_ONE;
    const apisignature = process.env.REACT_APP_SIGNATURE;
    const { User } = useContext(AuthContext);
    const { appURL } = useContext(UpperbarContext);

    const [cooperativePopup, setCooperativePopup] = useState(false);
    const [cooperativeEditPopup, setCooperativeEditPopup] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const [editIsSubmit, setEditIsSubmit] = useState(false);

    const [categoryPopup, setCategoryPopup] = useState(false)
    const [assignPopup, setAssignPopup] = useState(false)


    const [originalList, setOriginalList] = useState(null);
    const [searchCategory, setSearchCategory] = useState(null);
    const [searchCommission, setSearchCommission] = useState(null);

    const [allowApp, setAllowApp] = useState(false);
    const [free, setFree] = useState(false);
    const [disableUltility, setDisableUtility] = useState(false);
    const [showBalance, setShowBalance] = useState(false);

    const [loading, setLoading] = useState(false);

    const cooperativevalue = {
        CoopID: '',
        scope: 'E',
        CoopName: '',
        nickName: '',
        address: '',
        color: '',
        contactPerson: '',
        contactNumber: '',
        url: '',
        creditLimit: '',
        noOfUser: '',
        expire: '',
        logo: '',
        serverKey: '',
        senderId: '',
        userName: '',
        fullName: '',
    };

    const [cooperativeFormValue, setCooperativeFormValue] = useState(cooperativevalue);
    const [cooperativeFormError, setCooperativeFormError] = useState({});

    const [paidOption, setPaidOption] = useState("-1");
    const [utilityOption, setUtilityOption] = useState("-1");
    const [creditLimit, setCreditLimit] = useState("-1");
    const [expiredOption, setExpiredOption] = useState("-1");
    const [liveOption, setLiveoption] = useState("-1");
    const [device, setDevice] = useState("-1");
    const [status, setStatus] = useState("-1");







    //Checksession to get IS Manager

    const [userDetails, setUserDetails] = useState("")

    useEffect(() => {
        // const cur_user = localStorage.getItem("token");
        // 
        // cur_user.length && setUserDetails(JSON.parse(cur_user));

        const dataForm = {
            ComID: User.CompanyId,
            UID: User.UID,
            NotificationToken: "265b357b6100dfe8",
            DeviceId: "265b357b6100dfe8",
            FetchURL: `${appURL}api/checksession`,
            Type: "POST",
        };

        Fetchdata(dataForm)
            .then(function (result) {
                if (result.StatusCode === 200) {
                    // 
                    const postResult = result.Logins[0] ? result.Logins[0] : "";
                    if (postResult) {
                        postResult.CompanyId = "ES25";
                        postResult.Username = User.UserName;
                        setUserDetails(postResult);
                    } else {
                        const cur_user = localStorage.getItem("token");

                        cur_user.length && setUserDetails(JSON.parse(cur_user));
                    }
                } else {

                    const cur_user = localStorage.getItem("token");

                    cur_user.length && setUserDetails(JSON.parse(cur_user));
                }
            })
            .then((res) => {
                // 
            });
    }, []);


    //API to hit cooperative form

    const formPost = () => {
        const dataForm = {
            Flag: "I",
            CooperativeCode: cooperativeFormValue.CoopID,
            ServerName: "",
            DbName: "",
            DbUserName: "",
            DbPwd: "",
            CooperativeName: cooperativeFormValue.CoopName,
            NickName: cooperativeFormValue.nickName,
            Logo: cooperativeFormValue.logo,
            LogoType: "U",
            Contact: cooperativeFormValue.contactNumber,
            ContactPerson: cooperativeFormValue.contactPerson,
            Address: cooperativeFormValue.address,
            ColorCode: cooperativeFormValue.color,
            IsPaid: free ? 'Y' : 'N',
            AllowUtils: disableUltility ? 'Y' : 'N',
            CBSUrl: cooperativeFormValue.url,
            ScopeType: cooperativeFormValue.scope,
            CreditLimit: cooperativeFormValue.creditLimit,
            NumOfUser: cooperativeFormValue.noOfUser,
            ServerKey: cooperativeFormValue.serverKey,
            SenderID: cooperativeFormValue.senderId,
            BranchID: "",
            IsApproved: "",
            ApprovedBy: "",
            AllowApp: allowApp ? 'Y' : 'N',
            ShowBalance: showBalance ? 'Y' : 'N',
            ExpiryDate: cooperativeFormValue.expire,
            StaffID: User.UserID,
            FetchURL: `${reactURL}EasySoftOnlineData/api/sadmin/cooperative`,
            Type: "POST",
        };

        Fetchdata(dataForm).then(function (result) {

            if (result.STATUS_CODE === "0") {
                setCooperativePopup(false);
                coopList();
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



    //API to hit cooperative user form

    const fetchdata = async () => {

        const dataForm = {
            CoOperativeCode: cooperativeFormValue.CoopID,
            IsActive: "Y",
            UserName: cooperativeFormValue.userName,
            MacID: "PC-Mijal",
            FullName: cooperativeFormValue.fullName,
            Address: "",
            RoleCd: "000",
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
        const response = await fetch(`${reactURL}MblPayPanel/UserMgnt/CreateUser`, {
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



    //API to hit Cooperative list
    const [cooperativeList, setCooperativeList] = useState([]);

    useEffect(() => {
        coopList();
    }, [paidOption, utilityOption, creditLimit, expiredOption, status, liveOption, device]);

    const coopList = () => {
        const params = {
            Flag: "S",
            IsPaid: paidOption,
            AllowUtils: utilityOption,
            CreditLimit: creditLimit,
            IsExpired: expiredOption,
            StaffID: "-1",
            IsApproved: status,
            IsLive: liveOption,
            Device: device,
            IsEncryptReq: "N",
            TimeStamp: "2022-05-02T01:35:44.345",
        };


        var key = CryptoJS.enc.Utf8.parse("D89035A6634F4C4786B947518F17A18A");
        var iv = CryptoJS.enc.Utf8.parse("EasyS0ftS0ftware");

        var encrypted = CryptoJS.AES.encrypt(
            JSON.stringify(params),
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
        fetch(`${reactURL}MblPayPanel/CoOperative/CoOperativeData`, requestOptions)
            .then((result) => {
                result.json().then((resp) => {

                    if (resp.statuS_CODE === "0") {
                        setCooperativeList(resp.coopConfigList)
                        setOriginalList(resp.coopConfigList)
                        setLoading(false)
                    }
                    else if (resp.statuS_CODE === "1") {
                        setCooperativeList({})
                        setLoading(false)

                    }
                })
            })
    };



    //Api to edit 

    const [titleId, setTitleID] = useState();
    const editPop = (datas) => {

        setTitleID(datas.cooperativeCode);
        setCooperativeEditPopup(true);
    };

    //API to edit user form
    const editData = () => {
        const dataForm = {
            Flag: "U",
            CooperativeCode: cooperativeFormValue.CoopID,
            ServerName: "",
            DbName: "",
            DbUserName: "",
            DbPwd: "",
            CooperativeName: cooperativeFormValue.CoopName,
            NickName: cooperativeFormValue.nickName,
            Logo: cooperativeFormValue.logo,
            LogoType: "U",
            Contact: cooperativeFormValue.contactNumber,
            ContactPerson: cooperativeFormValue.contactPerson,
            Address: cooperativeFormValue.address,
            ColorCode: cooperativeFormValue.color,
            IsPaid: free ? 'Y' : 'N',
            AllowUtils: disableUltility ? 'Y' : 'N',
            CBSUrl: cooperativeFormValue.url,
            ScopeType: cooperativeFormValue.scope,
            CreditLimit: cooperativeFormValue.creditLimit,
            NumOfUser: cooperativeFormValue.noOfUser,
            ServerKey: cooperativeFormValue.serverKey,
            SenderID: cooperativeFormValue.senderId,
            BranchID: "",
            IsApproved: "",
            ApprovedBy: "",
            AllowApp: allowApp ? 'Y' : 'N',
            ShowBalance: showBalance ? 'Y' : 'N',
            ExpiryDate: cooperativeFormValue.expire,
            StaffID: User.UserID,
            FetchURL: `${reactURL}EasySoftOnlineData/api/sadmin/cooperative`,
            // FetchURL: "https://testing.esnep.com/EasySoftOnlineData/api/sadmin/cooperative",
            Type: "POST",
        };
        Fetchdata(dataForm).then(function (result) {

            if (result.STATUS_CODE === "0") {
                setCooperativeEditPopup(false);
                coopList();
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


    //API to hit Cooperative Info
    const [coopInfo, setCoopInfo] = useState([]);

    useEffect(() => {
        coopInfoList();
    }, []);

    const coopInfoList = () => {
        const params = {
            Flag: "SI",
            CooperativeCode: titleId,
            IsEncryptReq: "N",
            TimeStamp: "2022-05-02T01:35:44.345",
        };


        var key = CryptoJS.enc.Utf8.parse("D89035A6634F4C4786B947518F17A18A");
        var iv = CryptoJS.enc.Utf8.parse("EasyS0ftS0ftware");

        var encrypted = CryptoJS.AES.encrypt(
            JSON.stringify(params),
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
        fetch(`${reactURL}MblPayPanel/CoOperative/CoOperativeData`, requestOptions)
            .then((result) => {
                result.json().then((resp) => {

                    if (resp.statuS_CODE === "0") {
                        const data = resp.coopConfigList[0] ? resp.coopConfigList[0] : "";
                        setCooperativeFormValue({
                            CoopID: data.cooperativeCode,
                            scope: data.scopeType,
                            CoopName: data.cooperativeName,
                            nickName: data.nickName,
                            address: data.address,
                            color: data.colorCode,
                            contactPerson: data.contact,
                            contactNumber: data.contact,
                            url: data.cbsUrl,
                            creditLimit: data.creditLimit,
                            noOfUser: data.numOfUser,
                            expire: data.expiryDate,
                            logo: data.logo,
                            serverKey: data.serverKey,
                            senderId: data.senderID,
                        })
                        setAllowApp(data.allowApp)
                        setFree(data.isPaid)
                        // setDisableUtility(data)
                        // setShowBalance(data)

                    }

                })
            })
    };

    // API to get staff info

    //   const [coopInfo, setCoopInfo] = useState([]);

    //   useEffect(() => {
    //     
    //     coopInfoList();
    //   }, [titleId]);

    //   const coopInfoList = () => {
    //     const params = {
    //       Flag: "SI",
    // CooperativeCode: titleId, 
    // CooperativeName: "ES26"
    //       FetchURL: `${reactURL}EasySoftOnlineData/api/sadmin/cooperative`,
    //       Type: "POST",
    //     };

    //     Fetchdata(params).then(function (result) {
    //       
    //       if (result.StatusCode === 200) {
    //         const data = result.CoopConfigList[0] ? result.CoopConfigList[0] : "";
    //         
    //         setCooperativeFormValue({
    //           firstName: data.FirstName,
    //           middleName: data.MiddleName,
    //           lastName: data.LastName,
    //           userID: data.UserID,
    //           userCode: data.UserCode,
    //           deviceCode: data.DeviceCode,
    //           mobileCode: data.MobileID,
    //           userName: data.UserName,
    //           email: data.Email,
    //           contact: data.Contact,
    //           phone: data.Phone,
    //           address: data.Address,
    //           district: data.DistrictID,
    //           dateOfBirth: data.DateOfBirth,
    //           citizenshipNo: data.CitizenshipNo,
    //           pan: data.PAN,
    //           gender: data.GenderID,
    //           blood: data.BloodGroupID,
    //           religion: data.ReligionID,
    //           marital: data.MaritialStatusID,
    //           enrollDate: data.EnrollDate,
    //           leaveDate: data.LeaveDate,
    //           jobType: data.JobTypeID,
    //           selectShift: data.ShiftID,
    //           shiftType: data.ShiftTypeID,
    //           grade: data.GradeID,
    //           department: data.DepartmentID,
    //           subDepartment: data.SubDepartmentID,
    //           designation: data.DesignationID,
    //           days: data.WorkingDays,
    //         });

    //         setImage(data.Image);
    //         setManagerChecked(data.IsManager);
    //         setNotWorking(data.setNotWorking);
    //       } else {
    //         
    //       }
    //     });
    //   };

    //API to hit Cooperative status

    const stateInitial = [];
    const [newStat, setNewStat] = useState(stateInitial);

    const deactivateDepart = (ID, IsActive, coopcode) => {
        const dataForm = {
            Flag: "AP",
            CooperativeCode: coopcode,
            AllowApp: IsActive,
            StaffID: ID,
            FetchURL: `${reactURL}EasySoftOnlineData/api/sadmin/cooperative`,
            Type: "POST",
        };
        if (IsActive === "Y") {
            dataForm.Status = "N";
        } else {
            dataForm.Status = "Y";
        }
        Fetchdata(dataForm).then(function (result) {

            if (result.StatusCode === 200) {
                coopList();
                let statsN = JSON.parse(JSON.stringify(newStat));
                let pitchStatus;

                if (dataForm.Status === "Y") {
                    pitchStatus = "Activated";
                } else if (dataForm.Status === "N") {
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


    // This is all for commission category in Cooperative Components

    const categoryvalue = {
        categoryName: "",
        categoryList: "",
    };



    const [categoryFormValue, setCategoryFormValue] = useState(categoryvalue);
    const [categoryFormError, setCategoryFormError] = useState({});
    const [categorySubmit, setCategorySubmit] = useState(false);

    const [inputFields, setInputFields] = useState([])

    //API to hit category commission list 

    //API to hit category commission list
    const [commissionList, setCommissionList] = useState([]);

    useEffect(() => {
        getList();
    }, []);

    const getList = () => {
        const params = {
            Type: "POST",
            FetchURL: `${reactURL}MblPayPanel/Category/GetOperatorDetails?CategoryID=KHALTI`,
        };


        Fetchdata(params).then(function (result) {

            if (result.statuS_CODE === "0") {
                const postResult = result.lstOperatordtl ? result.lstOperatordtl : "";
                setCommissionList(postResult);
                setSearchCategory(postResult);
                setLoading(false);
            } else {
                setLoading(false);
                setCommissionList([]);

            }
        });

    };


    // End of Commission Category ends in Coopertive Component


    // This all about Assign Commission button in Cooperative List



    const assignvalue = {
        assignComm: "",
    };



    const [assignFormValue, setAssignFormValue] = useState(assignvalue);
    const [assignFormError, setAssignFormError] = useState({});
    const [assignSubmit, setAssignSubmit] = useState(false);

    //API to hit category list
    const [categoryList, setCategoryList] = useState([]);

    useEffect(() => {
        catList();
    }, []);

    const catList = () => {
        const params = {
            Type: "POST",
            FetchURL: `${reactURL}MblPayPanel/Category/GetCategoryList?CoOperativeCode=ES25`,
        };


        Fetchdata(params).then(function (result) {

            if (result.statuS_CODE === "0") {
                const postResult = result.lstOperatordtl ? result.lstOperatordtl : "";
                setCategoryList(postResult);
                setSearchCommission(postResult);
                setLoading(false);
            } else {
                setLoading(false);
                setCategoryList([]);

            }
        });

    };

    const [cooCode, setCooCode] = useState("")


    const assignCommission = async () => {

        const dataForm = {
            CoOperativeCode: cooCode,
            categoryId: assignFormValue.assignComm,
            UserName: User.Username,
            IsCoOperative: "Y",
            IsEncryptReq: "N",
            TimeStamp: "2022-05-02T01:35:44.345"
        }
        console.log(dataForm)

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
        const response = await fetch(`${reactURL}MblPayPanel/Category/AssignCommission`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Signature: apisignature,
            },
            body: JSON.stringify(dts), //dts
        });
        const pay = await response.json();

        console.log(pay)
        if (pay.statuS_CODE === "0") {
            // setCooperativePopup(false);
            coopList();
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

    // Ends assign Commission button in Cooperative List







    return (
        <CooperativeContext.Provider
            value={{
                cooperativePopup, setCooperativePopup, cooperativeEditPopup, setCooperativeEditPopup, isSubmit, setIsSubmit, editIsSubmit, setEditIsSubmit, originalList, setOriginalList, allowApp, setAllowApp, loading, setLoading, cooperativeFormValue, setCooperativeFormValue, cooperativeFormError, setCooperativeFormError, cooperativevalue, free, setFree, disableUltility, setDisableUtility, showBalance, setShowBalance, userDetails, reactURL, titleId, editPop, coopList, formPost, editData, fetchdata, cooperativeList, setCooperativeList, categoryPopup, setCategoryPopup, categoryFormValue, setCategoryFormValue, categoryFormError, setCategoryFormError, categoryvalue, categorySubmit, setCategorySubmit, commissionList, setCommissionList, inputFields, setInputFields, assignFormValue, setAssignFormValue, assignFormError, setAssignFormError, assignSubmit, setAssignSubmit, assignvalue, assignPopup, setAssignPopup, categoryList, assignCommission, searchCommission, setSearchCommission, searchCategory, setSearchCategory, deactivateDepart, getList, setCooCode,
                paidOption, setPaidOption, utilityOption, setUtilityOption, creditLimit, setCreditLimit, expiredOption, setExpiredOption, liveOption, setLiveoption, device, setDevice, status, setStatus, catList
            }}
        >
            {props.children}
        </CooperativeContext.Provider>
    );
}
export default CooperativeState;
