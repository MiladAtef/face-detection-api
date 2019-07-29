const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const app = express();
let PORT = process.env.PORT || 3000;

const database = {
	users: [
		{
			id: '123',
			password: 'cookies',
			name: 'John',
			email: 'john@gmail.com',
			entries: 0,
			joined: new Date()
		},
		{
			id: '124',
			password: 'bananas',
			name: 'Sally',
			email: 'sally@gmail.com',
			entries: 0,
			joined: new Date()
		}
	]
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//root route
app.get('/', (req, res) => {
	res.send(database.users);
});

//signin route
app.post('/signin', (req, res) => {
	if (
		req.body.email === database.users[0].email &&
		req.body.password === database.users[0].password
	) {
		res.json('success');
	} else {
		res.status(400).json('error logging in');
	}
});

//register route
app.post('/register', (req, res) => {
	const { name, email, password } = req.body;
	database.users.push({
		id: '125',
		password,
		name,
		email,
		entries: 0,
		joined: new Date()
	});
	res.json(database.users[database.users.length - 1]);
});

//profile route
app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let user = database.users.find(user => user.id === id);
	if (user) {
		res.json(user);
	} else {
		res.status(404).json('user not found');
	}
});

//image route
app.put('/image', (req, res) => {
	const { id } = req.body;
	let user = database.users.find(user => user.id === id);
	if (user) {
		user.entries++;
		res.json(user.entries);
	} else {
		res.status(404).json('user not found');
	}
});

app.listen(PORT, () => {
	console.log(`server is running on port ${PORT}`);
});
