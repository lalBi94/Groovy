import {ScaleLoader} from "react-spinners"

export default function Loader({color, radius, speedMultiplier, height, width, loading}) {
    return (
        <div className="loader">
            <ScaleLoader
                color={ color ?? "black" }
                height={ height ?? 80 }
                radius={ radius ?? 4 }
                speedMultiplier={ speedMultiplier ?? 1.1 }
                width={ width ?? 50 }
            />
        </div>
    )
}