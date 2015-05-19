// Use the external Chai As Promised to deal with resolving promises in
// expectations.
var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    expect = chai.expect,
    http = require('http'),
    restler = require('restler'),
    fs = require('fs'), 
    config = require('../config');

chai.use(chaiAsPromised);


module.exports = function() {    

    var cookies = {}, 
        url = "", 
        formData = {},
        fname = "test_" + Math.floor(Math.random() * 100000) + ".jpg",
        captchaResult = '';

    function err(e, n) {
        console.log("res:" + e);
        n();
    }

    this.Given(/^I go on(?: the website)? "([^"]*)"$/, function(url, next) {
        
        browser.get(url).then(next, next);
    });

    this.Given(/^user id "([^"]*)"/, function(id, next) {
        formData['person_id'] = id;
        $('input[name="person_id"]').clear().sendKeys(id).then(next, next);
    });

    this.Given(/^from "([^"]*)"/, function(from, next) {
        formData['from_station'] = from;
        $('select[name="from_station"]').sendKeys(from).then(next, next);
    });

    this.Given(/^to "([^"]*)"/, function(to, next) {
        formData['to_station'] = to;
        $('select[name="to_station"]').sendKeys(to).then(next, next);
    });

    this.Given(/^getin date from config/, function(next) {
        var keyinValue = '',
            select = $('select[name="getin_date"]'),
            date = config.cron.getinDate;
            
        select.$$('option').then(function(options) {
            for (var i = 0; i < options.length; i++) {
                options[i].getAttribute('value').then(function(v){
                    if (v.indexOf(date) > -1) {
                        console.log("Keyin value: " + v);
                        formData['getin_date'] = v;
                        select.sendKeys(formData['getin_date']).then(next, next);
                    }
                });
            }
        });
    });

    this.Given(/^train number "([^"]*)"/, function(number, next) {
        formData['train_no'] = number;
        $('input[name="train_no"]').clear().sendKeys(number).then(next, next);
    });

    this.Given(/^quantity "([^"]*)"/, function(qty, next) {
        formData['order_qty_str'] = qty;
        $('select[name="order_qty_str"]')
            .sendKeys(qty)
            .then(next, next);
    });
    

    this.When(/^I submit the data$/, function(next) {    
        $('button').click().then(next, next);
    });

    this.Then(/^I will get the cookie "([^"]*)"$/, function(cookie, next) {
        browser.manage().getCookie(cookie).then(function(c){
            cookies[c.name] = c;
            next();
        }, err);
    });

    this.Given(/^I try to get the random image$/, function(next) {
        var path = "/ImageOut.jsp;jsessionid=" + cookies['JSESSIONID'].value;

        var options = {
            host: 'railway.hinet.net',
            port: 80,
            path: path,
            headers: {
                'Referer': 'http://railway.hinet.net/check_ctno1.jsp',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_4)' 
            }
        };

        http.get(options, function(res) {
            var buffer = [];
            //res.setEncoding('binary');

            res.on('data', function(chunk) {
                buffer.push(chunk);
            });

            // try to recognize the number
            res.on('end', function() {
                var img = Buffer.concat(buffer);
                fs.writeFile(fname, img, function(err) {
                    if(err) {
                       throw err;
                    }
                    console.log("file " + fname + " saved!");
                    next();
                });
            });
        });
    })

    this.Then(/^I get the recognized number$/, function(next) {
        var apiKey = config.captcha.key;

        fs.stat(fname, function(err, stats){
            if (err) {
                console.log(err);
                throw Exception;
            }

            var options = {
                multipart: true,
                data: {
                    method: "post",
                    key: apiKey,
                    numeric: "1",
                    min_len: "5",
                    max_len: "6",
                    file: restler.file(fname, null, stats.size, null, "image/jpg")
                }
            };
            restler.post(config.captcha.uploadUrl, options)
            .on("complete", function(res) {
                if (res.substring(0,3) === 'OK|') {
                    console.log('upload image sucessfully!');
                    
                    var id = res.substring(3, res.length),
                        uri = config.captcha.resultUrl + "?key=" + apiKey + 
                                "&action=get&id=" + id;   

                        restler.get(uri).on("complete", function(res) {
                            if (res instanceof Error) {
                                console.log('Error:', result.message);
                                this.retry(3000); // try again after 5 sec
                            } else {
                                console.log("captcha result: " + res);
                                if (res.substring(0,3) === 'OK|') {

                                    captchaResult = res.substring(3, res.length);
                                    console.log(captchaResult);
                                    $('#randInput').sendKeys(captchaResult).then(next);
                                    
                                } else {
                                    this.retry(3000);
                                }
                            }
                        });
                } else {
                    console.log(res);
                    this.retry(2000);
                }
            });
        });
    })

    this.Then(/^I book the ticket with recognized number$/, function(next) {    
        // fill in the image number
        $('#sbutton').click();
       
    })

    this.Then(/^I check the result$/, function(next) {

    });

    this.Then(/^I check the header$/, function(next){
        
    });

};
