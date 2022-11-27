import { useEffect, useState } from "react";

import io from "socket.io-client";

import { v4 as uuidv4 } from "uuid";

import "./App.css";

const newId = uuidv4();
const socket = io("http://localhost:3000");
socket.on("connect", () =>
  console.log("[IO] Connect => A new connection has been established")
);

function App() {
  const [message, setMessage] = useState();
  const [msgs, setMsgs] = useState([]);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (message.trim()) {
      socket.emit("chat.message", {
        id: newId,
        message,
      });

      setMessage("");
    }
  };

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      setMsgs([...msgs, newMessage]);
    };

    socket.on("chat.message", handleNewMessage);

    return () => {
      socket.off("chat.message", handleNewMessage);
    };
  }, [msgs]);

  return (
    <main className="container">
      <ul className="list">
        {msgs.map((e, index) => (
          <li
            key={index}
            className={`list__item list__item--${
              e.id == newId ? "mine" : "other"
            }`}
          >
            <span
              className={`message message--${e.id == newId ? "mine" : "other"}`}
            >
              {e.message}
            </span>
          </li>
        ))}
      </ul>

      <form className="form" onSubmit={(e) => handleFormSubmit(e)}>
        <input
          onChange={(e) => setMessage(e.target.value)}
          className="form__field"
          placeholder="digite aqui"
          value={message}
        />
      </form>
    </main>
  );
}

export default App;
