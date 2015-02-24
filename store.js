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

  for (let handler in definition.handlers) {
    context.Dispatcher.on(
      handler,
      definition.handlers[handler].bind(this, context)
    );
  }
};

Store.prototype.setState = function(state) {
  this.state = assign(this.state, state);
  this.emit(CHANGE_EVENT);
};

Store.prototype.replaceState = function(state) {
  this.state = assign(Array.isArray(this.state) ? [] : {}, state);
  this.emit(CHANGE_EVENT);
};

module.exports = Store;
