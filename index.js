var stripe = require('stripe')('sk_test_51HgzC5CVfK3DvMdN09bUQHoUNwkphFCbd4PctjI4Mr2jIXY84oQboMsFkurlnLsdCcI5RX8LfZBbAPAV8l8psh9Y005x3pEEW8');
const express = require('express')
const bodyparser = require('body-parser')
const path = require('path')
const app = express()


var Publishable_Key = 'pk_test_51HgzC5CVfK3DvMdNEabuGw4jIdtGgx5HOxcqTURCegXBGTujZ4k0haZ8YgNtX3HAZM54Hnfaf1MfG7JuJ5ix5f8v00W0uJ2BSY'


var port = Number(process.env.PORT || 3000);

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())
app.use(express.static('public'))

// View Engine Setup 
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', function(req, res) {
    res.render('Index')
})
app.get('/Teste2', function(req, res) {
    res.render('Index')
})

app.get('/teste', function(req, res) {
    res.render('Teste')
})

app.post("/charge", (req, res) => {
    try {
        stripe.customers
            .create({
                name: 'Marcos Vitor',
                source: req.body.stripeToken,
                email: 'markdjay.contato@gmail.com'
            })
            .then(customer =>
                stripe.charges.create({
                    amount: 15000,
                    currency: "brl",
                    description: 'Escova Platinada',
                    customer: customer.id
                })

            )
            .then(() => res.render('completed.ejs'))
            .catch(() => res.render("refused.ejs"));
    } catch (err) {
        res.send(err);
    }
});


app.post('/pay', async(request, response) => {
    try {
        let intent;
        if (request.body.payment_method_id) {
            // Create the PaymentIntent
            intent = await stripe.paymentIntents.create({
                payment_method: request.body.payment_method_id,
                amount: 1099,
                currency: 'brl',
                confirmation_method: 'manual',
                confirm: true
            });
        } else if (request.body.payment_intent_id) {
            intent = await stripe.paymentIntents.confirm(
                request.body.payment_intent_id
            );
        }
        // Send the response to the client
        response.send(generateResponse(intent));
    } catch (e) {
        // Display error on client
        return response.send({ error: e.message });
    }
});

const generateResponse = (intent) => {
    // Note that if your API version is before 2019-02-11, 'requires_action'
    // appears as 'requires_source_action'.
    if (
        intent.status === 'requires_action' &&
        intent.next_action.type === 'use_stripe_sdk'
    ) {
        // Tell the client to handle the action
        return {
            requires_action: true,
            payment_intent_client_secret: intent.client_secret
        };
    } else if (intent.status === 'succeeded') {
        // The payment didn’t need any additional actions and completed!
        // Handle post-payment fulfillment
        return {
            success: true
        };
    } else {
        // Invalid status
        return {
            error: 'Invalid PaymentIntent status'
        }
    }
};



app.post('/payment', function(req, res) {

    // Moreover you can take more details from user 
    // like Address, Name, etc from form 
    stripe.customers.create({
            name: req.body.name,
            email: req.body.email,
            source: req.body.stripeToken,
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
                amount: 2500, // Charing Rs 25 
                description: 'Web Development Product',
                currency: 'INR',
                customer: customer.id
            });
        })
        .then((charge) => {
            res.render('completed.html') // If no error occurs 
        })
        .catch((err) => {
            res.send(err) // If some error occurs 
        });
})

app.listen(port, function(error) {
    if (error) throw error
    console.log("Server created Successfully")
})