const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase : true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    dateOfGrad: {
        type: String,
        required: true
    },
    github: {
        type: String,
        required: true,
        match: [/^(https:\/\/github\.com\/)([a-zA-Z0-9-]+)\/([a-zA-Z0-9_.-]+)(\/)?$/, 'Invalid URL']
    },
    website: {
        type: String,
        required: true,
        match: [/^(https?:\/\/)([a-zA-Z0-9-]+\.?)+([a-zA-Z]{2,})(\/[^\s]*)?$/, 'Invalid URL']
    },
    bio: {
        type: String,
        default: null
    },
    profilePic: {
        type: String,
        default: null
    },
    fieldOfInterest: {
        type: [String],
        default: []
    },
    seeking: {
        type: [String],
        default: []
    },
    techStack: {
        type: [String],
        default: []
    },
    createdAt: { 
        type: String,
        default: new Date().toLocaleString()
    },
    updateAt: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('Student', studentSchema)