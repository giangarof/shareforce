import mongoose from 'mongoose';
import passportMongoose from 'passport-local-mongoose';
// import Schema from mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

userSchema.plugin(passportMongoose);

const User = mongoose.model('User', userSchema);

export default User

