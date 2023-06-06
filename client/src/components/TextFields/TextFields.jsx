import "./TextFields.scss"

export default function TextFields({ min, max, persostyle, placeholder, oc, name, type }) {
    return (
        <input
            min={min ?? null}
            max={max ?? null}
            style={persostyle ?? null}
            className="textfields-input"
            name={ name ?? null }
            type= { type ?? "search" }
            placeholder={ placeholder ?? "..." }
            onChange={ oc ?
                (event) => {
                    oc(event)
                } : null}
        />
    )
}