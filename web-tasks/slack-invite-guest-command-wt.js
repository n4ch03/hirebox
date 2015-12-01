var request = require('request-promise');
var validator = require('validator');

module.exports =
  function (context, cb) {
    var result = preValidate(context);
    if (!result.ok) {
      return cb(null, result.message);
    }
    inviteUser(context.data.text, context.data.channel_id, context.data.SLACK_DOMAIN, context.data.SLACK_TOKEN)
      .then(function(json) {
        result = postValidate(json, context.data.text);
        if (!result.ok) {
          return cb(null, result.message);
        }
        return cb(null, 'User created and invited to the channel.');
      })
      .catch(function(err) {
        return cb(err, null);
      });

  }

/**
 * Invites a guest user to slack.
 * @param {string} email - The email will be used to invite the guest.
 * @param {string} channel - The channel id wheres the command was triggered.
 * @param {string} slackDomain - The account domain of slack that will be used to invite a guest user.
 * @param {string} slackToken - The SLACK API token.
 */
function inviteUser(email, channel, slackDomain, slackToken) {
  return request({
    json: true,
    method: "POST",
    url: "https://" + slackDomain + ".slack.com/api/users.admin.invite",
    qs: {
      "email": email,
      "ultra_restricted": 1,
      "token": slackToken,
      "set_active": true,
      "_attempts": 1,
      "channels": channel
    }
  });
}

/**
 * Performs a pre validation of the context of the Webtask before performs the invite.
 * @param {string} context - context with information regarding the webtask configuration and the parameters sent to webtask.
 */
function preValidate(context) {
  var result = getEmptyResult();
  // validate the token sent by the command is the same that the one stored in the wt
  if (context.data.SLACK_COMMAND_TOKEN !==context.data.token) {
    result.message = "You need to provide the valid security token when deploy integration webtask.";
    return result;
  // validate if the webtask defined correctly the slack domain
  } else if (context.data.SLACK_DOMAIN === undefined) {
    result.message = "Your command wasn't configured properly, please provide your slack domain in SLACK_DOMAIN to webtask.";
    return result;
  //validate if the command was triggered from a channel
  } else if (context.data.channel_name === 'directmessage' ||
      context.data.channel_name === 'privategroup') {
    result.message = "You need to be in a public channel to invite an external user.";
    return result;
  //validate if a slack api token was privided
  } else if (context.data.SLACK_TOKEN === undefined) {
    result.message = "Sorry but the Slack API token in you webhook isn't valid.";
    return result;
  } else if (!validator.isEmail(context.data.text)) {
    result.message = "Please provide a valid email";
    return result;
  }
  result.ok = true;
  return result;
}

/**
 * Performs a post validation to check if the invite was done correctly.
 * @param {json} json - The SLACK API response to the resource users.admin.invite.
 * @param {string} mail - The email used to perform the invitation.
 */
function postValidate(json, mail) {
  var result = getEmptyResult();
  if (!json.ok) {
    if (json.error === "already_in_team") {
      result.message = "The user " + mail + " was already invited. If the user didn't get the invite email please contact a Slack admin to resend the invite.";
    } else {
      result.message = "There was an error: " + json.error;
    }
    return result;
  }
  result.ok = true;
  return result;
}

function getEmptyResult() {
  return {
    ok: false,
    message: null
  }
}
