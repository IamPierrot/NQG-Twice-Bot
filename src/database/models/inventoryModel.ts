import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
     userId: String,
     guildId: String,
     items: {
          /// Tet Inventory !
          "101": { type: Number, default: 0 },
          "102": { type: Number, default: 0 },
          "103": { type: Number, default: 0 },
          "104": { type: Number, default: 0 },
          "105": { type: Number, default: 0 },
          "106": { type: Number, default: 0 },
          ///////////////////
          Id: {
               amount: Number,
               quality: String
          }
     }

});

const inventoryModel = mongoose.model('inventory', inventorySchema);

export = inventoryModel;