import {green, red, blue} from "console-log-colors";

/**
 * @desc Contains a multiple functions related to Customers action
 * */
export default class Rotors {
    constructor(database, enigma) {
        this.database = database
        this.enigma = enigma
    }

    /**
     * @desc Modify client info
     * @param { string } token The user token
     * @param { string } what The info
     * @param { string } newvalue The new value
     * @return { Promise<{}> } New customers info
     * */
    modifyClientInfos(token, what, newvalue) {
        return new Promise(async (resolve, reject) => {
            switch(what) {
                case "pseudo": case "email": {
                    const exist = await this.isUserExist(newvalue)

                    if(!exist) {
                        this.database.query(
                            what === "pseudo" ? "UPDATE users SET user=? WHERE token=?" : "UPDATE users SET email=? WHERE token=?",
                            [newvalue, token], async (err, res, fields) => {
                                if(err) {
                                    console.log(red(err))
                                    resolve(false)
                                } else {
                                    const newUserData = await this.getUserData(token)
                                    resolve(newUserData)
                                }
                            })
                    } else {
                        resolve(false)
                    }

                    break;
                }

                case "phone": {
                    this.database.query(
                        "UPDATE users SET phone=? WHERE token=?",
                        [newvalue, token], async (err, res, fields) => {
                            if(err) {
                                console.log(red(err))
                                resolve(false)
                            } else {
                                const newUserData = await this.getUserData(token)
                                resolve(newUserData)
                            }
                        }
                    )
                    break;
                }

                default: {
                    break;
                }
            }
        })
    }

    /**
     * @desc Search if user exist
     * @param { string } id Email / Username
     * @return { Promise } True if exist and false if not exit
     * */
    isUserExist(id) {
        return new Promise((resolve, reject) => {
            this.database.query(
                "SELECT id FROM users WHERE email=? OR user=? OR token=?",
                [id, id, id], (err, res, fields) => {
                    resolve(res.length > 0)
                }
            )
        })
    }

    /**
     * @desc Get user data
     * @param { string } token
     * @return { Promise } data if exist and null if not exit
     * */
    getUserData(token) {
        return new Promise((resolve, reject) => {
            this.database.query(
                "SELECT * FROM users WHERE token=?",
                [token], (err, res, fields) => {
                    try {
                        delete res[0].passwd
                        delete res[0].token
                        resolve(res[0])
                    } catch(error) {
                        resolve(false)
                    }
                }
            )
        })
    }

    /**
     * @desc Get hashed password
     * @param { string } id The identifier
     * @return { Promise } The hashed password
     * */
    getHashedPasswdOf(id) {
        return new Promise((resolve, reject) => {
            this.database.query(
                "SELECT passwd FROM users WHERE email=? OR user=?",
                [id, id], (err, res, fields) => {
                    if(err) {
                        resolve(null)
                    } else {
                        resolve(res[0].passwd)
                    }
                }
            )
        })
    }

    /**
     * @desc Login
     * @param {array[string]} user Object contains Username and Password write by the user
     * @return { boolean } login status
     * */
    async login(user) {
        return await new Promise(async (resolve, reject) => {
            const username = user[0]
            const password = user[1]
            let isExist = await this.isUserExist(username)
            console.log(blue(`?Rotors ::${username} try to connect.`))

            if(isExist) {
                const registerePasswd = await this.getHashedPasswdOf(username)
                const isCorrectPsswd = registerePasswd === password

                /**
                 * @desc Generate a complexe token.
                 * @return { Promise } the token.
                 * */
                const genToken = () => {
                    return new Promise((resolve, reject) => {
                        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                        let token = ''

                        for (let i = 0; i < 40; i++) {
                            if (i > 0 && i % 4 === 0) {
                                token += '-'
                            }

                            const randomIndex = Math.floor(Math.random() * chars.length)
                            token += chars[randomIndex]
                        }

                        resolve(token)
                    })
                }

                if(isCorrectPsswd) {
                    const token = await genToken()

                    this.database.query(
                        `UPDATE users SET token=? WHERE user=? OR email=?`,
                        [ token, user[0], user[0] ], (err, res, fields) => {
                            if(err) {
                                console.log(red(`?Rotors ::${user[0]} got an error.`))
                                resolve(false)
                            } else {
                                console.log(green(`?Rotors ::${user[0]} is connected.`))
                                resolve({ correctPasswd: isCorrectPsswd, token: token })
                            }
                        }
                    )
                } else {
                    console.log(red(`?Rotors ::${user[0]} is disconnected. (Wrong Password)`))
                    resolve({ correctPasswd: false })
                }
            } else {
                console.log(red(`?Rotors ::${username} not exist.`))
                resolve(false)
            }
        })
    }

