 var localStream;
 var call;
 var mypeerid;
var peer = new Peer();

  peer.on('open', function(id) {
  console.log('My peer ID is: ' + id);

  database.ref('users/FBTest' ).push().set({
    "name":"new user","peer_id":id
  });
  

  ManageOnlineOffline(id)

  $('mypeerid').html(id)
  mypeerid=id;
  $('.after').show();
});
function  ManageOnlineOffline(peer_id){
 // any time that connectionsRef's value is null (i.e. has no children) I am offline
 var roomsRef = firebase.database().ref('users/rooms/testroom/users/'+peer_id);
 
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
   navigator.getUserMedia({ audio: false, video: { width: 1280, height: 720 } },
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
   
    // This WILL work because we are listening on the 'document', 
    // for a click on an element with an ID of #test-element
    $(document).on("click",".small_vids",function(e) {
     $('clone') .html($('#'+this.id).clone());
        console.log("try to Project to main screen:"+this.id)
        if(mainvideo_id!=undefined)
        callPeer(mainvideo_id,0)
        callPeer(this.id,1)
        mainvideo_id=this.id;
         

    });
 
});


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