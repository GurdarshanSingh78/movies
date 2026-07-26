import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  return (
    <nav className="border-b bg-black text-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-xl font-bold tracking-tighter">
          DRAMA DISCOVERY
        </Link>
        <div className="hidden md:flex gap-4 text-sm font-medium text-gray-400">
          <Link href="/movies" className="hover:text-white transition-colors">Movies</Link>
          <Link href="/series" className="hover:text-white transition-colors">Series</Link>
          <Link href="/pakistani" className="hover:text-white transition-colors">Pakistani Dramas</Link>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="outline" className="text-black bg-white hover:bg-gray-200">
          Sign In
        </Button>
      </div>
    </nav>
  );
}