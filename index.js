const express = require('express');
const bodyParser = require('body-parser');
const query = require('./db/customers');
const auth = require('./services/authenticate');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;

app.set('view engine', 'pug');

let customers = [
  {id: '1588323375416', firstname: 'John', lastname: 'Johnson', email: 'john@johnson.com', phone: '8233243'},
  {id: '1588323375417', firstname: 'Mary', lastname: 'Smith', email: 'mary@smith.com', phone: '6654113'},
  {id: '1588323375418', firstname: 'Peter', lastname: 'North', email: 'peter@north.com', phone: '901176'},
]

app.get("/", (req, res) => {
  res.render("customerlist", {customers: customers});
})

app.get("/addcustomer", (req, res) => {
  res.render("addcustomer");
})

app.post("/addcustomer", (req, res) => {
  const newCustomer = {id: new Date().now, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, phone: req.body.phone};
  customers = [...customers, newCustomer];
  res.redirect("/");
})

process.env.SECRET_KEY = "5b1a3923cc1e1e19523fd5c3f20b409509d3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84d";

app.get("/api/customers", auth.authenticate, query.getAllCustomers);
app.get("/api/customers/:id", auth.authenticate, query.getCustomerById);
app.post("/api/customers", auth.authenticate, query.addCustomer);
app.delete("/api/customers/:id", auth.authenticate, query.deleteCustomer);
app.put("/api/customers/:id", auth.authenticate, query.updateCustomer);

// Route for login
app.post("/login", auth.login);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${port}.`);
});

module.exports = app;