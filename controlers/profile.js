const handleGetProfile=(db)=> (req, res) => {
	const { id } = req.params;
	db.select('*').from('users').where({id}).then(user=>{
		if (user.length) {
			res.send(user[0])
		} else {
			throw new Error();
		}
	}).catch(e=>res.status(404).send('unable to find profile'))
}

module.exports={handleGetProfile}