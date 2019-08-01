const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors=require('cors');
const knex=require('knex');
const app = express();
let PORT = process.env.PORT || 3000;


const db=knex({
	client:'pg',
	connection: 'postgres://postgres:test@localhost:5432/smartbrain'
});

app.use(cors());
app.use(bodyParser.json());
//root route
app.get('/', (req, res) => {
	res.send(database.users);
});

//signin route
app.post('/signin', (req, res) => {
	const{email,password}=req.body;
	db.select('email','hash').from('login').where('email','=',email)
	.then(data => {
		const isValid=bcrypt.compareSync(password,data[0].hash);
		if (isValid) {
			return db.select('*').from('users').where('email','=',email)
			.then(user=>res.json(user[0]))
			.catch(e=> res.status(404).json('unable to find user'))
		} else {
			throw new Error();
		}
	}).catch(e=> res.status(400).json('error logging in'))
});

//register route
app.post('/register', (req, res) => {
	const { name, email,password} = req.body;
	const hash=bcrypt.hashSync(password);

	db.transaction(trx=>{
		trx.insert({hash,email})
		.into('login')
		.returning('email')
		.then(loginEmail=>{
	    	return trx('users')
			.returning('*')
			.insert({
				name,
				email:loginEmail[0],
				joined:new Date()
			})
			.then(user=>res.json(user[0]))
		}).then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(e=>res.status(400).send('unable to register'));
});

//profile route
app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	db.select('*').from('users').where({id}).then(user=>{
		if (user.length) {
			res.send(user[0])
		} else {
			throw new Error();
		}
	}).catch(e=>res.status(404).send('unable to find profile'))
	
});

//image route
app.put('/image', (req, res) => {
	const { id } = req.body;
	db('users').where('id','=',id).increment('entries',1).returning('entries').then(entries=>{
		if (entries.length) {
			res.json(entries[0])
		} else {
			throw new Error();
		}
	}).catch(e=>res.status(400).send('unable to get entries'))
});

app.listen(PORT, () => {
	console.log(`server is running on port ${PORT}`);
});
