import mongoose, { Schema, model } from 'mongoose';


export interface WhiteListInterface {
    userId: string
    limitation: number
    current: number
}

const whiteListSchema = new Schema<WhiteListInterface & mongoose.Document>({
    userId: String,

    current: Number,
    limitation: {
        type: Number,
        default: 1,
    }
})

const whiteListModel = model('whitelist', whiteListSchema);

export default whiteListModel;