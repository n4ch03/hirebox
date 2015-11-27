# hirebox
A slack integration that builds a sandbox to work with candidates

## Motivation

In some scenarios for a hiring perspective is interesting to:
* Invite an external user to our organization's [Slack](http://www.slack.com)
* Add the external user to only one channel

Some of the problems this couple of tasks have are:
* Only slack administrators can invite external users
* Repetitive(boring) task


## Solution

Slack allows to create integrations to custom endpoints and that endpoints can be trigged using commands. For example, we could set up that when you call `/custom-command text` an endpoint is called with the information about **command, text, userId,** and other information.

For the purpose of our solution we'll be using:
* text from command
* user id
* channel name: that means the cannel where the command was typed

The idea is to setup a integration that when you type a command **x** with parameter **y** the information is sent to a webtask. What is a valid **input?** an **email** or **email prefixed with +**

### Webtask rules
* If input is prefixed with +
  * Create a new channel with the user part of the mail plus a predefined fixed word
  * Invite a user with the mail in the input
  * Add the user to the created channel
  * Add the user that triggered the action to the channel
* otherwise
  * Invite a user with the mail in the input
  * Add the new user to the channel where action was triggered


## Installation

### Clone repo and install webtask

Once repo is cloned execute:
```
wt create web-tasks/hirebox-wt.js --name  new-hire --secret SLACK_TOKEN=SLACK_API_TOKEN --secret SLACK_CHANNEL_NAME=POSTFIX_CHANNEL_NAME --secret SLACK_COMMAND_TOKEN=SECURITY_TOKEN
```
The channels names will be **MAIL_USER-POSTFIX_CHANNEL_NAME**

The token need for this integration is a token issued to an organization admin. To get that token, login as an administrator an go to https://api.slack.com/web .

### Set up slack integration
![](https://dl.dropboxusercontent.com/u/3835331/hirebox-slack.gif)

That's all!! Just type your command and an email or your command and +email and the boring task of creating channels and invite externals users will not be there ;)
