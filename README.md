# slack-invite-guest-command: A slack integration that builds a sandbox to work with candidates.
![](https://api.travis-ci.org/n4ch03/slack-invite-guest-command.svg?branch=master)

## Motivation

In some scenarios is interesting to:
* Invite an external user to our organization's [Slack](http://www.slack.com)
* Add the external user to only one channel

Some of the problems this couple of tasks have are:
* Only slack administrators can invite external users
* Repetitive(boring) task


## Solution

Slack allows to create integrations to custom endpoints and that endpoints can be trigged using commands. For example, we could set up that when you call `/custom-command text` an endpoint is called with the information about **command, text, userId,** and other information.

For the purpose of our solution we'll be using:
* text from command
* channel name: that means the cannel where the command was typed

The idea is to setup a integration that when you type a command **x** with parameter **y**, the information is sent to a webtask. Any valid email and not associated with an existent Slack team member is a valid input.

### Webtask rules
* Invite a user with the mail in the input
* Add the new user to the channel where action was triggered
* Control errors, some of them:
  * User previously invited or part of team
  * Invalid email
  * Invalid Slack API Token, Command Token or Slack domain
  * Command triggered from private groups or direct message   


## Installation

### Running tests

```
npm install
npm test
```

### Clone repo and install webtask

Once repo is cloned execute:
```
wt create web-tasks/slack-invite-guest-command-wt.js --name  invite-guest --secret SLACK_TOKEN=SLACK_API_TOKEN --secret SLACK_COMMAND_TOKEN=SECURITY_TOKEN --secret SLACK_DOMAIN=YOUR_SLACK_ORGANIZATION_DOMAIN
```

The token need for this integration is a token issued to an organization admin. To get that token, login as an administrator an go to https://api.slack.com/web .

### Set up slack integration
![](https://dl.dropboxusercontent.com/u/3835331/invite-guest-slack-command.gif)

That's all!! Just type your command and an email or your command and +email and the boring task of creating channels and invite externals users will not be there ;)

## TODO
* Move to express and/or decide how to improve validations (middleware?)
