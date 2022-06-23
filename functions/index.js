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
        pass: 'bbenbcmoofhyrfiu'
    }
    
});

/* Shipping Days */
const shippingDays = 7;


/* Email Validation */ 
function emailIsValid(destEmail, response) {
    let index = -1;
    index = members.findIndex(items => items.email === destEmail.substring(0,destEmail.length-1));
    if (index === -1) response.send('Invalid member!');
    return index;
};

/* Calculates Delivery Date */
function getDeliveryDate(shipping) {
    var deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + shipping);
    return deliveryDate;
}


/* Generates Email */
function constructEmail(special, destEmail, defaultItems, dateObject, index) {
    const textPrompt = 'Hi ' + destEmail + '! The following items will be sent to you: ';
    const textItems = special === "true" ? members[index].items.join(', ') : defaultItems.join(', ');
    const textArrival = 'Your order will arrive on ' + dateObject.toLocaleDateString();
    let options = {
        from: 'Giang Pham <giangphamgia03@gmail.com>',
        to: destEmail,
        subject: 'Testing',
        text: textItems,
        html: '<div>' + textPrompt + '</div><b>' + textItems + '</b>' + '<div>' + textArrival + '</div>',
    };
    return options;
}


/* Sends Email */
async function sendEmail(options, response) {
    return await transporter.sendMail(options, (error, info) => {
        if(error){
            return response.send(error.toString());
        }
        return response.send('Email Succesfully Sent');
    });
}


/* Webhook function */

async function notify(request, response) {

    const dest = request.query.dest
    let index = emailIsValid(dest, response);
    if (index === -1) return;
    let options = constructEmail(request.query.individualized, dest, request.body.items, getDeliveryDate(shippingDays), index);
    return await sendEmail(options, response);
}


exports.notify = functions.https.onRequest(notify);

