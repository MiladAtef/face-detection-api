const handleRegister=(db,bcrypt)=>(req, res) => {
	const { name, email,password} = req.body;
	const hash=bcrypt.hashSync(password);
	if(!name || !email || !password){
		return res.status(400).json('error form submission!')
	}
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
}

module.exports={handleRegister}