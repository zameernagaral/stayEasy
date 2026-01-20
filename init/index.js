const mongoose = require('mongoose');
const Listing = require('../models/listing');
const initData  = require('./data.js');
const { init } = require('../models/user');
main()
.then(() => console.log('Database connected'))
.catch(err => console.log(err));
async function main() {
    await mongoose.connect("mongodb+srv://Stayeasy:OOVaD55psuy95nsc@cluster0.nlymnm0.mongodb.net/?appName=Cluster0");
    
}
const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map( (obj) => ({...obj, owner:"696e6caa547bc8cbe74c82a9"})); 

    await Listing.insertMany(initData.data);
}
initDB();