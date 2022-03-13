'use strict';
let menu;
const body = document.querySelector('body');
const detailsPage = document.querySelector('.details');
const add = document.querySelector('#add');
const search = document.querySelector('#search');
const searchForm = document.querySelector('#search-form');
const head = document.querySelector('.head');
const table = document.querySelector('table');
const tbody = document.createElement('tbody');
table.append(tbody);
const addPage = document.querySelector('.add');
const updatePage = document.querySelector('.update');
const goBack = document.querySelectorAll('.go-back');
const updateForm = document.querySelector('#update-form');
const addForm = document.querySelector('#add-form');
const suggestionsList = document.createElement('ul');
suggestionsList.className = 'suggestions';
head.append(suggestionsList);
const message = document.querySelector('.message');
let updateRowNum;

function getData() {
	fetch('http://localhost:5000/menu')
		.then((data) => data.json())
		.then((data) => {
			menu = data;
			data.forEach((item) => {
				createTable(item);
			});
			createFilterCard();
			totalItems();
			totalRows();
			router();
		})
		.catch((err) => console.error(err.message));
}

add.addEventListener('click', () => {
	detailsPage.classList.add('hidden');
	addPage.classList.remove('hidden');
	history.pushState(null, null, 'add');
});

function debounce(fn, d) {
	let timer;
	return function () {
		const args = [...arguments];
		clearTimeout(timer);
		timer = setTimeout(() => {
			fn(args[0]);
		}, d);
	};
}

function suggestions(query) {
	suggestionsList.innerHTML = '';
	menu.forEach((item) => {
		if (item.item.includes(query)) {
			displayQuery(item.item);
		}
	});
}

function displayQuery(query) {
	const suggestion = document.createElement('li');
	suggestion.innerText = query;
	suggestionsList.append(suggestion);
}

const debounceList = debounce(suggestions, 300);

search.addEventListener('keyup', (e) => {
	if (e.target.value.toLowerCase().trim()) {
		debounceList(e.target.value.toLowerCase().trim());
	} else if (!e.target.value.toLowerCase().trim()) {
		suggestionsList.innerHTML = '';
	}
});

suggestionsList.addEventListener('click', (e) => {
	tbody.innerHTML = '';
	search.value = e.target.innerText;
	menu.find((item) => {
		if (item.item.toLowerCase() === e.target.innerText.toLowerCase()) {
			createTable(item);
		}
	});
	suggestionsList.innerHTML = '';
	totalRows();
});

searchForm.addEventListener('submit', (e) => {
	e.preventDefault();
	tbody.innerHTML = '';
	menu.forEach((item) => {
		if (item.item.includes(search.value.toLowerCase().trim())) {
			createTable(item);
		}
	});
	search.value = '';
	totalRows();
});

table.addEventListener('click', (e) => {
	if (e.target.matches('#update')) {
		updateRowNum = e.target.parentElement.rowIndex;
		detailsPage.classList.add('hidden');
		updatePage.classList.remove('hidden');
		const query = menu.find(
			(item) =>
				item.item === e.target.parentElement.firstChild.innerText.toLowerCase()
		);
		populateForm(query);
		history.pushState(null, null, 'update');
	} else if (e.target.matches('#delete')) {
		if (
			!confirm(
				`Are you sure you want to delete ${e.target.parentElement.firstChild.innerText}?`
			)
		)
			return;
		const item = e.target.parentElement.firstChild.innerText.toLowerCase();
		const rowNum = e.target.parentElement.rowIndex;
		deleteItem(item, rowNum);
	} else if (
		e.target.matches('#restaurants,#catagories,#food-types,#availabilities')
	) {
		filterFunc(e.target.value, e.target.id);
	}
});

goBack.forEach((btn) => {
	btn.addEventListener('click', () => {
		detailsPage.classList.remove('hidden');
		addPage.classList.add('hidden');
		updatePage.classList.add('hidden');
		history.back();
	});
});

addForm.addEventListener('submit', (e) => {
	e.preventDefault();
	addItem();
});

updateForm.addEventListener('submit', (e) => {
	e.preventDefault();
	updateItem(updateRowNum);
});

