import mongoose from 'mongoose';

const voiceLevelSchema = new mongoose.Schema({
     userId: String,
     level: {
          type: Number,
          default: 1
     },
     xp: {
          type: Number,
          default: 0
     },
     nextLevel: { type: Number, default: 500 },
     totalTime: {
          type: Number,
          default: 0
     },
});

const voiceLevelModel = mongoose.model("voiceLevel", voiceLevelSchema);

export = voiceLevelModel;