import { useEffect, useRef, useState } from "react";

type Quote = {
  text: string;
  romaji: string;
  author: string;
};

const quotes: Quote[] = [
  {
    text: "神は死んだ",
    romaji: "kami wa shinda",
    author: "ニーチェ",
  },
  {
    text: "我思う、ゆえに我あり",
    romaji: "ware omou, yue ni ware ari",
    author: "デカルト",
  },
];

export default function App() {
  const [text, setText] = useState("");
  const [romaji, setRomaji] = useState("");
  const [author, setAuthor] = useState("");
  const [bgmOn, setBgmOn] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  const typeSound = useRef<HTMLAudioElement | null>(null);
  const bgm = useRef<HTMLAudioElement | null>(null);
  const gameOverBgm = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    typeSound.current = new Audio(import.meta.env.BASE_URL + "type.mp3");
    bgm.current = new Audio(import.meta.env.BASE_URL + "bgm.mp3");
    gameOverBgm.current = new Audio(import.meta.env.BASE_URL + "gameover.mp3");

    if (bgm.current) {
      bgm.current.loop = true;
      bgm.current.volume = 0.3;
      bgm.current.play().catch(() => {});
    }

    startTyping();
  }, []);

  const startTyping = () => {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    setAuthor(q.author);

    let i = 0;
    const interval = setInterval(() => {
      if (i >= q.text.length) {
        clearInterval(interval);

        // デモ用：表示完了でゲームオーバー状態へ
        setTimeout(() => {
          triggerGameOver();
        }, 2000);

        return;
      }

      setText((prev) => prev + q.text[i]);
      setRomaji((prev) => prev + q.romaji[i] || "");

      if (typeSound.current) {
        typeSound.current.currentTime = 0;
        typeSound.current.play().catch(() => {});
      }

      i++;
    }, 80);
  };

  const triggerGameOver = () => {
    setGameOver(true);

    if (bgm.current) {
      bgm.current.pause();
    }

    if (gameOverBgm.current) {
      gameOverBgm.current.loop = true;
      gameOverBgm.current.volume = 0.4;
      gameOverBgm.current.play().catch(() => {});
    }
  };

  const toggleBgm = () => {
    setBgmOn((prev) => {
      const next = !prev;

      if (next) {
        bgm.current?.play().catch(() => {});
      } else {
        bgm.current?.pause();
        gameOverBgm.current?.pause();
      }

      return next;
    });
  };

  return (
    <div className="screen">
      <div className="quote-box">
        <div className="quote">{text}</div>
        <div className="romaji">{romaji}</div>
        <div className="author">{author}</div>
      </div>

      <button className="bgm-button" onClick={toggleBgm}>
        {bgmOn ? "BGM ON" : "BGM OFF"}
      </button>
    </div>
  );
}