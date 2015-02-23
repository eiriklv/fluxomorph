'use strict';

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
  hello: 'goodbye',
  age: 50
});
