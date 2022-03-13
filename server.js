const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./connection');
const bodyParser = require('body-parser');
const { MenuDb } = require('./model');
const path = require('path');

const server = express();

dotenv.config({ path: 'config.env' });
const PORT = process.env.PORT || 8080;

connectDB();

server.use(bodyParser.urlencoded({ extended: true }));

server.use(express.static(path.resolve(__dirname, 'assets')));

server.use(express.json());

server.get('/menu', (req, res) => {
	MenuDb.find()
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			console.error(err.message);
		});
});

server.get('/*', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'assets', 'index.html'));
});

server.post('/api/add', (req, res) => {
	const menu = new MenuDb({
		item: req.body.item,
		foodType: req.body.foodType,
		cuisineType: req.body.cuisineType,
		catagory: req.body.catagory,
		imgSrc: req.body.imgSrc,
		price: req.body.price,
		totalCalories: req.body.totalCalories,
		availability: req.body.availability,
		rating: req.body.rating,
		restaurant: req.body.restaurant,
		place: req.body.place,
		PINcode: req.body.PINcode,
	});
	if (req.body) {
		let error = false;
		menu
			.save(menu)
			.catch((err) => {
				error = true;
				return res.status(400).send(err.message);
			})
			.then(() => {
				if (!error) {
					res.send('Data saved successfully!');
				}
			});
	}
});

server.patch('/api/update', (req, res) => {
	MenuDb.findOneAndUpdate(req.query, req.body)
		.catch((err) => {
			res.status(400).send(err.message);
		})
		.then(() => {
			res.send(`${req.query.item} updated successfully!`);
		});
});

server.delete('/api/delete', (req, res) => {
	MenuDb.deleteOne(req.query)
		.catch((err) => {
			return res.status(400).send(err.message);
		})
		.then(() => {
			res.send(`${req.query.item} deleted successfully!`);
		});
});

server.listen(5000, () => {
	console.log(`http://localhost:${PORT}`);
});
