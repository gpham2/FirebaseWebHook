const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const members = require('../members.json');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions


/* Sender Authentication */
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'giangphamgia03@gmail.com',
        pass: 'lhidttsfivkvjcxv'
    }
});

/* Shipping Days */
const shippingDays = 7;


/* Webhook function */
const helloWorld = (request, response) => {
    
    // Checking if email is within member database
    const dest = request.query.dest
    let index = -1;
    index = members.findIndex(items => items.email === dest.substring(0,dest.length-1));
    if (index === -1) return response.send('Invalid member!');

    // Calculating Shipping arrival date
    var deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + shippingDays);

    // Generating email message
    const special = request.query.individualized;
    const textPrompt = 'Hi ' + dest + '! The following items will be sent to you: ';
    const textItems = special === "true" ? members[index].items.join(', ') : request.body.items.join(', ');
    const textArrival = 'Your order will arrive on ' + deliveryDate.toLocaleDateString();
    let options = {
        from: 'Giang Pham <giangphamgia03@gmail.com>',
        to: dest,
        subject: 'Testing',
        text: textItems,
        html: '<div>' + textPrompt + '</div><b>' + textItems + '</b>' + '<div>' + textArrival + '</div>',
    };

    // Sending the email
    return transporter.sendMail(options, (erro, info) => {
        if(erro){
            return response.send(erro.toString());
        }
        return response.send('Email Succesfully Sent');
    });
}


exports.helloWorld = functions.https.onRequest(helloWorld);

