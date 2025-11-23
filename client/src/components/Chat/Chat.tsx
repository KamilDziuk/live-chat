import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import chatWindowStyles from "./Chat.module.css";
import Icon from "../Icon/Icon";
import iconStyle from "../Icon/Icon.module.css";
import { useChatScroll } from "./useChatWindow.ts";

interface Message {
  name: string;
  text: string;
  nickColor: string;
}

export default function Chat() {
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [nickColor, setNickColor] = useState("#ffffff");
  const [messages, setMessage] = useState<Message[]>([]);

  const chatEndRef = useChatScroll(messages);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    //https://livechat-fue3.onrender.com/"
    socketRef.current = io("http://localhost:3004");

    socketRef.current?.on("message", (n: string, t: string, c: string) => {
      setMessage((messageContent: any) => [
        ...messageContent,
        { name: n, text: t, nickColor: c },
      ]);
    });

    socketRef.current?.on("userJoined", (user: string) => {
      setMessage((userStatus: any) => [
        ...userStatus,
        {
          name: "System",
          text: `${user} joined the chats`,
          nickColor: nickColor,
        },
      ]);
    });

    socketRef.current?.on("userLeft", (user: string) => {
      setMessage((userStatus: any) => [
        ...userStatus,
        {
          name: "System",
          text: `${user} left the chats`,
          nickColor: nickColor,
        },
      ]);
    });
    
    return () => {
      socketRef.current?.off("message");

      socketRef.current?.disconnect();
    };
  }, []);

  const send = () => {
    if (!text.trim() || !name.trim()) return;

    socketRef.current?.emit("message", name, text, nickColor);
    setText("");
    setDisabled(true);

    if (!disabled) {
      socketRef.current?.emit("join", name, nickColor);
      setDisabled(true);
    }
  };

  return (
    <div className={chatWindowStyles.assistantWindow}>
      <code>v0.9.0-beta</code>
      <div className={chatWindowStyles.mainWindowText}>
        Live chat
        <Icon iconStyle={iconStyle.cloudIcon} iconName="io5:IoChatbubbles" />
      </div>

      <input
        className={chatWindowStyles.nick}
        type="text"
        placeholder="Your nick"
        disabled={disabled}
        onChange={(e) => setName(e.target.value)}
        value={name}
      />

      <label>
        Select nick color:
        <input
          className={chatWindowStyles.nickColor}
          type="color"
          onChange={(e) => setNickColor(e.target.value)}
          disabled={disabled}
          value={nickColor}
        />
      </label>

      <div ref={chatEndRef} className={chatWindowStyles.responseBox}>
        {messages.map((msg, index) => (
          <div key={index} className={chatWindowStyles.responseText}>
            <strong style={{ color: msg.nickColor }}>{msg.name}</strong> :{" "}
            {msg.text}
          </div>
        ))}
      </div>

      <div className={chatWindowStyles.communicationContener}>
        <input
          className={chatWindowStyles.askInputData}
          type="text"
          placeholder="Your message..."
          onChange={(e) => setText(e.target.value)}
          value={text}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button className={chatWindowStyles.sendAsk} onClick={send}>
          <Icon iconStyle={iconStyle.sendAsk} iconName="fi:FiSend" />
        </button>
      </div>
    </div>
  );
}
