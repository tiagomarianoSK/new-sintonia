import 'jest'

import * as mongoose from 'mongoose'
import * as request from 'supertest'
import {environment} from '../common/environment'

let address: string = (<any>global).address
const auth: string = (<any>global).auth

test('get /clients', ()=>{
  return request(address)
         .get('/clients')
         .then(response=>{
           expect(response.status).toBe(200)
           expect(response.body.items).toBeInstanceOf(Array)
         })
         .catch(fail)
})

test('get /client/aaaaa - not found', ()=>{
  return request(address)
         .get('/clients/aaaaa')
         .then(response=>{
           expect(response.status).toBe(404)
         })
         .catch(fail)
})

/*
  Exemplo de como pode ser um post para restaurants
*/

test('post /clients', ()=>{
  return request(address)
            .post('/clients')
            .set('Authorization', auth)
            .send({
              name: 'Burger House',
              menu: [{name: "Coke", price: 5}]
            })
            .then(response=>{
              expect(response.status).toBe(200)
              expect(response.body._id).toBeDefined()
              expect(response.body.name).toBe('Burger House')
              expect(response.body.menu).toBeInstanceOf(Array)
              expect(response.body.menu).toHaveLength(1)
              expect(response.body.menu[0]).toMatchObject({name: "Coke", price: 5})
            })
            .catch(fail)
})