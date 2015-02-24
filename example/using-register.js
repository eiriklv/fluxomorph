'use strict';

const socket = new (require('events').EventEmitter)();
const Flux = require('../lib');
const myFlux = Flux();

myFlux.registerStore('myStore', {
  getInitialState: function() {
    return {
      hello: 'world',
      age: 28
    };
  }
});

myFlux.registerAction('myAction', function(context) {
  return function(payload, done) {
    console.log(context);
    context.Stores.myStore.setState(payload);
  };
});

myFlux.registerAction('myOtherAction', function(context) {
  return function(payload, done) {
    console.log(context);
    context.Stores.myStore.replaceState(payload);
  };
});

myFlux.registerSocketActor(socket, 'some-event', function(context) {
  return function(payload) {
    context.Actions.myAction(payload);
  };
});

myFlux.registerSocketActor(socket, 'some-other-event', function(context) {
  return function(payload) {
    context.Actions.myOtherAction(payload);
  };
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
