# Ohmit-Haleoas

Connecting via haleoas with ohmit.

## Usage

```js

import ohmit from ‘ohmit’
import ohmitHaleoas from ‘ohmit-haleoas’

let resourceFactory = ohmitHaleoas({ fetch: myFetchImplementation })
let ohm = ohmit({ resourceFactory })
let q = {
    _root: ‘http://my.api.com’
    , about: ‘/about’
}
ohm.execute(q).then({ results} => {
    results.about[0].self() == ‘http://my.api.com/about’ // true
})
```
