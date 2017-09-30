var config = require('../../mailjet.secret.json')
var mailjet = require('node-mailjet')
  .connect(
    config.MJ_APIKEY_PUBLIC,
    config.MJ_APIKEY_PRIVATE
  )

var sendSched = require('./sender').sendSched

var resources = require('../../resources')
var htmlTemplate = resources.htmlTemplate
var listSize = resources.recipientList.length

console.log('!!! SENDING TO', listSize, 'recipients')

sendSched(sendMail, {}, listSize) // {} is the opts, a mutable reference object read by the sender

function sendMail (opts, idx) {
  return mailjet
    .post('send')
    .request({
      FromEmail: 'ContinuingEd@ae911truth.org',
      FromName: 'AE911Truth Courses',
      Subject: "9/11: An Architect's Guide and Other AIA CES-Approved Courses",

      // 'Text-part': textTemplate
      //   .replace(/%email%/g, resources.emailForIdx(idx))
      //   .replace(/%name%/g, resources.nameForIdx(idx)),
      'Html-part': htmlTemplate
        .replace(/%email%/g, resources.emailForIdx(idx))
        .replace(/%name%/g, resources.nameForIdx(idx)),

      Recipients: [{
        'Email': resources.emailForIdx(idx)
      }]
    })
    .then(data => {
      console.log('!!! SENT MSG ID#', data.body.Sent[0].MessageID)
      // console.log(Object.keys(data.response).join('; '))
      opts.email = resources.emailForIdx(idx)
      return idx
    })
}
