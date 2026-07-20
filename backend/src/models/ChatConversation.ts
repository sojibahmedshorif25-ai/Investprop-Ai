import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  propertyContext?: mongoose.Types.ObjectId;
}

export interface IChatConversation extends Document {
  user: mongoose.Types.ObjectId;
  messages: IMessage[];
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    propertyContext: { type: Schema.Types.ObjectId, ref: 'Property' },
  },
  { _id: false }
);

const chatConversationSchema = new Schema<IChatConversation>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [messageSchema],
    title: { type: String, default: 'New Chat' },
  },
  { timestamps: true }
);

chatConversationSchema.index({ user: 1, updatedAt: -1 });

export const ChatConversation = mongoose.model<IChatConversation>(
  'ChatConversation',
  chatConversationSchema
);
