'use strict';

import haleoas from 'haleoas'
import Promise from 'bluebird'
import stampit from 'stampit'


export default function resourceAdapterFactory(opts = {}) {

let {fetch} = opts
const resourceAdapter = stampit()
.static({
    createResource({self,body}) {
        return resourceAdapter({
            self
            ,body
            , fetch
        })
    }
})
.init(function(){
    //accepts a resource instance to wrap
    //or creates a new one
    let resource = this.resource || haleoas({
        self: this.self
        , body: this.body
        , fetch: this.fetch
    })
    this.hasRelation = function(rel) {
        return (resource.links(rel).length > 0)
    }
    this.resource = function() {
        return resource
    }
    this.self = function() {
        return resource.self
    }
    this.follow = function(rel) {
        return Promise.all(resource.follow(rel))
        .map(resource => resourceAdapter({ resource}))
    }
    this.get = function(args) {
        return resource.get((args && args.params) || {})
        .then(result=>{
            ({resource} = result)
            return this
        })
    }
    ;(delete this.fetch)
    ;(delete this.body)

})

return resourceAdapter

}


