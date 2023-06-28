const express = require('express');
const cors = require('cors');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path')

ffmpeg.setFfmpegPath(path.join(__dirname, '/ffmpeg/bin/ffmpeg.exe'));
ffmpeg.setFfprobePath(path.join(__dirname, '/ffmpeg/bin/ffprobe.exe'));

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json())   

app.listen(port, () => {
    console.log(`[info] ffmpeg-api listening at http://localhost:${port}`)
});

// Get video stream metadata
app.use('/getStreamInfo', function (request, response, next) {
    const streamUrl = request?.body?.streamUrl;
    ffmpeg.ffprobe(streamUrl, function(err, metadata) {
      if (err) {
        console.log(err)
        response.send({error: "could not parse stream"});  
      } else {
        console.log(metadata)
        response.send(metadata);  
      } 
    });     
});

// Get video stream bitrate
app.use('/getStreamBitrate', function (request, response, next) {
    const streamUrl = request?.body?.streamUrl;
    ffmpeg.ffprobe(streamUrl, function(err, metadata) {
      if (err) {
        console.log(err)
        response.send({error: "could not parse stream"});  
      } else {
        console.log(metadata.streams[0]?.bit_rate)
        response.send({bitrate: metadata.streams[0]?.bit_rate});  
      } 
    });     
});