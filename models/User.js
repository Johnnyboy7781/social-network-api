const { Schema, model } = require('mongoose');
const { Thought } = require('./Thought');
const { db } = require('./Thought');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: 'Email already in use!',
            validate: {
                validator: function(email) {
                    return /^([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(email)
                },
                message: 'Not a valid email'
            }
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: "Thoughts"
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: this
            }
        ]
    },
    {
        toJSON: {
            virtuals: true
        },
        id: false
    }
)

UserSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

// UserSchema.pre('findOneAndDelete', function(next) {
//     console.log("Testing!");
//     console.log(this.getQuery());
//     db.collection('Thought').deleteMany({ username: this.getQuery().username })
//         .then(() => console.log('success!'));
//     next();
// })

const User = model('User', UserSchema);

module.exports = User;