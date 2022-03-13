const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
	item: {
		type: String,
		required: true,
		unique: true,
	},
	imgSrc: {
		type: String,
		required: true,
		unique: true,
	},
	foodType: {
		type: String,
		required: true,
	},
	cuisineType: {
		type: String,
		required: true,
	},
	catagory: {
		type: String,
		required: true,
	},
	totalCalories: {
		type: Number,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	restaurant: {
		type: String,
		required: true,
	},
	place: {
		type: String,
		required: true,
	},
	PINcode: {
		type: Number,
		required: true,
	},
	rating: {
		type: Number,
		required: true,
	},
	availability: {
		type: Boolean,
		required: true,
	},
});

const MenuDb = mongoose.model('menuDb', MenuSchema);

module.exports = { MenuDb };
