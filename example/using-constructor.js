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
  },
  Actors: {
    'some-socket-event': function(context, payload) {
      context.Actions.myAction(payload);
      // alternatively
      // context.Dispatcher.emit('MY_ACTION_EVENT', payload);
    },
    'some-other-socket-event': function(context, payload) {
      context.Actions.myOtherAction(payload);
      // alternatively
      // context.Dispatcher.emit('MY_OTHER_ACTION_EVENT', payload);
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
  console.log(myFlux.Stores.myStore.state);
});

let currentState = myFlux.Stores.myStore.state;
console.log(currentState);

myFlux.Actions.myAction({
  age: 50
});

myFlux.Actions.myAction({
  hello: 'goodbye'
})

myFlux.Actions.myOtherAction({
  name: 'Joe'
});

setTimeout(function() {
  socket.emit('some-socket-event', {
    waddoo: 'camoo',
    bing: 45
  });
}, 2000);

setTimeout(function() {
  socket.emit('some-other-socket-event', {
    crap: 'hello',
    woop: 60
  });
}, 3000);
