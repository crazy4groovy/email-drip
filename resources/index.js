var fs = require('fs')
var csv = require('csv-string')

try {
  var rawTemplate = fs.readFileSync(__dirname + '/raw-email.txt').toString()
  var htmlTemplate = fs.readFileSync(__dirname + '/html-email.txt').toString()
  var recipientList = csv.parse(fs.readFileSync(__dirname + '/list.csv').toString()) // note: expects an empty last line
} catch (err) {
  console.error('ERROR getting required resources: ', err.message)
}

module.exports = {
  rawTemplate: rawTemplate,
  htmlTemplate: htmlTemplate,
  recipientList: recipientList,

  emailForIdx: idx => console.log('!', JSON.stringify(idx), recipientList) || recipientList[idx][0],
  nameForIdx: idx => recipientList[idx][1]
}
