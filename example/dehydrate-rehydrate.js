'use strict';

const assign = require('object-assign');
const socket = new(require('events').EventEmitter)();
const Flux = require('../lib');

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

const myFlux = Flux({
  Stores: filledStoreDefinitions
});

let filledAppState = myFlux.dehydrate();
console.log(filledAppState);

const myOtherFlux = Flux({
  Stores: emptyStoreDefinitions
});

let emptyAppState = myOtherFlux.dehydrate();
console.log(emptyAppState);

myOtherFlux.rehydrate(filledAppState);

let rehydratedAppState = myOtherFlux.dehydrate();
console.log(rehydratedAppState);
