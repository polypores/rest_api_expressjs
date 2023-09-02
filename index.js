const Joi = require('joi')
// object schema validation

const express = require('express')
require('dotenv').config()

const mysql = require('mysql2')

const app = express()

const db = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USERNAME,
	database: process.env.DB_NAME
})

module.exports = db

app.use(express.json())

db.connect((err) => {
	if (err) {
		throw err;
	}
	console.log('mysql connected')
})

app.get('/book/insert', function (req, res) {
	let bookInfo = {
		"id": 6,
		"name": "Tây Du Ký",
		"year": 2010,
		"price": 10000
	}
	let sql = "INSERT INTO book SET ?"
	let query = db.query(sql, bookInfo, (err, result) => {
		if (err) throw err
		console.log(result)
		res.send("Db đã được update")
	})
})

app.get('/book/search', function (req, res) {
	let error_banner = 'Please enter the parameters'
	let id = req.query.id
	if (id === undefined) {
		console.log(error_banner)
		res.send(error_banner)
		return
	}
	let sql = "SELECT * FROM book " + "WHERE id = " + id.toString()
	let query = db.query(sql, (err, result, fields) => {
		if (err) throw err
		console.log(result)
		res.send(result)
	})
})

app.get('/', function (req, res) {
	res.send('Hello there')
})

app.get('/age', function (req, res) {
	const schema = Joi.object({
		name: Joi.string().min(3).required()
	})
	const result = schema.validate(req.query)
	if (result.error) {
		res.status(400).send(result.error.details[0].message);
		return
	} else {
		res.send(result)
	}
})

app.get('/api/book', function (req, res) {
	res.send([1, 2, 3])
})

app.get('/api/book/:id', function (req, res) {
	res.send(req.params.id)
})

app.get('/api/book/:id1/:id2', function (req, res) {
	res.send(req.params)
})

const port = process.env.PORT || 3000

app.listen(port, function () {
	console.log(`Listening on port ${port}...`)
})
