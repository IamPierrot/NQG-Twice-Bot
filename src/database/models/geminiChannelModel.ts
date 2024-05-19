import { Document, model, Schema } from 'mongoose';

export interface IGeminiChannelModel {
    userId: string
    guildId: string,
    AIChannel: {
        id: string
        expired: number
    }[],
}

const extraChannelSchema = new Schema<IGeminiChannelModel & Document>({
    userId: String,
    guildId: String,
    AIChannel: [{
        id: String,
        expired: Number
    }],
})

const geminiChannelModel = model("geminiChannel", extraChannelSchema);

export default geminiChannelModel;