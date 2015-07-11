#!/usr/bin/env node

'use strict';

var meow = require('meow');
var videoScreen = require('./');

var cli = meow({
	help: [
		'Usage',
		'  $ video-screen <input-file> > <output-file>',
		'',
		'Options',
		'  -t, --time       Seeked position of video to take screenshot',
		'  -w, --width      Width of screenshot',
		'  -h, --height     Height of screenshot',
		'',
		'Example',
		'  $ video-screen clip.mp4 > clip.png',
		''
	]
}, {
	alias: {
		time: 't',
		width: 'w',
		height: 'h'
	}
});

videoScreen(cli.input[0], cli.flags)
	.pipe(process.stdout);
