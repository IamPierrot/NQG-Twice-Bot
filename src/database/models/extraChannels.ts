import { Document, model, Schema } from 'mongoose';

export interface IextraChannelModel {
     guildId: string,
     chatChannelId: string[],
     voiceChannelId: string[]
}

const extraChannelSchema = new Schema<IextraChannelModel & Document>({
     guildId: String,
     chatChannelId: [String],
     voiceChannelId: [String],
})

const extraChannelModel = model("extraXpChannel", extraChannelSchema);

export default extraChannelModel;