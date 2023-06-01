import NavBar from "../../components/NavBar/NavBar"
import "./Product.scss"
import { useEffect, useState } from "react"
import GenButton from "../../components/GenButton/GenButton"
import { getItemById } from "../../components/ClientAPI/ItemsAPI"
import Loader from "../../components/Loader/Loader";
import {faHeart, faMusic} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {getUserWishList, insertItemWishList, removeItemWishList} from "../../components/ClientAPI/ClientAPI";
import Cookie from "js-cookie";

export default function Product() {
    const [product, setProduct] = useState(null)
    const [isInWishList, setIsInWishList] = useState(false)

    function handlerBack() {
        window.location = "/shop"
    }

    function handlerClickItemWishList() {
        if(isInWishList) {
            removeItemWishList(product.id)
                .then(() => {
                    window.location.reload()
            })
        } else {
            insertItemWishList(product.id)
                .then(() => {
                    window.location.reload()
                })
        }
    }

    function handlerRefresh() {
        window.location.reload()
    }

    useEffect(() => {
        try {
            const path = window.location.href.split('?')[1]
            const id = parseInt(path.split("=")[1])

            getItemById(id)
                .then((data) => {
                    setProduct(data)

                    getUserWishList()
                        .then((res) => {
                            res.forEach((e) => {
                                if(e.itemid === data.id) {
                                    setIsInWishList(true)
                                }
                            })
                        })
                })
        } catch(err) {
            window.location = "/shop"
        }
    }, [])

    return (
        <div id="product-container">
            <NavBar where="shop"/>

            { product ?
                <div id="product-infos">
                    <div id="product-img">
                        { Cookie.get("token") ?
                            <div id="product-wishlist" onClick={ handlerClickItemWishList }>
                                <FontAwesomeIcon
                                    className={ isInWishList ?
                                        "icon activate" : "icon desactivate" }
                                    icon={faHeart}
                                />
                            </div>
                        : null}

                        <img src={ `data:${ product.imgtype};base64,${ product.b64 }` } alt=""/>
                    </div>

                    <div id="product-vinyl">
                        <span className="product-artist"><u>{ product.artist }</u></span>

                        <span className="product-name">
                            { product.name }
                            <span className="product-album"> from "{ product.album }"</span>
                        </span>

                        { product.desc !== "" ?
                            <span className="product-desc"> {product.desc} </span>
                        : null}

                        { product.promotion != null ?
                            <span className="product-price">
                                <span className="product-newprice">{ product.price - (product.price * product.promotion / 100) }€
                                    <span className="product-promotion">{ product.promotion }%</span>
                                </span>

                                <span className="product-oldprice">
                                    {product.price}€
                                </span>
                            </span>
                            : <span className="product-price">{product.price}€</span> }

                        { product.haveAudio ?
                            <div id="product-audio-container">
                                { product.audiob64 ?
                                    <audio controls={true} className="product-audio" src={ `data:${ product.audiotype};base64,${ product.audiob64 }` } />
                                    :
                                    <button id="product-audio-load" onClick={ handlerRefresh }>
                                        <FontAwesomeIcon icon={faMusic} />
                                    </button>
                                }
                            </div>  : null }

                        { product.qte > 0 ?
                            <span className="product-stock">Stock ({ product.qte }) ✔</span>
                        : null }


                        { product.qte > 0 ?
                            <div className="product-prebuy">
                                <GenButton persostyle={{width: "90px"}} text="Add to cart" />
                                <GenButton persostyle={{width: "90px"}} text="Buy" />
                                <GenButton persostyle={{width: "90px", background: "red"}} handler={handlerBack} text="Back" />
                            </div>
                        :
                            <div className="product-prebuy">
                                <span className="product-err">Out of stock</span>
                                <GenButton persostyle={{width: "90px", background: "red"}} handler={handlerBack} text="Back" />
                            </div>
                        }
                    </div>
                </div>
            :  <Loader /> }
        </div>
    )
}