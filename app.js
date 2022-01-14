const express = require('express')
const mongoose = require('mongoose')

const app = express()

app.set('view engine', 'ejs')

app.use(express.static('public'))

//databse connection
mongoose.connect('mongodb://localhost:27017/jigsawDB', { useNewUrlParser: true })

//budgetschema
const budgetSchema = {
	id: Number,
	amount: Number,
	timeperiod: String,
	sector: String,
}

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
const investmentSchema = {
	id: Number,
	date: Date,
	amount: Number,
	sector: String,
}

const Investment = mongoose.model('Investment', budgetSchema)

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

//for month

Investment.find(function (err, foundInvestments) {
	if (!err) {
		let totalBudget = 0,
			monthBudget = 0,
			quarterBudget = 0,
			bigdataBudget = 0,
			ecommerceBudget = 0

		const a = foundInvestments.map((investments) => {
			//rule5
			if (totalBudget < 350) {
				//rule4
				if (investments.sector === 'ecommerce') {
					ecommerceBudget += investments.amount
					if (ecommerceBudget <= 70) {
						totalBudget += investments.amount
						return investments
					}
				}
				//rule3
				if (investments.sector === 'bigdata') {
					// if(investments.date <= '31-03-2020'){
					bigdataBudget += investments.amount
					if (bigdataBudget <= 25) {
						totalBudget += investments.amount
						return investments
					}
					// }
				}
				//rule2
				if (investments.sector === 'fintech' && investments.amount <= 30) {
					totalBudget += investments.amount
					return investments
				}
			}
		})
		console.log(a)
		console.log(totalBudget, bigdataBudget)
	} else {
		res.send(err)
	}
})

app.listen(3000, function () {
	console.log('Server started on port 3000')
})
