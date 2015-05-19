var config = {};

config.captcha = {};

config.captcha.key = '';
config.captcha.uploadUrl = '';
config.captcha.resultUrl = '';

config.cron = {
	// the protractor starting time
	startTime: '2015-05-17T23:59:59+08:00',
	numSpawn: 3, 
	// book date
	getinDate: '2015/06/01'
};

module.exports = config;
