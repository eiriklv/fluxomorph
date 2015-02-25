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

  this.setState = typeof definition.setState === 'function' ?
    definition.setState.bind(this, this.emit.bind(this, CHANGE_EVENT)) :
    function(state) {
      this.state = assign(this.state, state);
      this.emit(CHANGE_EVENT);
    };

  this.replaceState = typeof definition.replaceState === 'function' ?
    definition.replaceState.bind(this, this.emit.bind(this, CHANGE_EVENT)) :
    function(state) {
      this.state = assign(Array.isArray(this.state) ? [] : {}, state);
      this.emit(CHANGE_EVENT);
    };

  this.getState = typeof definition.getState === 'function' ?
    definition.getState.bind(this, this.emit.bind(this, CHANGE_EVENT)) :
    function() {
      return assign(Array.isArray(this.state) ? [] : {}, this.state);
    };

  for (let handler in definition.handlers) {
    context.Dispatcher.on(
      handler,
      definition.handlers[handler].bind(this, context)
    );
  }
};
module.exports = Store;
