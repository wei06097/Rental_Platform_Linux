export default function isImageFormat(input) {
    const array = ["png", "jpg", "jpeg", "gif"]
    const type = input?.type?.split("/")[1] || ""
    return array.includes(type)
}