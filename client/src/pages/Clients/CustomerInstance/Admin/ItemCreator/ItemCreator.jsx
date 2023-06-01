import "./ItemCreator.scss"
import NavBar from "../../../../../components/NavBar/NavBar"
import {useForm} from 'react-hook-form'
import axios from "axios"
import {useEffect, useState} from "react"
import GenButton from "../../../../../components/GenButton/GenButton"
import {getUserData, isAdmin} from "../../../../../components/ClientAPI/ClientAPI";

export default function ItemCreator() {
    const { register, handleSubmit } = useForm();
    const [ preview, setPreview ] = useState(null)
    const [ audio, setAudioPreview ] = useState(null)

    function showPreview(event) {
        event.preventDefault()

        const img = event.target.files[0]
        const reader = new FileReader();

        reader.onloadend = () => {
            setPreview(reader.result);
        }

        if(img) {
            reader.readAsDataURL(img);
        }
    }

    function showAudioPreview(event) {
        event.preventDefault()

        const audio = event.target.files[0]
        const reader = new FileReader();

        reader.onloadend = () => {
            setAudioPreview(reader.result);
        }

        if(audio) {
            reader.readAsDataURL(audio);
        }
    }

    const onSubmit = (data) => {
        const { name, album, owner, desc, price, category, qte, image, rec } = data
        const required = [ name, album, owner, desc, price, category, qte, image ]

        const hasMissing = required.some((field) => !field)
        if(hasMissing) {
            return alert("Some fields was empty")
        }

        const data_file = new FormData();

        const blob = new Blob([image[0]], { type: image[0].type })
        data_file.append('file', blob);

        if(rec[0]) {
            const blobaudio = new Blob([rec[0]], { type: rec[0].type })
            data_file.append("audio", blobaudio)
        }


        axios.post(`/createItem?name=${name}&album=${album}&owner=${owner}&desc=${desc}&price=${price}&category=${category}&qte=${qte}`,data_file)
            .then((res) => {
                if(res.data.isOk) {
                    return alert("Création de l'article effectué !")
                } else {
                    return alert("Erreur !")
                }
            })
    }

    useEffect(() => {
        getUserData()
            .then((res) => {
                if(!isAdmin(res.data)) {
                    window.location = "/home"
                    return alert("Acces non autorisé")
                }
            })
    }, [])

    return (
        <div id="item-creator-container">
            <NavBar where="admin"/>

            <div id="item-creator-content">
                <form onSubmit={handleSubmit(onSubmit)} id="item-creator-form">
                    <div className="item-creator-options">
                        <label htmlFor="name">Nom du vinyl&nbsp;</label>

                        <input
                            className="textfields-input"
                            {...register("name")}
                            placeholder="..."
                        />
                    </div>

                    <div className="item-creator-options">
                        <label htmlFor="album">Nom de l'album&nbsp;</label>

                        <input
                            className="textfields-input"
                            {...register("album")}
                            placeholder="..."
                        />
                    </div>

                    <div className="item-creator-options">
                        <label htmlFor="owner">Artiste / MD&nbsp;</label>

                        <input
                            className="textfields-input"
                            {...register("owner")}
                            placeholder="..."
                        />
                    </div>

                    <div className="item-creator-options">
                        <label htmlFor="price">Prix&nbsp;</label>

                        <input
                            className="textfields-input"
                            {...register("price")}
                            placeholder="..."
                        />
                    </div>

                    <div className="item-creator-options">
                        <label htmlFor="desc">Description</label>

                        <input
                            className="textfields-input"
                            {...register("desc")}
                            placeholder="..."
                        />
                    </div>

                    <div className="item-creator-options">
                        <label htmlFor="cotegory">Categorie</label>

                        <input
                            className="textfields-input"
                            {...register("category")}
                            placeholder="..."
                        />
                    </div>

                    <div className="item-creator-options">
                        <label htmlFor="qte">Quantité</label>

                        <input
                            className="textfields-input"
                            {...register("qte")}
                            placeholder="..."
                        />
                    </div>

                    <div className="item-creator-options">
                        <label htmlFor="image">Image</label>
                        <input
                            type="file"
                            {...register('image')}
                            onChange={showPreview}
                            accept="image/*"
                        />
                    </div>

                    <div className="item-creator-options">
                        <label htmlFor="record">Audio (can be empty)</label>
                        <input
                            type="file"
                            {...register('rec')}
                            onChange={(event) => { showAudioPreview(event) }}
                            accept="audio/*"
                        />
                    </div>

                    <GenButton type="submit" text="Create"/>
                </form>

                <div id="item-creator-previews">
                    <img src={ preview } className="item-creator-img" alt="Please select a pics"/>
                    <audio src={ audio } controls={true} />
                </div>
            </div>
        </div>
    );
}