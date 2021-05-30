const d = new Date(2021, 4, 30, 14, 50, 0)
//year, monthIndex, day, hours, minutes, and seconds - according to local timezone

// let cd = new Date()
// let cs = Math.round(cd.getTime() / 1000)
//according to UTC

//console.log(d)
//console.log(cd)

let is = Math.round(d.getTime() / 1000)
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
