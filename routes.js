var stripe = require('stripe')('sk_test_51HgzC5CVfK3DvMdN09bUQHoUNwkphFCbd4PctjI4Mr2jIXY84oQboMsFkurlnLsdCcI5RX8LfZBbAPAV8l8psh9Y005x3pEEW8');
const bodyparser = require('body-parser')
const path = require('path')
const app = require('express').Router()

app.get('/', function (req, res) {
    res.render('Home', {
        key: Publishable_Key,
        teste: 'Oi'
    })
})
app.get('/Teste2', function (req, res) {
    res.render('Teste2')
})

app.get('/teste', function (req, res) {
    res.render('Teste')
})

app.post("/charge", (req, res) => {
    try {
        stripe.customers
            .create({
                name: req.body.name,
                email: req.body.email,
                source: req.body.stripeToken
            })
            .then(customer =>
                stripe.charges.create({
                    amount: req.body.amount * 100,
                    currency: "usd",
                    customer: customer.id
                })
            )
            .then(() => res.render("TUDO CERTO"))
            .catch(err => console.log(err));
    } catch (err) {
        res.send(err);
    }
});


app.post('/payment', function (req, res) {

    // Moreover you can take more details from user 
    // like Address, Name, etc from form 
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Gourav Hammad',
        address: {
            line1: 'TC 9/4 Old MES colony',
            postal_code: '452331',
            city: 'Indore',
            state: 'Madhya Pradesh',
            country: 'India',
        }
    })
        .then((customer) => {

            return stripe.charges.create({
                amount: 2500,     // Charing Rs 25 
                description: 'Web Development Product',
                currency: 'INR',
                customer: customer.id
            });
        })
        .then((charge) => {
            res.send("Success")  // If no error occurs 
        })
        .catch((err) => {
            res.send(err)       // If some error occurs 
        });
})

module.exports = app