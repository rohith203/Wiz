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


app.post('/upload_img',type, (req, res) => {
    console.log(req.file)
    var spawn = require('child_process').spawn;
    console.log(__dirname+'\\public/uploads/' + req.file.filename);
    
    var process = spawn('python', ['test.py', req.file.destination + req.file.filename]);
    
    process.stdout.on('data', function(data) { 
        console.log("yes", data.toString());
        res.json({'output':data.toString()});
    })
});

const port = 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`))


