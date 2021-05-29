const date = new Date(2021, 5, 29, 13, 0, 0)
//year, month, day, hours, minutes, and seconds
let ts = Math.round(date.getTime() / 1000)
console.log(ts)

const conductorReqObj = {
    start_time : ts,
    duration : 120,
    post : "Test Post 3",
    candidates : ["werewolf","hagrid"],
    voters : ["severus", "potter", "wheezly"]
}

const conductorReqJson = JSON.stringify(conductorReqObj)

console.log(conductorReqJson)