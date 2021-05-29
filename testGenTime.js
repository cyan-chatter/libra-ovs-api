const date = new Date(2021, 5, 30, 1, 0, 0)
//year, month, day, hours, minutes, and seconds
let ts = Math.round(date.getTime() / 1000)
console.log(ts)

const conductorReqObj = {
    start_time : ts,
    duration : 1440,
    post : "Test Post",
    candidates : ["werewolf","hagrid"],
    voters : ["severus", "potter", "wheezly"]
}

const conductorReqJson = JSON.stringify(conductorReqObj)

console.log(conductorReqJson)