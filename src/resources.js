var fs = require('fs')
var csv = require('csv-string')

try {
  var rawTemplate = fs.readFileSync('./resources/raw-email.txt').toString()
  var htmlTemplate = fs.readFileSync('./resources/html-email.txt').toString()
  var recipientList = csv.parse(fs.readFileSync('./resources/list.csv').toString()) // note: expects an empty last line

  module.exports = {
    rawTemplate: rawTemplate,
    htmlTemplate: htmlTemplate,
    recipientList: recipientList,

    emailForIdx: idx => recipientList[idx][0],
    nameForIdx: idx => recipientList[idx][1]
  }
} catch (err) {
  console.error('ERROR getting required resources: ', err.message)
}