function createTable(item) {
	const row = document.createElement('tr');
	const ItemName = document.createElement('td');
	ItemName.innerText = item.item;
	const restaurant = document.createElement('td');
	restaurant.innerText = item.restaurant;
	const catagory = document.createElement('td');
	catagory.innerText = item.catagory;
	const foodType = document.createElement('td');
	foodType.innerText = item.foodType;
	const availability = document.createElement('td');
	if (JSON.parse(item.availability)) {
		availability.innerText = 'Available';
	} else {
		availability.innerText = 'Unavailable';
	}
	const price = document.createElement('td');
	price.innerText = item.price;
	const updateItem = document.createElement('td');
	updateItem.innerText = 'UPDATE';
	updateItem.id = 'update';
	const deleteItem = document.createElement('td');
	deleteItem.innerText = 'DELETE';
	deleteItem.id = 'delete';
	row.append(
		ItemName,
		restaurant,
		catagory,
		foodType,
		availability,
		price,
		updateItem,
		deleteItem
	);
	tbody.append(row);
}

function populateForm(item) {
	document.querySelector('#update-item').value = item.item;
	document.querySelector('#update-food-type').value = item.foodType;
	document.querySelector('#update-catagory').value = item.catagory;
	document.querySelector('#update-cuisine-type').value = item.cuisineType;
	document.querySelector('#update-rating').value = item.rating;
	document.querySelector('#update-calories').value = item.totalCalories;
	document.querySelector('#update-img-src').value = item.imgSrc;
	document.querySelector('#update-price').value = item.price;
	document.querySelector('#update-restaurant').value = item.restaurant;
	document.querySelector('#update-place').value = item.place;
	document.querySelector('#update-PIN-code').value = item.PINcode;
	if (JSON.parse(item.availability)) {
		document.querySelector('#update-available').checked = true;
	} else {
		document.querySelector('#update-unavailable').checked = true;
	}
}

function createFilterCard() {
	let restaurantsSelects = [];
	let catagoriesSelects = [];
	let foodtypesSelects = [];

	table
		.querySelectorAll('tr')
		.forEach((tr) => restaurantsSelects.push(tr.children[1].innerText));
	table
		.querySelectorAll('tr')
		.forEach((tr) => catagoriesSelects.push(tr.children[2].innerText));
	table
		.querySelectorAll('tr')
		.forEach((tr) => foodtypesSelects.push(tr.children[3].innerText));

	restaurantsSelects = [...new Set(restaurantsSelects)].slice(1);
	catagoriesSelects = [...new Set(catagoriesSelects)].slice(1);
	foodtypesSelects = [...new Set(foodtypesSelects)].slice(1);

	const restaurantsFilter = document.querySelector('#restaurants');
	const catagoriesFilter = document.querySelector('#catagories');
	const foodtypesFilter = document.querySelector('#food-types');

	restaurantsSelects.forEach((restaurant) => {
		restaurantsFilter.add(new Option(restaurant, restaurant.toLowerCase()));
	});
	catagoriesSelects.forEach((catagory) => {
		catagoriesFilter.add(new Option(catagory, catagory.toLowerCase()));
	});
	foodtypesSelects.forEach((foodType) => {
		foodtypesFilter.add(new Option(foodType, foodType.toLowerCase()));
	});
}

function totalItems() {
	const totalItems = document.getElementById('total-items');
	const totalItemsNum = menu.length;
	totalItems.innerText = `Total Items: ${totalItemsNum}`;
}

function totalRows(n = 0) {
	const totalRowNums = tbody.rows.length;
	const itemNums = document.getElementById('total-rows');
	itemNums.innerText = `ITEMS : ${totalRowNums - n}`;
}

function filterFunc(value, id) {
	let hidden = 0;
	tbody.innerHTML = '';
	if (value === 'all' && menu.length) {
		menu.forEach((item) => createTable(item));
	}

	if (id === 'restaurants' && value !== 'all') {
		menu.forEach((item) => {
			if (item.restaurant.toLowerCase() === value) {
				createTable(item);
			}
		});
	} else if (id === 'catagories' && value !== 'all') {
		menu.forEach((item) => {
			if (item.catagory.toLowerCase() === value) {
				createTable(item);
			}
		});
	} else if (id === 'food-types' && value !== 'all') {
		menu.forEach((item) => {
			if (item.foodType.toLowerCase() === value) {
				createTable(item);
			}
		});
	} else if (id === 'availabilities' && value !== 'all') {
		if (value === 'available') {
			menu.forEach((item) => {
				if (item.availability) {
					createTable(item);
				}
			});
		} else if (value === 'unavailable') {
			menu.forEach((item) => {
				if (!item.availability) {
					createTable(item);
				}
			});
		}
	}

	const filterValues = [];
	table.querySelectorAll('select').forEach((select) => {
		filterValues.push(select.value);
	});

	const trs = tbody.querySelectorAll('tr');

	for (let i = 0; i < 4; i++) {
		if (filterValues[i] !== 'all') {
			trs.forEach((tr) => {
				if (tr.children[i + 1].innerText.toLowerCase() !== filterValues[i]) {
					tr.classList.add('hidden');
				}
			});
		}
	}

	tbody.querySelectorAll('tr').forEach((tr) => {
		if (tr.getAttribute('class') === 'hidden') {
			hidden++;
		}
	});

	totalRows(hidden);
}

