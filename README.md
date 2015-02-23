Fluxomorph
==============

[![Build Status](https://travis-ci.org/eiriklv/fluxomorph.svg?branch=master)](https://travis-ci.org/eiriklv/fluxomorph)
[![npm version](https://badge.fury.io/js/fluxomorph.svg)](http://badge.fury.io/js/fluxomorph)
[![Dependency Status](https://david-dm.org/eiriklv/fluxomorph.svg)](https://david-dm.org/eiriklv/fluxomorph)
[![devDependency Status](https://david-dm.org/eiriklv/fluxomorph/dev-status.svg)](https://david-dm.org/eiriklv/fluxomorph#info=devDependencies)

#### Introduction:
Minimal Isomorphic Flux Implementation.

WIP

---------------------------------------

### constructor()

Create a flux instance.

__Arguments__

* `options`
 * `Stores` - Store definitions object
 * `Actions` - Action definitions object

__Example__

```js
const Flux = require('fluxomorph');

// use the constructor directly

const flux = Flux({...}); // use store and action definition objects { Stores: {...}, Actions: {...} }

// or call register-function on the instance

const flux = Flux();

flux.registerStore({...});
flux.registerStores({...});
flux.registerAction({...});
flux.registerActions({...});

// add stuff to the context

flux.addToContext({...});

const Stores = flux.Stores;
const Actions = flux.Actions;
const context = flux.context;      // context.Stores, context.Actions...

// dehydration / rehydration

let appState = flux.dehydrate(); // (fetches state from all stores)
flux.rehydrate(appState);        // replaces all store state with the one in appState
```
