import GenButton from "../../../../components/GenButton/GenButton";
import NavBar from "../../../../components/NavBar/NavBar";
import {Link} from "react-router-dom";
import "./Admin.scss"
import {useEffect, useState} from "react";
import {getUserData, isAdmin} from "../../../../components/ClientAPI/ClientAPI";

export default function Admin() {
    const [can, setCan] = useState(false)

    useEffect(() => {
        getUserData()
            .then((res) => {
                if(isAdmin(res.data)) {
                    setCan(true)
                    return alert("Acces autorisé")
                } else {
                    window.location = "/home"
                    return alert("Acces non autorisé")
                }
            })
    }, [])

    return (
        <div>
            { can ?
                <div id="admin-container">
                    <NavBar />

                    <div id="admin-tools-links-container">
                        <span id="admin-tools-title">Panneau d'administration</span>

                        <Link class="admin-tools-links" to="/admin/itemcreator">
                            <GenButton text="Création d'un article" />
                        </Link>

                        <Link class="admin-tools-links" to="/admin/promotioncreator">
                            <GenButton text="Création de promotion" />
                        </Link>
                    </div>
                </div>
                : null}
        </div>
    )
}