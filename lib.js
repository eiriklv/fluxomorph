'use strict';

const assign = require('object-assign');
const Store = require('./store');
const StateMixin = require('./state-mixin');

function Flux(options) {
  if (!(this instanceof Flux))
    return new Flux(options);

  options = options || {};
  this.Stores = {};
  this.Actions = {};

  this.context = {};
  this.context.Stores = this.Stores;
  this.context.Actions = this.Actions;

  if (options.Stores)
    this.registerStores(options.Stores);
  if (options.Actions)
    this.registerActions(options.Actions);
}

Flux.prototype.registerStore = function(name, storeDefinition) {
  this.Stores[name] = Flux.createStoreWithContext(storeDefinition, this.context);
};

Flux.prototype.registerAction = function(name, actionCreator) {
  this.Actions[name] = Flux.createActionWithContext(actionCreator, this.context);
};

Flux.prototype.registerStores = function(storeDefinitions) {
  for (let definition in storeDefinitions) {
    this.registerStore(definition, storeDefinitions[definition]);
  }
};

Flux.prototype.registerActions = function(actionCreators) {
  for (let creator in actionCreators) {
    this.registerAction(creator, actionCreators[creator]);
  }
};

Flux.prototype.dehydrate = function() {
  return Object.keys(this.Stores).reduce(function(appState, Store) {
    appState[Store] = this.Stores[Store].state;
    return appState;
  }, {});
};

Flux.prototype.rehydrate = function(appState) {
  for (let Store in this.Stores) {
    this.Stores[Store].replaceState(appState[Store] || {})
  }
};

Flux.prototype.addToContext = function(name, obj) {
  this.context[name] = obj;
};

Flux.createStoreWithContext = function(storeDefinition, context) {
  return Store(storeDefinition, context);
};

Flux.createActionWithContext = function(actionCreator, context) {
  return actionCreator(context);
};

Flux.StateMixin = StateMixin;

module.exports = Flux;
