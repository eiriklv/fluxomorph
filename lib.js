'use strict';

var assign = require('object-assign');
var Store = require('./store');
var StateMixin = require('./state-mixin');
var eventEmitter = require('events').EventEmitter;

function Flux(options) {
  if (!(this instanceof Flux))
    return new Flux(options);

  options = options || {};
  this.Stores = {};
  this.Actions = {};
  this.Dispatcher = new eventEmitter();

  this.context = {};
  this.context.Stores = this.Stores;
  this.context.Actions = this.Actions;
  this.context.Dispatcher = this.Dispatcher;
  this.context.shouldUpdate = true;

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
  Object.keys(storeDefinitions).forEach(function(store) {
    this.registerStore(store, storeDefinitions[store]);
  }.bind(this));
};

Flux.prototype.registerAction = function(name, actionCreator) {
  this.Actions[name] = actionCreator.bind(null, this.context);
};

Flux.prototype.registerActions = function(actionCreators) {
  Object.keys(actionCreators).forEach(function(creator) {
    this.registerAction(creator, actionCreators[creator]);
  }.bind(this));
};

Flux.prototype.registerSocketActor = function(socket, event, eventActor) {
  socket.on(event, eventActor.bind(null, this.context));
};

Flux.prototype.registerSocketActors = function(socket, eventActorDefinitions) {
  Object.keys(eventActorDefinitions).forEach(function(event) {
    this.registerSocketActor(socket, event, eventActorDefinitions[event]);
  }.bind(this));
};

Flux.prototype.getContext = function() {
  return this.context;
};

Flux.prototype.addToContext = function(name, obj) {
  this.context[name] = obj;
};

Flux.prototype.dehydrate = function() {
  return Object.keys(this.Stores).reduce(function(appState, Store) {
    appState[Store] = this.Stores[Store].getState();
    return appState;
  }.bind(this), {});
};

Flux.prototype.rehydrate = function(appState) {
  Object.keys(this.Stores).forEach(function(Store) {
    this.Stores[Store].replaceState(appState[Store])
  }.bind(this));
};

Flux.prototype.enableUpdates = function(cond) {
  this.context.shouldUpdate = !!cond;
};

Flux.StateMixin = StateMixin;

module.exports = Flux;
