import Link from 'next/link';
import { Search } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-slate-900/90 to-transparent transition-all duration-300 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-8">
        <Link href="/" className="text-2xl font-bold text-red-600 tracking-tighter">
          GREYBRAINER
        </Link>
        <div className="hidden md:flex space-x-6 text-sm font-medium text-slate-200">
          <Link href="/" className="hover:text-slate-400 transition">Home</Link>
          <Link href="/reviews" className="hover:text-slate-400 transition">Deep Reviews</Link>
          <Link href="/insights" className="hover:text-slate-400 transition">Research & Insights</Link>
          <Link href="/comparisons" className="hover:text-slate-400 transition">Comparisons</Link>
        </div>
      </div>
      
      <div className="flex items-center space-x-5 text-slate-200">
        {/* Social Links */}
        <a href="https://x.com/Greybrainlens" target="_blank" rel="noopener noreferrer" className="hover:text-white transition" title="Follow on X">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>
        <a href="https://www.linkedin.com/company/greybrainer/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition" title="LinkedIn">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </a>
        <a href="https://medium.com/@GreyBrainer" target="_blank" rel="noopener noreferrer" className="hover:text-white transition" title="Medium">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13.54 12c0 3.74-3.01 6.77-6.72 6.77S.1 15.74.1 12s3.01-6.77 6.72-6.77S13.54 8.26 13.54 12zm7.37 0c0 3.52-1.51 6.38-3.38 6.38S14.15 15.52 14.15 12s1.51-6.38 3.38-6.38 3.38 2.86 3.38 6.38zm3.04 0c0 3.15-.53 5.7-1.18 5.7s-1.18-2.55-1.18-5.7.53-5.7 1.18-5.7 1.18 2.55 1.18 5.7z"/></svg>
        </a>
        <a href="https://www.facebook.com/share/1DmapQ7Hw3/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition" title="Facebook">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24h11.494v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12V24h6.116C23.407 24 24 23.407 24 22.676V1.325C24 .593 23.407 0 22.675 0z"/></svg>
        </a>
        <a href="https://www.instagram.com/greybrainlens" target="_blank" rel="noopener noreferrer" className="hover:text-white transition" title="Instagram">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
        </a>
        <div className="hidden md:block h-5 w-px bg-slate-700" />
        <Search className="w-5 h-5 cursor-pointer hover:text-white transition" />
        <Link href="/hub" className="hidden md:block text-sm font-semibold text-slate-200 hover:text-white transition">Writer Hub</Link>
      </div>
    </nav>
  );
}
