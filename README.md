# WebRTC POC Project with Stream Control

## **Project Overview**
This WebRTC Proof-of-Concept (POC) project demonstrates a broadcaster-receiver model using a video file (`sample_video.mp4`). The broadcaster streams the video file over a secure peer-to-peer (P2P) connection using WebRTC, and the receiver views the streamed video in real-time. The application includes stream control features such as **mute/unmute audio** and **pause/resume video**.

---

## **Setup and Run Instructions**

### **Prerequisites**
- **Node.js**: Install Node.js from [Node.js Official Website](https://nodejs.org/).
- **Browser**: Use a modern browser with WebRTC support (e.g., Chrome or Firefox).


### **Steps to Set Up**
1. Clone the repository or download the source code.
2. Navigate to the `server` directory:
   ```bash
   cd server
   ```
3. Install server dependencies
   ```
   npm install
   ```

### **Run the Application**

1. Start the Signaling Server:
From the server directory, run:
```
node server.js
```
The signaling server will start on ws://localhost:8080

2. Test the Application:
Open the `index.html` file in a browser.
  - For Broadcaster: Select the `Broadcaster` role and click Start. The `sample_video.mp4` will start broadcasting.
  - For Receiver: Open the `index.html` file in a second browser tab/window, select the `Receiver` role, and click Start. The streamed video will be visible.

## Approach
1. WebRTC
  - WebRTC is used for secure, real-time peer-to-peer communication.
  - It provides APIs for capturing, encoding, and streaming media directly between peers.
2. Stream Control
  - Controls are implemented to provide real-time feedback for the broadcaster, allowing them to manage the stream effectively.
  - These changes are instantly reflected in the receiver's stream.
3. Modular Design
  - The project is divided into:
  - Client-side logic: For WebRTC stream setup and controls.
    - Server-side logic: For signaling via WebSocket.
4. Video File Broadcasting
  - Instead of using a camera stream, the `sample_video.mp4` file is played in a hidden `<video>` element and captured using the `captureStream()` API.
   
