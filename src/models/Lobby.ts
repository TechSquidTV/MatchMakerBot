import * as mongoose from 'mongoose'

let Schema = new mongoose.Schema({
  game: Object,
  when: Date,
  status: String
})

export default mongoose.model('Lobby', Schema)