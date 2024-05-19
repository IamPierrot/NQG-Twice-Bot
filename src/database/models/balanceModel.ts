import mongoose from 'mongoose';

const balanceSchema = new mongoose.Schema({
     userId: String,
     money: {
          type: Number,
          default: 0
     }
});

const balanceModel = mongoose.model('balance', balanceSchema);

export = balanceModel;