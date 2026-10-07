"use client";

import { useState } from "react";
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

const tracks = [
  ["Son Yaz", "Zeynep Bastık", "3:24"],
  ["Midnight", "The Weeknd", "4:12"],
  ["Aşkın Rengi", "Semicenk", "3:56"],
  ["Flowers", "Miley Cyrus", "3:20"],
  ["Unutamam", "Edis", "3:48"],
  ["Calm Down", "Rema", "3:39"]
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

  const track = tracks[active];

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
              placeholder="Şarkı, sanatçı, albüm veya video ara..."
            />
          </div>

          <button
            className="round"
            onClick={() => setDark(!dark)}
          >
            {dark ? <Sun size={19} /> : <Moon size={19} />}
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
              onClick={() => setPlaying(true)}
            >
              <Play size={18} />
              Hemen Keşfet
            </button>

            <button className="secondary">
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

          <div className="cards">

            {tracks.map((x, i) => (

              <article
                key={x[0]}
                onClick={() => {
                  setActive(i);
                  setPlaying(true);
                }}
              >

                <div className="cover">

                  <img
                    src={`https://images.unsplash.com/photo-${pics[i]}?w=600`}
                    alt={x[0]}
                  />

                  <span>
                    <Play size={19} fill="currentColor" />
                  </span>

                </div>

                <b>{x[0]}</b>

                <small>
                  {x[1]} · {x[2]}
                </small>

              </article>

            ))}

          </div>

        </Section>

        <Section title="Popüler Sanatçılar">

          <div className="artists">

            {tracks.map((x, i) => (

              <div className="artist" key={x[1]}>

                <img
                  src={`https://images.unsplash.com/photo-${pics[i]}?w=300`}
                  alt={x[1]}
                />

                <span>{x[1]}</span>

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
            ].map(x => (
              <div key={x}>
                {x}
              </div>
            ))}

          </div>

        </Section>

      </section>

      <footer className="player">

        <img
          src={`https://images.unsplash.com/photo-${pics[active]}?w=200`}
          alt=""
        />

        <div className="now">

          <b>{track[0]}</b>

          <small>{track[1]}</small>

        </div>

        <button>
          <Shuffle size={17} />
        </button>

        <button>
          <SkipBack size={20} />
        </button>

        <button
          className="play"
          onClick={() => setPlaying(!playing)}
        >
          {playing
            ? <Pause size={20} />
            : <Play size={20} />}
        </button>

        <button>
          <SkipForward size={20} />
        </button>

        <button>
          <Repeat2 size={17} />
        </button>

        <button className="download">
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
