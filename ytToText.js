const fs = require('fs')
const YoutubeMp3Downloader = require('youtube-mp3-downloader')
const { Deepgram } = require('@deepgram/sdk')
const ffmpeg = require('ffmpeg-static')


const deepgramApiKey = 'a3e2620e24915546bd4256b9decbe0c7ba1cc132';
const deepgram = new Deepgram(deepgramApiKey)
/*
const YD = new YoutubeMp3Downloader({
    ffmpegPath: ffmpeg,
    outputPath: './',
    youtubeVideoQuality: 'highestaudio',
    queueParallelism: 1
})
*/


async function toText(id) {
    let promise = new Promise((resolve, reject) => {



        try {
            const ytID = id;
            //const ytID = 'uBp6qjJtKC0'

            const YD = new YoutubeMp3Downloader({
                ffmpegPath: ffmpeg,
                outputPath: './',
                youtubeVideoQuality: 'highestaudio',
                queueParallelism: 1
            })

            YD.download(ytID)

            YD.on('error', err => {
                console.log("something goofed");
                console.log(err)
                reject("Download error");
            })


            YD.on('progress', data => {
                console.log(data.progress.percentage + '% downloaded')
            })

            YD.on('finished', async (err, video) => {
                try {
                    const videoFileName = video.file
                    console.log(`Downloaded ${videoFileName}`)

                    const file = {
                        buffer: fs.readFileSync(videoFileName),
                        mimetype: 'audio/mp3'
                    }
                    const options = {
                        punctuate: true,
                        utterances: true
                    }

                    const result = await deepgram.transcription.preRecorded(file, options).catch(e => console.log(e))

                    const transcript = result.results.channels[0].alternatives[0].transcript
                    //console.log(JSON.stringify(result, undefined, 4));
                    const utterances = result.results.utterances;
                    console.log(":)")
                    resolve(JSON.stringify(utterances, undefined, 4));
                } catch (error) {
                    console.log("other");
                     console.log(error)
                    reject("other")
                }

            })

        } catch (err) {
            console.log("other2");
            console.log(err)
            reject("other2")
        }
    })
    return promise;
}



module.exports = toText

//Test if the id doesnt break everything
