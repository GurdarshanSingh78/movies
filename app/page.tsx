import Link from 'next/link';
import GenreFilter from './components/GenreFilter';

export default async function HomePage({ searchParams }: { searchParams: Promise<{ genre?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const selectedGenreId = resolvedSearchParams?.genre;

  const TMDB_KEY = process.env.TMDB_API_KEY;

  // 1. Fetch Genres LIVE from TMDB
  const genreRes = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_KEY}`);
  const genreData = await genreRes.json();
  
  // Format them for our GenreFilter component
  const genres = (genreData.genres || []).map((g: any) => ({
    id: g.id.toString(),
    genre_name: g.name
  }));

  // 2. Fetch Titles LIVE from TMDB based on the filter
  // Default to global trending if no genre is selected
  let fetchUrl = `https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_KEY}`;
  
  if (selectedGenreId) {
    // If they click a genre, discover the best/most popular of all time in that genre
    fetchUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_genres=${selectedGenreId}&sort_by=popularity.desc&vote_count.gte=1000`;
  }

  const titlesRes = await fetch(fetchUrl);
  const titlesData = await titlesRes.json();
  const liveTitles = titlesData.results || [];

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          Live Discoveries
        </h1>
        <p className="text-zinc-400 text-sm md:text-base">
          Fetching the absolute best global content in real-time.
        </p>
      </div>

      <GenreFilter genres={genres} />

      {liveTitles.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          No titles found for this genre.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {liveTitles.map((title: any) => {
            // TMDB uses 'name' for TV shows and 'title' for movies
            const displayTitle = title.title || title.name;
            const releaseDate = title.release_date || title.first_air_date;
            const format = title.media_type === 'tv' ? 'SERIES' : 'MOVIE';
            const linkType = title.media_type === 'tv' ? 'tv' : 'movie';

            return (
              <Link 
                href={`/title/${title.id}?type=${linkType}`}
                key={title.id} 
                className="group relative flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:scale-105 hover:border-zinc-700 transition-all duration-300 shadow-lg cursor-pointer"
              >
                <div className="relative aspect-[2/3] w-full bg-zinc-800">
                  {title.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${title.poster_path}`}
                      alt={displayTitle}
                      className="object-cover w-full h-full group-hover:opacity-80 transition-opacity"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-zinc-500">
                      No Poster
                    </div>
                  )}
                </div>

                <div className="p-3 flex flex-col justify-between flex-grow bg-gradient-to-t from-zinc-950 to-zinc-900">
                  <h2 className="font-semibold text-sm line-clamp-1 group-hover:text-amber-400 transition-colors">
                    {displayTitle}
                  </h2>
                  <div className="flex items-center justify-between mt-1.5 text-[11px] text-zinc-400">
                    <span>
                      {releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded uppercase font-bold text-[9px] tracking-wide ${
                      format === 'MOVIE' ? 'bg-indigo-900/80 text-indigo-300' : 'bg-emerald-900/80 text-emerald-300'
                    }`}>
                      {format}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}