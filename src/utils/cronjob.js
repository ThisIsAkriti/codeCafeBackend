const cron = require("node-cron");
cron.schedule('0 8  * * *', () => {
    console.log('running task every minute!')
});