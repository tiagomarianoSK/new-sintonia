import {ModelRouter} from '../common/model-router'
import * as restify from 'restify'
import {NotFoundError} from 'restify-errors'
import {Client} from './client.models'
import {authorize} from '../security/authz.handler'


class ClientRouter extends ModelRouter<Client> {
  constructor(){
    super(Client)
  }

  envelope(document){
    let resource = super.envelope(document)
    resource._links.menu = `${this.basePath}/${resource._id}/adverts`
    return resource
  }

  findAdverts = (req, resp, next) => {
    Client.findById(req.params.id, "+adverts")
    .then(rest =>{
      if(!rest){
        throw new NotFoundError('Client not found')
      }else{
        resp.json(rest.adverts)
        return next()
      }
    }).catch(next)
  }

  replaceAdverts = (req, resp, next) => {
    Client.findById(req.params.id).then(rest=>{
      if(!rest){
        throw new NotFoundError('Client not found')
      }else{
        rest.adverts = req.body //Array de Anuncios
        return rest.save()
      }
    }).then(rest=>{
      resp.json(rest.adverts)
      return next()
    }).catch(next)
  }

  applyRoutes(application: restify.Server){
    application.get(`${this.basePath}`, this.findAll)
    application.get(`${this.basePath}/:id`, [this.validateId, this.findById])
    application.post(`${this.basePath}`, [authorize('admin'),this.save])
    application.put(`${this.basePath}/:id`, [authorize('admin'),this.validateId,this.replace])
    application.patch(`${this.basePath}/:id`, [authorize('admin'),this.validateId,this.update])
    application.del(`${this.basePath}/:id`, [authorize('admin'),this.validateId,this.delete])

    application.get(`${this.basePath}/:id/menu`, [this.validateId, this.findAdverts])
    application.put(`${this.basePath}/:id/menu`, [authorize('admin'),this.validateId, this.replaceAdverts])
  }
}

export const clientRouter = new ClientRouter()