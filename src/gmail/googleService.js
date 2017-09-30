var fs = require('fs')
var google = require('googleapis')
var gmail = google.gmail('v1')
var { btoa: encode64 } = require('Base64')
var csv = require('csv-string')

var defaultEmailTemplate = fs.readFileSync('../../resources/raw-email.txt').toString()
var emailRecipientList = csv.parse(fs.readFileSync('../../resources/list.csv').toString())
var oneMinute = 60 * 1000

var timeDelay = () => (3 * oneMinute) + (3 * oneMinute * Math.random())
var now = () => new Date().toLocaleString()

function send (emailTemplate, userId, auth, idx = 0) {
  var sendTo = emailRecipientList[idx]

  var emailBody = emailTemplate
    .replace(/%email%/g, sendTo[0])
    .replace(/%name%/g, sendTo[1])

  var raw = encode64(emailBody)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  gmail.users.messages.send({ auth, userId, resource: { raw } },
    function (err, response) {
      if (err) {
        console.log(now(), 'ERROR SENDING EMAIL: >>>', sendTo[0], '<<< ', err.message)
        return
      }

      console.log(now(), '#', idx, ' SENT to: >>>', sendTo[0], '<<< ', new Date().toLocaleString())

      if (idx === emailRecipientList.length - 1) {
        console.log(now(), '\n!FINSIHED SENDING!', new Date().toLocaleString())
        return
      }

      var delay = timeDelay()
      console.log(now(), 'TIME DELAY in minutes: ', delay / 1000 / 60)

      setTimeout(
        () => send(emailTemplate, userId, auth, idx + 1),
        delay
      )
    })

  console.log('...SENDING to: ', sendTo[0])
}

const sendEmail =
  (emailTemplate = defaultEmailTemplate, userId = 'me') =>
    (auth) =>
      send(emailTemplate, userId, auth)

module.exports = {
  sendEmail
}
