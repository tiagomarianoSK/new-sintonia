import* as mongoose from 'mongoose'

export interface AdvertsItem extends mongoose.Document {
  name: String,
  price: number
}

export interface Client extends mongoose.Document {
  name: String,
  adverts: AdvertsItem[]
}

const advertsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  adverts: {
    type: [advertsSchema],
    required: false,
    select: false,
    default: []
  }
})

export const Client = mongoose.model<Client>('Client', clientSchema)