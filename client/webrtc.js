const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const muteButton = document.getElementById('muteButton');
const pauseButton = document.getElementById('pauseButton');
const roleSelect = document.getElementById('role');
const startButton = document.getElementById('startButton');
const videoContainer = document.getElementById('videoContainer');

const peerConnection = new RTCPeerConnection();
const ws = new WebSocket('ws://localhost:8080'); 
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.use(express.static('./client'));

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


startButton.onclick = () => {
    const role = roleSelect.value;
    videoContainer.style.display = 'block';

    if (role === 'broadcaster') {
        startBroadcaster();
    } else if (role === 'receiver') {
        startReceiver();
    }
};

function startBroadcaster() {
    muteButton.style.display = 'inline';
    pauseButton.style.display = 'inline';

    //path to the video file served by the same server
    const videoURL = "http://localhost:3000/sample_video_h264.mp4";
    localVideo.src = videoURL;
    localVideo.loop = true; //loop the video
    localVideo.muted = true; 

    localVideo.play()
        .then(() => {
            console.log("Video is playing successfully.");
            const stream = localVideo.captureStream(); 
            stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
        })
        .catch((error) => {
            console.error("Error playing video:", error);
        });

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            ws.send(JSON.stringify({ candidate: event.candidate }));
        }
    };

    peerConnection.createOffer()
        .then((offer) => {
            peerConnection.setLocalDescription(offer);
            ws.send(JSON.stringify({ offer }));
        })
        .catch((error) => {
            console.error("Error creating offer:", error);
        });

    muteButton.onclick = () => {
        const audioTracks = localVideo.srcObject?.getAudioTracks() || [];
        audioTracks.forEach((track) => (track.enabled = !track.enabled));
    };

    pauseButton.onclick = () => {
        if (localVideo.paused) {
            localVideo.play().catch((error) => console.error("Error resuming video:", error));
        } else {
            localVideo.pause();
        }
    };
}

function startReceiver() {
    peerConnection.ontrack = (event) => {
        console.log("Received remote track.");
        remoteVideo.srcObject = event.streams[0];
    };

    ws.onmessage = (message) => {
        const data = JSON.parse(message.data);

        if (data.offer) {
            peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer))
                .then(() => peerConnection.createAnswer())
                .then((answer) => {
                    peerConnection.setLocalDescription(answer);
                    ws.send(JSON.stringify({ answer }));
                })
                .catch((error) => {
                    console.error("Error handling offer/answer:", error);
                });
        } else if (data.candidate) {
            peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate))
                .catch((error) => {
                    console.error("Error adding ICE candidate:", error);
                });
        }
    };
}
