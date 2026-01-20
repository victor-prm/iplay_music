import Link from "next/link";

export default function CategoryOverviewPage() {
    return (
        <div>
            <h1 className="font-bold text-2xl">Categories</h1>
            <ul>
                <li>
                    <Link href="/category/jazz">Jazz</Link>
                </li>
                <li>
                    <Link href="/category/reggae">Reggae</Link>
                </li>
                <li>
                    <Link href="/category/thrash-metal">Thrash metal</Link>
                </li>
            </ul>
        </div>
    );
}