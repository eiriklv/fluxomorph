'use strict';

var assign = require('object-assign');
var socket = new(require('events').EventEmitter)();
var Flux = require('../lib');
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

myFlux.registerAction('myAction', function(context, payload, done) {
  context.Dispatcher.emit('MY_ACTION_EVENT', payload);
});

myFlux.registerAction('myOtherAction', function(context, payload, done) {
  context.Dispatcher.emit('MY_OTHER_ACTION_EVENT', payload);
});

myFlux.registerSocketActor(socket, 'some-event', function(context, payload) {
  context.Actions.myAction(payload);
  // alternatively
  // context.Dispatcher.emit('MY_ACTION_EVENT', payload);
});

myFlux.registerSocketActor(socket, 'some-other-event', function(context, payload) {
  context.Actions.myOtherAction(payload);
  // alternatively
  // context.Dispatcher.emit('MY_OTHER_ACTION_EVENT', payload);
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

var currentState = myFlux.Stores.myStore.getState();
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
