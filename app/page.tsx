"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Home,
  Music2,
  Video,
  Users,
  Disc3,
  Globe2,
  Heart,
  ListMusic,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Download,
  Shuffle,
  Repeat2,
  Moon,
  Sun
} from "lucide-react";

import { supabase } from "../lib/supabase";

type Track = {
  id: number | string;
  title: string;
  artist: string;
  duration: string;
  cover_url?: string | null;
  stream_url?: string | null;
  downloadable?: boolean;
  download_url?: string | null;
};

const demoTracks: Track[] = [
  {
    id: "demo-1",
    title: "Son Yaz",
    artist: "Zeynep Bastık",
    duration: "3:24"
  },
  {
    id: "demo-2",
    title: "Midnight",
    artist: "The Weeknd",
    duration: "4:12"
  },
  {
    id: "demo-3",
    title: "Aşkın Rengi",
    artist: "Semicenk",
    duration: "3:56"
  },
  {
    id: "demo-4",
    title: "Flowers",
    artist: "Miley Cyrus",
    duration: "3:20"
  },
  {
    id: "demo-5",
    title: "Unutamam",
    artist: "Edis",
    duration: "3:48"
  },
  {
    id: "demo-6",
    title: "Calm Down",
    artist: "Rema",
    duration: "3:39"
  }
];

const pics = [
  "1493225457124-a3eb161ffa5f",
  "1516280440614-37939bbacd81",
  "1524368535928-5b5e00ddc76b",
  "1506157786151-b8491531f063",
  "1501386761578-eac5c94b800a",
  "1492684223066-81342ee5ff30"
];

