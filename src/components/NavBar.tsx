import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand">
        <span className="navbar-title">The Chai Stand</span>
      </Link>
    </nav>
  );
}