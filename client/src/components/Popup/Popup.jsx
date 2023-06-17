import Modal from "react-modal";
import "./Popup.scss"
import GenButton from "../GenButton/GenButton";

Modal.setAppElement('#root');

export default function Popup({ isOpen, onClose, title, text }) {
    return (
        <Modal className="popup" isOpen={isOpen} onRequestClose={onClose} contentLabel="Popup">
            <h2>{title}</h2>
            <p>{text}</p>
            <GenButton text="Close" handler={onClose} />
        </Modal>
    )
}