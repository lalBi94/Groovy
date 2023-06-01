import { green, red } from 'console-log-colors'

export default class Store {
    constructor(database) {
        this.database = database
    }

    /**
     * @desc Recuperer les articles a l'affiche
     * @return { {} } Les articles
     * */
    getAlaffiche() {
        return new Promise((resolve, reject) => {
            this.database.query(
                "SELECT items FROM alaffiche", [], (err, res, fields) => {
                    const data = JSON.parse(res[0].items)
                    resolve(data)
                }
            )
        })
    }

    /**
     * @desc Faire une promo
     * @param { number } id L'identifiant de l'item
     * @param { number | null } promo LA promotion appliqué
     * @return { Promise }
     * */
    setPromotion(promo, id) {
        return new Promise((resolve, reject) => {
            this.database.query(
                "UPDATE items SET promotion=? WHERE id=?",
                [ promo, id ], (err, res, fields) => {
                    if(err) {
                        console.log(red("?Store ::Failed to set promotion"))
                        resolve(false)
                    } else {
                        console.log(green(`?Store ::Setting promotion succes for [${id}]`))
                        resolve(true)
                    }
                }
            )
        })
    }

    /**
     * @desc Recuperer les vinyls
     * @return { Promise }
     * */
    getItems() {
        return new Promise((resolve, reject) => {
            try {
                this.database.query(
                    "SELECT * FROM items ORDER BY id",
                    null, (err, res, fields) => {
                        resolve(res)
                    }
                )
            } catch(error) {
                console.log(red(error))
            }
        })
    }

    /**
     * @desc Recupere la musique d'un item
     * @param { number } id Vinyl id
     * */
    getItemMusic(id) {
        return new Promise((resolve, reject) => {
            try {
                this.database.query(
                    "SELECT audio FROM items WHERE id=?",
                    [id], (err, res, fields) => {
                        resolve(res[0].audio)
                    }
                )
            } catch(error) {
                console.log(red(error))
            }
        })
    }

    /**
     * @desc Créer un item
     * @param { {} } infos Name etc...
     * @param { [] } img The pciture
     * @param { [] } audio The audio
     * */
    createItem(infos, img, audio) {
        return new Promise((resolve, reject) => {
            let { name, album, owner, desc, price, category, qte } = infos;
            price = parseFloat(price)
            qte = parseInt(qte)
            category = parseInt(category)
            desc = decodeURI(desc)
            name = decodeURI(name)
            album = decodeURI(album)
            owner = decodeURI(owner)

            this.database.query(
                "INSERT INTO items(artist, price, name, album, `desc`, category, promotion, qte, img, audio) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [ owner, price, name, album, desc, category, null, qte, img, audio ], (err, res, fields) => {
                    if(err) {
                        console.log(err)
                        console.log(red(`?Store ::${ name } creation failed.`))
                        resolve(false)
                    } else {
                        console.log(green(`?Store ::${ name } created succesfully.`))
                        resolve(true)
                    }
                }
            )
        })
    }
}