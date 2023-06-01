import Crypto from "crypto-js"
import {green, red, blue} from "console-log-colors";

/**
 * Contains a multiple functions related to
 * Cyptology
 * */
export default class Enigma {
    /**
     * Here to crypt data.
     * @param { string } sentence Sentence to crypt.
     * @return {string | null} The hash for sentence.
     * */
    encrypt(sentence) {
        try {
            return Crypto.SHA256(sentence).toString()
        } catch(e) {
            console.error(red("?Enigma ::Failed to crypt the sentence."))
            return null
        }
    }

    /**
     * Here to check the egality of cipher and sentence.
     * @param { string } cipher The hashed sentence.
     * @param { string } sentence Some sentence.
     * */
    isEquals(cipher, sentence) {
        try {
            const crypto = Crypto.SHA256(sentence).toString()
            return crypto === cipher
        }  catch(e) {
            console.error(red("?Enigma ::Failed to check equality of the sentences."))
            return false
        }
    }
}