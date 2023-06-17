import "./CustomerInstance.scss"
import {useEffect, useState} from "react"
import Cookie from "js-cookie"
import {getUserData, modifyClientInfo} from "../../../components/ClientAPI/ClientAPI"
import NavBar from "../../../components/NavBar/NavBar"
import Loader from "../../../components/Loader/Loader"
import GenButton from "../../../components/GenButton/GenButton"
import {isAdmin} from "../../../components/ClientAPI/ClientAPI"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCircleUser, faPen} from "@fortawesome/free-solid-svg-icons"
import {convertDate} from "../../../components/ClientAPI/UtilsAPI"
import Popup from "../../../components/Popup/Popup";
import TextFields from "../../../components/TextFields/TextFields"

export default function CustomerInstance() {
    const categorys = {
        settings: {text: "Settings", label: "settings"},
        likelist: {text: "Wish List", label: "wishlist"},
        admin: {text: "Admin Panel", label: "adminpanel"}
    }

    const [userData, setUserData] = useState({})
    const [activeCat, setActiveCat] = useState(categorys.settings.label)

    const [isPseudoModifier, setIsPseudoModifier] = useState(false)
    const [isEmailModifier, setIsEmailModifier] = useState(false)
    const [isPhoneModifier, setIsPhoneModifier] = useState(false)

    const [pseudoModify, setPseudoModify] = useState("")
    const [emailModify, setEmailModify] = useState("")
    const [phoneModify, setPhoneModify] = useState("")

    function handlerRegisterInputs(event, fn) {
        fn(event.target.value)
    }

    function handleModifier(what) {
        switch(what) {
            case "pseudo": {
                setIsPseudoModifier(!isPseudoModifier)
                break;
            }

            case "email": {
                setIsEmailModifier(!isEmailModifier)
                break;
            }

            case "phone": {
                setIsPhoneModifier(!isPhoneModifier)
                break;
            }
        }
    }

    function handleConfirmModification(what) {
        switch(what) {
            case "pseudo": {
                setIsPseudoModifier(false)
                handleModify("pseudo", pseudoModify)
                break;
            }

            case "email": {
                setIsEmailModifier(false)
                handleModify("email", emailModify)
                break;
            }

            case "phone": {
                setIsPhoneModifier(false)
                handleModify("phone", phoneModify)
                break;
            }
        }
    }

    /**
     * @desc Modify some information in db
     * */
    function handleModify(what, newvalue) {
        modifyClientInfo(what, newvalue)
            .then((res) => {
                if(res) {
                    res.created = convertDate(res.created)
                    setUserData(res)
                    openPopup("Succes", `${what} changed by ${newvalue}`)
                } else {
                    openPopup(`Error`, `${newvalue} already exist !`)
                }
            })
    }

    /**
     * @desc Popup
     * */
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [popupInfos, setPopupInfos] = useState({
        title: "",
        text: ""
    })

    function openPopup(title, text) {
        setPopupInfos({ title: title, text: text })
        setIsPopupOpen(true)
    }

    function closePopup() {
        setIsPopupOpen(false)
    }

    /**
     * @desc Switch categorys
     * @param { string } which Category
     * */
    function handlerCat(which) {
        setActiveCat(which)
    }

    /**
     * @desc Handler to disconnect user (delete the token cookie)
     * */
    function handlerDisconnect() {
        Cookie.remove("token")
        window.location = "/home"
    }

    useEffect(() => {
        document.title = "French Connection | My Account"

        if(!Cookie.get("token")) {
            window.location = "/home"
            return
        } else {
            getUserData()
                .then((res) => {
                    res.data.created = convertDate(res.data.created)
                    setUserData(res.data)
            })
        }
    }, [])

    return (
        <div id="customerinstance-container">
            <NavBar where="myaccount" />

            {isPopupOpen && (
                <Popup
                    title={popupInfos.title}
                    text={popupInfos.text}
                    isOpen={isPopupOpen}
                    onClose={closePopup}
                />
            )}

            <div id="customerinstance-res">
                <div id="customerinstance-cat">
                    <GenButton
                        text={ categorys.settings.text }
                        persostyle={{ width: "90px" }}
                        handler={ () => { handlerCat(categorys.settings.label) } }
                    />

                    <GenButton
                        text={ categorys.likelist.text }
                        persostyle={{ width: "90px" }}
                        handler={ () => { handlerCat(categorys.likelist.label) } }
                    />

                    { isAdmin(userData) ?
                        <GenButton
                            text={ categorys.admin.text }
                            persostyle={{ width: "90px" }}
                            handler={ () => { window.location = "/admin" } }
                        />  : null}

                    <GenButton
                        text="Log out"
                        persostyle={{ width: "90px", background: "red", color: "white"}}
                        handler={ handlerDisconnect }
                    />
                </div>

                <div id="customerinstance-settings">
                    { !userData ?
                        <Loader />
                        :
                        <div id="customeronstance-card">
                            { activeCat === categorys.settings.label ?
                                <div id="customeronstance-card-settings">
                                    <FontAwesomeIcon icon={faCircleUser} className="icon" />
                                    <span>Personal informations</span>
                                    <div className="line"></div>

                                    <div id="customeronstance-card-container">
                                        <span className="customeronstance-card-info">
                                            Pseudo

                                            { isPseudoModifier ?
                                                <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "10px"}}>
                                                    <TextFields
                                                        min="5"
                                                        oc={(event) => { handlerRegisterInputs(event, setPseudoModify) }}
                                                        placeholder={userData.user}
                                                    />
                                                    <GenButton text="OK" handler={() => {
                                                        handleConfirmModification("pseudo")
                                                    }}/>
                                                </div>
                                            :
                                                <span className="customeronstance-card-info-text">
                                                    {userData.user}
                                                </span>
                                            }

                                            <FontAwesomeIcon
                                                className="customeronstance-card-info-modify"
                                                icon={faPen}
                                                onClick={() => {
                                                    handleModifier("pseudo")
                                                }}
                                            />
                                        </span>

                                        <span className="customeronstance-card-info">
                                            Email

                                            { isEmailModifier ?
                                                <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "10px"}}>
                                                    <TextFields
                                                        min="5"
                                                        oc={(event) => { handlerRegisterInputs(event, setEmailModify) }}
                                                        placeholder={userData.email}
                                                    />
                                                    <GenButton text="OK" handler={() => {
                                                        handleConfirmModification("email")
                                                    }}/>
                                                </div>
                                            :
                                                <span className="customeronstance-card-info-text">
                                                    {userData.email}
                                                </span>
                                            }

                                            <FontAwesomeIcon
                                                className="customeronstance-card-info-modify"
                                                icon={faPen}
                                                onClick={() => {
                                                    handleModifier("email")
                                                }}
                                            />
                                        </span>

                                        <span className="customeronstance-card-info">
                                            Phone

                                            { isPhoneModifier ?
                                                <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "10px"}}>
                                                    <TextFields
                                                        min="5"
                                                        oc={(event) => { handlerRegisterInputs(event, setPhoneModify) }}
                                                        placeholder={userData.phone}
                                                    />
                                                    <GenButton text="OK" handler={() => {
                                                        handleConfirmModification("phone")
                                                    }}/>
                                                </div>
                                            :
                                                <span className="customeronstance-card-info-text">
                                                    {userData.phone}
                                                </span>
                                            }

                                            <FontAwesomeIcon
                                                className="customeronstance-card-info-modify"
                                                icon={faPen}
                                                onClick={() => {
                                                    handleModifier("phone")
                                                }}
                                            />
                                        </span>

                                        <span className="customeronstance-card-info">
                                            Created
                                            <span className="customeronstance-card-info-text">
                                                {userData.created}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                : null}

                            { activeCat === categorys.likelist.label ?
                                <div>
                                    <span>{categorys.likelist.label}</span>
                                </div>
                                : null}
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}