/* import */
/* ======================================== */
/* API */
import API from "../../../API"
/* CSS */
import style from "./ImgCard.module.css"
/* Import Swiper React components */
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import "./styles.css"
import { Pagination } from "swiper"
/* Components */
import Img from "./Img"

/* ======================================== */
export default function ImgCard({ ImgArray, viewPicture, setViewPicture}) {
    function openhandler() {
        setViewPicture(prev => !prev)
    }
    return <>
        <div className={viewPicture? style.view: style.frame}>
            <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
                {
                    ImgArray.map( (name, i) => {
                        return (
                            <SwiperSlide key={i}>
                                <Img 
                                    src={`${API.WS_URL}/${name}`}
                                    openhandler={openhandler}
                                />
                            </SwiperSlide>
                        )
                    })
                }
            </Swiper>
        </div>
    </>
}
