import Crypto from "crypto-js"

/**
 * @desc get SHA256 of code
 * @param { string } sentence The sentence
 * @return { Promise<String> }
 * */
export function getSHA256(sentence) {
    return new Promise((resolve, reject) => {
        resolve(Crypto.SHA256(sentence).toString())
    })
}

/**
 * @desc Date converter 2023-05-26T15:27:00.000Z -> May 26, 2023, 3:27 PM
 * @param { string } olddate the old date
 * @return { string } The new date
 * */
export function convertDate(olddate) {
    const date = new Date(olddate);

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    };

    const formattedDate = date.toLocaleString('en-US', options);

    return formattedDate
}