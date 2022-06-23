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
        pass: '##########'
    }
    
});


function emailIsValid(destEmail) {
    const checkMe = destEmail.substring(0,destEmail.length-1);
    const mailformat = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return mailformat.test(checkMe);
};


/* Calculates Delivery Date */
function getDeliveryDate(shipping = 7) {
    var deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + shipping);
    return deliveryDate;
}


/* Generates Email */
function constructEmail(destEmail, defaultItems, dateObject) {
    const textPrompt = `Hi ${destEmail}! The following items will be sent to you: `;
    const textItems = defaultItems.join(', ');
    const textArrival = `Your order will arrive on ${dateObject.toLocaleDateString()}`;
    let options = {
        from: 'Giang Pham <giangphamgia03@gmail.com>',
        to: destEmail,
        subject: 'Testing',
        text: textItems,
        html: `<div> ${textPrompt} </div><b> ${textItems} </b><div> ${textArrival} </div>`,
    };
    return options;
}


/* Sends Email */
function sendEmail(options) {
    return new Promise((resolve, reject) => {
        transporter.sendMail(options, (error, info) => {
        if (error) return reject();
        return resolve();
        });
    });
}


/* Webhook function */
async function notify(request, response) {

    const dest = request.query.dest
    const isValid = emailIsValid(dest);
    if (isValid === false) return response.send('Invalid Email');
    const options = constructEmail(dest, request.body.items, getDeliveryDate());
    try {
        const emailResult = await sendEmail(options, response);
        return response.send("Email is successfully sent");
    }
    catch (error) {
        response.send(error.toString());
    }
    
}


exports.notify = functions.https.onRequest(notify);

