/**
 * Created by Tim on 16-2-2017.
 */
var moment = require('moment');

module.exports = function(io, db) {
    io.on('connection', function (socket) {
        socket.on('insert:grocery', function (data) {
            db.table('grocery')
            .insert({
                name: data,
                timestamp: db.now()
            }).run(db.conn, function(err, res) {
                io.emit('return:groceries_changed');
            });
        });

        socket.on('delete:grocery', function(id) {
            db.table('grocery').get(id).delete({returnChanges: true}).run(db.conn, function(err, res) {
                if (err) throw err;
                if (res.deleted>0)
                {
                    io.emit('return:groceries_changed');
                }
            });
        });

        socket.on('query:grocery_list_today', function () {
            db.table('grocery')
            .between(
                db.epochTime(Number(moment().startOf('day').format('X'))),
                db.epochTime(Number(moment().endOf('day').format('X'))),
                {index: 'timestamp'}
            ).run(db.conn, function (err, cursor) {
                if (err) throw err;
                cursor.toArray(function (err, groceries) {
                    if (err) throw err;
                    socket.emit('return:grocery_list', groceries);
                });
            });
        });
    });
};