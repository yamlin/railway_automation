// Use the external Chai As Promised to deal with resolving promises in
// expectations.
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var http = require('http');

// Chai expect().to.exist syntax makes default jshint unhappy.
// jshint expr:true

module.exports = function() {    

    var cookies = {}, url = "";
    var formData = {};


    function err(e, n) {
        console.log("res:" + e);
        n();
    }

    function timeConverter(unix_timestamp){
      var a = new Date(unix_timestamp*1000);
      return a.toUTCString();
    }

    this.Given(/^I go on(?: the website)? "([^"]*)"$/, function(url, next) {
        browser.get(url)
        .then(next, next);
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

    this.Given(/^getin date "([^"]*)"/, function(date, next) {
        formData['getin_date'] = date;
        $('select[name="getin_date"]')
            .sendKeys(formData['getin_date'])
            .then(next, next);

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
            var data = "";
            res.setEncoding('binary');

            res.on('data', function(chunk) {
                data += chunk;
            });

            // try to recognize the number
            res.on('end', function() {
                var fname = "/Users/yamlin/Desktop/images/test" + Math.floor(Math.random() * 10000000) + ".jpg";
                var fs = require('fs');
                fs.writeFile(fname, data, 'binary', function(err) {
                    
                    console.log("file saved!");
                });     
            });
        });
       
        next();
        
    });

    this.Then(/^I book the ticket with recognized number$/, function(next) {
        // fill in the image number
        $('input[name="randInput"]').clear().sendKeys("12333");
        //$('#sbutton').click();
    })

};
