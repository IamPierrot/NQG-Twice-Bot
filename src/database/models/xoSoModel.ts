import mongoose from 'mongoose'

const xoSoSchema = new mongoose.Schema({
    userId: [String], 
    giaiDB: {
        type: String,
        default: 0
    },
    giaiNhat: {
        type: String,
        default: 0
    },
    giaiNhi: {
        type: String,
        default: 0
    },
    giaiBa: {
        type: String,
        default: 0
    },
    giaiKK: {
        type: String,
        default: 0
    },

})

const xoSoModel = mongoose.model('xoso', xoSoSchema)

export = xoSoModel