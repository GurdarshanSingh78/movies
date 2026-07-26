'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function GenreFilter({ genres }: { genres: { id: string, genre_name: string }[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentGenre = searchParams.get('genre');

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
      <button
        onClick={() => router.push('/')}
        className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
          !currentGenre 
            ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
            : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-white'
        }`}
      >
        All Discoveries
      </button>
      
      {genres.map((g) => (
        <button
          key={g.id}
          onClick={() => router.push(`/?genre=${g.id}`)}
          className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
            currentGenre === g.id 
              ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
              : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-white'
          }`}
        >
          {g.genre_name}
        </button>
      ))}
    </div>
  );
}