import mongoose from 'mongoose';

const dailySchema = new mongoose.Schema({
     userId: String,
     streaks: {
          type: Number,
          default: 0
     },
     cooldowns: {
          type: Number,
          default: 0
     }
});

const dailyModel = mongoose.model('daily', dailySchema);

export = dailyModel;