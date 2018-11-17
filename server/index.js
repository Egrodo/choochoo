const express = require('express');
const MTA = require('mta-gtfs');
const fs = require('fs');
const app = express();

const data = JSON.parse(fs.readFileSync('server/stopList.json'));
/*
  Design:
    So I have this big map of "stopId"s and their corresponding station names which I can get with mta.stop().
    I'll need to use this for the setup of the app so the user can choose their stations.
    On the frontend I'll need to write a debouncer that searches for the stopId in this list. Make an endpoint to search stop_id's from stop_name's?

    This is a static list for the most part, but it could always change. I should be updating this every month maybe?
    This backend might have to go onto AWS or something.
    Then I have mta.schedule(stopId, field_id). The field_id's differentiate 
    
*/

// Get the oncoming trains given a stopId and fieldId.
app.get('/schedule/:stopId/', (req, res, next) => {
  const { stopId } = req.params;
  const { direction, feed_id } = req.query;
  if (stopId === undefined || stopId === null) {
    res.json({ error: 'Missing stopId parameter' });
    return;
  }

  const mta = new MTA({
    key: '6fdbd192a4cc961fa30c69c9607abcbf',
    feed_id: +feed_id || 1
  });

  mta
    .schedule(stopId)
    .then(({ schedule }) => {
      // Generate current Epoch for comparison.
      let currTime = Date.now().toString();
      currTime = +currTime.substring(0, currTime.length - 3);

      // Get the nearest 5 train arrivals in your given direction. Or, if no direction given, include both directions.
      const nextArriving = {};

      // Populate North
      if (direction === 'N' || direction !== 'S') {
        nextArriving.N = [];
        for (let i = 0; nextArriving.N.length < 5 && i < schedule[stopId].N.length; ++i) {
          const { routeId, arrivalTime } = schedule[stopId].N[i];
          // If arrival time is null I'm assuming that means it's at the station? Maybe returning 0 would be better for FE, hmm.

          if (arrivalTime < currTime) continue; // BUG: Occasionally an arrivalTime will be in the past? Just assume data integrity err and skip it.
          const eta = arrivalTime === null ? 'At the station' : arrivalTime - currTime;
          nextArriving.N.push({ routeId, eta });
        }
      }

      // Populate South
      if (direction === 'S' || direction !== 'N') {
        nextArriving.S = [];
        for (let i = 0; nextArriving.S.length < 5 && i < schedule[stopId].S.length; ++i) {
          const { routeId, arrivalTime } = schedule[stopId].S[i];

          if (arrivalTime < currTime) continue;
          const eta = arrivalTime === null ? 'At the station' : arrivalTime - currTime;
          nextArriving.S.push({ routeId, eta });
        }
      }

      res.json(nextArriving);
    })
    .catch(next);
});

// Get info on stops or any specific stop.
app.get('/stopInfo', (req, res, next) => {
  const mta = new MTA({
    key: '6fdbd192a4cc961fa30c69c9607abcbf',
    feed_id: 1
  });

  const { id } = req.query;
  if (!id) {
    // Return a pre-filtered list of stops that don't include N's.
    res.json({ stopsList });
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

app.get('/searchStop/', (req, res, next) => {
  const { query } = req.query;

  // TODO: Search the stopsInfo list for the query, return all matching.
  const arr = Object.keys(data).map(key => {
    const c = data[key];
    return { ...c };
  });

  res.json(arr);
});

app.use((_, res) => {
  res.status(404).send("Route doesn't exist.");
});

app.listen(3001, () => console.log('Server running on port 3001.'));
