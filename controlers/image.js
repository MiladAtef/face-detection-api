const Clarifai=require( 'clarifai');

const app = new Clarifai.App({
	apiKey: '598a5062fa3f471391f18f9388ed5ade'
});

const handleApiCall=(req,res)=>{
	app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
	.then(data=>res.json(data))
	.catch(e=>res.status(400).send('unable to work with api'))
}

const handleImage=db=>(req, res) => {
	const { id } = req.body;
	db('users').where('id','=',id).increment('entries',1).returning('entries').then(entries=>{
		if (entries.length) {
			res.json(entries[0])
		} else {
			throw new Error();
		}
	}).catch(e=>res.status(400).send('unable to get entries'))
}

module.exports={handleImage,handleApiCall}