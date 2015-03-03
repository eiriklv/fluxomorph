Fluxomorph
==============

[![Build Status](https://travis-ci.org/eiriklv/fluxomorph.svg?branch=master)](https://travis-ci.org/eiriklv/fluxomorph)
[![npm version](https://badge.fury.io/js/fluxomorph.svg)](http://badge.fury.io/js/fluxomorph)
[![Dependency Status](https://david-dm.org/eiriklv/fluxomorph.svg)](https://david-dm.org/eiriklv/fluxomorph)
[![devDependency Status](https://david-dm.org/eiriklv/fluxomorph/dev-status.svg)](https://david-dm.org/eiriklv/fluxomorph#info=devDependencies)

#### Introduction:
Minimal Isomorphic Flux Implementation. Still WIP.

#### Install:
`npm install fluxomorph --save`

#### Usage:

* Create a flux instance with actions and stores using only the constructor.

```javascript
var Flux = require('fluxomorph');

var myFlux = Flux({
  Stores: {
    myStore: {
      getInitialState: function() {
        return {
          hello: 'world',
          age: 28
        };
      },
      handlers: {
        'MY_ACTION_EVENT': function(context, payload) {
          this.setState(payload);
        },
        'MY_OTHER_ACTION_EVENT': function(context, payload) {
          this.replaceState(payload);
        }
      }
    }
  },
  Actions: {
    myAction: function(context, payload, done) {
      context.Dispatcher.emit('MY_ACTION_EVENT', payload);
    },
    myOtherAction: function(context, payload, done) {
      context.Dispatcher.emit('MY_OTHER_ACTION_EVENT', payload);
    }
  }
});
```

* Create a flux instance with actions and stores using the constructor and `register` methods.

```javascript
var Flux = require('fluxomorph');

var myFlux = Flux();

myFlux.registerStore('myStore', {
  getInitialState: function() {
    return {
      hello: 'world',
      age: 28
    };
  },
  handlers: {
    'MY_ACTION_EVENT': function(context, payload) {
      this.setState(payload);
    },
    'MY_OTHER_ACTION_EVENT': function(context, payload) {
      this.replaceState(payload);
    }
  }
});

myFlux.registerAction('myAction', function(context, payload, done) {
  context.Dispatcher.emit('MY_ACTION_EVENT', payload);
});

myFlux.registerAction('myOtherAction', function(context, payload, done) {
  context.Dispatcher.emit('MY_OTHER_ACTION_EVENT', payload);
});
```

* Using custom `setState`, `replaceState` and `getState` methods for stores. This enables you to use your favorite immutable data structures.

```javascript
var Flux = require('fluxomorph');

var myFlux = Flux();

myFlux.registerStore('myStore', {
  getInitialState: function() {
    return {
      hello: 'world',
      age: 28
    };
  },
  setState: function(emitUpdate, newState) {
    this.state = assign(this.state, newState);
    emitUpdate();
  },
  replaceState: function(emitUpdate, newState) {
    this.state = assign({}, newState);
    emitUpdate();
  },
  getState: function() {
    return assign(Array.isArray(this.state) ? [] : {}, this.state);
  },
  handlers: {
    'MY_ACTION_EVENT': function(context, payload) {
      this.setState(payload);
    },
    'MY_OTHER_ACTION_EVENT': function(context, payload) {
      this.replaceState(payload);
    }
  }
});
```

* Adding stuff to the context, making it available to the actions.

```javascript
var Flux = require('fluxomorph');

var myFlux = Flux();

myFlux.registerStore('myStore', {
  getInitialState: function() {
    return {
      hello: 'world',
      age: 28
    };
  },
  setState: function(emitUpdate, newState) {
    this.state = assign(this.state, newState);
    emitUpdate();
  },
  replaceState: function(emitUpdate, newState) {
    this.state = assign({}, newState);
    emitUpdate();
  },
  getState: function() {
    return assign(Array.isArray(this.state) ? [] : {}, this.state);
  },
  handlers: {
    'MY_ACTION_EVENT': function(context, payload) {
      this.setState(payload);
    },
    'MY_OTHER_ACTION_EVENT': function(context, payload) {
      this.replaceState(payload);
    }
  }
});

myFlux.addToContext('api', {
  signIn: function() {}
});

myFlux.addToContext('router', {
  redirect: function() {}
});

// inside action handlers you now have context.api and context.router
```

* Listening for updates in stores

```javascript
myFlux.Stores.myStore.on('change', function() {
  console.log('updated state:', myFlux.Stores.myStore.getState());
});

var currentState = myFlux.Stores.myStore.getState();
console.log('initial state:', currentState);

myFlux.Actions.myAction({
  age: 50
});
```

* Dehydration / rehydration (pull all state out of the stores in your instance for serialization / initialization)

```javascript
var Flux = require('fluxomorph');

var filledStoreDefinitions = {
  myStore: {
    getInitialState: function() {
      return {
        hello: 'world',
        age: 28
      };
    }
  },
  myOtherStore: {
    getInitialState: function() {
      return [
        'hello',
        'goodbye'
      ];
    }
  }
};

var emptyStoreDefinitions = {
  myStore: {
    getInitialState: function() {
      return {};
    }
  },
  myOtherStore: {
    getInitialState: function() {
      return [];
    }
  }
};

var myFlux = Flux({
  Stores: filledStoreDefinitions
});

var filledAppState = myFlux.dehydrate();
console.log(filledAppState);
/*
{
  myStore: {
    hello: 'world',
    age: 28
  },
  myOtherStore: [
    'hello',
    goodbye
  ]
}
*/

var myOtherFlux = Flux({
  Stores: emptyStoreDefinitions
});

var emptyAppState = myOtherFlux.dehydrate();
console.log(emptyAppState);
/*
{
  myStore: {},
  myOtherStore: []
}
*/

myOtherFlux.rehydrate(filledAppState);

var rehydratedAppState = myOtherFlux.dehydrate();
console.log(rehydratedAppState);
/*
{
  myStore: {
    hello: 'world',
    age: 28
  },
  myOtherStore: [
    'hello',
    goodbye
  ]
}
*/
```

* Attach handlers to eventEmitters/sockets (wip - there is still some work to be done here to have proper cleanup)

```javascript
// socket in this case might be a socket.io/ws connection or just an any event emitter
// following the eventEmitter.on('eventName', function handler() {...}) pattern

myFlux.registerSocketActor(socket, 'some-event', function(context, payload) {
  // call an action
  context.Actions.myAction(payload);
  // or alternatively dispatch a message to a store directly
  // context.Dispatcher.emit('MY_ACTION_EVENT', payload);
});

myFlux.registerSocketActor(socket, 'some-other-event', function(context, payload) {
  // call an action
  context.Actions.myOtherAction(payload);
  // or alternatively dispatch a message to a store directly
  // context.Dispatcher.emit('MY_OTHER_ACTION_EVENT', payload);
});
```
