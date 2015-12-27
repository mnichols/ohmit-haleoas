'use strict';

import haleoas from 'haleoas'
import Promise from 'bluebird'
import stampit from 'stampit'


export default function resourceAdapterFactory(opts = {}) {

let hal = haleoas(opts)

return stampit()
.static({
    createResource({self,body}) {
        return this({
            self
            ,body
        })
    }
})
.init(function({instance,stamp}){
    //accepts a resource instance to wrap
    //or creates a new one
    let resource = this.resource || hal({
        self: this.self
        , body: this.body
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
        .map(resource => stamp({ resource}))
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


