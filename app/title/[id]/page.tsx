import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { toggleWatchlist } from '@/app/actions';

export default async function TitleDetailsPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ type?: string }>
}) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  
  const { id } = resolvedParams;
  const type = resolvedSearch.type || 'movie';
  const TMDB_KEY = process.env.TMDB_API_KEY;

  // 1. Authenticate the user and check their watchlist status
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let isSaved = false;
  if (user) {
    const savedItem = await prisma.watchlist.findFirst({
      where: { user_id: user.id, media_id: id }
    });
    if (savedItem) isSaved = true;
  }

  let displayTitle = "";
  let year = "";
  let synopsis = "";
  let posterUrl = null;
  let backdropUrl = null;
  let trailerUrl = null;
  let runtime = null;
  let status = null;
  let displayFormat = type === 'tv' ? 'Series' : type === 'movie' ? 'Movie' : 'Drama';

  // --- BRANCH 1: LOCAL PAKISTANI DRAMAS ---
  if (type === 'drama') {
    const drama = await prisma.title.findUnique({
      where: { id: id }
    });

    if (!drama) {
      return <div className="p-8 text-center text-zinc-500">Drama not found in local records.</div>;
    }

    displayTitle = drama.title_name;
    year = drama.release_date ? new Date(drama.release_date).getFullYear().toString() : '';
    synopsis = drama.synopsis || "No description provided.";
    posterUrl = drama.poster_url;
    backdropUrl = drama.poster_url;
    trailerUrl = null; 
  } 
  
  // --- BRANCH 2: LIVE TMDB TITLES (MOVIES & SERIES) ---
  else {
    const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${TMDB_KEY}&append_to_response=videos`);
    const data = await res.json();

    if (!data || data.success === false) {
      return <div className="p-8 text-center text-zinc-500">Title not found on global networks.</div>;
    }

    displayTitle = data.title || data.name;
    const releaseDate = data.release_date || data.first_air_date;
    year = releaseDate ? new Date(releaseDate).getFullYear().toString() : '';
    synopsis = data.overview;
    posterUrl = data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null;
    backdropUrl = data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : null;
    runtime = data.runtime ? `${data.runtime} MIN` : null;
    status = data.status;

    const trailer = data.videos?.results?.find((vid: any) => vid.type === 'Trailer' && vid.site === 'YouTube');
    trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <Link href="/" className="text-zinc-400 hover:text-white text-sm mb-6 inline-block transition-colors">
        ← Back to Discoveries
      </Link>

      <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl flex flex-col md:flex-row">
        
        {/* Left Side: Poster */}
        <div className="w-full md:w-1/3 lg:w-1/4 shrink-0 bg-zinc-950">
          {posterUrl ? (
            <img src={posterUrl} alt={displayTitle} className="w-full h-full object-cover aspect-[2/3]" />
          ) : (
            <div className="w-full aspect-[2/3] flex items-center justify-center text-zinc-600">No Poster Available</div>
          )}
        </div>

        {/* Right Side: Details & Backdrop */}
        <div className="relative w-full p-8 md:p-12 flex flex-col justify-center min-h-[400px]">
          {backdropUrl && (
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none mix-blend-luminosity"
              style={{ backgroundImage: `url(${backdropUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
          )}
          
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
              {displayTitle} {year && <span className="text-zinc-500 font-normal">({year})</span>}
            </h1>
            
            <div className="flex gap-2 mb-6 text-xs uppercase tracking-wider font-semibold text-zinc-400">
              <span className={`px-2 py-1 rounded ${type === 'drama' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-zinc-800'}`}>
                {displayFormat}
              </span>
              {runtime && <span className="bg-zinc-800 px-2 py-1 rounded">{runtime}</span>}
              {status && <span className="bg-zinc-800 px-2 py-1 rounded">{status}</span>}
            </div>

            <p className="text-zinc-300 text-base md:text-lg leading-relaxed mb-8 max-w-3xl line-clamp-6 md:line-clamp-none">
              {synopsis || "No synopsis available for this title."}
            </p>

            <div className="flex gap-4">
              {type === 'drama' ? (
                <Button className="bg-emerald-500 text-white hover:bg-emerald-600 font-bold px-8">
                  ▶ Open YouTube Playlist
                </Button>
              ) : trailerUrl ? (
                <a href={trailerUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-white text-black hover:bg-zinc-200 font-bold px-8">
                    ▶ Play Trailer
                  </Button>
                </a>
              ) : (
                <Button disabled className="bg-zinc-800 text-zinc-500 font-bold px-8">
                  No Trailer Available
                </Button>
              )}
              
              {/* Dynamic Watchlist Action Form */}
              <form action={toggleWatchlist}>
                <input type="hidden" name="mediaId" value={id} />
                <input type="hidden" name="mediaType" value={type} />
                <input type="hidden" name="title" value={displayTitle} />
                <input type="hidden" name="posterUrl" value={posterUrl || ''} />
                <Button type="submit" variant="outline" className="text-white border-zinc-700 hover:bg-zinc-800 h-full font-bold">
                  {isSaved ? "✓ Remove from Watchlist" : "+ Add to Watchlist"}
                </Button>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}