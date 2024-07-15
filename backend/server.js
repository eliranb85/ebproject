const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

const mongoURI = 'mongodb+srv://eliranb:IWypJDxdRybtWwIO@clusterdata.qtdon88.mongodb.net/?retryWrites=true&w=majority&appName=ClusterData';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(cors());
app.use(bodyParser.json());
const followerSchema = new mongoose.Schema({
  username:String,
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

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  firstname: String,
  lastname: String,
  role: String,
  termsok: Boolean,
});

const User = mongoose.model('User', userSchema);

app.post('/api/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.status(200).send({
        message: 'User found',
        user: {
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role
        }
      });
    } else {
      res.status(404).send({ message: 'No user exists' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

const taskSchema = new mongoose.Schema({
  name: String,
  priority: String,
  description: String,
  dateCreated: { type: Date, default: Date.now },
  status: { type: String, default: 'in process' }
});

const Task = mongoose.model('Task', taskSchema);

app.post('/api/tasks', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).send(newTask);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(updatedTask);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete('/api/tasks', async (req, res) => {
  try {
    await Task.deleteMany({});
    res.status(200).send({ message: 'All tasks deleted' });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
