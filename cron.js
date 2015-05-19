var schedule = require('node-schedule'),
    spawn =  require('child_process').spawn,
    path = process.env.PWD + '/cucumber.conf.js',
    run = function(i) {
        var protractor = spawn('/usr/local/bin/protractor', [path]);
        protractor.stdout.on('data', function(data) {
        console.log("process " + i + " out: " + data);
        });

        protractor.stderr.on('data', function(data) {
        console.log("process " + i + " err: " + data);
        });

        protractor.on('close', function(code) {
        console.log('child process ' + i + ' exited with code ' + code);
        });
    },
    config = require('./config'),
    date = new Date(config.cron.startTime),
    webdriver = spawn('/usr/local/bin/webdriver-manager', ['start']);


console.log("start at:" + date);
console.log("#spwan: " + config.cron.numSpawn);

webdriver.stderr.on('data', function(data) {
    console.log("webdriver err: " + data);
});

webdriver.on('close', function(code) {
    console.log('webdriver exited with code ' + code);
});

schedule.scheduleJob(date, function(){
    setTimeout(function() {

        console.log("start at " + date);
        console.log("#spwan: " + config.cron.numSpawn);

        // wait 3 seconds
        for (var i = 0; i < config.cron.numSpawn; i++) {
            run(i);
        }
    }, 3000);
   
});

