import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import "./Slider.scss";
import { EffectCoverflow, Pagination } from "swiper";

export default function Slider({ data }) {
    /**
     * @desc Redirection on product item page
     * @param { number } n The item id
     * */
    function handlerClick(n) {
        window.location = `/shop/product?id=${n}`
    }

    return (
        <div id="slider-container">
            <Swiper
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={"auto"}
                coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                }}
                pagination={true}
                modules={[EffectCoverflow, Pagination]}
                className="mySwiper"
            >

                { data ?
                    <div id="slider-card-container">
                        { data.map((item, index) => (
                            <SwiperSlide key={index} onClick={() => { handlerClick(item.id) }}>
                                { item.promotion > 0 ?
                                    <span className="promotion">DISCOUNT</span>
                                    : null}
                                <img src={ `data:${ item.imgtype };base64,${ item.b64 }` } alt={ item.name }/>
                                <span>{item.name} <span className="desc">from {item.album}</span></span>
                                <span>{item.artist}</span>
                                { item.promotion > 0 ?
                                    <div>
                                        <span style={{textDecoration: "line-through", color: "red", fontWeight: "bold"}}>{item.price}€</span>
                                        <span>&nbsp;➜ { item.price - (item.price * item.promotion / 100) }€</span>
                                    </div>
                                : <span>{item.price}€</span> }
                            </SwiperSlide>
                        ))}
                    </div>
                : null }

            </Swiper>
        </div>
    );
}
