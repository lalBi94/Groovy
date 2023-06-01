import axios from "axios"
import Cookie from "js-cookie"

/**
 * @desc Get the user's data
 * @return { {} } the data
 * */
export async function getUserData() {
    const token = await Cookie.get("token")

    if(token) {
        const data = await axios.post("/getUserData", { token })

        if(!data.data) {
            await Cookie.remove("token")
            window.location = "/myaccount"
        } else {
            return data
        }
    }
}

/**
 * @desc Add item in wish list
 * @param { number } itemid The item
 * */
export async function insertItemWishList(itemid) {
    const token = await Cookie.get("token")

    if(token) {
        await axios.post("/insertWishListItem", {itemid, token})
    }
}

/**
 * @desc Remove Item from wish list
 * @param { number } itemid The item
 * */
export async function removeItemWishList(itemid) {
    const token = await Cookie.get("token")
    if(token) {
        await axios.post("/removeWishListItem", {itemid, token})
    }
}

/**
 * @desc Get the user wishlist
 * return {{}} data
 * */
export async function getUserWishList() {
    const token = await Cookie.get("token")

    if(token) {
        const data = await axios.post("/getUserWishList", { token })
        return data.data.wishlist
    }
}

/**
 * @desc For restricted zone
 * @param { {permission: number} } user
 * @return { boolean } Is admin or not
 * */
export function isAdmin(user) {
    return user.permission === 777
}