const express = require('express');
const app = express();
const server = app.listen(process.env.PORT || 3000);

const ytToText = require("./ytToText")

const fs = require('fs')
const YoutubeMp3Downloader = require('youtube-mp3-downloader')
const { Deepgram } = require('@deepgram/sdk')
const ffmpeg = require('ffmpeg-static')

//const ytToText = require()

const deepgramApiKey = 'a3e2620e24915546bd4256b9decbe0c7ba1cc132';
const deepgram = new Deepgram(deepgramApiKey)
const YD = new YoutubeMp3Downloader({
  ffmpegPath: ffmpeg,
  outputPath: './',
  youtubeVideoQuality: 'highestaudio',
  queueParallelism: 2
})

app.use(function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});

app.use(express.static('public'))

app.get('/:id([a-zA-Z0-9-_]{11})', async (req, res) => {

    ytToText(req.params.id).then(utt => {
      console.log("sent");
      //console.log(res)
      // res.header("Access-Control-Allow-Origin", "*")
      res.json(utt)
    }).catch((err) => {
      console.log(err)
      console.log(">:(");
      res.status(400).send(err);
    })


    
})

app.get('*', (req, res) => {
  res.status(404).send('404 error')
})