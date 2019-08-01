const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors=require('cors');
const knex=require('knex');
const signin=require('./controlers/signin');
const register=require('./controlers/register');
const profile=require('./controlers/profile');
const image=require('./controlers/image');

const app = express();
let PORT = process.env.PORT || 3000;


const db=knex({
	client:'pg',
	connection:{
		connectString:process.env.DATABASE_URL,
		ssl:true
	} 
});

app.use(cors());
app.use(bodyParser.json());

app.get('/',(req,res)=>res.send('it is working!'))
app.post('/signin',signin.handleSignin(db,bcrypt));
app.post('/register', register.handleRegister(db,bcrypt));
app.get('/profile/:id',profile.handleGetProfile(db));
app.put('/image', image.handleImage(db));
app.post('/imageurl',(req,res)=> image.handleApiCall(req,res));

app.listen(PORT, () => {
	console.log(`server is running on port ${PORT}`);
});
