function isImageFormat(file) {
    const limit = 8  //限制多少MB
    const type = file?.type?.split("/")[0] || ""
    const size = file?.size || limit + 1
    if (type !== "image") {
        alert("檔案並非圖片")
        return false
    } else if (size > limit * 1000 * 1000) {
        alert(`單張圖片限制在${limit}MB以內`)
        return false
    } else {
        return true
    }
}
function noBlank(...items) {
    return !(items.includes("") || items.includes(" "))
}

const InputChecker = {
    isImageFormat,
    noBlank
}
export default InputChecker
