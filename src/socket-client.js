import io from 'socket.io-client';
const socket = io.connect('127.0.0.1:3000', { reconnect: true });

socket.on('tweet', function(tweet) {
    console.log(tweet);
});