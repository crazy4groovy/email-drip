var config = require('../mailjet.secret')
var mailjet = require('node-mailjet')
  .connect(
    config.MJ_APIKEY_PUBLIC,
    config.MJ_APIKEY_PRIVATE
  )

var res = require('./resources')
var htmlTemplate = res.htmlTemplate
var listSize = res.recipientList.length

console.log('!!! SENDING TO', listSize, 'recipients')

var sendSched = require('./sender')
  .sendSched

sendSched(sendMail, {}, listSize) // {} is the opts, a mutable reference object read by the sender

function sendMail (opts, idx) {
  var request = mailjet
    .post('send')
    .request({
      FromEmail: 'ContinuingEd@ae911truth.org',
      FromName: 'AE911Truth Courses',
      Subject: "9/11: An Architect's Guide and Other AIA CES-Approved Courses",

      // 'Text-part': textTemplate
      //   .replace(/%email%/g, res.emailForIdx(idx))
      //   .replace(/%name%/g, res.nameForIdx(idx)),
      'Html-part': htmlTemplate
        .replace(/%email%/g, res.emailForIdx(idx))
        .replace(/%name%/g, res.nameForIdx(idx)),

      Recipients: [{
        'Email': res.emailForIdx(idx)
      }]
    })

  // var p = new Promise((resolve, reject) => {
  //   request
  //     .on('success', function (response, body) {
  //       console.log(response.statusCode, body)
  //       opts.email = res.emailForIdx(idx)
  //       resolve(idx)
  //     })
  //     .on('error', function (err, response) {
  //       console.log(response.statusCode, err)
  //       opts.email = res.emailForIdx(idx)
  //       reject(idx)
  //     })
  // })

  return request.then(data => {
    console.log('SENT MSG ID#', data.body.Sent[0].MessageID)
    // console.log(Object.keys(data.response).join('; '))
    opts.email = res.emailForIdx(idx)
    return data
  })
}
