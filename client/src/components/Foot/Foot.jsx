import "./Foot.scss"
import Logo from "./assets/logo.png"
import { Link } from "react-router-dom"

export default function Foot() {
    return (
        <div id="foot-container">
            <div>
                <div className="footer">
                    <div className="content">
                        <div>
                              <div>
                                   <b>Eldew</b>
                                   <Link to="#">Secuce</Link>
                                   <Link to="#">Drupand</Link>
                                   <Link to="#">Oceash</Link>
                                   <Link to="#">Ugefe</Link>
                                   <Link to="#">Babed</Link>
                              </div>
                        </div>

                        <div>
                              <img src={ Logo } alt="" className="image" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}