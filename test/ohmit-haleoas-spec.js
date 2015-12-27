'use strict';


import test from 'blue-tape'
import haleoas from 'haleoas'
import fetchMock from 'fetch-mock'
import factory from '../src/ohmit-haleoas'
import 'isomorphic-fetch'

const getOrigin = () => {
    if(typeof window == 'undefined') {
        return 'http://example.com'
    }
    return (window && window.location && window.location.origin)
}
const origin = getOrigin()
test('creating a resource works',(assert) => {
    let adapter= factory().createResource({self:origin})
    assert.equal(adapter.self(),origin)
    assert.end()
})
test('GETting a resource works with params',(assert) => {
    let body = {
        _links: {
            self: { href: origin}
            , about: { href: `${origin}/about` }
        }
        , foo: 'bar'
    }
    fetchMock.mock(`${origin}?foo=bar`,'GET',{
        body
        , headers: {
            'content-type': 'application/hal+json'
            , 'content-length': JSON.stringify(body).length
        }
        , statusCode: 200
    })
    let adapter= factory({ fetch}).createResource({ self: `${origin}{?foo}`})
    return adapter.get({ params: { foo: 'bar'}})
    .then(adapter=>{
        assert.equal(adapter.self(),origin)
        assert.equal(adapter.resource().foo,'bar')
    })
})
test('following a relationship works', (assert)=> {
    let body = {
        "_links": {
            "self": { "href": origin },
            "about": { "href": `${origin}/about` }
        },
        "foo": "bar"
    }
    let adapter= factory({}).createResource({ body})
    return adapter.follow('about')
    .then(adapters=>{
        assert.equal(adapters.length,1)
        assert.equal(adapters[0].self(),`${origin}/about`)
    })

})
test('testing relations works',(assert) => {
    let body = {
        "_links": {
            "self": { "href": origin },
            "about": { "href": `${origin}/about` }
        },
        "foo": "bar"
    }
    let adapter= factory({}).createResource({ body})
    assert.false(adapter.hasRelation('aboot'))
    assert.true(adapter.hasRelation('about'))
    assert.end()
})

