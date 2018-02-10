const Homeassistant = require('node-homeassistant')

let ha = new Homeassistant({
    host: 'localhost',
    retryTimeout: 1000, // in ms, default is 5000
    retryCount: 3, // default is 10, values < 0 mean unlimited
    port: 8123
});

ha.connect().then(() => {
    console.log(ha.state('sun.sun'));
}).catch((err) => console.log(err));
