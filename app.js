const express = require('express')
const mongoose = require('mongoose')
const moment = require('moment')

const app = express()

app.set('view engine', 'ejs')

app.use(express.static('public'))

//databse connection
mongoose.connect('mongodb://localhost:27017/jigsawDB', { useNewUrlParser: true })

//investschema
const investmentSchema = new mongoose.Schema({
	id: Number,
	date: Date,
	amount: Number,
	sector: String,
})

const Investment = mongoose.model('Investment', investmentSchema)

//query handling
Investment.find(function (err, foundInvestments) {
	if (!err) {
		let totalBudget = 0,
			monthBudget = 0,
			quarterBudget = 0,
			ecommerceBudget = 0

		const a = foundInvestments.map((investments) => {
			totalBudget += investments.amount
			if (totalBudget < 350) {
				//Jan
				if (
					moment(investments.date).format('YYYY-MM-DD') >= '2020-01-01' &&
					moment(investments.date).format('YYYY-MM-DD') <= '2020-01-31' &&
					monthBudget <= 75
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
						} else {
							quarterBudget -= investments.amount
						}
					} else if (investments.sector === 'fintech') {
						if (investments.amount <= 30) return investments
					} else {
						return investments
					}
				}
				//Feb
				else if (
					moment(investments.date).format('YYYY-MM-DD') >= '2020-02-01' &&
					moment(investments.date).format('YYYY-MM-DD') <= '2020-02-29'
				) {
					monthBudget+=investments.amount
					if(monthBudget <= 75){
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
							} else {
								quarterBudget -= investments.amount
							}
						} else if (investments.sector === 'fintech') {
							if (investments.amount <= 30) return investments
						} else {
							return investments
						}
					} else{
						monthBudget -= investments.amount
					}
				}
				//March
				else if (
					moment(investments.date).format('YYYY-MM-DD') >= '2020-03-01' &&
					moment(investments.date).format('YYYY-MM-DD') <= '2020-03-31' &&
					monthBudget <= 75
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
						} else {
							quarterBudget -= investments.amount
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
					monthBudget <= 75
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
						ecommerceBudget -= investments.amount
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
		//filter output since the logic is for those investments that comply the rule
		const res = a.map((items,index) => {
			if(items === undefined) return index+1
		}).filter((item) => (item>0));
		console.log(res)
	} else {
		res.send(err)
	}
})

app.listen(3000, function () {
	console.log('Hope, you are having a good day. Here is your output, do update me in case of any suggestions.')
})
