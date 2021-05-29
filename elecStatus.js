const determineElectionStatus = (start_time,duration) => {
    let ts = Math.round((new Date()).getTime() / 1000);
    if(ts < start_time) return {
        status_code : 0,
        status_message : "Scheduled",
        status_description : "Voting Phase Not Started Yet"
    } 
    if(ts >= start_time && ts < (start_time + duration) ) return {
        status_code : 1,
        status_message : "Running",
        status_description : "Voting Phase is Active"
    }
    if(ts >= (start_time + duration)) return {
        status_code : 2,
        status_message : "Complete",
        status_description : "Election is Over"
    }
}
module.exports = determineElectionStatus