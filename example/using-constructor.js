'use strict';

const socket = new(require('events').EventEmitter)();
const Flux = require('../lib');

const myFlux = Flux({
  Stores: {
    myStore: {
      getInitialState: function() {
        return {
          hello: 'world',
          age: 28
        };
      }
    }
  },
  Actions: {
    myAction: function(context, payload, done) {
      context.Stores.myStore.setState(payload);
    },
    myOtherAction: function(context, payload, done) {
      context.Stores.myStore.replaceState(payload);
    }
  },
  Actors: {
    'some-event': function(context, payload) {
      context.Actions.myAction(payload);
    },
    'some-other-event': function(context, payload) {
      context.Actions.myOtherAction(payload);
    }
  },
  socket: socket
});

myFlux.addToContext('api', {
  signIn: function() {}
});

myFlux.addToContext('router', {
  redirect: function() {}
});

myFlux.Stores.myStore.on('change', function() {
  console.log('updated!');
  console.log(myFlux.Stores.myStore.getState());
});

let currentState = myFlux.Stores.myStore.getState();
console.log(currentState);

myFlux.Actions.myAction({
  age: 50
});

myFlux.Actions.myAction({
  hello: 'goodbye'
});

myFlux.Actions.myOtherAction({
  name: 'Joe'
});

setTimeout(function() {
  socket.emit('some-event', {
    waddoo: 'camoo',
    bing: 45
  });
}, 2000);

setTimeout(function() {
  socket.emit('some-other-event', {
    crap: 'hello',
    woop: 60
  });
}, 3000);
