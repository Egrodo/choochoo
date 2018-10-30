const GTFS = require('gtfs-realtime-bindings');
const express = require('express');
const request = require('request');
const MTA = require('mta-gtfs');
const app = express();

/*
  Design:
    So I have this big map of "stopId"s and their corresponding station names which I can get with mta.stop().
    I'll need to use this for the setup of the app so the user can choose their stations.
    On the frontend I'll need to write a debouncer that searches for the stopId in this list. Make an endpoint to search stop_id's from stop_name's?

    This is a static list for the most part, but it could always change. I should be updating this every month maybe?
    This backend might have to go onto AWS or something.
    Then I have mta.schedule(stopId, field_id). The field_id's differentiate 

*/
app.get('/', (req, res) => {
  // request({
  //   method: 'GET',
  //   url: 'http://datamine.mta.info/mta_esi.php?key=6fdbd192a4cc961fa30c69c9607abcbf&feed_id=1',
  //   encoding: null
  // }, ((err, reqRes, body) => {
  //   if (err) {
  //     throw new Error(err);
  //   } else if (res.statusCode !== 200) {
  //     throw new Error(`Not okay response status code? -> ${reqRes.statusCode}`)
  //   }

  //   const feed = GTFS.FeedMessage.decode(body);
  //   // feed.entity.forEach((entity) => {
  //   //   console.log(entity);
  //   // });
  //   res.send(feed.entity[feed.entity.length - 1]);
  // }));
  const mta = new MTA({
    key: '6fdbd192a4cc961fa30c69c9607abcbf',
    feed_id: 1 // TODO: Does this feed_id determine which data I can get with .schedule?
  });

  // mta.stop().then(function (result) {
  //   res.send(result);
  // }).catch(function (err) {
  //   console.log(err);
  // });
  // mta.schedule(115, 1).then((result) => res.send(result));
  /*
    Stations are stop ids. Sometimes there are multiple of the same id number, N and S versions. They have a parent_station. Just use the parent station?
  // */
  // There are many different stopId's for each station, wtf? Do each match up to a different feed?
  // stopId is the station identifier
  const stopId = 902;
  // feedId is the type of train
  const feedId = 26;
  /*
    fieldId's:
      1: the 1,2,3,4,5,6, and S lines
      26: the A,C,E,H,S lines (S???)
      16: the N,Q,R,W lines
      21: the B,D,F,M lines
      2: the L line
      11: the Staten Island Railway
      31: the G line
      36: the J,Z line
      51: the 7 line
  */
  mta.schedule(stopId, feedId).then((result) => {
    // I need to ensure I do strict checking of the stopId and feedId and error handling else can crash everything.
    /* At this stage I have a data in the structure of 
      {
        schedule: {
          635: {
            N: [
              {
                routeId: "6" // What does this mean?
                delay: null,
                arrivalTime: // epoch time
                departureTime: // This same as arrival time?
              }
            ],
            S: [
              (southbound stops)
            ]
          }
        }
      }

    */
    // This array contains everything from like 2 hours ago to like in an hour. So have to sort according to current time.
    // Get the next 5 arriving.
    let currTime = Date.now();
    // Date.now comes out in milliseconds, I need seconds. Trim last 3 off the end.
    currTime = currTime.toString().substring(0, currTime.toString().length - 3);
    let next = result.schedule[`${stopId}`].N.filter(({ arrivalTime }) => {
      // Within the next 600 seconds.
      const diff = arrivalTime - currTime;
      if (diff > 0 && diff < 3000) {
        return true;
      }
      return false;
    });

    // Then rewrite their dates to readable format.
    next = next.map((curr) => {
      return { ...curr, readableTime: `${curr.arrivalTime - currTime} seconds away.` };
    });
    res.send(next);
  });
});

// Get the oncoming trains given a stopId and fieldId.
app.get('/schedule', (req, res) => {
  const mta = new MTA({
    key: '6fdbd192a4cc961fa30c69c9607abcbf',
    feed_id: 1
  });
  const { stopId, direction } = req.query;
  if (stopId === undefined || stopId === null) {
    res.json({ error: 'Need to include a stopId' });
    return;
  }

  mta.schedule(stopId).then(({ schedule }) => {
    if (direction === undefined || direction === null) {
      // If no direction given, just return all data we have. Not ideal...
      res.json(schedule[stopId]);
    } else {
      if (direction !== 'N' && direction !== 'S') {
        res.json({ error: 'Invalid direction given' });
        return;
      }
      // Generate current Epoch for comparison.
      let currTime = Date.now().toString();
      currTime = currTime.substring(0, currTime.length - 3);

      // Get the nearest 5 train arrivals in your given direction
      const next = [];
      for (let i = 0; next.length < 6; ++i) {
        // !!! This is assuming that it's sorted by arrival time, further testing required !!!
        const { routeId, arrivalTime } = schedule[stopId][direction][i];
        // If arrival time is null I'm assuming that means it's at the station? Maybe returning 0 would be better for FE, hmm.

        if (arrivalTime < +currTime) continue; // BUG: Occasionally an arrivalTime will be in the past? Just assume data integrity err and skip it.
        const eta = arrivalTime === null ? 'At the station' : arrivalTime - +currTime;
        next.push({ routeId, eta });
      }
      res.json(next);
    }
  }).catch((error) => {
    res.json({ error });
  });
});

// Get info on stops or any specific stop.
app.get('/stopInfo', (req, res) => {
  const mta = new MTA({
    key: '6fdbd192a4cc961fa30c69c9607abcbf',
    feed_id: 1
  });
  const { stopId } = req.query;
  if (stopId === undefined) {
    mta.stop().then((stopsInfo) => {
      res.json(stopsInfo);
    }).catch((error) => {
      res.json({ error });
    });
  } else {
    mta.stop(stopId).then((stopInfo) => {
      res.json(stopInfo);
    }).catch((error) => {
      res.json({ error });
    });
  }
});

app.use((req, res, next) => {
  res.statusCode(404).send("Route doesn't exist.");
});

app.listen(3001, () => console.log('Server running on port 3001.'));