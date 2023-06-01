import axios from "axios";

/**
 * @desc Get all items of the store
 * @return { {} } The all of items
 * */
export async function fetchItems() {
    try {
        const res = await axios.get(`/getItems`)
        return res.data
    } catch (nothing) { }
}

/**
 * @desc Get item's infos
 * @param { number } id
 * */
export async function getItemById(id) {
    const res = await axios.get(`/getItem?id=${id}`)
    const data = res.data
    return data
}

/**
 * @desc Get the items "A l'affiche"
 * @return { {} }
 * */
export async function getAlaffiche() {
    try {
        const res = await fetch("/getAlaffiche")
        const data = await res.json()
        return data
    } catch(nothing) { }
}