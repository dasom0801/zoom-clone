const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');

room.hidden = true;

let roomName;

function addMessage(message) {
	const ul = room.querySelector('ul');
	const li = document.createElement('li');
	li.innerText = message;
	ul.appendChild(li);
}

function handleMessageSubmit(event) {
	event.preventDefault();
	const input = room.querySelector('#msg input');
	socket.emit('new_message', input.value, roomName, () => {
		addMessage(`You: ${input.value}`);
		input.value = '';
	});
}

function handleNicknameSubmit(event) {
	event.preventDefault();
	const input = room.querySelector('#name input');
	socket.emit('nickname', input.value);
}

function showRoom() {
	welcome.hidden = true;
	room.hidden = false;
	const h3 = room.querySelector('h3');
	h3.innerText = `Room ${roomName}`;
	const msgForm = room.querySelector('#msg');
	const nameForm = room.querySelector('#name');
	msgForm.addEventListener('submit', handleMessageSubmit);
	nameForm.addEventListener('submit', handleNicknameSubmit);
}

function handleRoomSubmit(event) {
	event.preventDefault();
	const input = form.querySelector('input');
	socket.emit('enter_room', input.value, showRoom);
	roomName = input.value;
	input.value = '';
}

form.addEventListener('submit', handleRoomSubmit);

socket.on('welcome', (user, newCount) => {
	addMessage(`${user} arrived!`);
	const h3 = room.querySelector('h3');
	h3.innerText = `Room ${roomName} (${newCount})`;
});

socket.on('bye', (user, newCount) => {
	addMessage(`${user} left`);
	const h3 = room.querySelector('h3');
	h3.innerText = `Room ${roomName} (${newCount})`;
});

socket.on('new_message', addMessage);

socket.on('room_change', (rooms) => {
	const roomList = document.querySelector('#welcome ul');
	roomList.innerHTML = '';
	if (rooms.length === 0) {
		return;
	}

	rooms.forEach((room) => {
		const li = document.createElement('li');
		li.innerText = room;
		roomList.append(li);
	});
});
