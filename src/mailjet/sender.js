// no requires!

var oneMinute = 60 * 1000
var timeDelay = () => (0.5 * oneMinute) + (0.5 * oneMinute * Math.random())
var now = () => new Date().toLocaleString()

var senderCb = (sendMail, opts, idx) => {
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
          .then(() => senderCb(sendMail, opts, idx))
      ),
      delay
  )

  return senderCb // ref to self
}

var listSize = 1 // only temp val, should be replaced by sendSched
module.exports = {
  sendSched: function sendSched (sendMail, opts, _listSize) {
    listSize = _listSize

    return sendMail(opts, 0)
        .then(idx => senderCb(sendMail, opts, idx))
  }
}
