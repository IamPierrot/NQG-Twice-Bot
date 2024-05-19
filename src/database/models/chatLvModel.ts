import { Schema, model } from 'mongoose';

const chatLevelSchema = new Schema({
     userId: String,
     level: {
          type: Number,
          default: 1
     },
     xp: {
          type: Number,
          default: 0
     },
     nextLevel: {
          type: Number,
          default: 500
     },
     totalText: {
          type: Number,
          default: 0
     }
})

const chatLevelModel = model('chatLevel', chatLevelSchema);

export = chatLevelModel;