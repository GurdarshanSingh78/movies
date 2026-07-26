import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export default async function WatchlistPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const savedItems = await prisma.watchlist.findMany({
    where: { user_id: user.id },
    orderBy: { created_at: 'desc' }
  });

  return (
    <div className="max-w-7xl mx-auto py-8">
      <h1 className="text-3xl font-extrabold mb-8">My Watchlist</h1>
      
      {savedItems.length === 0 ? (
        <p className="text-zinc-500">Your watchlist is empty. Go save some titles!</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {savedItems.map((item) => (
            <Link 
              href={`/title/${item.media_id}?type=${item.media_type}`}
              key={item.id} 
              className="group relative flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:scale-105 transition-all shadow-lg"
            >
              <div className="relative aspect-[2/3] w-full bg-zinc-800">
                {item.poster_url && (
                  <img src={item.poster_url} alt={item.title} className="object-cover w-full h-full group-hover:opacity-80 transition-opacity" />
                )}
              </div>
              <div className="p-3 bg-gradient-to-t from-zinc-950 to-zinc-900">
                <h2 className="font-semibold text-sm line-clamp-1 group-hover:text-amber-400">{item.title}</h2>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}