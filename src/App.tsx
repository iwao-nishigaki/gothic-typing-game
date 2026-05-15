import { useEffect, useRef, useState } from "react";
import { quotes } from "./quotes";
import "./style.css";

export default function App() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [flash, setFlash] = useState(false);
  const [distort, setDistort] = useState(false);
  const [bgmEnabled, setBgmEnabled] = useState(true);

  const typeSound = useRef<HTMLAudioElement | null>(null);
  const bgm = useRef<HTMLAudioElement | null>(null);
  const gameOverBgm = useRef<HTMLAudioElement | null>(null);

  const quote = quotes[quoteIndex];
  const romaji = quote.reading;

  // 音初期化
  useEffect(() => {
    typeSound.current = new Audio(import.meta.env.BASE_URL + "type.mp3");
    bgm.current = new Audio(import.meta.env.BASE_URL + "bgm.mp3");
    gameOverBgm.current = new Audio(import.meta.env.BASE_URL + "gameover.mp3");

    if (bgm.current) {
      bgm.current.loop = true;
      bgm.current.volume = 0.3;
    }

    if (gameOverBgm.current) {
      gameOverBgm.current.loop = true;
      gameOverBgm.current.volume = 0.4;
    }

    const startBgm = () => {
      if (bgmEnabled) {
        bgm.current?.play().catch(() => {});
      }
      window.removeEventListener("click", startBgm);
    };

    window.addEventListener("click", startBgm);
  }, []);

  // ゲームオーバー時のBGM切替
  useEffect(() => {
    if (gameOver) {
      bgm.current?.pause();
      gameOverBgm.current?.play().catch(() => {});
    } else {
      gameOverBgm.current?.pause();
    }
  }, [gameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      const key = e.key.toLowerCase();
      if (key.length !== 1) return;

      const correctChar = romaji[index];

      if (key === correctChar) {
        if (typeSound.current) {
          typeSound.current.currentTime = 0;
          typeSound.current.play().catch(() => {});
        }

        const nextIndex = index + 1;
        setIndex(nextIndex);

        if (nextIndex === romaji.length) {
          setTimeout(() => {
            setScore((s) => s + 1);
            setQuoteIndex((prev) => (prev + 1) % quotes.length);
            setIndex(0);
            setLives(5);
          }, 800);
        }
      } else {
        setFlash(true);
        setDistort(true);

        setTimeout(() => setFlash(false), 100);
        setTimeout(() => setDistort(false), 300);

        setLives((prev) => {
          if (prev - 1 <= 0) {
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, romaji, gameOver]);

  // ゲームオーバー画面
  if (gameOver) {
    return (
      <div className="gameover">
        <div className="message">
          あなたはまだ生きなければならないようです。
        </div>
        <div className="sub">
          It seems like you still have to live.
        </div>

        <button
          onClick={() => {
            gameOverBgm.current?.pause();
            if (gameOverBgm.current) {
              gameOverBgm.current.currentTime = 0;
            }

            if (bgmEnabled) {
              bgm.current?.play().catch(() => {});
            }

            setGameOver(false);
            setScore(0);
            setQuoteIndex(0);
            setIndex(0);
            setLives(5);
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`container ${flash ? "flash" : ""} ${distort ? "distort" : ""}`}>
      {/* ライフ */}
      <div className="lives">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < lives ? "heart alive" : "heart"}>
            ♥
          </span>
        ))}
      </div>

      {/* スコア */}
      <div className="score">啓蒙: {score}</div>

      {/* BGMトグル */}
      <div
          className={`bgm-toggle ${bgmEnabled ? "" : "off"}`}
        onClick={() => {
          setBgmEnabled((prev) => {
            const next = !prev;

            if (next) {
              if (!gameOver) {
                bgm.current?.play().catch(() => {});
              }
            } else {
              bgm.current?.pause();
              gameOverBgm.current?.pause();
            }

            return next;
          });
        }}
      >
        {bgmEnabled ? "☽ BGM ON" : "☾ BGM OFF"}
      </div>

      {/* 名言 */}
      <div key={quoteIndex} className="quote fade">
        {quote.text}
        <div className="author">{quote.author}</div>
      </div>

      {/* ローマ字 */}
      <div className="romaji">
        {romaji.split("").map((c, i) => (
          <span
            key={i}
            className={i < index ? "done" : "remaining"}
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
