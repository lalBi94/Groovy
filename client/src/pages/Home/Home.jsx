import "./Home.scss"
import NavBar from "../../components/NavBar/NavBar"
import Vinyl from "./assets/vinyl.png"
import { Link } from "react-router-dom"
import GenButton from "../../components/GenButton/GenButton"
import { useState, useEffect } from "react"
import Cookie from "js-cookie";
import {getUserData} from "../../components/ClientAPI/ClientAPI"
import {getAlaffiche, getItemById} from "../../components/ClientAPI/ItemsAPI"
import Loader from "../../components/Loader/Loader"
import Slider from "./Slider/Slider"

export default function Home() {
	const [userData, setUserData] = useState(null)
	const [alaffiche, setAlaffiche] = useState(null)

	useEffect(() => {
		if(Cookie.get("token")) {
			getUserData()
				.then((res) => {
					setUserData(res.data)
				})
		}

		getAlaffiche()
			.then(async (res) => {
				let tmp = []

				for(let i = 0; i <= res.items.length-1; i++) {
					await getItemById(res.items[i])
						.then((data) => {
							tmp.push(data)
						})
				}

				await setAlaffiche(tmp)
		})

		document.title = "French Connection | Home"
	}, [])

	return (
		<div id="home-container">
			<NavBar where="home"/>

			<main id="home-vinyl-container">
				{ userData ?
					<span>Hello { userData.user } !</span>
					: null }

					{ alaffiche ? <div id="home-alaffiche-container">
						<span className="alaffiche-title">A l'affiche</span>
						<Slider data={alaffiche} />
					</div>
					: <Loader /> }


				<div id="home-vinyl-turn-container">
					<span className="selection-title">Selection</span>

					<div id="home-vinyl-turn">
						<img src={Vinyl} id="home-vinyl" alt="vinyl qui tourne" />

						<Link to="/shop" id="home-order">
							<GenButton
								text="Click here"
								persostyle={{width: "100px", height: "50px"}}/>
						</Link>
					</div>
				</div>
			</main>
		</div>
  	);
}