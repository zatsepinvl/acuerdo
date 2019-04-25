module.exports = {
    sleepUntil: (to) => {
        console.log("Sleeping for " + (to - new Date().getTime() / 1000) + " seconds");
        const waitTill = to * 1000;
        while (waitTill > new Date()) {
        }
    },

    promiseTimeout: (promise, ms = 1000) => {

        // Create a promise that rejects in <ms> milliseconds
        let timeout = new Promise((resolve, reject) => {
            let id = setTimeout(() => {
                clearTimeout(id);
                reject('Timed out in ' + ms + 'ms.')
            }, ms);
        });

        // Returns a race between our timeout and the passed in promise
        return Promise.race([
            promise,
            timeout
        ]);
    },

    nowSeconds: () => {
        return Math.floor(Date.now() / 1000);
    }
};