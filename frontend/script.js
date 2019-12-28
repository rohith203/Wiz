function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}


// Set constraints for the video stream
var constraints = { video: { facingMode: "user" }, audio: false };
// Define constants
const cameraView = document.querySelector("#camera--view"),
    cameraOutput = document.querySelector("#camera--output"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger")
// Access the device camera and stream to cameraView
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
        track = stream.getTracks()[0];
        cameraView.srcObject = stream;
    })
    .catch(function(error) {
        console.error("Oops. Something is broken.", error);
    });
}
// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function() {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    cameraOutput.src = cameraSensor.toDataURL("image/jpg");
    cameraOutput.classList.add("taken");
};
// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);

submitBtn = document.querySelector("#upload_btn");

submitBtn.onclick = () => {
    
    data = new FormData();
    var block = cameraOutput.src.split(";");
    var contentType = block[0].split(":")[1];// In this case "image/gif"
    var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."
    var blob = b64toBlob(realData, {type:contentType});
    data.append('image', blob, 'myimg.jpg');

    console.log("uploaded" + data);
    fetch("http://localhost:3000/upload_img", {
        method:"POST",
        body:data
      })
      .then(res=>res.json())
      .then(data => console.log(data))
}



var rad = document.getElementsByName('select_tab');
var prev = null;
for (var i = 0; i < rad.length; i++) {
    rad[i].addEventListener('change', function() {
        (prev) ? console.log(prev.value): null;
        if (this !== prev) {
            prev = this;
        }
        console.log(this.value);
        if(this.value==="cam"){
            document.querySelector('.tab.upload').display="none";
            document.querySelector('.tab.cam').display="block";
            // console.log("cam" + document.querySelector('.tab.cam').display);
            // console.log("upload" + document.querySelector('.tab.upload').display);
            console.log("changed"+this.value)
        }
        if(this.value==="upload"){
            document.querySelector('.tab.cam').visibility="hidden";
            document.querySelector('.tab.upload').visibility="block";
            // console.log("cam" + document.querySelector('.tab.cam').display);
            // console.log("upload" + document.querySelector('.tab.upload').display);
            console.log("changed"+this.value)
        }
    });
}