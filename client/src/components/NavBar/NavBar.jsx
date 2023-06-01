import "./NavBar.scss"
import NavBarLogo from "./assets/logo.png"
import { Link } from "react-router-dom"
import {useState} from "react"
import Cookie from "js-cookie"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {
    faBars, faCartShopping,
    faCircleDown, faCircleInfo,
    faCircleUp, faCompactDisc,
    faHouse, faLocationDot,
    faUser, faXmark
} from "@fortawesome/free-solid-svg-icons";

export default function NavBar({where}) {
    const [moreIsActivate, setIsActivate] = useState(false)
    const [burger, setBurger] = useState(false)

    function handlerMoreIsActivate() {
        setIsActivate(!moreIsActivate)
    }

    function handlerBurger() {
        setBurger(!burger)
    }

    return (
        <nav id="nav-container">
            <div id="nav-paths">
                <Link to="/home" className="stay">
                    <img src={ NavBarLogo } alt="Logo of this website." />
                </Link>

                <Link to="/home" className={ where === "home" ? "selected" : null }>
                    <FontAwesomeIcon icon={faHouse} />
                    <span>&nbsp;Home</span>
                </Link>

                <Link to="/shop" className={ where === "shop" ? "selected" : null }>
                    <FontAwesomeIcon icon={faCartShopping} />
                    <span>&nbsp;Shop</span>
                </Link>

                <Link to="/thursdaywall" className={ where === "thursdaywall" ? "selected" : null }>
                    <FontAwesomeIcon icon={faCompactDisc} />
                    <span>&nbsp;Thursday Wall</span>
                </Link>

                <div id="nav-burger" onClick={handlerBurger}>
                    <FontAwesomeIcon icon={faBars} />
                </div>
            </div>

            <div id="nav-customer">
                <div id="nav-customer-about" onClick={ handlerMoreIsActivate }>
                    { moreIsActivate ?
                        <FontAwesomeIcon icon={faCircleDown} />
                        :
                        <FontAwesomeIcon icon={faCircleUp} />
                    }

                    <div id="nav-more">
                        <span>More</span>

                        { moreIsActivate ?
                            <div id="nav-more-hidden">
                                <Link to="/about" className="nav-more-hidden-content">
                                    <FontAwesomeIcon icon={faCircleInfo} />
                                    <span>About us</span>
                                </Link>

                                <Link to="/localisation" className="nav-more-hidden-content">
                                    <FontAwesomeIcon icon={faLocationDot} />
                                    <span>Localisation</span>
                                </Link>
                            </div>
                        : null}
                    </div>
                </div>

                { Cookie.get("token") ?
                    <div id="nav-customer-infos">
                        <Link to="/myaccount" className={ where === "myaccount" ? "selected" : null }>
                            <FontAwesomeIcon icon={faUser} />
                            <span>&nbsp;Account</span>
                        </Link>
                    </div>
                    :
                    <div id="nav-customer-infos">
                        <Link to="/signin">
                            <FontAwesomeIcon icon={faUser} />
                            <span>&nbsp;Sign in</span>
                        </Link>
                    </div>
                }
            </div>

            { burger ?
                <div id="nav-burger-menu-container">
                    <div id="close" onClick={ handlerBurger }>
                        <FontAwesomeIcon icon={faXmark} />
                    </div>

                    <Link to="/home">
                        <nobr>
                            <FontAwesomeIcon icon={faHouse} />
                            Home
                        </nobr>
                    </Link>

                    <Link to="/shop">
                        <nobr>
                            <FontAwesomeIcon icon={faCartShopping} />
                            Shop
                        </nobr>
                    </Link>

                    <Link to="/thursdaywall">
                        <nobr>
                            <FontAwesomeIcon icon={faCompactDisc} />
                            Thursday Wall
                        </nobr>
                    </Link>

                    { Cookie.get("token") ?
                        <Link to="/myaccount">
                            <nobr>
                                <FontAwesomeIcon icon={faUser} />
                                Account
                            </nobr>
                        </Link>
                    :
                        <Link to="/signin">
                            <nobr>
                                <FontAwesomeIcon icon={faUser} />
                                Sign in
                            </nobr>
                        </Link>
                    }

                    <Link to="/about">
                        <nobr>
                            <FontAwesomeIcon icon={faCircleInfo} />
                            About us
                        </nobr>
                    </Link>

                    <Link to="/localisation">
                        <nobr>
                            <FontAwesomeIcon icon={faLocationDot} />
                            Localisation
                        </nobr>
                    </Link>
                </div>
                : null}
        </nav>
    )
}