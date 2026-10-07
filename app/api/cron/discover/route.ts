import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AppleTrack = {
  trackId?: number;
  trackName?: string;
  artistName?: string;
  artworkUrl100?: string;
  previewUrl?: string;
  trackViewUrl?: string;
  trackTimeMillis?: number;
  primaryGenreName?: string;
  releaseDate?: string;
  collectionId?: number;
};

type AppleResponse = {
  resultCount?: number;
  results?: AppleTrack[];
};

const SEARCHES = [
  { term: "pop", country: "TR" },
  { term: "pop", country: "US" },
  { term: "pop", country: "GB" },
  { term: "pop", country: "DE" },
  { term: "pop", country: "FR" },
  { term: "pop", country: "BR" },
  { term: "pop", country: "JP" },
  { term: "pop", country: "KR" },
  { term: "rock", country: "US" },
  { term: "rap", country: "US" },
  { term: "hip hop", country: "US" },
  { term: "dance", country: "GB" }
];

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

async function searchApple(term: string, country: string) {
  const url =
    `https://itunes.apple.com/search?term=${encodeURIComponent(term)}` +
    `&country=${country}` +
    `&media=music` +
    `&entity=song` +
    `&limit=25`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "GlobalMusic/1.0"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Apple API ${response.status}`);
  }

  return (await response.json()) as AppleResponse;
}

export async function GET(req: Request) {
  const authorization = req.headers.get("authorization");

  if (
    process.env.CRON_SECRET &&
    authorization !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: "Unauthorized"
      },
      { status: 401 }
    );
  }

  const startedAt = new Date().toISOString();

  let found = 0;
  let added = 0;
  let skipped = 0;

  try {
    for (const search of SEARCHES) {
      const data = await searchApple(
        search.term,
        search.country
      );

      const tracks = data.results ?? [];

      found += tracks.length;

      for (const track of tracks) {
        if (
          !track.trackName ||
          !track.artistName ||
          !track.trackViewUrl
        ) {
          skipped++;
          continue;
        }

        const artistName = track.artistName.trim();
        const artistNormalized = normalize(artistName);

        const { data: artist, error: artistError } =
          await supabaseAdmin
            .from("artists")
            .upsert(
              {
                name: artistName,
                normalized_name: artistNormalized,
                image_url: track.artworkUrl100 ?? null,
                country: search.country
              },
              {
                onConflict: "normalized_name"
              }
            )
            .select("id")
            .single();

        if (artistError || !artist) {
          skipped++;
          continue;
        }

        const trackData = {
          artist_id: artist.id,
          title: track.trackName.trim(),
          normalized_title: normalize(track.trackName),

          duration_seconds: track.trackTimeMillis
            ? Math.round(track.trackTimeMillis / 1000)
            : null,

          genre: track.primaryGenreName ?? null,

          release_date: track.releaseDate
            ? track.releaseDate.slice(0, 10)
            : null,

          cover_url: track.artworkUrl100
            ? track.artworkUrl100.replace(
                "100x100bb",
                "600x600bb"
              )
            : null,

          preview_url: track.previewUrl ?? null,

          stream_url: track.previewUrl ?? null,

          source_name: "Apple Music Preview",

          source_url: track.trackViewUrl,

          external_ids: {
            apple_track_id: track.trackId ?? null,
            apple_collection_id: track.collectionId ?? null
          },

          downloadable: false,

          download_url: null,

          is_active: true
        };

        const { data: inserted, error: trackError } =
          await supabaseAdmin
            .from("tracks")
            .upsert(trackData, {
              onConflict: "source_name,source_url",
              ignoreDuplicates: false
            })
            .select("id")
            .single();

        if (trackError) {
          skipped++;
          continue;
        }

        if (inserted) {
          added++;
        }
      }
    }

    return NextResponse.json({
      ok: true,
      message: "GlobalMusic keşfi tamamlandı.",

      started_at: startedAt,

      finished_at: new Date().toISOString(),

      searches: SEARCHES.length,

      items_found: found,

      items_added_or_updated: added,

      items_skipped: skipped
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,

        error:
          error instanceof Error
            ? error.message
            : "Bilinmeyen hata",

        items_found: found,

        items_added_or_updated: added,

        items_skipped: skipped
      },
      { status: 500 }
    );
  }
}
