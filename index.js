'use strict';

var isVideo = require('is-video');
var assign = require('object-assign');
var through = require('through2');
var which = require('which');
var spawn = require('child_process').spawn;

/**
 * takes screenshot of specified video, if a callback is provided it returns
 * the image as a buffer, otherwise it will return a stream
 *
 * @param {string} filename
 * @param {object} options
 * @param {function} [callback]
 *
 * @example
 *
 * videoScreen('/path/to/video.mp4', function (err, data) {
 *   fs.writeFile('screenshot.png', data, function (err) {
 *     if (err) return console.log(err);
 *     console.log('screenshot saved!');
 *   });
 * })
 *
 * videoScreen('/other/path/to/video.mp4')
 *   .on('error', function (err) {
 *     console.log(err);
 *   })
 *   .pipe(fs.createWriteStream('screenshot.jpg'));
 */
module.exports = function (filename, options, callback) {
  if (!isVideo(filename)) {
    throw new TypeError('invalid parameter `filename`');
  }

  if (typeof options !== 'object') {
    callback = options;
    options = {};
  }

  options = assign({
    time: '00:00:01',
    width: 200,
    height: 125
  }, options);

  var stream = takeScreenshot(filename, options);

  if (typeof callback !== 'function') {
    return stream;
  }

  var screenshot = new Buffer(0);

  stream.on('error', callback);

  stream.on('end', function () {
    callback(null, screenshot);
  });

  stream.on('data', function (data) {
    screenshot = Buffer.concat([screenshot, data]);
  });
};

/**
 * spawns ffmpeg and tries to extract a screenshot from the provided video
 *
 * @param {string} filename
 * @param {object} options
 * @return {stream}
 */
function takeScreenshot (filename, options) {
	var stream = through();

	which('ffmpeg', function (err, command) {
		if (err) {
			stream.emit('error', err);
      return stream.end();
		}

		var ffmpeg = spawn(command, [
			'-ss', options.time, // seek time
			'-i', filename, // video file
			'-s', options.width + '*' + options.height, // size
			'-vframes', '1', // number of frames to extract
			'-f', 'image2', // type of output
			'pipe:1' // output location
		]);

		ffmpeg.on('error', function (err) {
			stream.emit('error', err);
		});

		ffmpeg.on('exit', function () {
			stream.end();
		});

    ffmpeg.stdout.pipe(stream);
	});

	return stream;
}
