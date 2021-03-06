'use strict';

var CHANGE_EVENT = require('./constants').CHANGE_EVENT;

module.exports = function(fluxPropName) {
  return {
    __updateState: function(Store) {
      var state = {};
      state[Store] = this.props[fluxPropName].Stores[Store].getState();
      this.setState(state);
    },

    componentWillMount: function() {
      for (var Store in this.props[fluxPropName].Stores) {
        this.props[fluxPropName].Stores[Store].on(CHANGE_EVENT, this.__updateState.bind(this, Store));
      }
    },

    componentWillUnmount: function() {
      for (var Store in this.props.Stores) {
        this.props[fluxPropName].Stores[Store].removeListener(CHANGE_EVENT, this.__updateState);
      }
    },

    getInitialState: function() {
      return Object.keys(this.props[fluxPropName].Stores).reduce(function(initialState, Store) {
        initialState[Store] = this.props[fluxPropName].Stores[Store].getState();
        return initialState;
      }.bind(this), {});
    }
  }
};
