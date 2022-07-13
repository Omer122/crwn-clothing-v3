
require("dotenv").config(); //attach the env variables to the enviorment
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY );

// send me event and try payment
exports.handler = async (event) =>{ //export old way
    try{
        const { amount } = JSON.parse(event.body);

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            payment_method_types:["card"]
        });

        return{ //succeed in get the payment object-> send it back
            statusCode:200,
            body:JSON.stringify({ paymentIntent })
        }
    } catch(error) {
        console.log({ error });
        return{
            status:400,
            body:JSON.stringify({ error }),
        };
    }
} 