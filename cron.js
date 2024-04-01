const cron = require('node-cron');

let i = 0;
cron.schedule('* * * * * *', function () {
    console.log(`This task runs every second - ${++i}`);
});
