const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require('crypto');

app.use(cors())
app.use(bodyParser.json());

const port = 3000;

const ITEMS = {
  users: [
	{
	  id: crypto.randomUUID(),
	  firstName: 'John',
	  lastName: 'Doe',
	  address: {
		streetAndNumber: 'Sesame, 10',
		postalCode: '077020',
		city: 'LA',
		country: 'USA'
	  },
	  sports: [ 'running', 'cycling' ],
	  gender: 'male',
	  age: 23,
	  activity_class: 'amateur'
	},
    {
	  id: crypto.randomUUID(),
	  firstName: 'Jane',
	  lastName: 'Doe',
	  address: {
		streetAndNumber: '1 Mai, 32',
		postalCode: '077020',
		city: 'Berceni',
		country: 'Romania'
	  },
	  sports: [ 'running' ],
	  gender: 'female',
	  age: 20,
	  activity_class: 'professional'
	},
    {
	  id: crypto.randomUUID(),
	  firstName: 'Lorem',
	  lastName: 'Ipsum',
	  address: {
		streetAndNumber: 'Intrarea Verii, 15',
		postalCode: '27653',
		city: 'Iasi',
		country: 'Romania'
	  },
	  sports: [ 'walking' ],
	  gender: 'female',
	  age: 59,
	  activity_class: 'professional'
	},
    {
	  id: crypto.randomUUID(),
	  firstName: 'Rilastil',
	  lastName: 'Sulfat',
	  address: {
		streetAndNumber: 'Strada mica, 3',
		postalCode: '52296',
		city: 'Iasi',
		country: 'Romania'
	  },
	  sports: [ 'walking' ],
	  gender: 'female',
	  age: 29,
	  activity_class: 'professional'
	},
    {
	  id: crypto.randomUUID(),
	  firstName: 'Norbert',
	  lastName: 'Layis',
	  address: {
		streetAndNumber: 'Tamalis, 43',
		postalCode: '826470',
		city: 'Budapest',
		country: 'Hungary'
	  },
	  sports: [ 'skiing' ],
	  gender: 'male',
	  age: 31,
	  activity_class: 'amateur'
	},
  ],
};

const sendResponse = function(res, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(res[data ? 'json' : 'send'](data));
	}, parseInt(Math.random() * 5000));
  }) 
}

app.get("/users", (req, res) => {
	return sendResponse(res.status(200), ITEMS.users);
});

app.get("/users/:id", (req, res) => {
  const user = ITEMS.users.find(
    (user) => {
		return user.id === req.params.id
	}
  );
  if (user) {
    return sendResponse(res.status(200), user);
  }
  return sendResponse(res.status(404), null);
});

app.post("/users", (req, res) => {
  const body = req.body || {};
  ITEMS.users.push({...body, id: crypto.randomUUID() });
  return sendResponse(res.status(201), ITEMS.users[ITEMS.users.length - 1]);
});

app.put("/users/:id", (req, res) => {
  const body = req.body || {};
  const userIdx = ITEMS.users.findIndex(
    (user) => user.id === req.params.id
  );
  const user = ITEMS.users[userIdx];
  ITEMS.users[userIdx] = { ...body }
  return sendResponse(res.status(201), ITEMS.users[userIdx]);
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id
  ITEMS.users = ITEMS.users.filter(user => user.id !== id)
  return sendResponse(res.status(200))
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
