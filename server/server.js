import express, {response} from "express"
import { red, blue, green, magenta } from "console-log-colors"
import cors from "cors"
import "./Turing/Turing.js"
import Turing from "./Turing/Turing.js";
import multer from "multer"
import fs from "fs"
import ChronoStatis from "./ChronoStatis/ChronoStatis.js";

const PORT = 3001
const app = express()
const api = new Turing()
const chronoStatis = new ChronoStatis(api)

let itemsShop = chronoStatis.getItemsShop()
app.use(cors())
app.use(express.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'file') {
            cb(null, './Storage/image');
        } else if (file.fieldname === 'audio') {
            cb(null, './Storage/audio');
        } else {
            cb(new Error('Invalid file type.'));
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage })
    .fields([{ name: 'file' }, { name: 'audio' }]);

/**
 * @desc Register new client
 * @link /register?user=&password=&email=&phone=&created=
 * */
app.post("/register", async (req, res) => {
    try {
        const { user, password, email, phone, created } = req.body;

        const isOk = await api.register([
            0,
            user,
            email,
            phone,
            password,
            created
        ]);

        res.json({ "response": isOk });
    } catch (err) {
        res.json({ "response": false });
    }
})

/**
 * @desc Login existed client
 * @link /login?user=&passwd=
 * */
app.post("/login", async (req, res) => {
    try {
        const { user, passwd } = await req.body;

        const isOk = await api.login([
            user, passwd
        ]);

        res.json({ response: isOk.correctPasswd, username: user, token: isOk.token });
    } catch (err) {
        res.json({ response: false });
    }
})

/**
 * @desc Get user data
 * @link /getUserData?token=
 * */
app.post("/getUserData", async (req, res) => {
    try {
        const token = await req.body.token
        const data = await api.getUserData(token)
        res.json(data)
    } catch(err) {
        res.json({ response: false });
    }
})

/**
 * @desc Get user Wish List
 * @link "/getUserWishList?token="
 * */
app.post("/getUserWishList", async (req, res) => {
    try {
        const token = await req.body.token
        const data = await api.getUserWishList(token)
        res.json({wishlist: data})
    } catch(err) {
        res.json({ response: null })
    }
})

/**
 * @desc Insert item in wishlist user
 * @link "/insertWishListItem?itemid="
 * */
app.post("/insertWishListItem", async (req, res) => {
    const token = await req.body.token
    const itemid = await req.body.itemid
    const data = await api.insertWishListItem(token, itemid)

    res.json({succes: data})
})

/**
 * @desc Remove item from wishlist user
 * @link "/removeWishListItem?itemid="
 * */
app.post("/removeWishListItem", async (req, res) => {
    const token = await req.body.token
    const itemid = await req.body.itemid
    const data = await api.removeWishListItem(token, itemid)

    res.json({succes: data})
})

/**
 * @desc Crypt a data
 * @link /crypt?sentence=
 * */
app.post("/crypt", (req, res) => {
    const { sentence } = req.body
    const cipher = api.encrypt(sentence)

    if(cipher !== null) {
        res.json({"cryptedSentence": cipher})
    } else {
        res.json({"cryptedSentence": false})
    }
})

/**
 * @desc Check if two data have the same fingerprint
 * @link /equality?cipher=&sentence=
 * */
app.get("/equality", (req, res) => {
    const { cipher, sentence } = req.query
    const isEquals = api.isEquals(cipher, sentence)

    res.json({isEquals: isEquals})
})

/**
 * @desc Get all items
 * @link /getItems?
 * */
app.get("/getItems", async (req, res) => {
    const data = await itemsShop

    data.forEach((e) => {
        e.audio = null
        e.audiob64 = null
        e.audiotype = null
    })

    res.json(data)
})

/**
 * @desc Get items from "A l'affiche"
 * @link /getAlaffiche?
 * */
app.get("/getAlaffiche", async (req, res) => {
    const data = await api.getAlaffiche()
    res.json(data)
})

/**
 * @desc Get items infos
 * @link /getItem?id=
 * */
app.get("/getItem", async (req, res) => {
    const { id } = req.query
    const data = await itemsShop

    const ifMusic = async () => {
        const req = await api.getItemMusic(parseInt(id))
        const data = req
        return data
    }

    data.forEach((e) => {
        if(e.id === parseInt(id)) {
            if(e.haveAudio) {
                ifMusic()
                    .then((res) => {
                        e.audio = res
                        e.audiotype = chronoStatis.getTypeOfArrayBuffer(e.audio)
                        e.audiob64 = chronoStatis.encode64(e.audio)
                })

                res.json(e)
            } else {
                res.json(e)
            }
        }
    })
})

/**
 * @desc Set new promotion to item
 * @link /setPromotion?promo=&id=
 * */
app.get("/setPromotion", async (req, res) => {
    const { promo, id } = req.query
    const data = await api.setPromotion(parseInt(promo) || null, parseInt(id))
    res.json({ isOk: data })
})

/**
 * @desc Create items
 * @link /createItem?name=&album=&owner=&price=&datedontknow=$date=&category=&qte=&image=
 * */
app.post("/createItem", async (req, res) => {
    upload(req, res, async (err) => {
        if(err) {
            console.log(red(err))
            res.json({ isOk: false })
        } else {
            const fileData = await fs.readFileSync(req.files.file[0].path)
            let audioData = null

            if(req.files.audio) {
                audioData = await fs.readFileSync(req.files.audio[0].path) ?? null
            }

            const data = await api.createItem(req.query, fileData, audioData)

            await fs.rmSync(req.files.file[0].path)

            if(req.files.audio) {
                await fs.rmSync(req.files.audio[0].path)
            }

            res.json({ isOk: data })
        }
    })
})

app.post("/modifyClientInfos", async (req, res) => {
    const { token, what, newvalue } = req.body

    if(token && ["pseudo", "email", "phone"].includes(what)) {
        if(what === "email") {
            if(!newvalue.includes("@") && !newvalue.includes(".")) {
                console.log(newvalue)
                res.json(null)
                return null
            }
        }

        if(what === "phone") {
            if(!/[0-9+\s]/.test(newvalue)) {
                res.json(null)
                return null
            }
        }

        const data = await api.modifyClientInfos(token, what, newvalue)
        console.log(data)

        if(data) {
            res.json(data)
        } else {
            res.json(null)
        }
    } else {
        res.json(null)
    }
})

app.listen(PORT, () => {
    console.log(magenta(`?Server ::${PORT} [OK]\n`))
})