const mongoose = require('mongoose');
const Listing = require('../models/listing');
const initData  = require('./data.js');
const { init } = require('../models/user');
main()
.then(() => console.log('Database connected'))
.catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/stayeasy');
    
}
const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map( (obj) => ({...obj, owner:"6951ee17fa1b62ec2bac248d"})); 

    await Listing.insertMany(initData.data);
}
initDB();