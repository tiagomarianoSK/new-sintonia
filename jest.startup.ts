import * as jestCli from 'jest-cli'

import {Server} from './server/server'
import {environment} from './common/environment'
import {usersRouter} from './users/users.router'
import {reviewsRouter} from './reviews/reviews.router'
import {clientRouter} from './client/client.router'
import {User} from './users/users.model'
import {Review} from './reviews/reviews.model'
import {Client} from './client/client.models'

let server: Server
const beforeAllTests = ()=>{
  environment.db.url = process.env.DB_URL || 'mongodb://localhost/radio-api'
  environment.server.port = process.env.SERVER_PORT || 3001
  server = new Server()
  return server.bootstrap([
    usersRouter,
    reviewsRouter,
    clientRouter
  ])
  .then(()=>User.remove({}).exec())
  .then(()=>{
    let admin = new User()
    admin.name = 'admin'
    admin.email = 'admin@email.com'
    admin.password = '1234567'
    admin.profiles = ['admin', 'user']
    return admin.save()
  })
  .then(()=>Review.remove({}).exec())
  .then(()=>Client.remove({}).exec())
}

const afterAllTests = ()=>{
  return server.shutdown()
}

beforeAllTests()
.then(()=>jestCli.run())
.then(()=>afterAllTests())
.catch(console.error)