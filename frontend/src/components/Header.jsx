export default function Header() {
  return (
    <header className="w-full bg-[#f7efe6] border-b border-[#e6d6c3]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-10 py-5">
        <h1 className="text-3xl font-semibold">Jayendra Vasan Bhandar</h1>

        <nav className="flex gap-8 text-xl">
          <a className="hover:text-[#b38b59]" href="#">
            Home
          </a>
          <a className="hover:text-[#b38b59]" href="#">
            Shop
          </a>
          <a className="hover:text-[#b38b59]" href="#">
            About
          </a>
          <a className="hover:text-[#b38b59]" href="#">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
