const GTFS = require('gtfs-realtime-bindings');
const express = require('express');
const request = require('request');
const MTA = require('mta-gtfs');
const app = express();

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
    feed_id: 1
  });

  mta.stop().then(function (result) {
    res.send(result);
  }).catch(function (err) {
    console.log(err);
  });
  /*
    Stations are stop ids. Sometimes there are multiple of the same id number, N and S versions. They have a parent_station. Just use the parent station?
  */
  // mta.schedule(635, 1).then((result) => {
  //   /* At this stage I have a data in the structure of 
  //     {
  //       schedule: {
  //         635: {
  //           N: [
  //             {
  //               routeId: "6" // What does this mean?
  //               delay: null,
  //               arrivalTime: // epoch time
  //               departureTime: // This same as arrival time?
  //             }
  //           ],
  //           S: [
  //             (southbound stops)
  //           ]
  //         }
  //       }
  //     }

  //   */
  //   // This array contains everything from like 2 hours ago to like in an hour. So have to sort according to current time.
  //   const { routeId, arrivalTime } = result.schedule["635"].N[result.schedule["635"].N.length - 1];
  //   // Get the next 5 arriving.
  //   let currTime = Date.now();
  //   // Date.now comes out in milliseconds, I need seconds. Trim last 3 off the end.
  //   currTime = currTime.toString().substring(0, currTime.toString().length - 3);
  //   let next = result.schedule["635"].N.filter(({ arrivalTime }) => {
  //     // Within the next 600 seconds.
  //     const diff = arrivalTime - currTime;
  //     if (diff > 0 && diff < 600) {
  //       return true;
  //     }
  //     return false;
  //   });

  //   // Then rewrite their dates to readable format.
  //   next = next.map((curr) => {
  //     return { ...curr, readableTime: `${curr.arrivalTime - currTime} seconds away.` };
  //   });
  //   res.send(next);
  // });
});

app.use((req, res, next) => {
  res.statusCode(404).send("Route doesn't exist.");
});

app.listen(3001, () => console.log('Server running on port 3001.'));