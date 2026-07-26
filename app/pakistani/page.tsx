import Link from 'next/link';
import { prisma } from '../../lib/prisma';

export default async function PakistaniDramasPage() {
  // Pull all curated records out of your local Supabase database
  const dramas = await prisma.title.findMany({
    where: { format: 'DRAMA' },
    orderBy: { release_date: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl text-emerald-400">
          Pakistani Dramas
        </h1>
        <p className="text-zinc-400 text-sm">
          Browse official television serials and playlists indexed directly from leading networks.
        </p>
      </div>

      {dramas.length === 0 ? (
        <div className="text-center py-24 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 max-w-xl mx-auto mt-8">
          <p className="text-zinc-400 mb-2 font-medium">Your specialized hub is ready!</p>
          <p className="text-zinc-600 text-xs">
            No records found. Run your upgraded YouTube seed route to instantly populate this grid.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {dramas.map((drama) => (
            <Link
              href={`/title/${drama.id}?type=drama`}
              key={drama.id}
              className="group relative flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:scale-105 hover:border-zinc-700 transition-all duration-300 shadow-lg cursor-pointer"
            >
              <div className="relative aspect-[2/3] w-full bg-zinc-800">
                {drama.poster_url ? (
                  <img
                    src={drama.poster_url}
                    alt={drama.title_name}
                    className="object-cover w-full h-full group-hover:opacity-80 transition-opacity"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-zinc-500">
                    No Poster Available
                  </div>
                )}
              </div>
              
              <div className="p-3 flex flex-col justify-between flex-grow bg-gradient-to-t from-zinc-950 to-zinc-900">
                <h2 className="font-semibold text-sm line-clamp-1 group-hover:text-amber-400 transition-colors">
                  {drama.title_name}
                </h2>
                <div className="flex items-center justify-between mt-1.5 text-[11px] text-zinc-400">
                  <span>
                    {drama.release_date 
                      ? new Date(drama.release_date).getFullYear() 
                      : 'N/A'}
                  </span>
                  <span className="px-1.5 py-0.5 rounded uppercase font-bold text-[9px] tracking-wide bg-emerald-900/80 text-emerald-300">
                    DRAMA
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}