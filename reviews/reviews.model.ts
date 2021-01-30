import * as mongoose from 'mongoose'

import {User} from '../users/users.model'
import {Client} from '../client/client.models'

export interface Review extends mongoose.Document {
  date: Date,
  rating: number,
  comments: string,
  user: mongoose.Types.ObjectId | User,
  client: mongoose.Types.ObjectId | Client
}

const reviewSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comments: {
    type: String,
    required: true,
    maxlength: 500
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  }
})


export const Review = mongoose.model<Review>('Review', reviewSchema)