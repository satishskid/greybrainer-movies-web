import Link from 'next/link';
import { Search, Bell, Menu } from 'lucide-react';

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
      
      <div className="flex items-center space-x-6 text-slate-200">
        <Search className="w-5 h-5 cursor-pointer hover:text-white transition" />
        <Link href="/hub" className="hidden md:block text-sm font-semibold text-slate-200 hover:text-white transition">Writer Hub</Link>
        <Bell className="w-5 h-5 cursor-pointer hover:text-white transition" />
        <div className="w-8 h-8 rounded-sm bg-slate-600 cursor-pointer overflow-hidden">
          {/* Avatar placeholder */}
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Greybrainer" alt="User Avatar" />
        </div>
      </div>
    </nav>
  );
}
