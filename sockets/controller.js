const TicketControl = require('../models/ticket-control');

const ticketControl = new TicketControl();

const socketController = (socket) => {

    socket.emit('last-ticket', ticketControl.last);
    socket.emit('current-state', ticketControl.lastFour);

    socket.emit('pending-tickets', ticketControl.tickets.length);

    socket.on('next-ticket', (payload, callback) => {
        const next = ticketControl.next();
        socket.broadcast.emit('pending-tickets', ticketControl.tickets.length);
        callback(next);

        // TODO: notify the new ticket pending
    });

    socket.on('attend-ticket', ({desktop}, callback) => {
        if(!desktop) {
            return callback({
                ok: false,
                msg: 'The desktop is required'
            });
        }

        const ticket = ticketControl.attend(desktop);
        socket.broadcast.emit('current-state', ticketControl.lastFour);
        socket.emit('pending-tickets', ticketControl.tickets.length);
        socket.broadcast.emit('pending-tickets', ticketControl.tickets.length);

        if(!ticket) {
            callback({
                ok: false,
                mag: 'No more pending tickets'
            });
        }else {
            callback({
                ok: true,
                ticket
            });
        }
    })
}

module.exports = {
    socketController
}
