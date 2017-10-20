const eventTransformer = require('./transform/event');
const eventsFilter = (data) => {
  let arr = [];
  data.Events.forEach((evt) => {
    if ('Public' === evt.AccessLevel) {
      arr.push(eventTransformer(evt));
    }
  });
  data.Events = arr;

  return data;
};

const writer = (res, data) => {
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(data));
  res.end();
};

module.exports = (apiWorker) => {
  return {
    serve: (req, res, next) => {
      if ('/featuredevents' == req.path) {
        apiWorker.login((data) => {
          apiWorker.featuredevents(data.Permissions[0].AccountId, data.access_token)
            .then(eventsFilter)
            .then((data) => {
              writer(res, data);
            });
        })
      }

      if ('/calendarevents' == req.path) {
        apiWorker.login((data) => {
          apiWorker.calendarevents(data.Permissions[0].AccountId, data.access_token)
          .then(eventsFilter)
          .then((data) => {
            writer(res, data);
          });
        })
      }
    }
  };
};
