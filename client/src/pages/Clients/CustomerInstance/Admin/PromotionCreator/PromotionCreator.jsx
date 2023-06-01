import "./PromotionCreator.scss"
import TextFields from "../../../../../components/TextFields/TextFields"
import NavBar from "../../../../../components/NavBar/NavBar"
import {useEffect, useState} from "react"
import {useForm} from "react-hook-form"
import GenButton from "../../../../../components/GenButton/GenButton"
import { fetchItems } from "../../../../../components/ClientAPI/ItemsAPI"
import {getUserData, isAdmin} from "../../../../../components/ClientAPI/ClientAPI"

export default function PromotionCreator() {
    const [items, setItems] = useState({})
    const [showedItems, setShowedItems] = useState([])
    const [selection, setSelection] = useState(null)
    const { register, handleSubmit} = useForm()
    const [promotionFinal, setPromotionFinal] = useState(0)

    const onSubmit = (data) => {
        if(promotionFinal <= 0) {
            return alert("Promotion > 99% impossible")
        }

        fetch(`/setPromotion?promo=${ data.promotion }&id=${ selection.id }`)
            .then((res) => {
                if(res) {
                    window.location.reload()
                    return alert("Reduction appliquée.")
                } else {
                    return alert("Erreur.")
                }
            })
    }

    function handlerPromotion(event) {
        const promo = parseInt(event.target.value)
        const percent = selection.price * promo / 100
        const resultAfterPromo = selection.price - percent

        setPromotionFinal(resultAfterPromo)
    }

    function handlerVinylChoose(id) {
        setPromotionFinal(0)

        showedItems.forEach((e) => {
            if(e.id === id) {
                e.choosing = true
                setSelection(e)
                window.scrollTo(0, 0)
            } else {
                e.choosing = false
            }
        })
    }

    function handlerSearch(event) {
        const selection = event.target.value.toLowerCase()

        if(selection === "") {
            setShowedItems([])
            return
        }

        let tmp = []

        items.forEach((e) => {
            const name = e.name.toLowerCase()
            const album = e.album.toLowerCase()
            const artist = e.artist.toLowerCase()

            if(name.includes(selection) ||
                album.includes(selection) ||
                artist.includes(selection)) {
                tmp.push(e)
            }
        })

        setShowedItems(tmp)
    }

    function handlerDeletePromo() {
        fetch(`/setPromotion?promo=${ null }&id=${ selection.id }`)
            .then((res) => {
                if(res) {
                    window.location.reload()
                    return alert("Reduction supprimée.")
                } else {
                    return alert("Erreur.")
                }
            })
    }

    useEffect(() => {
        getUserData()
            .then((res) => {
                if(isAdmin(res.data)) {
                    fetchItems()
                        .then((res) => {
                            setItems(res)
                        })
                } else {
                    window.location = "/home"
                    return alert("Acces non autorisé")
                }
            })
    }, [])

    return (
        <div id="promotioncreator-container">
            <NavBar />

            <div id="promotioncreator-vinyls-container">
                { selection != null ?
                    <div id="promotioncreator-vinyls-controls">
                        <div id="promotioncreator-vinyls-controls-info">
                            <img src={ `data:${ selection.imgtype };base64,${ selection.b64 }` } alt="Selection"/>
                            <span>${selection.name} (${selection.album})</span>
                            { promotionFinal > 0 ?
                                <div>
                                    <span style={{ textDecoration: "line-through", color: "red" }}>${selection.price}€</span>
                                    &nbsp;➜&nbsp;<span>${promotionFinal}€</span>
                                </div>
                                :
                                <span>${selection.price}€</span>
                            }
                        </div>

                        <div id="promotioncreator-vinyls-controls-settings">
                            <form onSubmit={ handleSubmit(onSubmit) }>
                                <input
                                    className="textfields-input"
                                    type="number"
                                    max="100"
                                    min="1"
                                    {...register("promotion")}
                                    placeholder="Nouvelle promotion"
                                    onChange={ (event) => { handlerPromotion(event) } }
                                />

                                <GenButton type="submit" text="OK" />
                            </form>

                            { selection.promotion > 0 ?
                                <GenButton
                                    persostyle={{background: "red", color: "white"}}
                                    text="Supprimer la promotion"
                                    handler={ handlerDeletePromo }
                                />
                                : null
                            }
                        </div>
                    </div>
                    :
                    null
                }

                <TextFields
                    id="promotioncreator-vinyls-search"
                    placeholder="Rechercher un vinyl"
                    oc={ (event) => { handlerSearch(event) } }
                />

                <div id="promotioncreator-vinyls">
                    { showedItems.length > 0 ?
                        showedItems.map((item, index) => (
                            <div className="promotioncreator-card" onClick={ () => { handlerVinylChoose(item.id) } }>
                                <img src={ `data:${ item.imgtype };base64,${ item.b64 }` } alt="Pochet Vinyl"/>
                                <span className="promotioncreator-card-name">${item.name} (${item.album})</span>
                                <span className="promotioncreator-card-price">${item.price}€</span>
                                { item.promotion > 0 ?
                                    <span className="promotioncreator-card-alreadypromotion">En promotion</span>
                                    : null
                                }
                            </div>
                        ))
                        : null }
                </div>
            </div>
        </div>
    )
}