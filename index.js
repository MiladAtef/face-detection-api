const express = require('express');
const app = express();

let PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
	res.send('helooooooooo');
});

app.listen(PORT, () => {
	console.log(`server is running on port ${PORT}`);
});
