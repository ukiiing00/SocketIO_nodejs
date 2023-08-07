const socket = new WebSocket(`ws://${window.location.host}`);
const messageList = document.querySelector('ul');
const nickForm = document.querySelector('#nick');
const messageForm = document.querySelector('#message');

function makeMessage(type, payload) {
    const msg = { type, payload };
    return JSON.stringify(msg);
}

function handleOpen() {
    console.log('Connected to Server ✅');
}

socket.addEventListener('open', handleOpen);

socket.addEventListener('message', (message) => {
    console.log(message.data);
    const li = document.createElement('li');
    li.innerText = message.data;
    messageList.appendChild(li);
});

socket.addEventListener('close', () => {
    console.log('Disconnected from Server ❌');
});

function handleSubmit(event) {
    event.preventDefault();
    const input = messageForm.querySelector('input');
    socket.send(makeMessage('new_message', input.value));
    input.value = '';
}

function handleNickSubmit(event) {
    event.preventDefault();
    const input = nickForm.querySelector('input');
    socket.send(makeMessage('nickname', input.value));
}

messageForm.addEventListener('submit', handleSubmit);
nickForm.addEventListener('submit', handleNickSubmit);
