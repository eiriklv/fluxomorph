'use strict';

const util = require('util');
const assign = require('object-assign');
const eventEmitter = require('events').EventEmitter;
const CHANGE_EVENT = require('./constants').CHANGE_EVENT;

util.inherits(Store, eventEmitter);

function Store(definition, context) {
  if (!(this instanceof Store))
    return new Store(definition, context);

  this.context = context || {};
  this.state = definition.getInitialState() || {};

  this.setState = definition.setState ?
    definition.setState.bind(this, this.emit.bind(this, CHANGE_EVENT)) :
    function(state) {
      this.state = assign(this.state, state);
      this.emit(CHANGE_EVENT);
    };

  this.replaceState = definition.replaceState ?
    definition.replaceState.bind(this, this.emit.bind(this, CHANGE_EVENT)) :
    function(state) {
      this.state = assign(Array.isArray(this.state) ? [] : {}, state);
      this.emit(CHANGE_EVENT);
    };

  this.getState = definition.getState ?
    definition.getState.bind(this, this.emit.bind(this, CHANGE_EVENT)) :
    function() {
      return assign(Array.isArray(this.state) ? [] : {}, this.state);
    };
};
module.exports = Store;
