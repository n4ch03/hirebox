var chai = require('chai');
var bluebird = require('bluebird');
chai.should();
var data;
var mock = require('mock-require');
var oracle;
mock('request-promise', function (options) {
    //INVITE EXTERNAL
    options.qs.email.should.be.a("string");
    options.qs.should.have.property("email", oracle.data.test_email);
    options.qs.should.have.property("set_active",true);
    options.qs.should.have.property("channels", oracle.data.channel_id);
    return bluebird.resolve(oracle.data.result);
});
var wt = require(__dirname + '/slack-invite-guest-command-wt.js');
describe('Invite External User', function() {
  it('No @ in email', function() {
    oracle = {
      data: {
        "SLACK_TOKEN": "API-TOKEN",
        "SLACK_COMMAND_TOKEN": "COMMAND-TOKEN",
        "token": "COMMAND-TOKEN",
        "text": "hihihihi.com",
        "SLACK_DOMAIN": 'n4ch03'
      }
    };
    wt(oracle, function (error, body){
      body.should.be.equal("Please provide a valid email");
    });
  });
  it('Valid Email Address', function() {
    oracle = {
      data: {
        "SLACK_TOKEN": "API-TOKEN",
        "SLACK_COMMAND_TOKEN": "COMMAND-TOKEN",
        "token": "COMMAND-TOKEN",
        "channel_id": "CHANNEL_TRIGGERED_ACTION",
        "text": "iesmite@gmail.com",
        "test_email": "iesmite@gmail.com",
        "SLACK_DOMAIN": 'n4ch03',
        "result": {"ok": true}
      }
    };
    wt(oracle, function (error, body){
      body.should.be.equal("User created and invited to the channel.");
    });
  });
  it('Wrong Command Security Token', function() {
    oracle = {
      data: {
        "SLACK_TOKEN": "API-TOKEN",
        "SLACK_COMMAND_TOKEN": "COMMAND-TOKEN",
        "token": "COMMAND-TOKE",
        "channel_id": "CHANNEL_TRIGGERED_ACTION",
        "text": "iesmite@gmail.com",
        "test_email": "iesmite@gmail.com",
        "SLACK_DOMAIN": 'n4ch03',
        "result": {"ok": true}
      }
    };
    wt(oracle, function (error, body){
      body.should.be.equal("You need to provide the valid security token when deploy integration webtask.");
    });
  });
  it('No Slack Domain Configured', function() {
    oracle = {
      data: {
        "SLACK_TOKEN": "API-TOKEN",
        "SLACK_COMMAND_TOKEN": "COMMAND-TOKEN",
        "token": "COMMAND-TOKEN",
        "channel_id": "CHANNEL_TRIGGERED_ACTION",
        "text": "iesmite@gmail.com",
        "test_email": "iesmite@gmail.com",
        "result": {"ok": true}
      }
    };
    wt(oracle, function (error, body){
      body.should.be.equal("Your command wasn't configured properly, please provide your slack domain in SLACK_DOMAIN to webtask.");
    });
  });
  it('Action from directmessage', function() {
    oracle = {
      data: {
        "SLACK_TOKEN": "API-TOKEN",
        "SLACK_COMMAND_TOKEN": "COMMAND-TOKEN",
        "token": "COMMAND-TOKEN",
        "channel_id": "CHANNEL_TRIGGERED_ACTION",
        "text": "iesmite@gmail.com",
        "test_email": "iesmite@gmail.com",
        "channel_name": "directmessage",
        "SLACK_DOMAIN": 'n4ch03',
        "result": {"ok": true}
      }
    };
    wt(oracle, function (error, body){
      body.should.be.equal("You need to be in a public channel to invite an external user.");
    });
  });
  it('Action from privategroup', function() {
    oracle = {
      data: {
        "SLACK_TOKEN": "API-TOKEN",
        "SLACK_COMMAND_TOKEN": "COMMAND-TOKEN",
        "token": "COMMAND-TOKEN",
        "channel_id": "CHANNEL_TRIGGERED_ACTION",
        "text": "iesmite@gmail.com",
        "test_email": "iesmite@gmail.com",
        "channel_name": "privategroup",
        "SLACK_DOMAIN": 'n4ch03',
        "result": {"ok": true}
      }
    };
    wt(oracle, function (error, body){
      body.should.be.equal("You need to be in a public channel to invite an external user.");
    });
  });
  it('Slack API Token missing', function() {
    oracle = {
      data: {
        "SLACK_COMMAND_TOKEN": "COMMAND-TOKEN",
        "token": "COMMAND-TOKEN",
        "channel_id": "CHANNEL_TRIGGERED_ACTION",
        "text": "iesmite@gmail.com",
        "test_email": "iesmite@gmail.com",
        "channel_name": "channel",
        "SLACK_DOMAIN": 'n4ch03',
        "result": {"ok": true}
      }
    };
    wt(oracle, function (error, body){
      body.should.be.equal("Sorry but the Slack API token in you webhook isn't valid.");
    });
  });
  it('Already Invited User', function() {
    oracle = {
      data: {
        "SLACK_TOKEN": "API-TOKEN",
        "SLACK_COMMAND_TOKEN": "COMMAND-TOKEN",
        "token": "COMMAND-TOKEN",
        "channel_id": "CHANNEL_TRIGGERED_ACTION",
        "text": "iesmite@gmail.com",
        "test_email": "iesmite@gmail.com",
        "channel_name": "channel",
        "SLACK_DOMAIN": 'n4ch03',
        "result": {"ok": false, "error": "already_in_team"}
      }
    };
    wt(oracle, function (error, body){
      body.should.be.equal('The user iesmite@gmail.com was already invited. If the user didn\'t get the invite email please contact a Slack admin to resend the invite.');
    });
  });
  it('Other API Error', function() {
    oracle = {
      data: {
        "SLACK_TOKEN": "API-TOKEN",
        "SLACK_COMMAND_TOKEN": "COMMAND-TOKEN",
        "token": "COMMAND-TOKEN",
        "channel_id": "CHANNEL_TRIGGERED_ACTION",
        "text": "iesmite@gmail.com",
        "test_email": "iesmite@gmail.com",
        "channel_name": "channel",
        "SLACK_DOMAIN": 'n4ch03',
        "result": {"ok": false, "error": "other_error"}
      }
    };
    wt(oracle, function (error, body){
      body.should.be.equal('There was an error: other_error');
    });
  });
});
