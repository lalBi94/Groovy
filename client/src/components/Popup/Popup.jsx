import "./Popup.scss"

export default function Popup({show, title, text, close}) {
    if (!show) {
        return null;
    }

    return (
        <div className="popup-container">
            <div className="popup-content">
                <h3>{ title }</h3>
                <p>{ text }</p>
                <button onClick={ close }>Fermer</button>
            </div>
        </div>
    );
}