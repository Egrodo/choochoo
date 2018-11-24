/* eslint-disable camelcase */
const express = require('express');
const cors = require('cors');
const MTA = require('mta-gtfs');
const axios = require('axios');
const Fuse = require('fuse.js');
const stopList = require('./stopList.json');
const routeToFeed = require('./routeIdToFeedId.json');

require('dotenv').config();

const app = express();
app.use(cors());

// Get the oncoming trains given a stopId and fieldId.
app.get('/schedule/:stopId/', (req, res, next) => {
  const { stopId } = req.params;
  if (stopId === undefined || stopId === null) {
    res.json({ error: 'Missing stopId parameter' });
    return;
  }

  // A function to return all closest trains given a schedule.
  const getTrains = (schedule, maxCount = 3) => {
    // Get the current (3 length) second count for comparison.
    let currTime = Date.now().toString();
    currTime = +currTime.substring(0, currTime.length - 3);

    // Get the nearest `countPerDir` train arrivals in both directions.

    const { N, S } = schedule[stopId];
    const north = [];
    const south = [];
    let i = 0;
    while (i < (Math.max(N.length, S.length))) {
      if (N[i] && north.length < maxCount) {
        const { routeId, arrivalTime } = N[i];

        // If the arrival time is in the future (sometimes it's not, bug)
        if (arrivalTime > currTime) {
          const eta = arrivalTime === null ? 0 : arrivalTime - currTime;
          north.push({ routeId, eta });
        }
      }

      if (S[i] && south.length < maxCount) {
        const { routeId, arrivalTime } = S[i];

        if (arrivalTime > currTime) {
          const eta = arrivalTime === null ? 0 : arrivalTime - currTime;
          south.push({ routeId, eta });
        }
      }
      ++i;
    }
    return { north, south };
  };

  // Use the feed map to get a feed_id from the first char of the stopId.
  const feed_id = routeToFeed[stopId.charAt(0)];
  if (!feed_id) {
    res.json({ error: 'routemap failed!', stopId, feed_id });
    return;
  }

  if (Array.isArray(feed_id)) {
    // If feed_id is an array that means there are multiple potential matches for it (like 'S'), so try both.
    (async function loop() {
      for (let i = 0; i < feed_id.length; ++i) {
        const mta = new MTA({
          key: process.env.MTA_KEY,
          feed_id: feed_id[i]
        });

        try {
          /* eslint-disable-next-line */
          const { schedule } = await mta.schedule(stopId);
          // If that feed_id exists at that stop, add it to our results.
          if (schedule) {
            const { north, south } = getTrains(schedule);
            res.json({ N: north, S: south });
            return;
          }
        } catch (err) {
          res.json({ error: err });
          return;
        }
      }
    })();
    return;
  }

  const mta = new MTA({
    key: process.env.MTA_KEY,
    feed_id
  });

  mta.schedule(stopId).then(({ schedule }) => {
    if (!schedule || !Object.keys(schedule).length) {
      res.json({ error: 'no schedule returned from request', stopId });
      return;
    }

    const { north, south } = getTrains(schedule, 3);
    res.json({ N: north, S: south });
  }).catch(err => {
    res.json({ error: err, message: "mta.schedule promise rejected.", stopId, feed_id });
  });
});

app.get('/searchStops/', (req, res, next) => {
  const { query } = req.query;
  if (!query) {
    next('No query sent');
    return;
  }
  const fuse = new Fuse(stopList, {
    shouldSort: true,
    threshold: 0.3,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 3,
    keys: ['stop_name', 'stop_id']
  });
  const results = fuse.search(query);
  // Only get the top 5 search results.
  if (results.length > 5) {
    res.json(results.slice(0, 5));
  } else res.json(results);
});

// Get info on stops or any specific stop.
app.get('/stopInfo', (req, res, next) => {
  const mta = new MTA({
    key: process.env.MTA_KEY,
    feed_id: 1
  });

  const { id } = req.query;
  if (!id) {
    // If no id given just return all stops
    res.json(stopList);
  } else {
    mta
      .stop(id)
      .then(stopInfo => {
        if (stopInfo === undefined) throw new Error(`Invalid id: ${id}`);
        res.json({ stopInfo });
      })
      .catch(next);
  }
});

app.get('/weatherInfo/:lat/:lon', (req, res, next) => {
  const { lat, lon } = req.params;
  if (!lat || !lon) {
    res.json({ error: 'Missing either lat or lon from parameters' });
    return;
  }

  axios.get(`https://api.darksky.net/forecast/${process.env.WEATHER_KEY}/${lat},${lon}`)
    .then(({ data }) => {
      const { summary, temperature } = data.currently;
      res.json({ temperature, summary });
    }).catch(err => res.json(err));
});

app.use((_, res) => {
  res.status(404).send("Route doesn't exist.");
});

app.listen(3001, () => console.log('Server running on port 3001.'));
