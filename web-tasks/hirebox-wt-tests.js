var chai = require('chai');
var bluebird = require('bluebird');
chai.should();
var data;
var mock = require('mock-require');
var oracle;
mock('request-promise', function (options) {
    var url = options.url;
    if (url.indexOf("channels.join") !== -1) {
      //CREATE CHANNEL
      options.qs.should.have.property("name",oracle.data.test_username + "-" + (oracle.data.SLACK_CHANNEL_NAME || "exercise"));
      return bluebird.resolve({channel: {id: "TEST_CHANNEL_ID"}})
    } else if (url.indexOf("users.admin.invite") !== -1) {
      //INVITE EXTERNAL
      options.qs.email.should.be.a("string");
      options.qs.should.have.property("email", oracle.data.test_email);
      options.qs.should.have.property("set_active",true);
      options.qs.should.have.property("channels", oracle.data.channel_id);
      return bluebird.resolve({})
    } else if (url.indexOf("channels.invite") !== -1) {
      // INVITE CHANNEL
      options.qs.should.have.property("channel", oracle.data.channel_id);
      options.qs.should.have.property("user", oracle.data.user_id);
      return bluebird.resolve({})
    }


});
var wt = require(__dirname + '/hirebox-wt.js');
describe('Invite External User Without Channel Creation', function() {
  it('No @', function() {
    oracle = {
      data: {
        "SLACK_TOKEN": "A",
        "SLACK_COMMAND_TOKEN": "B",
        "token": "B",
        "user_id": "USERID",
        "channel_name": "CHANNEL",
        "channel_id": "THE_CHANNEL_ID",
        "SLACK_CHANNEL_NAME": "PEPITO",
        "text": "hihihihi.com",
        "test_username": "hihihihi.com",
        "test_email": "hihihihi.com",
        "SLACK_DOMAIN": 'n4ch03'
      }
    };
    wt(oracle, function (error, body){
      body.should.be.equal("Please provide a valid email");
    });
  });
  it('Valid Email and From Channel', function() {
    oracle.data.text = "iesmite@gmail.com";
    oracle.data.test_username = "iesmite";
    oracle.data.test_email = "iesmite@gmail.com";
    wt(oracle, function (error, body){
      body.should.be.equal("User created and invited to channel");
    });
  });

  it('Valid Email and From Private Group', function() {
    oracle.data.channel_name = "privategroup";
    wt(oracle, function (error, body){
      body.should.be.equal("You need to be in a channel to invite an external user");
    });
  });

  it('Valid Email and From Direct Message', function() {
    oracle.data.channel_name = "directmessage";
    wt(oracle, function (error, body){
      body.should.be.equal("You need to be in a channel to invite an external user");
    });
  });
});

describe('Invite External User and Creates Channel', function() {
  it('No @', function() {
    oracle = {
      data: {
        "SLACK_TOKEN": "A",
        "SLACK_COMMAND_TOKEN": "B",
        "token": "B",
        "user_id": "USERID",
        "channel_name": "CHANNEL",
        "channel_id": "TEST_CHANNEL_ID",
        "SLACK_CHANNEL_NAME": "PEPITO",
        "text": "+hihihihi.com",
        "test_username": "hihihihi.com",
        "test_email": "hihihihi.com",
        "SLACK_DOMAIN": 'n4ch03'
      }
    };
    wt(oracle, function (error, body){
      body.should.be.equal("Please provide a valid email");
    });
  });
  it('Valid Email', function() {
    oracle.data.text = "+iesmite@gmail.com";
    oracle.data.test_username = "iesmite";
    oracle.data.test_email = "iesmite@gmail.com";
    wt(oracle, function (error, body){
      body.should.be.equal("Channel And User Created");
    });  });
});

describe('Generic Errors', function() {
  it('No token setted', function() {
    oracle = {
      data: {
        "SLACK_COMMAND_TOKEN": "B",
        "token": "B",
        "user_id": "USERID",
        "channel_name": "CHANNEL",
        "channel_id": "TEST_CHANNEL_ID",
        "SLACK_CHANNEL_NAME": "PEPITO",
        "text": "iesmite@gmail.com",
        "test_username": "iesmite",
        "test_email": "iesmite@gmail.com",
        "SLACK_DOMAIN": 'n4ch03'
      }
    };
    wt(oracle, function (error, body){
      body.should.be.equal("Sorry the token in you webhook isn't valid");
    });
  });
  it('No API TOKEN setted', function() {
    oracle.data.SLACK_TOKEN = "A";
    delete oracle.data.SLACK_COMMAND_TOKEN;
    wt(oracle, function (error, body){
      body.should.be.equal("You need to provide the security token when deploy integration webtask");
    });
  });
  it('No POSTFIX setted', function() {
    oracle.data.SLACK_COMMAND_TOKEN = "B";
    delete oracle.data.SLACK_CHANNEL_NAME;
    oracle.data.text = "+iesmite@gmail.com";
    oracle.data.test_username = "iesmite";
    oracle.data.test_email = "iesmite@gmail.com";
    wt(oracle, function (error, body){
      body.should.be.equal("Channel And User Created");
    });
  });
  it('No SLACK_DOMAIN setted', function() {
    delete oracle.data.SLACK_DOMAIN;
    wt(oracle, function (error, body){
      body.should.be.equal("Your command wasn't configured properly, please provide your slack domain in SLACK_DOMAIN to webtask");
    });
  });
});
