import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import './globals.css';
import { createClient } from '@/lib/supabase/server';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Drama Discovery',
  description: 'Aggregating global content and local favorites in real-time.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check the secure server-side cookies for an active session
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased min-h-screen`}>
        <header className="border-b border-zinc-900 bg-black sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-sm font-black tracking-wider uppercase hover:opacity-80 transition-opacity">
                DRAMA DISCOVERY
              </Link>

              <nav className="hidden md:flex items-center gap-6 text-xs text-zinc-400 font-medium">
                <Link href="/movies" className="hover:text-white transition-colors">Movies</Link>
                <Link href="/series" className="hover:text-white transition-colors">Series</Link>
                <Link href="/pakistani" className="hover:text-white transition-colors">Pakistani Dramas</Link>
                
                {/* Dynamically show the Watchlist link if the user is authenticated */}
                {user && (
                  <Link href="/watchlist" className="text-amber-400 hover:text-amber-300 transition-colors font-bold">
                    Watchlist
                  </Link>
                )}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {/* If a user exists, show their email and a Sign Out button */}
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="hidden sm:inline-block text-xs text-zinc-400 font-medium">
                    {user.email}
                  </span>
                  <form action={async () => {
                    'use server';
                    const supabase = await createClient();
                    await supabase.auth.signOut();
                  }}>
                    <Button type="submit" variant="outline" className="text-white border-zinc-700 hover:bg-zinc-800 text-xs px-4 py-2">
                      Sign Out
                    </Button>
                  </form>
                </div>
              ) : (
                /* Otherwise, show the standard Sign In button */
                <Link href="/login">
                  <Button className="bg-white text-black hover:bg-zinc-200 font-bold px-4 py-2 rounded-lg text-sm transition-all">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="px-4 md:px-8 max-w-7xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}