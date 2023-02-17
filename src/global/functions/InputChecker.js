function isImageFormat(input) {
    const array = ["png", "jpg", "jpeg", "gif"]
    const type = input?.type?.split("/")[1] || ""
    return array.includes(type)
}

function noBlank(...items) {
    return !(items.includes("") || items.includes(" "))
}

function noSpecialCharacter() {
    // const specialKey = ["&", "=", "_", "'", "-", "+", ",", "<", ">", "、", "."]
    return false
}


const InputChecker = {
    isImageFormat,
    noBlank,
    noSpecialCharacter
}
export default InputChecker