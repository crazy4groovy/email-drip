# EMAIL DRIP

Send an email to a newsletter list via Gmail, at the rate of a **slow drip**. (3-6 minutes per each email sent)

## inputs

- /resources/list.csv
  - the newsletter list (format of `email,name`)
- /resources/raw-email.txt
  - the entire SMTP message payload, include template variable markers `%email%` and `%name%`

## notes

Account authorization is granted via Oauth, stored in the project's `.credentials/` folder

#### see also:

- https://developers.google.com/gmail/api/quickstart/nodejs
- https://developers.google.com/gmail/api/v1/reference/users/messages/send

#### other libs:

- https://www.npmjs.com/package/gmail-send
- https://www.npmjs.com/package/nodemailer
