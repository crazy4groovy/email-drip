// no requires!

var oneMinute = 60 * 1000
var timeDelay = () => (2 * oneMinute) + (2 * oneMinute * Math.random())
var now = () => new Date().toLocaleString()

var scheduleSendMail = (sendMail, opts, idx) => {
  console.log(now(), '#', idx, ' SENT to: >>>', opts.email, '<<< ', new Date().toLocaleString())

  idx += 1

  if (idx >= listSize) {
    console.log(now(), '\n!FINSIHED SENDING!', new Date().toLocaleString(), idx, listSize)
    return
  }

  var delay = timeDelay()
  console.log(now(), 'TIME DELAY in minutes: ', delay / 1000 / 60)

  setTimeout(
      () => (
          sendMail(opts, idx)
          .then(() => scheduleSendMail(sendMail, opts, idx))
      ),
      delay
  )

  return scheduleSendMail // ref to self
}

var listSize = 1 // only temp val, should be replaced by sendSched

module.exports = {
  sendSched: function sendSched (sendMail, opts, _listSize) {
    listSize = _listSize

    return sendMail(opts, 0)
        .then(idx =>
          scheduleSendMail(sendMail, opts, idx)
        )
  }
}