    /**
     * Get user wishlist
     * @param { string } token The token of account
     * @return { [] } The wishlist
     * */
    async getUserWishList(token) {
        return await new Promise((resolve, reject) => {
            this.database.query(
                "SELECT id FROM users WHERE  token=?", [token], (err, res, fields) => {
                    if(res[0].id) {
                        this.database.query(
                            "SELECT itemid FROM wishlists WHERE userid=?", [res[0].id],
                            (err, res, fields) => {
                                if(!err) {
                                    resolve(res)
                                } else {
                                    resolve(null)
                                }
                            }
                        )
                    } else {
                        resolve(null)
                    }
                }
            )
        })
    }

    /**
     * @desc Insert an item in wish list
     * @param { string } token User token
     * @param { number } item Item id
     * */
    async insertWishlistItem(token, item) {
        return await new Promise((resolve, reject) => {
            this.database.query(
                "SELECT id FROM users WHERE token=?", [token],
                (err, res, fields) => {
                    if(res[0].id) {
                        this.database.query(
                            "INSERT INTO wishlists VALUES (?, ?)",
                            [res[0].id, item], (err, res, fields) => {
                                if(!err) {
                                    resolve(true)
                                } else {
                                    resolve(false)
                                }
                            }
                        )
                    } else {
                        resolve(false)
                    }
                }
            )
        })
    }

    /**
     * @desc Delete an item in wish list
     * @param { string } token User token
     * @param { number } item Item id
     * @return { boolean } Sucess or not
     * */
    async deleteWishlistItem(token, item) {
        return await new Promise((resolve, reject) => {
            this.database.query(
                "SELECT id FROM users WHERE token=?", [token],
                (err, res, fields) => {
                    if(res[0].id) {
                        this.database.query(
                            "DELETE FROM wishlists WHERE userid=? AND itemid=?",
                            [res[0].id, item], (err, res, fields) => {
                                if(!err) {
                                    resolve(true)
                                } else {
                                    resolve(false)
                                }
                            }
                        )
                    } else {
                        resolve(false)
                    }
                }
            )
        })
    }

    /**
     * Register a new user
     * @param { array[string | int | null] } user Object with name, password, perm etc...
     * @return { boolean } If the registration done.
     * */
    async register(user) {
        return await new Promise((resolve, reject) => {
            this.database.query(
                "SELECT user FROM users WHERE user=?",
                [user[1]], (err, res, fields) => {
                    if (err) {
                        console.log(red(err))
                        reject(err)
                    } else if (res.length > 0) {
                        console.log(red("?Rotors ::Username already exist"))
                        resolve(false)
                    } else {
                        this.database.query(
                            "SELECT email FROM users WHERE email=?",
                            [user[2]], (err, res, fields) => {
                                if (err) {
                                    console.log(red(err))
                                    reject(err)
                                } else if (res.length > 0) {
                                    console.log(red("?Rotors ::Email already exist"))
                                    resolve(false)
                                } else {
                                    this.database.query(
                                        "INSERT INTO users(permission, user, email, phone, passwd, created) VALUES(?, ?, ?, ?, ?, ?)",
                                        user, (err, res, fields) => {
                                            if(err) {
                                                console.log(red(err))
                                                reject(err)
                                            } else {
                                                console.log(green("?Rotors ::Request register() done."))
                                                resolve(true)
                                            }
                                        }
                                    )
                                }
                            }
                        )
                    }
                }
            )
        })
    }
}