import Link from 'next/link';
import GenreFilter from '../components/GenreFilter';

export default async function MoviesPage({ searchParams }: { searchParams: Promise<{ genre?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const selectedGenreId = resolvedSearchParams?.genre;
  const TMDB_KEY = process.env.TMDB_API_KEY;

  const genreRes = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_KEY}`);
  const genreData = await genreRes.json();
  const genres = (genreData.genres || []).map((g: any) => ({
    id: g.id.toString(),
    genre_name: g.name
  }));

  // Notice we specifically target "movie" endpoints here, not "all"
  let fetchUrl = `https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_KEY}`;
  if (selectedGenreId) {
    fetchUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_genres=${selectedGenreId}&sort_by=popularity.desc&vote_count.gte=1000`;
  }

  const titlesRes = await fetch(fetchUrl);
  const titlesData = await titlesRes.json();
  const liveTitles = titlesData.results || [];

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Movies</h1>
        <p className="text-zinc-400 text-sm">Browse all aggregated international movies.</p>
      </div>

      <GenreFilter genres={genres} />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {liveTitles.map((title: any) => (
          <Link 
            href={`/title/${title.id}?type=movie`}
            key={title.id} 
            className="group relative flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:scale-105 hover:border-zinc-700 transition-all shadow-lg"
          >
            <div className="relative aspect-[2/3] w-full bg-zinc-800">
              {title.poster_path && (
                <img src={`https://image.tmdb.org/t/p/w500${title.poster_path}`} alt={title.title} className="object-cover w-full h-full group-hover:opacity-80 transition-opacity" loading="lazy" />
              )}
            </div>
            <div className="p-3 flex flex-col justify-between flex-grow bg-gradient-to-t from-zinc-950 to-zinc-900">
              <h2 className="font-semibold text-sm line-clamp-1 group-hover:text-amber-400 transition-colors">{title.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}