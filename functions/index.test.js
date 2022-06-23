const {emailIsValid, constructEmail, getDeliveryDate} = require('./index.js');
//import {emailIsValid} from "./index.js"


/* Valid Emails */
const validEmails = [
    'email@example.com',
    'firstname.lastname@example.com',
    'email@subdomain.example.com',
    'firstname+lastname@example.com',
    'email@123.123.123.123',
    '1234567890@example.com',
    'email@example-one.com',
    '_______@example.com',
    'email@example.name',
    'email@example.museum',
    'email@example.co.jp',
    'firstname-lastname@example.com'
];

const wrongEmails = [
    'email@[123.123.123.123]',
    '"email"@example.com',
    'plainaddress',
    '#@%^%#$@#$@#.com',
    '@example.com',
    'Joe Smith <email@example.com>',
    'email.example.com',
    'email@example@example.com',
    '.email@example.com',
    'email.@example.com',
    'email..email@example.com',
    'あいうえお@example.com',
    'email@example.com (Joe Smith)',
    'email@example',
    'email@-example.com',
    'email@example..com',
    'Abc..123@example.com'
]


for (let i = 0; i < validEmails.length; i++) {
    test(`${validEmails[i]} == true?`, () => {
            expect(emailIsValid(validEmails[i])).toBe(true)
    });
}


for (let i = 0; i < wrongEmails.length; i++) {
    test(`${wrongEmails[i]} == false?`, () => {
            expect(emailIsValid(wrongEmails[i])).toBe(false)
    });
}


