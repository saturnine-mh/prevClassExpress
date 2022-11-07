const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://swaggernine:Football899@cluster0.a7z8gpc.mongodb.net/coinFlip?retryWrites=true&w=majority";
const dbName = "coinFlip";

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('results').find()
  .toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {CoinFlipResults: result})
  })
})

app.post('/results', (req, res) => {
//// all server side logic goes after the post and before it gets pushed to the actual collectio
/// userGuess is taken from the dom input via the requ.body method

  flipArray = ['heads', 'tails']
      flip = flipArray[Math.floor(Math.random() * flipArray.length)]
      if(flip == req.body.userGuess){
       winOrLose = 'You Won!'
      }
      else{
        winOrLose = ' You Lost!'
      }
    /// lines 37-44 is just logic flipping the coin randomly and then displaying an outcome based on the flpi result and comparing it to the userGuess input


  db.collection('results').insertOne({userGuess: req.body.userGuess, flipResult: flip, winOrLoss: winOrLose}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})
//// lines 33-39 api request to results collection in coinFlip database and stores all information inside the {} and uses req.body to pull information from the dom

app.put('/results', (req, res) => {
  db.collection('results')
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    $set: {
      thumbUp:req.body.thumbUp + 1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/results', (req, res) => {
  db.collection('results').findOneAndDelete({userGuess: req.body.userGuess, flipResult: flip, winOrLoss: winOrLose}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
