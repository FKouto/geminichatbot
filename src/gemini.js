import { useState } from "react";

export function Gemini() {
  const [error, setErr] = useState("");
  const [value, setValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const SurpriseOptions = [
    "O que é Node",
    "O que é Javascript",
  ];

  const surprise = () => {
    const randomPrompt =
      SurpriseOptions[Math.floor(Math.random() * SurpriseOptions.length)];
    setValue(randomPrompt);
  };

  const getResponse = async () => {
    if (!value) {
      setErr("Error! Please ask a question first! ");
      return;
    }

    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch("http://localhost:3000/gemini", options);
      const data = await response.text(); // Adicione "await" para esperar que a resposta seja resolvida
      console.log(data);

      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: "user",
          parts: [{ text: value }],
        },
        {
          role: "model",
          parts: [{ text: data }],
        },
      ]);

      setValue("");
    } catch (error) {
      console.error(error);
      setErr("Something went wrong!");
    }
  };

  const clear = () => {
    setValue("");
    setErr("");
    setChatHistory([]);
  };

  return (
    <div className="app">
      <section>
        <p>
          What do you want to know?
          <button className="surprise" onClick={surprise}>
            Surprise me
          </button>
        </p>
        <div className="input-container">
          <input
            value={value}
            placeholder="When is christmass..."
            onChange={(e) => setValue(e.target.value)}
          />
          {!error && <button onClick={getResponse}>Ask me</button>}
          {error && <button onClick={clear}>Clear</button>}
        </div>
        {error && <p>{error}</p>}
        <div className="search-result">
          {chatHistory &&
            chatHistory.map((chatItem, _index) => (
              <div key={_index}>
                <p className="answer">
                  {chatItem.role} : {chatItem.parts[0].text}
                </p>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
