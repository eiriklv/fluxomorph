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
  if (options.Actors && options.socket)
    this.registerSocketActors(options.socket, options.Actors);
}

Flux.prototype.registerStore = function(name, storeDefinition) {
  this.Stores[name] = Store(storeDefinition, this.context);
};

Flux.prototype.registerStores = function(storeDefinitions) {
  for (let store in storeDefinitions) {
    this.registerStore(store, storeDefinitions[store]);
  }
};

Flux.prototype.registerAction = function(name, actionCreator) {
  this.Actions[name] = actionCreator(this.context);
};

Flux.prototype.registerActions = function(actionCreators) {
  for (let creator in actionCreators) {
    this.registerAction(creator, actionCreators[creator]);
  }
};

Flux.prototype.registerSocketActor = function(socket, event, eventActor) {
  socket.on(event, eventActor(this.context));
};

Flux.prototype.registerSocketActors = function(socket, eventActorDefinitions) {
  for (let event in eventActorDefinitions) {
    this.registerSocketActor(socket, event, eventActorDefinitions[event], this.context);
  }
};

Flux.prototype.addToContext = function(name, obj) {
  this.context[name] = obj;
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

Flux.StateMixin = StateMixin;

module.exports = Flux;
