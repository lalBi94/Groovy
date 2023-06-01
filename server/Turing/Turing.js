import mysql from "mysql2"
import { red, blue, green, yellow } from "console-log-colors"
import Enigma from "./Enigma/Enigma.js"
import Rotors from "./Rotors/Rotors.js"
import Store from "./Store/Store.js"

export default class Turing {
    constructor() {
        try {
            console.log(yellow(
                "--------------------------------------------\n" +
                "* API Owner: Bilou                         *\n" +
                "* Website's Owner: French Connection Team  *\n" +
                "* Copyright© French Connection XXXX        *\n" +
                "--------------------------------------------"
            ))

            this.enigma = new Enigma()
            console.log(blue("?Turing ::Enigma [OK]"))

            this.database = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "root",
                database: "groovy"
            })
            console.log(blue("?Turing ::Database [OK]"))

            this.rotors = new Rotors(this.database, this.enigma)
            console.log(blue("?Turing ::Rotors [OK]"))

            this.store = new Store(this.database)
            console.log(blue("?Turing ::Store [OK]"))
        } catch(e) {
            console.error(e)
            console.error(red("Turing:: Failed to run Turing."))
        }
    }

    /**
     * @desc Enigma: Cryptology
     * */
    encrypt(sentence) {
        return this.enigma.encrypt(sentence)
    }

    isEquals(cipher, sentence) {
        return this.enigma.isEquals(cipher, sentence)
    }

    /**
     * @desc Rotors: Clients
     * */
    register(user) {
        return new Promise((resolve, reject) => {
            resolve(this.rotors.register(user))
        })
    }

    login(user) {
        return new Promise((resolve, reject) => {
            resolve(this.rotors.login(user))
        })
    }

    getUserData(token) {
        return new Promise((resolve, reject) => {
            resolve(this.rotors.getUserData(token))
        })
    }

    removeWishListItem(token, itemid) {
        return new Promise((resolve, reject) => {
            resolve(this.rotors.deleteWishlistItem(token, itemid))
        })
    }

    insertWishListItem(token, itemid) {
        return new Promise((resolve, reject) => {
            resolve(this.rotors.insertWishlistItem(token, itemid))
        })
    }

    getUserWishList(token) {
        return new Promise((resolve, reject) => {
            resolve(this.rotors.getUserWishList(token))
        })
    }

    /**
     * Store: Shop
     * */
    getItems() {
        return new Promise((resolve, reject) => {
            resolve(this.store.getItems())
        })
    }

    async getItemMusic(n) {
        return new Promise((resolve, reject) => {
            resolve(this.store.getItemMusic(n))
        })
    }

    createItem(infos, img, audio) {
        return new Promise((resolve, reject) => {
            resolve(this.store.createItem(infos, img, audio))
        })
    }

    setPromotion(promo, id) {
        return new Promise((resolve, reject) => {
            resolve(this.store.setPromotion(promo, id))
        })
    }

    getAlaffiche() {
        return new Promise((resolve, reject) => {
            resolve(this.store.getAlaffiche())
        })
    }
}