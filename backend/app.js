//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("../"))

app.get("/", (req, res) => {
    res.redirect("index.html");
});

app.post("/", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;

    // YOUR EMAIL AUTHENTICATION REQUIRED
    /* NOTE: REGULAR LOGIN PASSWORD WILL NOT WORK HERE IF TWO-FACTOR AUTHENTICATION IS ENABLED ON YOUR PROXY GOOGLE ACCOUNT. 
        THIS NEEDS AN APP-SPECIFIC PASSWORD
    */

    /* 
    To generate your App-Specific Password follow these instructions:
        1. Follow this link - https://myaccount.google.com/u/0/security?hl=en 
           Make sure you are on the proxy google account only.
        2. Under the section named "Sigining in to Google" click on "App Passwords"
        3. Verify it’s you by using the regular google account password
        4. Select App -> Other (Custom name)
        5. Click on "Generate"
        6. Copy this generated password into the "pass" field down here
        7. Voila! You are receiving messages via your proxy email when new users send any message
    */
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '<PROXY_EMAIL-ADDRESS>', // proxy email address
            pass: '<PASSWORD>' // If 2FA is enabled for this google account, app-specific password to be generated following the instructions.
        }
    });

    const mailData = {
        from: 'yashkadulkar3@gmail.com',  // proxy sender address
        to: 'info@bedudo.com',   // receive the message on your company email
        subject: `Message from Bedudo user: ${name}, ${email}`,
        text: `${message}`,
    };

    transporter.sendMail(mailData, function (err, info) {
        if (err) {
            // error possibly occurred due to failed login credentials on the provided Google Account
            console.log(err);
            res.send(err);
            // res.redirect("../error.html");
        }
        else {
            // success
            console.log("Email Sent:", info);
            res.redirect("/");
        }
    });
});




app.listen(process.env.PORT || 3000, () => console.log("Server running."));