export default function Page() {
  const [dark, setDark] = useState(true);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [tracks, setTracks] = useState<Track[]>(demoTracks);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadTracks() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("tracks")
        .select(
          "id,title,duration_seconds,cover_url,stream_url,downloadable,download_url,artists(name)"
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("GlobalMusic Supabase:", error);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        const realTracks: Track[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          artist:
            item.artists?.name ||
            "Bilinmeyen Sanatçı",
          duration: formatDuration(item.duration_seconds),
          cover_url: item.cover_url,
          stream_url: item.stream_url,
          downloadable: item.downloadable,
          download_url: item.download_url
        }));

        setTracks(realTracks);
      }

      setLoading(false);
    }

    loadTracks();
  }, []);

  const filteredTracks = tracks.filter((track) => {
    const q = search.toLowerCase().trim();

    if (!q) return true;

    return (
      track.title.toLowerCase().includes(q) ||
      track.artist.toLowerCase().includes(q)
    );
  });

  const currentTrack =
    filteredTracks[active] ||
    tracks[active] ||
    demoTracks[0];

  function selectTrack(index: number) {
    setActive(index);
    setPlaying(true);
  }

  function downloadTrack() {
    if (
      currentTrack.downloadable &&
      currentTrack.download_url
    ) {
      window.open(
        currentTrack.download_url,
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }

    alert(
      "Bu içerik için kaynak tarafından izin verilen bir indirme bağlantısı bulunmuyor."
    );
  }

  return (
    <main className={dark ? "site dark" : "site"}>

      <aside className="side">

        <div className="logo">
          〽 <b>GlobalMusic</b>
        </div>

        {[
          [Home, "Ana Sayfa"],
          [Search, "Arama"],
          [Music2, "Müzik"],
          [Video, "Videolar"],
          [Users, "Sanatçılar"],
          [Disc3, "Albümler"],
          [Globe2, "Türler"],
          [Globe2, "Ülkeler"]
        ].map(([Icon, text]: any, index) => (
          <button
            className={index === 0 ? "nav active" : "nav"}
            key={text}
          >
            <Icon size={18} />
            {text}
          </button>
        ))}

        <hr />

        <small>Listelerim</small>

        <button className="nav">
          <Heart size={18} />
          Beğenilenler
        </button>

        <button className="nav">
          <ListMusic size={18} />
          Çalma Listeleri
        </button>

      </aside>

      <section className="content">

        <header>

          <div className="search">

            <Search size={19} />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setActive(0);
              }}
              placeholder="Şarkı, sanatçı, albüm veya video ara..."
            />

          </div>

          <button
            className="round"
            onClick={() => setDark(!dark)}
          >
            {dark ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )}
          </button>

          <button className="login">
            Giriş Yap
          </button>

        </header>

        <div className="hero">

          <div>

            <small>GLOBALMUSIC</small>

            <h1>
              Dünya'nın
              <br />
              <b>Müziği</b> Burada
            </h1>

            <p>
              Milyonlarca şarkı, video ve sanatçı.
              <br />
              Keşfet, dinle, indir.
            </p>

            <button
              className="primary"
              onClick={() => {
                setActive(0);
                setPlaying(true);
              }}
            >
              <Play size={18} />
              Hemen Keşfet
            </button>

            <button
              className="secondary"
              onClick={() => {
                const random =
                  Math.floor(Math.random() * tracks.length);

                setActive(random);
                setPlaying(true);
              }}
            >
              <Shuffle size={17} />
              Rastgele Dinle
            </button>

          </div>

        </div>

        <div className="chips">

          {[
            "Tümü",
            "Pop",
            "Rap",
            "Rock",
            "Arabesk",
            "Elektronik",
            "Lo-fi",
            "K-Pop",
            "R&B",
            "Jazz",
            "Klasik"
          ].map((x, i) => (
            <button
              className={i === 0 ? "chip sel" : "chip"}
              key={x}
            >
              {x}
            </button>
          ))}

        </div>

        <Section title="Yeni Eklenenler">

          {loading ? (
            <p className="loading">
              GlobalMusic verileri yükleniyor...
            </p>
          ) : (
            <div className="cards">

              {filteredTracks.map((x, i) => {

                const originalIndex = tracks.findIndex(
                  (track) => track.id === x.id
                );

                return (
                  <article
                    key={x.id}
                    onClick={() =>
                      selectTrack(
                        originalIndex >= 0
                          ? originalIndex
                          : i
                      )
                    }
                  >

                    <div className="cover">

                      <img
                        src={
                          x.cover_url ||
                          `https://images.unsplash.com/photo-${pics[i % pics.length]}?w=600`
                        }
                        alt={x.title}
                      />

                      <span>
                        <Play
                          size={19}
                          fill="currentColor"
                        />
                      </span>

                    </div>

                    <b>{x.title}</b>

                    <small>
                      {x.artist} · {x.duration}
                    </small>

                  </article>
                );
              })}

            </div>
          )}

        </Section>

        <Section title="Popüler Sanatçılar">

          <div className="artists">

            {tracks.slice(0, 6).map((x, i) => (

              <div
                className="artist"
                key={`${x.artist}-${i}`}
              >

                <img
                  src={
                    x.cover_url ||
                    `https://images.unsplash.com/photo-${pics[i % pics.length]}?w=300`
                  }
                  alt={x.artist}
                />

                <span>{x.artist}</span>

              </div>

            ))}

          </div>

        </Section>

        <Section title="Ülkelere Göre Müzik">

          <div className="countries">

            {[
              "🇹🇷 Türkiye",
              "🇺🇸 Amerika",
              "🇬🇧 İngiltere",
              "🇰🇷 Kore",
              "🇸🇦 Arapça",
              "🌍 Dünya"
            ].map((x) => (
              <div key={x}>
                {x}
              </div>
            ))}

          </div>

        </Section>

      </section>

      <footer className="player">

        <img
          src={
            currentTrack.cover_url ||
            `https://images.unsplash.com/photo-${pics[active % pics.length]}?w=200`
          }
          alt=""
        />

        <div className="now">

          <b>{currentTrack.title}</b>

          <small>{currentTrack.artist}</small>

        </div>

        <button>
          <Shuffle size={17} />
        </button>

        <button
          onClick={() => {
            const next =
              active <= 0
                ? tracks.length - 1
                : active - 1;

            setActive(next);
          }}
        >
          <SkipBack size={20} />
        </button>

        <button
          className="play"
          onClick={() => setPlaying(!playing)}
        >
          {playing ? (
            <Pause size={20} />
          ) : (
            <Play size={20} />
          )}
        </button>

        <button
          onClick={() => {
            const next =
              active >= tracks.length - 1
                ? 0
                : active + 1;

            setActive(next);
          }}
        >
          <SkipForward size={20} />
        </button>

        <button>
          <Repeat2 size={17} />
        </button>

        <button
          className="download"
          onClick={downloadTrack}
        >
          <Download size={18} />
          İndir
        </button>

        <div className="bar">
          <i />
        </div>

      </footer>

    </main>
  );
}

function formatDuration(seconds?: number | null) {
  if (!seconds || seconds <= 0) {
    return "—";
  }

  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  return `${minutes}:${remaining
    .toString()
    .padStart(2, "0")}`;
}

function Section({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section">

      <div className="head">

        <h2>{title}</h2>

        <button>
          Tümünü Gör →
        </button>

      </div>

      {children}

    </section>
  );
    }
