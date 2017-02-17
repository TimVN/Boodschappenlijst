/**
 * Created by Tim on 16-2-2017.
 */
var r = require('rethinkdb');
require('rethinkdb-init')(r);

r.init({
    host: 'localhost',
    port: 28015,
    db: 'groceries'
}, [
    {
        name: 'grocery',
        indexes: ['timestamp']
    }
  ]
)
.then(function (conn) {
    r.conn = conn;
});

module.exports = r;