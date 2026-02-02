import LoadingSpinner from "../_components/LoadingSpinner";

export default function GlobalLoading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <LoadingSpinner className="size-8 opacity-70"/>
        </div>
    );
}