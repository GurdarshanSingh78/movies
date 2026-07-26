'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function toggleWatchlist(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const mediaId = formData.get('mediaId') as string;
  const mediaType = formData.get('mediaType') as string;
  const title = formData.get('title') as string;
  const posterUrl = formData.get('posterUrl') as string;

  // Check if it's already saved
  const existing = await prisma.watchlist.findFirst({
    where: { user_id: user.id, media_id: mediaId }
  });

  if (existing) {
    await prisma.watchlist.delete({ where: { id: existing.id } });
  } else {
    await prisma.watchlist.create({
      data: {
        user_id: user.id,
        media_id: mediaId,
        media_type: mediaType,
        title: title,
        poster_url: posterUrl || null
      }
    });
  }
  
  revalidatePath(`/title/${mediaId}`);
  revalidatePath('/watchlist');
}