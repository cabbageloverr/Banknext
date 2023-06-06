require('dotenv').config();
require('./config/database').connect();

const express = require('express');
const User = require('./model/user');
const Transaction = require('./model/transaction');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');
const cors = require('cors');


const app = express();

app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
    try {

        const { first_name, last_name, email, password } = req.body;

        if (!(email && password && first_name && last_name)) {
            res.status(400).send("All input is require!!");
        }

        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.status(409).send("User already exist.");
        }

        encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword
        })

        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "1h"
            }
        )

        user.token = token;

        res.status(201).json(user);

    } catch (err) {
        console.log(err);
    }
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            res.status(400).send("All input is require");
        }

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "1h"
                }
            )

            user.token = token;
            res.status(200).json(user);

        }

        res.status(400).send("Invalid email or password");



    } catch (err) {
        console.log(err);
    }

})

app.post("/home", auth, async (req, res) => {
    const { acc_num } = req.body;
    const user = await User.findOne({ acc_num });

    return res.status(200).json(user);
})

app.post("/deposit", async (req, res) => {
    try {
        const { money_depo, acc_num } = req.body;

        if (!(money_depo && acc_num)) {
            res.status(400).send("All input is require!!");
        }

        const findacc = await User.findOne({ acc_num });
        if (!findacc) {
            return res.status(409).send("Invalid accout number!");
        }

        const choose_acc = { acc_num: acc_num };
        const depo = { $inc: { money: money_depo } }
        let doc = await User.findOneAndUpdate(choose_acc, depo);
        doc.choose_acc;


        doc = await User.findOne(choose_acc);
        doc.money;

        return res.status(200).json(findacc);

    } catch (err) {
        console.log(err);
    }
});

app.post("/withdraw", async (req, res) => {
    try {
        const { money_wd, acc_num } = req.body;

        if (!(money_wd && acc_num)) {
            res.status(400).send("All input is require!!");
        }

        const findacc = await User.findOne({ acc_num });
        if (!findacc) {
            return res.status(409).send("Invalid accout number!");
        }

        const choose_acc = { acc_num: acc_num };
        const withdraw = { $inc: { money: - money_wd } }
        let doc = await User.findOneAndUpdate(choose_acc, withdraw);
        doc.choose_acc;
        //เรียกค่าหลังถูก update


        doc = await User.findOne(choose_acc);
        doc.money;
        //เรียกค่าหลังถูก update 

        return res.status(200).json(findacc);

    } catch (err) {
        console.log(err);
    }
});

app.post("/transfer", async (req, res) => {
    try {
        const { transfer_money, transferor, receiver } = req.body;

        if (!(transfer_money && transferor && receiver)) {
            res.status(400).send("All input is require!!");
        }

        const findacct = await User.findOne({ acc_num: transferor });
        const findaccr = await User.findOne({ acc_num: receiver });
        if (!findacct) {
            return res.status(409).send("Invalid transferor accout number!");
        }

        if (!findaccr) {
            return res.status(409).send("Invalid receiver accout number!");
        }

        const choose_acct = { acc_num: transferor };
        const transfer = { $inc: { money: - transfer_money } }
        let doc = await User.findOneAndUpdate(choose_acct, transfer);
        doc.choose_acct;

        doc = await User.findOne(choose_acct);
        doc.money;


        const choose_accr = { acc_num: receiver };
        const receive = { $inc: { money: transfer_money } }
        doc = await User.findOneAndUpdate(choose_accr, receive);
        doc.choose_accr;


        doc = await User.findOne(choose_accr);
        doc.money;

        await Transaction.create({
            type: "Transfer",
            acc_num: transferor,
            transferor: findacct.first_name,
            receiver: findaccr.first_name,
            money: transfer_money,
            current: (findacct.money-transfer_money),
            date: (new Date()).toLocaleString()
          });
        

        await Transaction.create({
            type: "Receive",
            acc_num:receiver,
            transferor: findacct.first_name,
            receiver: findaccr.first_name,
            money: transfer_money,
            current: (findaccr.money+transfer_money),
            date: (new Date()).toLocaleString()
          });
          
        
        return res.status(200).json(findacct);

    } catch (err) {
        console.log(err);
    }
});

app.post("/transaction", async (req, res) => {

    const { acc_num} = req.body;
    const transhistory = await Transaction.find({ acc_num: acc_num, type: "Transfer" }).sort({ _id: -1 });
    
    const receivehistory = await Transaction.find({ acc_num: acc_num, type: "Receive" }).sort({ _id: -1 });

    return res.status(200).json({'transhistory' : transhistory , 'receivehistory' : receivehistory});

});



    module.exports = app;