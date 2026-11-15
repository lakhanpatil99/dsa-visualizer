import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  username: {
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  displayName: {
    type: String,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    index: true
  },
  password: {
    type: String,
    required: false // Optional for Firebase OAuth users
  },
  photoURL: {
    type: String,
    default: ''
  },
  providerId: {
    type: String,
    default: 'password'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  accountStatus: {
    type: String,
    enum: ['active', 'pending', 'suspended'],
    default: 'active'
  },
  onboardingStatus: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'completed'
  },
  legacyUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastLoginAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Prevent sensitive fields from being serialized
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

// Export the model, reusing existing compilation if present
export default mongoose.models.User || mongoose.model('User', UserSchema);
