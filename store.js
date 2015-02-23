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
};

Store.prototype.setState = function(state) {
  this.state = assign(this.state, state);
  this.emit(CHANGE_EVENT);
};

Store.prototype.replaceState = function(state) {
  let assignee = Array.isArray(this.state) ? [] : {};
  this.state = assign(assignee, state);
  this.emit(CHANGE_EVENT);
};

module.exports = Store;
