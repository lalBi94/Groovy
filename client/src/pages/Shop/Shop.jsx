import "./Shop.scss"
import NavBar from "../../components/NavBar/NavBar"
import {useEffect, useState} from "react"
import GenButton from "../../components/GenButton/GenButton"
import TextFields from "../../components/TextFields/TextFields"
import { fetchItems } from "../../components/ClientAPI/ItemsAPI"
import Loader from "../../components/Loader/Loader";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faFilter, faXmark} from "@fortawesome/free-solid-svg-icons";

export default function Shop() {
    const [items, setItems] = useState({})
    const [showedItems, setShowedItems] = useState({})
    const [curIndex, setCurIndex] = useState(0)

    const [betweenPriceX, setBetweenPriceX] = useState(0)
    const [betweenPriceY, setBetweenPriceY] = useState(0)

    const [showPromotion, setShowPromotion] = useState(false)
    const [showCroissant, setShowCroissant] = useState(false)
    const [showDecroissant, setShowDecroissant] = useState(false)
    const [showStock, setShowStock] = useState(false)
    const [showBetweenPrice, setShowBetweenPrice] = useState(false)
    const [showUsed, setShowUsed] = useState(false)
    const [showNew, setShowNew] = useState(false)

    const [inFilter, setInFilter] = useState(false)

    /**
     * @desc Used handler
     * */
    function handleUsed() {
        if(!showUsed) {
            setShowDecroissant(false)
            setShowStock(false)
            setShowPromotion(false)
            setShowBetweenPrice(false)
            setShowNew(false)

            let newItems = []

            items.forEach((e) => {
                if(e.state === "Used") {
                    newItems.push(e)
                }
            })

            setCurIndex(0)
            setShowedItems(fragment(newItems, 8))
            setShowUsed(!showUsed)
        } else {
            showAll()
            setShowUsed(!showUsed)
        }
    }

    /**
     * @desc New handler
     * */
    function handleNew() {
        if(!showNew) {
            setShowDecroissant(false)
            setShowStock(false)
            setShowPromotion(false)
            setShowBetweenPrice(false)
            setShowUsed(false)

            let newItems = []

            items.forEach((e) => {
                if(e.state === "New") {
                    newItems.push(e)
                }
            })

            setCurIndex(0)
            setShowedItems(fragment(newItems, 8))
            setShowNew(!showNew)
        } else {
            showAll()
            setShowNew(!showNew)
        }
    }

    /**
     * @desc Go to product page of item id
     * @param { number } id The item id.
     * */
    function handleProduct(id) {
        window.location = `/shop/product?id=${id}`
    }

    /**
     * @desc Swicth ON/OFF for filters menu
     * */
    function handleFilter() {
        setInFilter(!inFilter)
    }

    /**
     * @desc Show all items
     * */
    function showAll() {
        setCurIndex(0)
        setShowedItems(fragment(items, 8))
    }

    /**
     * @desc Croissant handler
     * */
    function handleCroissant() {
        if(!showCroissant) {
            setShowDecroissant(false)
            setShowStock(false)
            setShowPromotion(false)
            setShowBetweenPrice(false)
            setShowUsed(false)
            setShowNew(false)

            let newItems = [...items]
            newItems.sort((a, b) => a.price - b.price)

            setCurIndex(0)
            setShowedItems(fragment(newItems, 8))

            setShowCroissant(!showCroissant)
        } else {
            showAll()
            setShowCroissant(!showCroissant)
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
            setShowBetweenPrice(false)
            setShowUsed(false)
            setShowNew(false)

            let newItems = [...items]
            newItems.sort((a, b) => (a.price < b.price ? 1 : -1))

            setCurIndex(0)
            setShowedItems(fragment(newItems, 8))

            setShowDecroissant(!showDecroissant)
        } else {
            setCurIndex(0)
            setShowedItems(fragment(items, 8))
            setShowDecroissant(!showDecroissant)
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
            setShowBetweenPrice(false)
            setShowUsed(false)
            setShowNew(false)

            let newItems = []

            items.forEach((e) => {
                if(e.qte > 0) {
                    newItems.push(e)
                }
            })

            setCurIndex(0)
            setShowedItems(fragment(newItems, 8))
            setShowStock(!showStock)
        } else {
            setCurIndex(0)
            setShowedItems(fragment(items, 8))
            setShowStock(!showStock)
        }
    }

    /**
     * @desc Between x and y register
     * */
    function handleXYBetweenChange(event, l) {
        setShowBetweenPrice(false)

        l === "x" ? setBetweenPriceX(event.target.value) :
            setBetweenPriceY(event.target.value)
    }

    /**
     * @desc Between x and y items
     * */
    function handleBetweenPrice() {
        if(!showBetweenPrice) {
            setShowCroissant(false)
            setShowDecroissant(false)
            setShowStock(false)
            setShowPromotion(false)
            setShowUsed(false)
            setShowNew(false)

            let newItems = []

            items.forEach((e) => {
                if(e.price >= betweenPriceX && e.price <= betweenPriceY) {
                    newItems.push(e)
                }
            })

            setCurIndex(0)
            setShowedItems(fragment(newItems, 8))
            setShowBetweenPrice(!showBetweenPrice)
        } else {
            setCurIndex(0)
            setShowedItems(fragment(items, 8))
            setShowBetweenPrice(!showBetweenPrice)
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
            setShowBetweenPrice(false)
            setShowUsed(false)
            setShowNew(false)

            let promotionItems = []

            items.forEach((e) => {
                if(e.promotion && e.qte > 0) {
                    promotionItems.push(e)
                }
            })

            setCurIndex(0)
            setShowedItems(fragment(promotionItems, 8))
            setShowPromotion(!showPromotion)
        } else {
            setCurIndex(0)
            setShowedItems(fragment(items, 8))
            setShowPromotion(!showPromotion)
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

                    <div id="shop-burger-filters">
                        <FontAwesomeIcon icon={faFilter} onClick={handleFilter}/>
                    </div>

                    { inFilter ?
                        <div id="shop-filters">
                            <span className="shop-filters-close" onClick={handleFilter}>
                                <FontAwesomeIcon icon={faXmark} />
                            </span>

                            <div className="shop-filters-card">
                                <span>Condition</span>

                                <div className="shop-filters-btn-container">
                                    { !showUsed ?
                                        <GenButton text="Used" persostyle={{
                                            background: "red",
                                            color: "white",
                                            fontWeight: "bold",
                                            width: "90px"
                                        }} handler={ handleUsed } />
                                        :
                                        <GenButton text="Used" persostyle={{
                                            background: "green",
                                            color: "white",
                                            fontWeight: "bold",
                                            width: "90px"
                                        }} handler={ handleUsed } />
                                    }

                                    { !showNew ?
                                        <GenButton text="New" persostyle={{
                                            background: "red",
                                            color: "white",
                                            fontWeight: "bold",
                                            width: "90px"
                                        }} handler={ handleNew } />
                                        :
                                        <GenButton text="New" persostyle={{
                                            background: "green",
                                            color: "white",
                                            fontWeight: "bold",
                                            width: "90px"
                                        }} handler={ handleNew } />
                                    }
                                </div>
                            </div>

                            <div className="shop-filters-card">
                                <span>Price</span>

                                <div className="shop-filters-btn-container">
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

                                    <TextFields min={0} type="number" persostyle={{width: "40px" }} oc={(event) => { handleXYBetweenChange(event, "X") }}/>
                                    <FontAwesomeIcon icon={faArrowRight} />
                                    <TextFields min={1} type="number" persostyle={{width: "40px" }} oc={(event) => { handleXYBetweenChange(event, "Y") }}/>
                                    { !showBetweenPrice ?
                                        <GenButton text="Ok" persostyle={{
                                            background: "red",
                                            color: "white",
                                            fontWeight: "bold",
                                            width: "90px"
                                        }} handler={ handleBetweenPrice } />
                                        :
                                        <GenButton text="Ok" persostyle={{
                                            background: "green",
                                            color: "white",
                                            fontWeight: "bold",
                                            width: "90px"
                                        }} handler={ handleBetweenPrice } />
                                    }
                                </div>
                            </div>

                            <div className="shop-filters-card">
                                <span>Other</span>

                                <div className="shop-filters-btn-container">
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
                        </div>
                    : null }
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