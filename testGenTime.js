const date = new Date(2021, 5, 29, 19, 37, 19)
//year, month, day, hours, minutes, and seconds

let is = Math.round(date.getTime() / 1000)
let cs = Math.round((new Date()).getTime() / 1000)

console.log(is)

//console.log(cs)

// const conductorReqObj = {
//     start_time : is,
//     duration : 120,
//     post : "Test Post 3",
//     candidates : ["werewolf","hagrid"],
//     voters : ["severus", "potter", "wheezly"]
// }

// const conductorReqJson = JSON.stringify(conductorReqObj)

// console.log(conductorReqJson)
