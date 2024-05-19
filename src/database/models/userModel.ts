import { Schema, model } from 'mongoose';

const userSchema = new Schema({
     userId: String,
     banned: {
          isBanned: { type: Boolean, default: false },
          reason: String
     },
     limited: {
          isLimited: { type: Boolean, default: false },
          reason: String,
          listLimited: []
     }

})
const userModel = model('user', userSchema);

export = userModel;