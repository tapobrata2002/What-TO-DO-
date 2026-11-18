
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            trim: true,
        },

        date: {
            type: String,
            default: "",
        },

        completed: {
            type: Boolean,
            default: false,
        },

        priorityLevel: {
            type: Number,
            default: 3,
        },

        pinned: {
            type: Boolean,
            default: false,
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },

        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Task", taskSchema);
