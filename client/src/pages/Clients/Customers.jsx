import "./Customers.scss"
import NavBar from "../../components/NavBar/NavBar"
import Yanti from "./assets/pub.jpg"
import {useEffect, useState} from "react"
import GenButton from "../../components/GenButton/GenButton"
import Popup from "../../components/Popup/Popup"
import axios from "axios";
import Cookie from "js-cookie"
import {getSHA256} from "../../components/ClientAPI/UtilsAPI"

export default function Customers() {
    useEffect(() => {
        if(Cookie.get("token")) {
            window.location = "/myaccount"
        }

        document.title = "French Connection | Sign In"
    }, [])

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
    const [showPopup, setShowPopup] = useState({
        title: "",
        text: "",
        show: false
    })

    /**
     * @desc Display popup
     * @param { string } title The title of popup
     * @param { string } text The text of popup
     * */
    function handleButtonClick(title, text) {
        setShowPopup({
            title: title,
            text: text,
            show: true
        })
    }

    /**
     * @desc Remove popup
     * */
    function handlePopupClose() {
        setShowPopup({
            title: "",
            text: "",
            show: false
        })
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
     * Connection
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
                    handleButtonClick(`Bonjour ${ data.username } !`, "Vous allez etre redirige vers la page d'accueil ...")
                    setTimeout(() => {
                        window.location = "/home"
                    }, 1500)
                } else {
                    return handleButtonClick("Error", "E-mail or password is wrong");
                }
            } else {
                return handleButtonClick("Error CAPTCHA", "Wrong answer.")
            }
        } catch(err) {
            console.error(err)
            return handleButtonClick("Error!", "An error occurred.")
        }
    }

    /**
     * Register a customer.
     * */
    async function register() {
        if (passwordConf !== password) {
            return handleButtonClick("Error !", "Passwords must be same.")
        } if (!email.includes("@") || !email.includes(".")) {
            return handleButtonClick("Error !", "An email must contain an @ and a dot.")
        } if (password.length < 3) {
            return handleButtonClick("Error !", "Password must be 15 characters long.")
        } if ([email, username, phone].some((data) => data.length === 0)) {
            return handleButtonClick("Error !", "All fields must be filled in.")
        } if(logCaptcha.res !== parseInt(logCaptchaSolution)) {
            return handleButtonClick("Error CAPTCHA !", "Wrong answer.")
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
                return handleButtonClick("Success!", "Account created.");
            } else {
                return handleButtonClick("Error!", "Someone has already registered with this email/username.");
            }
        } catch(err) {
            console.error(err);
            return handleButtonClick("Error!", "An error occurred.");
        }
    }

    function handlerRemember() {
        setLogRemember(!logRemember)
    }

    return (
        <div id="customers-container">
            <NavBar where="signin"/>

            <Popup
                show={ showPopup.show }
                title={ showPopup.title }
                text={ showPopup.text }
                close={ handlePopupClose }
            />

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