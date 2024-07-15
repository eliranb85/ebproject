const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const port = 5000;

const mongoURI = 'mongodb+srv://eliranb:IWypJDxdRybtWwIO@clusterdata.qtdon88.mongodb.net/?retryWrites=true&w=majority&appName=ClusterData';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(cors());
app.use(bodyParser.json());

const followerSchema = new mongoose.Schema({
  count: Number,
  date: { type: Date, default: Date.now }
});

const Follower = mongoose.model('Follower', followerSchema);

app.post('/api/followers', async (req, res) => {
  try {
    const newFollower = new Follower(req.body);
    await newFollower.save();
    res.status(201).send(newFollower);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/followers', async (req, res) => {
  try {
    const followers = await Follower.find({});
    res.status(200).send(followers);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/api/scrape-followers', async (req, res) => {
  try {
    const url = 'https://www.instagram.com/eb_art_artist/';
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const followerCount = await page.evaluate(() => {
      const el = document.querySelector('span.xdj266r');
      return el ? el.innerText.replace(/,/g, '') : null;
    });

    await browser.close();

    if (followerCount) {
      const newFollower = new Follower({ count: parseInt(followerCount, 10) });
      await newFollower.save();
      res.status(201).send(newFollower);
      console.log(newFollower)
    } else {
      res.status(404).send({ message: 'Follower count not found' });
    }
  } catch (error) {
    console.error('Error scraping data:', error);
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
