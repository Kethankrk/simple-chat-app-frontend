import "./App.css";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
let socket;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [room, setRoom] = useState("");
  const [cRoom, setCroom] = useState(false);
  const [jRoom, setJroom] = useState(false);
  const [roomNoInp, setRoomNoInp] = useState("");

  useEffect(() => {
    socket = io("http://192.168.29.20:3000");
    socket.on("connect", () => setIsLoading(false));

    socket.on("receive_msg", (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          text: msg.message,
          isMine: false,
        },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const sendMessage = (text) => {
    socket.emit("msg", {
      message: text,
      room: room,
    });
  };

  const addMessage = (e) => {
    e.preventDefault();
    setMessages((prev) => [
      ...prev,
      {
        text,
        isMine: true,
      },
    ]);
    sendMessage(text);
    setText("");
  };

  const createRoom = () => {
    if (cRoom) {
      alert("Already created a room");
      return;
    }
    setCroom(true);
    const no = Math.floor(Math.random() * 99999) + 1;
    setRoom(no);
    joinRoom(no);
  };

  const joinRoom = (text) => {
    socket.emit("join_room", text);
    setJroom(false);
  };
  return (
    <>
      <main className="flex flex-col justify-center items-center px-4 h-screen py-[50px]">
        {isLoading && <span className="loading loading-spinner text-primary mb-5"></span>}
        {cRoom && (
          <div className="absolute top-0 left-0 bottom-0 right-0 bg-black opacity-70 flex justify-center items-center">
            <div className="rounded-md bg-slate-200 p-10 relative">
              <button
                className="absolute top-1 right-1 px-2 py-1 text-[10px] rounded-xl font-bold bg-white text-black"
                onClick={() => setCroom(false)}
              >
                X
              </button>
              <p className="text-black font-semibold text-center bg-white rounded-md mb-5">
                {room}
              </p>
              <button className="rounded-md bg-slate-400 text-black">
                Copyt To Clipboard
              </button>
            </div>
          </div>
        )}
        {jRoom && (
          <div className="absolute top-0 left-0 bottom-0 right-0 bg-black opacity-70 flex justify-center items-center">
            <div className="rounded-md bg-slate-200 p-10 relative flex flex-col gap-10">
              <button
                className="absolute top-1 right-1 px-2 py-1 text-[10px] rounded-xl font-bold bg-white text-black"
                onClick={() => setJroom(false)}
              >
                X
              </button>
              <input
                type="text"
                className="px-4 py-1 rounded-md text-white font-semibold"
                value={roomNoInp}
                onChange={(e) => setRoomNoInp(e.target.value)}
              />
              <button
                className="rounded-md bg-slate-400 text-black"
                onClick={() => {
                  setRoom(roomNoInp);
                  joinRoom(roomNoInp);
                }}
              >
                Join
              </button>
            </div>
          </div>
        )}
        <div className="flex gap-5 mb-5">
          <button className="rounded-lg" onClick={createRoom}>
            Create Room
          </button>
          <button className="rounded-lg" onClick={() => setJroom(true)}>
            Join Room
          </button>
        </div>
        <div className="rounded-xl bg-[#242424] w-full md:w-1/2 h-full p-5 flex flex-col justify-between">
          <div className="flex flex-col gap-2 overflow-scroll">
            {room && (
              <p className="text-center font-medium text-xl">
                <span className="text-red-500">Room: </span>
                {room}
              </p>
            )}
            {messages.map((item) => (
              <div
                className={`flex ${
                  item.isMine ? "justify-end" : "justify-start"
                }`}
              >
                <p className="px-4 py-1 rounded-md bg-[#181818] text-white font-medium">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
          <form className="w-full flex" onSubmit={addMessage}>
            <input
              type="text"
              className="w-3/4 bg-slate-300 text-black rounded-s-xl px-5 py-1 placeholder:text-gray-800"
              placeholder="Enter a message"
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
            <button
              className="w-1/4 rounded-e-xl text-white font-semibold"
              onClick={addMessage}
            >
              send
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

export default App;
