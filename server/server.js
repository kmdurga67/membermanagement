const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect('mongodb+srv://durga:durga@cluster0.cuthn4x.mongodb.net/members', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

const memberSchema = new mongoose.Schema({
  memberId: String,
  memberName: String,
  memberAddress: String,
  joiningDate: Date,
  memberType: String,
  renewalDate: Date,
});

const Member = mongoose.model('Member', memberSchema);

app.post('/members', async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(201).send('Member created successfully');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get('/members', async (req, res) => {
  try {
    const members = await Member.find();
    res.status(200).json(members);
  } catch (err) {
    res.status(500).send('Error retrieving members: ' + err.message);
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
