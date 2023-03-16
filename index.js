const express = require('express');
const app = express();
const PORT = process.env.PORT || 4444;

require('dotenv').config()

//MIDDLEWARE
const cors = require('cors');
const { urlencoded, json } = require('body-parser');
app.use(cors())
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(express.static(__dirname+'/public'));
//DATABASE FIRST TOUCH
const createTable = require('./database/FirstTouched');

const db = require('./database/connection');

db.query('SELECT * FROM url', (err, result) => {
    if (!err) {
        return;
    } else {
        createTable(db)
    }
})


//helper
function alphanumeric_unique() {
    return Math.random().toString(36).split('').filter(function (value, index, self) {
        return self.indexOf(value) === index;
    }).join('').substr(2, 8);
}


//router

app.get('/', (req, res) => {
    return res.sendFile('/index.html');
})

app.get('/error', (req, res) => res.send('<h1 style="color:red">An unknow error</h1>'))

app.post('/create', (req, res) => {
    const url = req.body.url;

    if (!url) {
        return res.status(400).json({
            success: false,
            message: "Bad request"
        });
    }

    let urlID = alphanumeric_unique();

    //save to database
    try {
        db.query(`INSERT INTO url (urlID, url) VALUES ('${urlID}', '${url}')`)
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'An internal error'
        })
        return;
    }

    res.status(200).json({
        success: true,
        message: 'Saved url',
        urlID
    })

})

app.get('/:urlID', async (req, res) => {
    const urlID = req.params.urlID;

    if (!urlID) {
        return res.redirect('/')
    }
    try {
        db.query(`SELECT url FROM url WHERE urlID = '${urlID}'`, (err, result) => {
            if (!err) {
                
                if (result.rows.length > 0) {
                    return res.redirect(result.rows[0].url)
                } else {
                    return res.redirect('/')
                }
            } else {
                console.log(err)
                return redirect('/error');
            }
        })
    } catch (e) {
        console.log(e);
        return res.redirect('/error');
    }
})

app.listen(PORT, () => console.log("App is running at port:", PORT));