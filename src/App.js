import './App.css';
import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';

function App() {
  const [peerId, setpeerId] = useState("");
  const [remotePerrIdValue, setremotePerrIdValue] = useState("");
  const remoteVideoRef = useRef();
  const currentUserVideoRef = useRef();
  const peerInstance = useRef();

  useEffect(() => {
    const peer = new Peer();

    peer.on("open", (id) => {
      setpeerId(id);
    });

    peer.on('call', (call) => {
      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, (mediaStream) => {

        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();

        call.answer(mediaStream);
        call.on('stream', (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        })
      });
    })

    peerInstance.current = peer;
  }, []);

  const call = (remotePerrId) => {
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {

      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      const call = peerInstance.current.call(remotePerrId, mediaStream);

      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Current user id is {peerId}</h1>
        <input type="text" value={remotePerrIdValue} onChange={(e) => setremotePerrIdValue(e.target.value)} /><br />
        <button onClick={() => call(remotePerrIdValue)}>Call</button>
        <div className="video_container">
        <video ref={currentUserVideoRef} />
        <video ref={remoteVideoRef} />
        </div>
      </header>
    </div>
  );
}

export default App;
