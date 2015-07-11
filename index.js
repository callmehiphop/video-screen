'use strict';

var isVideo = require('is-video');
var assign = require('object-assign');
var through = require('through2');
var which = require('which');
var spawn = require('child_process').spawn;

module.exports = function (filename, options) {
	if (!isVideo(filename)) {
		throw new TypeError('missing required parameter `filename`'); // consider custom error type..?
	}

	if (typeof options !== 'object') {
		// callback = options;
		options = {};
	}

	var stream = through();

	options = assign({
		time: '00:00:01',
		width: 200,
		height: 125
	}, options);

	which('ffmpeg', function (err, command) {
		if (err) {
			return callback(new Error('unable to locate `ffmpeg`'));
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

		ffmpeg.stdout.on('data', function (data) {
			stream.push(data);
		});
	});

	return stream;
};