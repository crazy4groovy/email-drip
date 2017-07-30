var fs = require('fs')
var readline = require('readline')
var GoogleAuth = require('google-auth-library')

var {
  sendEmail
 } = require('./googleService')

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// var path = require('path')
// var appRoot = path.resolve(__dirname)
var appRoot = process.cwd()
var TOKEN_DIR = appRoot + '/.credentials/'
var TOKEN_PATH = TOKEN_DIR + 'token.json'

// If modifying these scopes, delete your previously saved credentials
// at .credentials/gmail-nodejs-quickstart.json
var SCOPES = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send'
  // 'https://www.googleapis.com/auth/gmail.labels'
]

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 */
function authorize (credentials) {
  var resolveP
  var p = new Promise((resolve, reject) => (resolveP = resolve) && true)

  var clientSecret = credentials.installed.client_secret
  var clientId = credentials.installed.client_id
  var redirectUrl = credentials.installed.redirect_uris[0]
  var auth = new GoogleAuth()
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl)

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function (err, token) {
    if (err) {
      getNewToken(oauth2Client).then(resolveP)
    } else {
      oauth2Client.credentials = JSON.parse(token)
      resolveP(oauth2Client)
    }
  })

  return p
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 */
function getNewToken (oauth2Client) {
  var resolveP, rejectP
  var p = new Promise((resolve, reject) => (resolveP = resolve) && (rejectP = reject))

  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })
  console.log('Authorize this app by visiting this url: ', authUrl)

  rl.question('Enter the code from that page here: ', function (code) {
    rl.close()
    oauth2Client.getToken(code, function (err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err)
        rejectP(err)
        return
      }

      oauth2Client.credentials = token
      storeToken(token)
      resolveP(oauth2Client)
    })
  })

  return p
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken (token) {
  try {
    fs.mkdirSync(TOKEN_DIR)
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err
    }
  }
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(token))
  console.log('Token stored to ' + TOKEN_PATH)
}

/* ************************************************************ */
/* ************************** INIT **************************** */
/* ************************************************************ */

// Load client secrets from a local file.
var creds = fs.readFileSync('client_secret.json')
authorize(JSON.parse(creds))
  .then(sendEmail())
  .then(auth => console.log('AUTH successfully fulfilled!'))
