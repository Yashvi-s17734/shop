export default function Footer() {
  return (
    <footer className="bg-[#6b2e2e] text-white">
      <div className="max-w-7xl mx-auto px-10 py-12 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-3">
            Jayendra Vasan Bhandar
          </h2>
          <p>Ghat Bazaar, Sihor – 364240</p>
          <p>+91 9825152881</p>
          <p>+91 9328337767</p>
        </div>

        <div className="flex items-end justify-end">
          <button className="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700">
            Chat with us
          </button>
        </div>
      </div>
    </footer>
  );
}
