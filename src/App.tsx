import { useEffect, useRef, useState } from "react";

const quotes = [
  { text: "神は死んだ", author: "ニーチェ" },
  { text: "我思う、ゆえに我あり", author: "デカルト" },
];

export default function App() {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");

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
        return;
      }

      setText((prev) => prev + q.text[i]);

      if (typeSound.current) {
        typeSound.current.currentTime = 0;
        typeSound.current.play().catch(() => {});
      }

      i++;
    }, 80);
  };

  return (
    <div className="screen">
      <div className="quote-box">
        <div className="quote">{text}</div>
        <div className="author">{author}</div>
      </div>
    </div>
  );
}