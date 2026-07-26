import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  const TMDB_KEY = process.env.TMDB_API_KEY;

  if (!TMDB_KEY) {
    return NextResponse.json({ error: "Missing TMDB API Key" }, { status: 500 });
  }

  try {
    const movieGenresRes = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_KEY}`);
    const tvGenresRes = await fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${TMDB_KEY}`);
    const movieGenresData = await movieGenresRes.json();
    const tvGenresData = await tvGenresRes.json();

    const allGenres = [...(movieGenresData.genres || []), ...(tvGenresData.genres || [])];
    const genreMap = new Map();

    for (const g of allGenres) {
      if (!genreMap.has(g.id)) {
        const savedGenre = await prisma.genre.upsert({
          where: { genre_name: g.name },
          update: {},
          create: { genre_name: g.name },
        });
        genreMap.set(g.id, savedGenre.id);
      }
    }

    let addedCount = 0;

    const moviesRes = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_KEY}`);
    const moviesData = await moviesRes.json();

    for (const item of (moviesData.results || [])) {
      const existing = await prisma.title.findFirst({ where: { title_name: item.title } });
      if (!existing) {
        const newTitle = await prisma.title.create({
          data: {
            title_name: item.title,
            synopsis: item.overview,
            format: 'MOVIE',
            release_date: item.release_date ? new Date(item.release_date) : null,
            poster_url: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
          }
        });
        addedCount++;
        
        if (item.genre_ids) {
          for (const tmdbGenreId of item.genre_ids) {
            const ourGenreId = genreMap.get(tmdbGenreId);
            if (ourGenreId) {
              await prisma.titleGenre.create({
                data: { title_id: newTitle.id, genre_id: ourGenreId }
              });
            }
          }
        }
      }
    }

    const tvRes = await fetch(`https://api.themoviedb.org/3/trending/tv/day?api_key=${TMDB_KEY}`);
    const tvData = await tvRes.json();

    for (const item of (tvData.results || [])) {
      const existing = await prisma.title.findFirst({ where: { title_name: item.name } });
      if (!existing) {
        const newTitle = await prisma.title.create({
          data: {
            title_name: item.name,
            synopsis: item.overview,
            format: 'SERIES',
            release_date: item.first_air_date ? new Date(item.first_air_date) : null,
            poster_url: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
          }
        });
        addedCount++;
        
        if (item.genre_ids) {
          for (const tmdbGenreId of item.genre_ids) {
            const ourGenreId = genreMap.get(tmdbGenreId);
            if (ourGenreId) {
              await prisma.titleGenre.create({
                data: { title_id: newTitle.id, genre_id: ourGenreId }
              });
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully added ${addedCount} new movies and series, completely tagged with genres!`
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}