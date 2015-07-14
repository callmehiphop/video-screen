# video-screen


> Generate screenshots from videos

This module requires [ffmpeg](https://www.ffmpeg.org/)

## Usage

```javascript
var videoScreen = require('video-screen');
var fs = require('fs');

videoScreen('path/to/video.mp4')
	.pipe(fs.createWriteStream('video.png'));

// or if streams aren't your thing
videoScreen('path/to/video.mp4', function (err, screenshot) {
  fs.writeFile('screenshot.png', screenshot, function () {
    console.log('screenshot saved!');
  });
});
```

## API

### videoScreen(filename, [options], [callback])

## filename

Required
Type: `string`

String of video path

## options

### time

Type: `string`
Default: `'00:00:01'`

The video time where the screenshot should be taken from

### width

Type: `number`
Default: `200`

The width of the generated screenshot

### height

Type: `number`
Default: `125`

## CLI

```shell
$ video-screen --help

  Take a screenshot of a video

  Usage
    $ video-screen <input-file> > <output-file>

  Options
    -t, --time       Seeked position of video to take screenshot
    -w, --width      Width of screenshot
    -h, --height     Height of screenshot

  Example
    $ video-screen clip.mp4 > clip.png

```

## License

MIT
