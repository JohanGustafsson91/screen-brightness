const exec = require('child_process').exec

const DEC = 'dec'
const INC = 'inc'
const mode = process.argv[2]

const getCurrentBrightnessCmd =
  `xrandr --verbose | grep -i brightness | grep -o '[0-9].[0-9]'`

const setBrightnessCmd = `xrandr --output eDP-1-1 --brightness`

const runBashCmd = cmd =>
  new Promise((res, req) =>
    exec(cmd, (err, stdout, stderr) =>
      (err || stderr) ? req(err) : res(stdout)
    )
  )

const getDecrementedValue = current => current - 0.1 >= 0
  ? current - 0.1
  : 0

const getInrementedValue = current => current + 0.1 <= 1
  ? current + 0.1
  : 1.0

const getNewValue = (curr, mode) => mode === DEC
  ? getDecrementedValue(curr)
  : getInrementedValue(curr)

runBashCmd(getCurrentBrightnessCmd)
  .then(current =>
    runBashCmd(`${setBrightnessCmd} ${getNewValue(parseFloat(current), mode)}`)
  )
