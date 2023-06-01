import "./Shop.scss"
import NavBar from "../../components/NavBar/NavBar"
import {useEffect, useState} from "react"
import GenButton from "../../components/GenButton/GenButton"
import TextFields from "../../components/TextFields/TextFields"
import { fetchItems } from "../../components/ClientAPI/ItemsAPI"
import Loader from "../../components/Loader/Loader";

export default function Shop() {
    const [items, setItems] = useState({})
    const [showedItems, setShowedItems] = useState({})
    const [curIndex, setCurIndex] = useState(0)

    const [showPromotion, setShowPromotion] = useState(false)
    const [showCroissant, setShowCroissant] = useState(false)
    const [showDecroissant, setShowDecroissant] = useState(false)
    const [showStock, setShowStock] = useState(false)

    function handleProduct(id) {
        window.location = `/shop/product?id=${id}`
    }

    function showAll() {
        setCurIndex(0)
        setShowedItems(fragment(items, 8))
        return
    }

    /**
     * @desc Croissant handler
     * */
    function handleCroissant() {
        if(!showCroissant) {
            setShowDecroissant(false)
            setShowStock(false)
            setShowPromotion(false)

            let newItems = [...items]
            newItems.sort((a, b) => a.price - b.price)

            setCurIndex(0)
            setShowedItems(fragment(newItems, 8))

            setShowCroissant(!showCroissant)
            return
        } else {
            showAll()
            setShowCroissant(!showCroissant)
            return
        }
    }

    /**
     * @desc Decroissant handler
     * */
    function handleDecroissant() {
        if(!showDecroissant) {
            setShowCroissant(false)
            setShowPromotion(false)
            setShowStock(false)

            let newItems = [...items]
            newItems.sort((a, b) => (a.price < b.price ? 1 : -1))

            setCurIndex(0)
            setShowedItems(fragment(newItems, 8))

            setShowDecroissant(!showDecroissant)
            return
        } else {
            setCurIndex(0)
            setShowedItems(fragment(items, 8))
            setShowDecroissant(!showDecroissant)
            return
        }
    }

    /**
     * @desc Stock handlers
     * */
    function handleStock() {
        if(!showStock) {
            setShowCroissant(false)
            setShowPromotion(false)
            setShowDecroissant(false)

            let newItems = []

            items.forEach((e) => {
                if(e.qte > 0) {
                    newItems.push(e)
                }
            })

            setCurIndex(0)
            setShowedItems(fragment(newItems, 8))
            setShowStock(!showStock)
            return
        } else {
            setCurIndex(0)
            setShowedItems(fragment(items, 8))
            setShowStock(!showStock)
            return
        }
    }

    /**
     * @desc Promotion handlers
     * */
    function handlePromotion() {
        if(!showPromotion) {
            setShowCroissant(false)
            setShowDecroissant(false)
            setShowStock(false)

            let promotionItems = []

            items.forEach((e) => {
                if(e.promotion && e.qte > 0) {
                    promotionItems.push(e)
                }
            })

            setCurIndex(0)
            setShowedItems(fragment(promotionItems, 8))
            setShowPromotion(!showPromotion)
            return
        } else {
            setCurIndex(0)
            setShowedItems(fragment(items, 8))
            setShowPromotion(!showPromotion)
            return
        }
    }

    /**
     * @desc go to next page
     * */
    function next() {
        if(showedItems[curIndex + 1]) {
            setCurIndex(curIndex + 1)
        }
    }

    /**
     * @desc go to previous page
     * */
    function previous() {
        if(showedItems[curIndex - 1]) {
            setCurIndex(curIndex - 1)
        }
    }

    /**
     * @desc fragment the collection by N
     * @param { {} | [] } container The collection
     * @param { number } by fractionned the collection by ...
     * */
    function fragment(container, by) {
        let tmp2 = [];

        for (let i = 0; i < container.length; i += by) {
            tmp2.push(container.slice(i, i + by))
        }

        return tmp2
    }

    /**
     * @desc Searching a Vinyl by artist / name
     * @param { Event } event To get the target value
     * */
    function searching(event) {
        setCurIndex(0)
        let search = event.target.value

        if(search === "") {
            setShowedItems(fragment(items, 8))
            return
        }

        let newStock =  []

        items.forEach((e) => {
            if(e.artist
                    .toLowerCase()
                    .includes(search.toLowerCase())
            || e.name
                .toLowerCase()
                .includes(search.toLowerCase())) {
                newStock.push(e)
            }
        })

        setShowedItems(fragment(newStock, 8))
    }

    useEffect(() => {
        document.title = "French Connection | Shop"

        fetchItems()
            .then((res) => {
                console.log(res)
                setItems(res)
                setShowedItems(fragment(res, 8))
            })
    }, [])

    return (
        <div id="shop-container">
            <NavBar where="shop" />

            <div id="shop-pagination">
                <div id="shop-search">
                    <div id="shop-searching">
                        <TextFields oc={ (event) => {searching(event)} } placeholder="Search" />
                    </div>
                    <div id="shop-filters">
                        { !showPromotion ?
                            <GenButton text="Promotion" persostyle={{
                                background: "red",
                                color: "white",
                                fontWeight: "bold",
                                width: "90px"
                            }} handler={ handlePromotion } />
                            :
                            <GenButton text="Promotion" persostyle={{
                                background: "green",
                                color: "white",
                                fontWeight: "bold",
                                width: "90px"
                            }} handler={ handlePromotion } />
                        }

                        { !showCroissant ?
                            <GenButton text="- au + cher" persostyle={{
                                background: "red",
                                color: "white",
                                fontWeight: "bold",
                                width: "90px"
                            }} handler={ handleCroissant } />
                            :
                            <GenButton text="- au + cher" persostyle={{
                                background: "green",
                                color: "white",
                                fontWeight: "bold",
                                width: "90px"
                            }} handler={ handleCroissant } />
                        }

                        { !showDecroissant ?
                            <GenButton text="+ au - cher" persostyle={{
                                background: "red",
                                color: "white",
                                fontWeight: "bold",
                                width: "90px"
                            }} handler={ handleDecroissant } />
                            :
                            <GenButton text="+ au - cher" persostyle={{
                                background: "green",
                                color: "white",
                                fontWeight: "bold",
                                width: "90px"
                            }} handler={ handleDecroissant } />
                        }

                        { !showStock ?
                            <GenButton text="in Stock" persostyle={{
                                background: "red",
                                color: "white",
                                fontWeight: "bold",
                                width: "90px"
                            }} handler={ handleStock } />
                            :
                            <GenButton text="in Stock" persostyle={{
                                background: "green",
                                color: "white",
                                fontWeight: "bold",
                                width: "90px"
                            }} handler={ handleStock } />
                        }
                    </div>
                </div>

                <div id="shop-pagination-index">
                    <GenButton
                        text="Previous"
                        handler={ previous }
                        persostyle={{ width: "90px" }}
                    />

                    <GenButton
                        text="Next"
                        handler={ next }
                        persostyle={{ width: "90px" }}
                    />
                </div>
            </div>

            <div id="shop-content">
                <div id="shop-items">
                    { showedItems.length > 0 ?
                        showedItems[curIndex].map((item, index) => (
                            <div className="shop-item" key={item.id} onClick={ () => { handleProduct(item.id) } }>
                                <img src={ `data:${ item.imgtype };base64,${ item.b64 }` } alt={ item.name } />
                                <span className="info info-name">{item.name}</span>
                                <span className="info info-artist">{item.artist}</span>
                                { item.qte > 0 ?
                                    <div>
                                        { item.promotion != null ?
                                            <span className="info info-price">
                                                <span style={{textDecoration: "line-through", color: "red", fontWeight: "bold"}}>{item.price}€</span>
                                                &nbsp;➜ <span>{ item.price - (item.price * item.promotion / 100) }€</span>
                                            </span>
                                            :
                                            <span className="info info-price">{item.price}€</span>
                                        }
                                    </div>
                                :
                                    <span className="info info-price" style={{ background: "red" }}>Out of stock</span>
                                }
                            </div>
                        )) :
                            <Loader />
                    }

                    <div className="shop-pagination-index-prime">
                        <GenButton
                            text="Previous"
                            handler={ previous }
                            persostyle={{ width: "90px" }}
                        />

                        <GenButton
                            text="Next"
                            handler={ next }
                            persostyle={{ width: "90px" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}