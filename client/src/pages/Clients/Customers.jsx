import "./Customers.scss"
import NavBar from "../../components/NavBar/NavBar"
import Yanti from "./assets/pub.jpg"
import {useEffect, useState} from "react"
import GenButton from "../../components/GenButton/GenButton"
import Popup from "../../components/Popup/Popup"
import axios from "axios";
import Cookie from "js-cookie"
import langages from "./assets/langages.json"
import {getSHA256} from "../../components/ClientAPI/UtilsAPI"

export default function Customers() {
    useEffect(() => {
        if(Cookie.get("token")) {
            window.location = "/myaccount"
        }

        document.title = "French Connection | Sign In"
    }, [])

    /**
     * TODO: Personnal babel
     * langages["fr"].blabla partout
     * */

    /**
     * @desc Registration
     * */
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [username, setUsername] = useState("");
    const [passwordConf, setPasswordConf] = useState("");
    const [date, setDate] = useState("")
    const [isLogin, setIsLogin] = useState(true);

    /**
     * @desc Login
     * */
    const [logEmUs, setLogEmUs] = useState("")
    const [logPass, setLogPass] = useState("")
    const [logCaptcha, setCaptcha] = useState(genCaptcha())
    const [logCaptchaSolution, setLogCaptchaSolution] = useState("")
    const [logRemember, setLogRemember] = useState(false)

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
     * @desc Generate a captcha
     * */
    function genCaptcha() {
        const x = Math.floor(Math.random() * 21)
        const y = Math.floor(Math.random() * 21)

        return {
            exp: `Write the answer of ${x} + ${y}`,
            res: x+y
        }
    }

    /**
     * @desc Login mode.
     * */
    function handlerLogin() {
        setIsLogin(true)
        setLogEmUs("")
        setLogPass("")
        setLogCaptchaSolution("")
        setCaptcha(genCaptcha())
        setPhone("")
        setPassword("")
        setPasswordConf("")
        setEmail("")
        setUsername("")
        setDate("")
        setLogCaptchaSolution("")
        setCaptcha(genCaptcha())
    }

    /**
     * @desc Registration mode.
     * */
    function handlerRegister() {
        setIsLogin(false)
        setPhone("")
        setPassword("")
        setPasswordConf("")
        setEmail("")
        setUsername("")
        setDate("")
        setLogCaptchaSolution("")
        setLogEmUs("")
        setLogPass("")
        setCaptcha(genCaptcha())
    }

    /**
     * @desc Set the state value in all changes.
     * @param { ChangeEvent<HTMLInputElement> } event Get the input data.
     * @param { function } fn Get the setter.
     * */
    function handlerRegisterInputs(event, fn) {
        const cur = new Date()
        const y = cur.getFullYear()
        const m = ('0' + (cur.getMonth() + 1)).slice(-2)
        const j = ('0' + cur.getDate()).slice(-2)
        const h = ('0' + cur.getHours()).slice(-2)
        const mi = ('0' + cur.getMinutes()).slice(-2)
        const sec = ('0' + cur.getSeconds()).slice(-2)
        setDate(`${y}-${m}-${j} ${h}:${mi}:${sec}`)

        fn(event.target.value)
    }

    /**
     * @desc log the user
     * */
    async function login() {
        try {
            if(logCaptcha.res === parseInt(logCaptchaSolution)) {
                const cipher = await getSHA256(logPass)

                const req = await axios.post("/login",
                    {user: logEmUs, passwd: cipher})
                const data = await req.data

                if(data.response) {
                    Cookie.set("token", data.token, { expires: logRemember ? 999 : 1 })
                    openPopup(`Bonjour ${ data.username } !`, "Vous allez etre redirige vers la page d'accueil ...")
                    setTimeout(() => {
                        window.location = "/home"
                    }, 2000)
                } else {
                    return openPopup("Error", "E-mail or password is wrong")
                }
            } else {
                return openPopup("Error CAPTCHA", "Wrong answer.")
            }
        } catch(err) {
            console.error(err)
            return openPopup("Error!", "An error occurred.")
        }
    }

    /**
     * Register a customer.
     * */
    async function register() {
        if (passwordConf !== password) {
            return openPopup("Error !", "Passwords must be same.")
        } if (!email.includes("@") || !email.includes(".")) {
            return openPopup("Error !", "An email must contain an @ and a dot.")
        } if (password.length < 3) {
            return openPopup("Error !", "Password must be 15 characters long.")
        } if ([email, username, phone].some((data) => data.length === 0)) {
            return openPopup("Error !", "All fields must be filled in.")
        } if(logCaptcha.res !== parseInt(logCaptchaSolution)) {
            return openPopup("Error CAPTCHA !", "Wrong answer.")
        } if(username.length > 5) {
            return openPopup("Error !", "A pseudo must be contains 5 letters.")
        }

        try {
            const cipher = await axios.post("/crypt",
                { sentence: password })
            const data = await cipher.data
            const cipherPassword = await data.cryptedSentence;

            const register = await axios.post("/register",
                { user: username, password: cipherPassword, email: email, phone: phone, created: date})
            const registerData = await register.data;

            if(registerData.response) {
                return openPopup("Success!", "Account created.")
            } else {
                return openPopup("Error!", "Someone has already registered with this email/username.")
            }
        } catch(err) {
            console.error(err)
            return openPopup("Error!", "An error occurred.")
        }
    }

    /**
     * @desc Change the state of remember client
     * */
    function handlerRemember() {
        setLogRemember(!logRemember)
    }

    return (
        <div id="customers-container">
            <NavBar where="signin"/>

            {isPopupOpen && (
                <Popup
                    title={popupInfos.title}
                    text={popupInfos.text}
                    isOpen={isPopupOpen}
                    onClose={closePopup}
                />
            )}

            <div id="customers-form-container">
                <div id="customers-form-connexion">
                    { !isLogin ? (
                            <div id="customers-form-register">
                            <span>Registration
                                <span className="mustt"> * is require</span>
                            </span>

                                <label className="input">
                                    <input
                                        id="customers-email"
                                        className="input__field"
                                        type="email"
                                        onChange={(event) => {
                                            handlerRegisterInputs(event, setEmail)
                                        }}
                                    />

                                    <span className="input__label">E-mail
                                    <span className="must"> *</span>
                                </span>
                                </label>

                                <label className="input">
                                    <input
                                        id="customers-username"
                                        className="input__field"
                                        type="text"
                                        onChange={(event) => {
                                            handlerRegisterInputs(event, setUsername)
                                        }}
                                    />

                                    <span className="input__label">Username
                                    <span className="must"> *</span>
                                </span>
                                </label>

                                <label className="input">
                                    <input
                                        id="customers-phone"
                                        className="input__field"
                                        type="tel"
                                        onChange={(event) => {
                                            handlerRegisterInputs(event, setPhone)
                                        }}
                                    />

                                    <span className="input__label">Phone number</span>
                                </label>

                                <label className="input">
                                    <input
                                        id="customers-pass"
                                        className="input__field"
                                        type="password"
                                        onChange={(event) => {
                                            handlerRegisterInputs(event, setPassword)
                                        }}
                                    />

                                    <span className="input__label">Password
                                    <span className="must"> *</span>
                                </span>
                                </label>

                                <label className="input">
                                    <input
                                        id="customers-passconf"
                                        className="input__field"
                                        type="password"
                                        onChange={(event) => {
                                            handlerRegisterInputs(event, setPasswordConf)
                                        }}
                                    />

                                    <span className="input__label">Confirm Password
                                    <span className="must"> *</span>
                                </span>
                                </label>

                                <label className="input">
                                    <input
                                        id="customers-login-captcha"
                                        className="input__field"
                                        type="text"
                                        onChange={(event) => {
                                            handlerRegisterInputs(event, setLogCaptchaSolution)
                                        }}
                                    />

                                    <span className="input__label"> { logCaptcha.exp }
                                        <span className="must"> *</span>
                                </span>
                                </label>

                                <div id="customers-btn-container">
                                    <GenButton
                                        text="Register now"
                                        className="register customers-btn"
                                        handler={ register }
                                        persostyle={{width: "90px", height: "50px"}}
                                    />

                                    <GenButton
                                        text="Login here"
                                        className="login customers-btn"
                                        handler={ handlerLogin }
                                        persostyle={{width: "90px", height: "50px"}}
                                    />
                                </div>
                            </div>
                        ) :
                        <div id="customers-form-login">
                            <span>Login</span>

                            <div id="customers-form-login-same">
                                <label className="input">
                                    <input
                                        id="customers-login-email"
                                        className="input__field"
                                        type="text"
                                        onChange={(event) => {
                                            handlerRegisterInputs(event, setLogEmUs)
                                        }}
                                    />

                                    <span className="input__label">E-mail / Username</span>
                                </label>

                                <label className="input">
                                    <input
                                        id="customers-login-username"
                                        className="input__field"
                                        type="password"
                                        onChange={(event) => {
                                            handlerRegisterInputs(event, setLogPass)
                                        }}
                                    />

                                    <span className="input__label">Password</span>
                                </label>
                            </div>

                            <label className="input">
                                <input
                                    id="customers-login-captcha"
                                    className="input__field"
                                    type="text"
                                    onChange={(event) => {
                                        handlerRegisterInputs(event, setLogCaptchaSolution)
                                    }}
                                />

                                <span className="input__label"> { logCaptcha.exp } </span>
                            </label>

                            <label htmlFor="remember" id="customer-login-remember">
                                <span>Remember me</span>
                                <input name="remember" type="checkbox" onChange={ handlerRemember }/>
                                <div className="checkmark"></div>
                            </label>

                            <div id="customers-btn-container">
                                <GenButton
                                    className="register customers-btn"
                                    text="Login now"
                                    handler={ login }
                                    persostyle={{width: "90px", height: "50px"}}
                                />

                                <GenButton
                                    text="Register here"
                                    className="login customers-btn"
                                    handler={ handlerRegister }
                                    persostyle={{width: "90px", height: "50px"}}
                                />
                            </div>
                        </div>
                    }

                    <div id="customers-form-pub">
                        <img id="customers-form-pub-yanti" src={ Yanti } alt="publicite" />
                    </div>
                </div>
            </div>
        </div>
    )
}