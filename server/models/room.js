const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    origin: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false,
        default: null
    },
    time: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

const roomSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    bgColor: {
        type: String,
        required: false,
    },
    messages: [messageSchema],
    key: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "live"
    }
});

const Room = mongoose.model('rooms', roomSchema);

module.exports = Room;
