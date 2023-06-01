import "./GenButton.scss"

export default function GenButton({ text, handler, persostyle, type }) {
    return(
        <button
            type={type ? type : null}
            id="genbutton-btn"
            onClick={ handler }
            style={ persostyle }>
            <nobr>{ text }</nobr>
        </button>
    )
}