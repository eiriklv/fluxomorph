'use strict';

var util = require('util');
var assign = require('object-assign');
var eventEmitter = require('events').EventEmitter;
var CHANGE_EVENT = require('./constants').CHANGE_EVENT;

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

  Object.keys(definition.handlers || {}).forEach(function(handler) {
    context.Dispatcher.on(
      handler,
      definition.handlers[handler].bind(this, context)
    );
  }.bind(this));
};
module.exports = Store;
