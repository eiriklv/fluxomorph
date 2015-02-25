'use strict';

var assign = require('object-assign');
var socket = new(require('events').EventEmitter)();
var Flux = require('../lib');

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

var myOtherFlux = Flux({
  Stores: emptyStoreDefinitions
});

var emptyAppState = myOtherFlux.dehydrate();
console.log(emptyAppState);

myOtherFlux.rehydrate(filledAppState);

var rehydratedAppState = myOtherFlux.dehydrate();
console.log(rehydratedAppState);
