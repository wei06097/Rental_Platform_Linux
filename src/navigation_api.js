const BASE_URL = process.env.REACT_APP_NAVIGATION_API_URL

const navigation_api = {
    get_nodes : async () => {
        const response = await fetch(`${BASE_URL}/navigation/graph`)
        const nodes = await response.json()
        return Promise.resolve(nodes)
    },
    directions : async (payload) => {
        const response = await fetch(`${BASE_URL}/navigation/directions`, {
            method : "POST",
            headers: { "Content-Type": "application/json" },
            body : JSON.stringify(payload)
        })
        const result = await response.json()
        return Promise.resolve(result)
    }
}

export default navigation_api
