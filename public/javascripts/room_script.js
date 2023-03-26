const socket = io();

const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
const showChat = document.querySelector("#showChat");

myVideo.muted = true;


const user = prompt("Enter your name");
console.log(user)

var peer = new Peer(undefined, {
  host: '/',
  port: '3001'
});

let myVideoStream;
const peers = {};
navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      console.log('someone call me');
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  });


// ----------disconnect-user----------
socket.on('user-disconnected', userId => {
  console.log("Deleted user id " + userId);
  if (peers[userId]) {
    peers[userId].close();
  }
})

const connectToNewUser = (userId, stream) => {
  console.log('I call someone' + userId);
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  //------disconnect-user------
  call.on("close", () => {
    video.remove();
  })
  peers[userId] = call

};

peer.on("open", (id) => {
  console.log('my id is' + id);
  socket.emit("join-room", ROOM_ID, id, user);
});

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    videoGrid.append(video);
  });
};



// ----------invite-mute-stop----------
const inviteButton = document.querySelector("#inviteButton");
const muteButton = document.querySelector("#muteButton");
const stopVideo = document.querySelector("#stopVideo");
muteButton.addEventListener("click", () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    html = `<i class="fas fa-microphone-slash"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    html = `<i class="fas fa-microphone"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  }
});

stopVideo.addEventListener("click", () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    html = `<i class="fas fa-video-slash"></i>`;
    stopVideo.classList.toggle("background__red");
    stopVideo.innerHTML = html;
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    html = `<i class="fas fa-video"></i>`;
    stopVideo.classList.toggle("background__red");
    stopVideo.innerHTML = html;
  }
});

inviteButton.addEventListener("click", (e) => {
  prompt(
    "Copy this link and send it to people you want to meet with",
    window.location.href
  );
});


// ----------chat----------
const chatBtn = document.querySelector('#chat-btn');
const mainLeft = document.querySelector('.main-left')
const mainRight = document.querySelector('.main-right')

let chat = 1;
chatBtn.addEventListener('click', () => {
  if (chat === 1) {
    mainLeft.classList.add('active-left')
    mainRight.classList.add('active-right')
    chatBtn.setAttribute( 'title', 'Close chat' );
    chat = 0;
  } else {
    mainLeft.classList.remove('active-left')
    mainRight.classList.remove('active-right')
    chatBtn.setAttribute( 'title', 'Open chat' );
    chat = 1;
  }
})

let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");

send.addEventListener("click", (e) => {
  if (text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});
text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

socket.on("createMessage", (message, userName) => {
  messages.innerHTML =
    messages.innerHTML +
    `<div class="message">
        <b><i class="far fa-user-circle"></i> <span> ${userName === user ? "me" : userName
    }</span> </b>
        <span>${message}</span>
    </div>`;
});


//------------recording------------

const startbtn = document.querySelector(".record-btn");
const stopbtn = document.querySelector(".stop-record-btn");

startbtn.addEventListener("click", () => {
  const recorder = new MediaRecorder(myVideoStream)
  // start-recording
  recorder.start();
  startbtn.classList.remove('active-start');
  stopbtn.classList.remove('active-stop');

  const buffer = [];
  recorder.addEventListener("dataavailable", (event) => {
    buffer.push(event.data);
  })

  recorder.addEventListener("stop", () => {
    const blob = new Blob(buffer, {
      type: "video/mp4"
    })
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "video-chat-recording.mp4";
    a.click();
  })

  //stop-recording
  stopbtn.addEventListener("click", () => {
    recorder.stop()
    startbtn.classList.add('active-start');
    stopbtn.classList.add('active-stop');
  })

})


