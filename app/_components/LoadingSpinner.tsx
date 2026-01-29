import { PiSpinnerBold } from "react-icons/pi";

interface LoadingSpinnerProps {
    className?: string;
}


export default function LoadingSpinner(props: LoadingSpinnerProps) {
    const { className } = props;
    return (
        <div className={`size-4.5 flex items-center justify-center animate-pulse ${className ?? ""}`}>
            <PiSpinnerBold className="size-full animate-spin" />
        </div>

    )
}