const express = require('express')
const mongoose = require('mongoose')
const moment = require('moment')

const app = express()

app.set('view engine', 'ejs')

app.use(express.static('public'))

//databse connection
mongoose.connect('mongodb://localhost:27017/jigsawDB', { useNewUrlParser: true })

//budgetschema
const budgetSchema = new mongoose.Schema({
	id: Number,
	amount: Number,
	timeperiod: String,
	sector: String,
})

const Budget = mongoose.model('Budget', budgetSchema)

//view budget data
app.get('/budget', (req, res) => {
	Budget.find(function (err, foundBudget) {
		if (!err) {
			res.send(foundBudget)
		} else {
			res.send(err)
		}
	})
})

//investschema
const investmentSchema = new mongoose.Schema({
	id: Number,
	date: Date,
	amount: Number,
	sector: String,
})

const Investment = mongoose.model('Investment', investmentSchema)

//view investment data
app.get('/invest', (req, res) => {
	Investment.find(function (err, foundInvestments) {
		if (!err) {
			res.send(foundInvestments)
		} else {
			res.send(err)
		}
	})
})

//query handling

Investment.find(function (err, foundInvestments) {
	if (!err) {
		let totalBudget = 0,
			monthBudget = 0,
			quarterBudget = 0,
			ecommerceBudget = 0;

		const a = foundInvestments.map((investments) => {
			totalBudget += investments.amount
			if (totalBudget <= 350) {
				monthBudget += investments.amount
				//Jan
				if (
					moment(investments.date).format('YYYY-MM-DD') >= '2020-01-01' &&
					moment(investments.date).format('YYYY-MM-DD') <= '2020-01-31' &&
					monthBudget <= 70
				) {
					if (investments.sector === 'ecommerce') {
						ecommerceBudget += investments.amount
						if (ecommerceBudget <= 70) {
							return investments
						}
					} else if (investments.sector === 'bigdata') {
						quarterBudget += investments.amount
						if (
							moment(investments.date).format('YYYY-MM-DD') >= '2020-01-01' &&
							moment(investments.date).format('YYYY-MM-DD') <= '2020-03-31' &&
							quarterBudget <= 25
						) {
							return investments
						}
					} else if (investments.sector === 'fintech') {
						if (investments.amount <= 30) return investments
					} else {
						monthBudget=0;
						return investments
					}
				}
				//Feb
				else if (
					moment(investments.date).format('YYYY-MM-DD') >= '2020-02-01' &&
					moment(investments.date).format('YYYY-MM-DD') <= '2020-02-31' &&
					monthBudget <= 70
				) {
					console.log('feb:'+monthBudget)
					if (investments.sector === 'ecommerce') {
						ecommerceBudget += investments.amount
						if (ecommerceBudget <= 70) {
							return investments
						}
					} else if (investments.sector === 'bigdata') {
						quarterBudget += investments.amount
						if (
							moment(investments.date).format('YYYY-MM-DD') >= '2020-01-01' &&
							moment(investments.date).format('YYYY-MM-DD') <= '2020-03-31' &&
							quarterBudget <= 25
						) {
							return investments
						}
					} else if (investments.sector === 'fintech') {
						if (investments.amount <= 30) return investments
					} else {
						monthBudget=0;
						return investments
					}
				}
				//March
				else if (
					moment(investments.date).format('YYYY-MM-DD') >= '2020-03-01' &&
					moment(investments.date).format('YYYY-MM-DD') <= '2020-03-31' &&
					monthBudget <= 70
				) {
					if (investments.sector === 'ecommerce') {
						ecommerceBudget += investments.amount
						if (ecommerceBudget <= 70) {
							return investments
						}
					} else if (investments.sector === 'bigdata') {
						quarterBudget += investments.amount
						if (
							moment(investments.date).format('YYYY-MM-DD') >= '2020-01-01' &&
							moment(investments.date).format('YYYY-MM-DD') <= '2020-03-31' &&
							quarterBudget <= 25
						) {
							return investments
						}
					} else if (investments.sector === 'fintech') {
						if (investments.amount <= 30) return investments
					} else {
						return investments
					}
				}
				//April
				else if (
					moment(investments.date).format('YYYY-MM-DD') >= '2020-04-01' &&
					moment(investments.date).format('YYYY-MM-DD') <= '2020-04-30' &&
					monthBudget <= 70
				) {	
					quarterBudget = 0		
					if (investments.sector === 'ecommerce') {
						ecommerceBudget += investments.amount
						if (ecommerceBudget <= 70) {
							return investments
						}
					} else if (investments.sector === 'fintech') {
						if (investments.amount <= 30) return investments
					} else {
						return investments
					}
				}
				//May
				else {
					if (investments.sector === 'ecommerce') {
						ecommerceBudget += investments.amount
						if (ecommerceBudget <= 70) {
							return investments
						}
					} else if (investments.sector === 'fintech') {
						if (investments.amount <= 30) return investments
					} else {
						return investments
					}
				}
				monthBudget -= investments.amount
			}
			totalBudget -= investments.amount
		})
		console.log(a)
		console.log(totalBudget, quarterBudget, monthBudget)
	} else {
		res.send(err)
	}
})

app.listen(3000, function () {
	console.log('Server started on port 3000')
})
