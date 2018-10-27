const GTFS = require('gtfs-realtime-bindings');
const express = require('express');
const request = require('request');
const app = express();

app.get('/', (req, res) => {
  request({
    method: 'GET',
    url: 'http://datamine.mta.info/mta_esi.php?key=6fdbd192a4cc961fa30c69c9607abcbf&feed_id=1',
    encoding: null
  }, ((err, reqRes, body) => {
    if (err) {
      throw new Error(err);
    } else if (res.statusCode !== 200) {
      throw new Error(`Not okay response status code? -> ${reqRes.statusCode}`)
    }

    const feed = GTFS.FeedMessage.decode(body);
    feed.entity.forEach((entity) => {
      console.log(entity);
    });
    res.send(feed.entity);
  }));
});

app.use((req, res, next) => {
  res.statusCode(404).send("Route doesn't exist.");
});

app.listen(3001, () => console.log('Server running on port 3001.'));