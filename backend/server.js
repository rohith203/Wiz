const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static('public'))

app.get('/', (req, res) => {
	res.send('getting root');
});

var upload = multer({ dest: __dirname + '/public/uploads/' });
var type = upload.single('image');

let wiz = function(rfile, res){
    var spawn = require('child_process').spawn;
    console.log(__dirname+'\\public/uploads/' + rfile.filename);
    
    var process = spawn('python', ['test.py', rfile.destination + rfile.filename]);
    
    process.stdout.on('data', function(data) { 
        console.log("yes", data.toString());
        res.json({'output':data.toString()});
    })
}


app.post('/camupload_img',type, (req, res) => {
    console.log(req.file);
    wiz(req.file, res);
});

app.post('/upload_img',type, (req, res) => {
    console.log(req.file);

    // test_obj = {"liner": "0.47463232", "paddlewheel": "0.0805761", "palace": "0.075020775", "dock": "0.046901654", "dome": "0.043579284"}
    // res.json({"output":JSON.stringify(test_obj)})

    wiz(req.file, res);
});

const port = 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`))