function addItem() {
	const data = getFormData('add-form');
	fetch(`http://localhost:5000/api/add?item=${data[0]}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data[1]),
	})
		.then((res) => res.text())
		.then((text) => {
			menu.push(data[1]);
			message.classList.remove('hidden');
			message.innerText = text;
			addNewRow(data[1]);
			totalItems();
			totalRows();
		})
		.catch((err) => console.error(err.message));
}

function addNewRow(data) {
	const rowNum = table.querySelectorAll('tr').length;
	const row = table.insertRow(rowNum);
	const cell1 = row.insertCell(0);
	cell1.innerText = data.item;
	const cell2 = row.insertCell(1);
	cell2.innerText = data.restaurant;
	const cell3 = row.insertCell(2);
	cell3.innerText = data.catagory;
	const cell4 = row.insertCell(3);
	cell4.innerText = data.foodType;
	const cell5 = row.insertCell(4);
	if (JSON.parse(data.availability)) {
		cell5.innerText = 'Available';
	} else {
		cell5.innerText = 'Unavailable';
	}
	const cell6 = row.insertCell(5);
	cell6.innerText = data.price;
	const cell7 = row.insertCell(6);
	cell7.innerText = 'UPDATE';
	cell7.id = 'update';
	const cell8 = row.insertCell(7);
	cell8.innerText = 'DELETE';
	cell8.id = 'delete';
}

function updateItem(n) {
	const updateFormInputItem = document.getElementById('update-item');
	updateFormInputItem.removeAttribute('disabled');
	const data = getFormData('update-form');
	updateFormInputItem.setAttribute('disabled', 'disabled');
	fetch(`http://localhost:5000/api/update?item=${data[0]}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data[1]),
	})
		.then((result) => result.text())
		.catch((err) => {
			console.error(err.message);
		})
		.then((text) => {
			message.classList.remove('hidden');
			message.innerText = text;
			updateRowData(n, data[1]);
			updateMenu(data[1]);
		});
}

function updateMenu(data) {
	let index;
	for (let i = 0; i < menu.length; i++) {
		if (menu[i].item === data.item) {
			index = i;
		}
	}
	menu.splice(index, 1, data);
}

function updateRowData(n, data) {
	const toUpdateRow = table.querySelectorAll('tr')[n];
	toUpdateRow.children[0].innerText = data.item;
	toUpdateRow.children[1].innerText = data.restaurant;
	toUpdateRow.children[2].innerText = data.catagory;
	toUpdateRow.children[3].innerText = data.foodType;
	if (JSON.parse(data.availability)) {
		toUpdateRow.children[4].innerText = 'Available';
	} else {
		toUpdateRow.children[4].innerText = 'Unavailable';
	}
	toUpdateRow.children[5].innerText = data.price;
}

function getFormData(id) {
	const form = document.querySelector(`#${id}`);
	const formData = new FormData(form);
	const values = [...formData.entries()];
	const formObj = Object.fromEntries(values);
	return [formData.get('item'), formObj];
}

function deleteItem(query, n) {
	fetch(`http://localhost:5000/api/delete?item=${query}`, {
		method: 'DELETE',
	})
		.then((res) => {
			if (res.ok) {
				menu.find((item, i) => {
					if (item.item.toLowerCase() === query) {
						menu.splice(i, 1);
					}
				});
				table.deleteRow(n);
				totalItems();
				totalRows();
			}
		})
		.catch((err) => console.error(err.message));
}

body.addEventListener('click', () => {
	message.classList.add('hidden');
});

function router() {
	const routes = [{ path: '/' }, { path: '/add' }, { path: '/update' }];
	const match = routes.find(
		(route) => route.path === location.pathname.toLowerCase().trim()
	);
	switch (match.path) {
		case '/':
			detailsPage.classList.remove('hidden');
			addPage.classList.add('hidden');
			updatePage.classList.add('hidden');
			message.classList.add('hidden');
			break;
		case '/add':
			detailsPage.classList.add('hidden');
			addPage.classList.remove('hidden');
			updatePage.classList.add('hidden');
			break;
		case '/update':
			detailsPage.classList.add('hidden');
			addPage.classList.add('hidden');
			updatePage.classList.remove('hidden');
			break;
		default:
			break;
	}
}

window.addEventListener('popstate', router);

getData();
