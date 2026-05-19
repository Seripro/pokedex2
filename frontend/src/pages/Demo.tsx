import { useEffect, useState } from "react";

function Demo() {
  // APIから届く文字を保存する状態（ステート）
  const [message, setMessage] = useState<string>("読み込み中...");

  useEffect(() => {
    // 💡 FastAPIのURLを指定してデータを取ってくる
    fetch("http://localhost:8000/")
      .then((res) => res.json())
      .then((data) => {
        // data.message（FastAPIが返した "Hello from FastAPI!"）をセット
        setMessage(data.message);
      })
      .catch((err) => {
        console.error("エラーが発生しました:", err);
        setMessage("APIとの通信に失敗しました");
      });
  }, []);

  return (
    <div
      style={{ padding: "40px", textAlign: "center", fontFamily: "sans-serif" }}
    >
      <h1>Pokedex アプリ開発</h1>
      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "#f0f0f0",
          borderRadius: "8px",
          display: "inline-block",
        }}
      >
        <p style={{ fontWeight: "bold", color: "#333" }}>
          バックエンドからのメッセージ：
        </p>
        {/* 💡 ここにFastAPIから取得した文字が表示されます */}
        <p style={{ fontSize: "24px", color: "#0070f3", margin: "10px 0 0 0" }}>
          {message}
        </p>
      </div>
    </div>
  );
}

export default Demo;
