



var room_id = getParameterByName('room_code'); 
var screenSharing=false;
var screenStream;

 var localStream;
 var call;
 var mypeerid;
 var videoOptions = {
    audio: true,
    video: {
      width: 720,
      height: 480,
      frameRate: {
          ideal: 30,
          min: 5
      }
  }
};
var peer = new Peer();

  peer.on('open', function(id) {
  console.log('My peer ID is: ' + id);

   
  

  ManageOnlineOffline(id)

  $('mypeerid').html(id)
  mypeerid=id;
  $('.after').show();
});
function  ManageOnlineOffline(peer_id){
 // any time that connectionsRef's value is null (i.e. has no children) I am offline
 var roomsRef = firebase.database().ref('users/rooms/'+room_id+'/users/'+peer_id);
 
 var connectedRef = firebase.database().ref('.info/connected');
 connectedRef.on('value', (snap) => {
   if (snap.val() === true) {


     // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
     var con = roomsRef.push();
 
     // When I disconnect, remove this device
     con.onDisconnect().remove();
 
     // Add this device to my connections list
     // this value could contain info about the device or a timestamp too
     con.set(true);
 
      
   }
 });
 
}


navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;


if (navigator.getUserMedia) {
   navigator.getUserMedia(videoOptions,
      function(stream) {
          
 localStream=stream;

 const video = document.getElementById('localVideo');
 video.srcObject = stream;
 video.onloadedmetadata = function(e) {
   video.play();
 };


      },
      function(err) {
         console.error(`The following error occurred: ${err.name}`);
      }
   );
} else {
   console.log("getUserMedia not supported");
}

//answer incoming call
peer.on('call', function(call) {

    console.log("incoming call from "+call.peer)
    // Answer the call, providing our mediaStream
    call.answer(localStream);
    console.log("answerng incoming call")

    if(peers_list.includes(call.peer) && mypeerid!=call.peer)
        {
            $('#'+call.peer).remove()
    $('remotearea').append('<video class="small_vids" height="150"   id="'+call.peer+'"></video>')
      
    call.on('stream', function(stream) {
        console.log("streaming incoming call")
        // `stream` is the MediaStream of the remote peer.
        // Here you'd add it to an HTML video/canvas element.
        const video = document.getElementById(call.peer);

     video.srcObject = stream;
     video.onloadedmetadata = function(e) {
       video.play();
     };

     


      });
    }

      call.on('close', function() { 
        $('#'+call.peer).remove();
       });




  });

  

  $('#callBtn').click(function(){
var input_peerid=$('#input_peerid').val();
callPeer(input_peerid);
  })

  function callPeer(peer_id,fullscreen){
    console.log("calling peer: "+peer_id);


    call = peer.call(peer_id,localStream);
    
    call.on('stream', function(stream) {
        if(peers_list.includes(peer_id) && mypeerid!=peer_id)
        {
            $('#'+peer_id).remove()
        $('remotearea').append('<video class="small_vids"  height="150" id="'+peer_id+'"></video>')
        console.log("streaming incoming call from called peer")
        // `stream` is the MediaStream of the remote peer.
        // Here you'd add it to an HTML video/canvas element.
        
        let video;
        if(fullscreen)
        video = document.getElementById('remote-video');
        else
        video = document.getElementById(peer_id);
     video.srcObject = stream;
     video.onloadedmetadata = function(e) {
       video.play();
     };

     
     

    }
      });
     

      call.on('close', function() { 
        $('#'+peer_id).remove();
       });



  }

   
  $(document).ready(function() {
    cloneTOMain('localVideo');
    // This WILL work because we are listening on the 'document', 
    // for a click on an element with an ID of #test-element
    $(document).on("click",".small_vids",function(e) {
     $('clone') .html($('#'+this.id).clone());
        console.log("try to Project to main screen:"+this.id)
        // if(mainvideo_id!=undefined)
        // callPeer(mainvideo_id,0)
        // callPeer(this.id,1)
        mainvideo_id=this.id;

 
       
      cloneTOMain(mainvideo_id)
        



         

    });
 
});

var webcam_on=true;
  const webcamOff=function(){//toggle state
   
    console.log("trying to off/on")
   local_stream=localStream;
     
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

var mic_on=true;
const micOff=function(){//toggle state
   
    local_stream=localStream;
     
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

    if(speaker_on)
    {
        $('#speaker').removeClass("green");
        $('#speaker').addClass("red");
        speaker_on=false;

        document.querySelectorAll('audio, video').forEach(el => el.muted = true)
   
   console.log("all sound muted")
    }else{
        speaker_on=true;

        $('#speaker').removeClass("red");
        $('#speaker').addClass("green");
        document.querySelectorAll('audio, video').forEach(el => el.muted = false)
   
        console.log("all sound on")
    }
    
};

function cloneTOMain(mainvideo_id)
{
  const leftVideo = document.getElementById(mainvideo_id);
  console.log(leftVideo)
  const rightVideo = document.getElementById('remote-video');
    
     let stream;
     const fps = 0;
     if (leftVideo.captureStream) {
       stream = leftVideo.captureStream(fps);
     } else if (leftVideo.mozCaptureStream) {
       stream = leftVideo.mozCaptureStream(fps);
     } else {
       console.error('Stream capture is not supported');
       stream = null;
     }
     rightVideo.srcObject = stream;
     rightVideo.play();
}


function startScreenShare() {
    if (screenSharing) {
        stopScreenSharing()
    }
  
    var displayMediaOptions = {
      video: {
          cursor: "always"
      },
      audio: false
  };
  
  navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
  .then(function (stream) {
    let videoTrack = stream.getVideoTracks()[0];
    const rightVideo = document.getElementById('localVideo');
     
        videoTrack.onended = () => {

          rightVideo.srcObject = localStream;
            stopScreenSharing()
            cloneTOMain('localVideo')
        }
        
        
        rightVideo.srcObject = stream;
        rightVideo.play();
        cloneTOMain('localVideo')


  screenStream=stream;

    for(var i=0;i<peers_list.length;i++)
    {
      console.log(peers_list[i])
      //callPeer(peers_list[i],false)
   call = peer.call(peers_list[i],stream);
    
    
    }
  });




         
            screenSharing = true
         
        
}

function stopScreenSharing() {
    if (!screenSharing) return;
    for(var i=0;i<peers_list.length;i++)
    {
      callPeer(peers_list[i],false)
    //call = peer.call(peers_list[i],localStream);
    }
    screenSharing = false
    console.log("Screen sharing stopped")
    screenStream.getTracks().forEach(function (track) {
      track.stop();
  });
}



function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
const callCut=function(){//toggle state
   
    console.log("closing");
    handlePeerDisconnect()
     //window.location.href="index.html";
      
};


function handlePeerDisconnect() {
  // manually close the peer connections
  for (let conns in peer.connections) {
    peer.connections[conns].forEach((conn, index, array) => {
      console.log(`closing ${conn.connectionId} peerConnection (${index + 1}/${array.length})`, conn.peerConnection.id);
      
      
      conn.peerConnection.close();

      // close it using peerjs methods
      if (conn.close)
        conn.close();
    });
  }
  window.location.href="index.html";
}