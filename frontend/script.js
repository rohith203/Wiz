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
    cameraOutput.src = cameraSensor.toDataURL("image/jpeg");
    cameraOutput.classList.add("taken");
};
// Start the video stream when the window loads
// window.addEventListener("load", cameraStart, false);

submitBtn = document.querySelector("#upload_btn");


let displayResults = (data)=>{
    console.log(data)
    arr = data
  //   arr = JSON.parse(data);
    let tabl = document.querySelector(".resultstable");
    
    var child = tabl.lastElementChild;  
    while (child) { 
        tabl.removeChild(child); 
        child = tabl.lastElementChild;
    } 
    let tr_ = document.createElement("tr");
    let th_1 = document.createElement("th")
    th_1.innerHTML = "Class";
    let th_2 = document.createElement("th")
    th_2.innerHTML = "Probability";
    tr_.appendChild(th_1);
    tr_.appendChild(th_2);
    tabl.appendChild(tr_);

    Object.keys(arr).map((k,i)=>{
        let tr_ = document.createElement("tr");
        let td_name = document.createElement("td");
        let td_bar = document.createElement("td");
        td_name.innerHTML = k; 
        
        let td_div = document.createElement("div");
      //   td_bar.innerHTML = arr[k];
        td_div.innerHTML = arr[k];
        $(td_div).css({"width":arr[k]*100});
        
        td_bar.appendChild(td_div);
        tr_.appendChild(td_name)
        tr_.appendChild(td_bar)
        tabl.appendChild(tr_);
        console.log(k + "  " + arr[k]);
    })
    $('td div').css({"background-color":"#bbb", "height":"100%"})
}


submitBtn.onclick = () => {
    
    data = new FormData();
    var block = cameraOutput.src.split(";");
    var contentType = block[0].split(":")[1];// In this case "image/gif"
    var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."
    var blob = b64toBlob(realData, {type:contentType});
    data.append('image', blob, 'myimg.jpg');

    console.log("uploaded" + data);
    fetch("http://localhost:5000/camupload_img", {
        method:"POST",
        body:data
      })
      .then(res=>res.json())
      .then(displayResults)
}


document.querySelector(".upload_submitBtn").onclick = () => {
    console.log("submit clicked")
    
    let f = document.querySelector("#fileToUpload").files[0]
    // f.filename = f.name
    console.log(f)
    data = new FormData();
    data.append('image', f, f.name)

    fetch("http://localhost:5000/upload_img", {
        method:"POST",
        body:data
      })
      .then(res=>res.json())
      .then(displayResults)
}