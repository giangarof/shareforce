import dotenv from 'dotenv'
dotenv.config()
import mongoose from "mongoose";

const db_url = process.env.DB_URL || 'mongodb://localhost:27017/shareforce';

mongoose.connect(db_url)
    .then(() => console.log('connected with mongodb'))
    .catch((error) => console.error(error))

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"))
db.once('open', () => {
    console.log('Database connected')
});
export default {db}
// module.exports = db;