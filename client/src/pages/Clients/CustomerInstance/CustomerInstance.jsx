import "./CustomerInstance.scss"
import {useEffect, useState} from "react";
import Cookie from "js-cookie";
import { getUserData } from "../../../components/ClientAPI/ClientAPI"
import NavBar from "../../../components/NavBar/NavBar";
import Loader from "../../../components/Loader/Loader";
import GenButton from "../../../components/GenButton/GenButton";
import {isAdmin} from "../../../components/ClientAPI/ClientAPI";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faArrowRight, faCircleUser, faUser} from "@fortawesome/free-solid-svg-icons";
import {convertDate} from "../../../components/ClientAPI/UtilsAPI";

export default function CustomerInstance() {
    const categorys = {
        settings: {text: "Settings", label: "settings"},
        likelist: {text: "Wish List", label: "wishlist"},
        admin: {text: "Admin Panel", label: "adminpanel"}
    }

    const [userData, setUserData] = useState({})
    const [activeCat, setActiveCat] = useState(categorys.settings.label)

    /**
     * @desc Switch categorys
     * @param { string } which Category
     * */
    function handlerCat(which) {
        setActiveCat(which)
    }

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
                    console.log(res.created)
                    res.date = convertDate(res.created)
                    setUserData(res.data)
            })
        }
    }, [])

    return (
        <div id="customerinstance-container">
            <NavBar where="myaccount" />

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
                                    <FontAwesomeIcon icon={faCircleUser} class="icon" />
                                    <span>Personal informations</span>
                                    <div className="line"></div>
                                    <span>Pseudo <FontAwesomeIcon icon={faArrowRight} /> {userData.user}</span>
                                    <span>Email <FontAwesomeIcon icon={faArrowRight} /> {userData.email}</span>
                                    <span>Tel <FontAwesomeIcon icon={faArrowRight} /> {userData.phone}</span>
                                    <span>Created <FontAwesomeIcon icon={faArrowRight} /> {userData.date}</span>
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