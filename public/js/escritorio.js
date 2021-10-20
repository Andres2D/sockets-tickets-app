
// Refs HTML
const lblDesktop = document.querySelector('h1');
const lblTicket = document.querySelector('small');
const btnNew = document.querySelector('button');
const divAlert = document.querySelector('.alert');
const lblPending = document.querySelector('#lblPending');

const searchParams = new URLSearchParams(window.location.search);

if(!searchParams.has('desktop')) {
    window.location = 'index.html';
    throw new Error('The desktop is required');
}

const desktop = searchParams.get('desktop');
divAlert.style.display = 'none';
lblDesktop.innerText = desktop;

const socket = io();

socket.on('connect', () => {
    btnNew.disabled = false;
});

socket.on('disconnect', () => {
    btnNew.disabled = true;
});

socket.on('pending-tickets', (pending) => {
    console.log(pending);
    lblPending.innerText = pending;
});

btnNew.addEventListener( 'click', () => {
    
    socket.emit('attend-ticket', {desktop}, ({ok, ticket, msg}) => {
        if(!ok) {
            lblTicket.innerText = 'Nadie.'; 
            return divAlert.style.display = '';
        }
        lblTicket.innerText = `The ticket ${ticket.number}`;       
    });

    socket.emit('pending-tickets', () => {

    })

//     socket.emit( 'next-ticket', null, ( ticket ) => {
//        lblNewTicket.innerText = ticket;
//     });
});
