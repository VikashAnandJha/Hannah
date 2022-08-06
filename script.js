const PRE = "Hannah"
const SUF = "Arendt"
var room_id;
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var local_stream,remoteStream;
var screenStream;
var peer = null;
var currentPeer = null
var screenSharing = false
var peerList=[];
var isCordova=false;
var videoOptions = {
      audio: true,
    video: {
    mandatory: {
        
            width: 1280,
            height: 720,
        
        frameRate: {
            ideal: 25,
            min: 15
        }
    }
    }
};
function createRoom() {
    console.log("Creating Room")
    let room = document.getElementById("room-input").value;
    if (room == " " || room == "") {
        alert("Please enter room number")
        return;
    }
    room_id = PRE + room + SUF;
    peer = new Peer(room_id)
    peer.on('open', (id) => {
        console.log("Peer Connected with ID: ", id)
        hideModal()
        getUserMedia(videoOptions, (stream) => {
            local_stream = stream;
            setLocalStream(local_stream)
        }, (err) => {
            console.log(err)
        })
        notify("Waiting for peer to join.")
    })
    peer.on('call', (call) => {
        call.answer(local_stream);
        call.on('stream', (stream) => {
            setRemoteStream(stream)
        })
        currentPeer = call;
    })
}

function setLocalStream(stream) {

    let video = document.getElementById("local-video");
    video.srcObject = stream;
    video.muted = true;
    video.play();
    showAfter();
}
function setRemoteStream(stream) {

    let video = document.getElementById("remote-video");
    video.srcObject = stream;
    video.play();
    remoteStream=stream;
    showAfter();
}

function hideModal() {
    document.getElementById("entry-modal").hidden = true
}

function notify(msg) {
    let notification = document.getElementById("notification")
    notification.innerHTML = msg
    notification.hidden = false
    setTimeout(() => {
        notification.hidden = true;
    }, 3000)
}

function joinRoom() {
    console.log("Joining Room")
    let room = document.getElementById("room-input").value;
    if (room == " " || room == "") {
        alert("Please enter room number")
        return;
    }
    room_id = PRE + room + SUF;
    hideModal()
    peer = new Peer()
    peer.on('open', (id) => {
        console.log("Connected with Id: " + id)
        

        getUserMedia(videoOptions, (stream) => {
            local_stream = stream;
            setLocalStream(local_stream)
            notify("Joining peer")

            let call = peer.call(room_id, stream)

            call.on('stream', (stream) => {
                setRemoteStream(stream);
            })


            currentPeer = call;

            
            //   database.ref('users/'+room_id ).push().set({
            //     "name":"new user","peer_id":id
            //   });




        }, (err) => {
            console.log(err)
        })

       

    })

   
}

function startScreenShare() {
    if (screenSharing) {
        stopScreenSharing()
    }
    navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
        screenStream = stream;
        let videoTrack = screenStream.getVideoTracks()[0];
        videoTrack.onended = () => {
            stopScreenSharing()
        }
        if (peer) {
            let sender = currentPeer.peerConnection.getSenders().find(function (s) {
                return s.track.kind == videoTrack.kind;
            })
            sender.replaceTrack(videoTrack)
            screenSharing = true
        }
        console.log(screenStream)
    })
}

function stopScreenSharing() {
    if (!screenSharing) return;
    let videoTrack = local_stream.getVideoTracks()[0];
    if (peer) {
        let sender = currentPeer.peerConnection.getSenders().find(function (s) {
            return s.track.kind == videoTrack.kind;
        })
        sender.replaceTrack(videoTrack)
    }
    screenStream.getTracks().forEach(function (track) {
        track.stop();
    });
    screenSharing = false
}
var mic_on=true;
const micOff=function(){//toggle state
   
   
     
    local_stream.getAudioTracks()[0].enabled = !local_stream.getAudioTracks()[0].enabled;

    if(local_stream.getAudioTracks()[0]!=undefined && local_stream.getAudioTracks()[0].enabled)
    {
        
        $('#mic').removeClass("red");
     $('#mic').addClass("green");
     mic_on=true;
     console.log(mic_on+" greenzone")
    } 
     else
     {
        console.log(mic_on+" redzone")
        $('#mic').removeClass("green");
         $('#mic').addClass("red");
         mic_on=false;
     }
};
var speaker_on=true;
const speakerOff=function(){//toggle state
   
   
     
    remoteStream.getAudioTracks()[0].enabled = !remoteStream.getAudioTracks()[0].enabled;

    if(remoteStream.getAudioTracks()[0]!=undefined && remoteStream.getAudioTracks()[0].enabled)
    {
        
        $('#speaker').removeClass("red");
     $('#speaker').addClass("green");
     speaker_on=true;
     console.log(speaker_on+" greenzone")
    } 
     else
     {
        console.log(speaker_on+" redzone")
        $('#speaker').removeClass("green");
         $('#speaker').addClass("red");
         speaker_on=false;
     }
};

var webcam_on=true;
const webcamOff=function(){//toggle state
   
   
     
    local_stream.getVideoTracks()[0].enabled = !local_stream.getVideoTracks()[0].enabled;

    if(local_stream.getVideoTracks()[0]!=undefined && local_stream.getVideoTracks()[0].enabled)
    {
        
        $('#webcam').removeClass("red");
     $('#webcam').addClass("green");
     webcam_on=true;
     console.log(webcam_on+" greenzone")
    } 
     else
     {
        console.log(webcam_on+" redzone")
        $('#webcam').removeClass("green");
         $('#webcam').addClass("red");
         webcam_on=false;
     }
};

function showAfter(){
console.log("show")
    setTimeout(function(){
        $('.after').show();
    },100)
   
}