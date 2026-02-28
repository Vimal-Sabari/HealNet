import NodeCache from 'node-cache';

// stdTTL is the default time-to-live in seconds (e.g., 1 hour = 3600)
// checkperiod is the internal clear up time (e.g., every 10 minutes)
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

export default cache;
