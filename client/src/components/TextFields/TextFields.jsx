import "./TextFields.scss"

export default function TextFields({ placeholder, oc, name, type }) {
    return (
        <input
            className="textfields-input"
            name={ name ? name : null }
            type= { type ?? "search" }
            placeholder={ placeholder ? placeholder : "..." }
            onChange={ oc ?
                (event) => {
                    oc(event)
                } : null}
        />
    )
}