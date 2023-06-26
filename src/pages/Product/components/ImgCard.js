/* import */
/* ======================================== */
/* API */
import API from "../../../API"
/* css */
import style from "./ImgCard.module.css"
/* Import Swiper React components */
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import "./styles.css"
import { Pagination } from "swiper"

/* ======================================== */
export default function ImgCard({ ImgArray }) {
    return <div className={style.frame}>
        <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
            {
                ImgArray.map( (name, i) => {
                    return (
                        <SwiperSlide key={i}>
                            <div className={style.img}>
                                <img src={`${API.WS_URL}/${name}`} alt="" />
                            </div>
                        </SwiperSlide>
                    )
                })
            }
        </Swiper>
    </div>
}
