var Flux = require('./lib');
var eventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

exports['initialization'] = {
  'should have context with actions and stores (constructor)': function(test) {
    test.expect(8);

    var flux = Flux({
      Stores: {
        myStore: {
          getInitialState: function() {
            return {
              hello: 'world',
              age: 28
            };
          },
          handlers: {
            'MY_ACTION_EVENT': function(context, payload) {
              this.setState(payload);
            },
            'MY_OTHER_ACTION_EVENT': function(context, payload) {
              this.replaceState(payload);
            }
          }
        }
      },
      Actions: {
        myAction: function(context, payload, done) {
          context.Dispatcher.emit('MY_ACTION_EVENT', payload);
        },
        myOtherAction: function(context, payload, done) {
          context.Dispatcher.emit('MY_OTHER_ACTION_EVENT', payload);
        }
      }
    });

    var api = {
      signIn: function() {}
    };

    var router = {
      redirect: function() {}
    };

    flux.addToContext('api', api);
    flux.addToContext('router', router);

    test.strictEqual(typeof flux.context, 'object', 'should contain context');
    test.strictEqual(typeof flux.context.Stores, 'object', 'should contain context Stores');
    test.strictEqual(typeof flux.context.Actions, 'object', 'should contain context Actions');
    test.strictEqual(typeof flux.context.Actions.myAction, 'function', 'should contain context specific action (1)');
    test.strictEqual(typeof flux.context.Actions.myOtherAction, 'function', 'should contain context specific action (2)');
    test.strictEqual(typeof flux.context.Actions.myNonExistingAction, 'undefined', 'should not contain anything else (2)');
    test.strictEqual(flux.context.api, api, 'should contain stuff added to context');
    test.strictEqual(flux.context.router, router, 'should contain stuff added to context');

    test.done();
  },
  'should have context with actions and stores (register)': function(test) {
    test.expect(8);

    var flux = Flux();

    flux.registerStore('myStore', {
      getInitialState: function() {
        return {
          hello: 'world',
          age: 28
        };
      },
      handlers: {
        'MY_ACTION_EVENT': function(context, payload) {
          this.setState(payload);
        },
        'MY_OTHER_ACTION_EVENT': function(context, payload) {
          this.replaceState(payload);
        }
      }
    });

    flux.registerAction('myAction', function(context, payload, done) {
      context.Dispatcher.emit('MY_ACTION_EVENT', payload);
    });

    flux.registerAction('myOtherAction', function(context, payload, done) {
      context.Dispatcher.emit('MY_OTHER_ACTION_EVENT', payload);
    });

    var api = {
      signIn: function() {}
    };

    var router = {
      redirect: function() {}
    };

    flux.addToContext('api', api);
    flux.addToContext('router', router);

    test.strictEqual(typeof flux.context, 'object', 'should contain context');
    test.strictEqual(typeof flux.context.Stores, 'object', 'should contain context Stores');
    test.strictEqual(typeof flux.context.Actions, 'object', 'should contain context Actions');
    test.strictEqual(typeof flux.context.Actions.myAction, 'function', 'should contain context specific action (1)');
    test.strictEqual(typeof flux.context.Actions.myOtherAction, 'function', 'should contain context specific action (2)');
    test.strictEqual(typeof flux.context.Actions.myNonExistingAction, 'undefined', 'should not contain anything else (2)');
    test.strictEqual(flux.context.api, api, 'should contain stuff added to context');
    test.strictEqual(flux.context.router, router, 'should contain stuff added to context');

    test.done();
  },
  'stores should have correct initial state (constructor)': function(test) {
    test.expect(3);

    var flux = Flux();

    flux.registerStore('myStore', {
      getInitialState: function() {
        return {
          hello: 'world',
          age: 28
        };
      },
      handlers: {
        'MY_ACTION_EVENT': function(context, payload) {
          this.setState(payload);
        },
        'MY_OTHER_ACTION_EVENT': function(context, payload) {
          this.replaceState(payload);
        }
      }
    });

    test.strictEqual(typeof flux.context.Stores.myStore.getState(), 'object', 'should have correct state');
    test.strictEqual(flux.context.Stores.myStore.getState().hello, 'world', 'should have correct state');
    test.strictEqual(flux.context.Stores.myStore.getState().age, 28, 'should have correct state');

    test.done();
  },
  'stores should have correct initial state (register)': function(test) {
    test.expect(3);

    var flux = Flux();

    flux.registerStore('myStore', {
      getInitialState: function() {
        return {
          hello: 'world',
          age: 28
        };
      },
      handlers: {
        'MY_ACTION_EVENT': function(context, payload) {
          this.setState(payload);
        },
        'MY_OTHER_ACTION_EVENT': function(context, payload) {
          this.replaceState(payload);
        }
      }
    });

    test.strictEqual(typeof flux.context.Stores.myStore.getState(), 'object', 'should have correct state');
    test.strictEqual(flux.context.Stores.myStore.getState().hello, 'world', 'should have correct state');
    test.strictEqual(flux.context.Stores.myStore.getState().age, 28, 'should have correct state');

    test.done();
  },
  'actions should update state correctly': function(test) {
    test.expect(9);

    var flux = Flux({
      Stores: {
        myStore: {
          getInitialState: function() {
            return {
              hello: 'world',
              age: 28
            };
          },
          handlers: {
            'MY_ACTION_EVENT': function(context, payload) {
              this.setState(payload);
            },
            'MY_OTHER_ACTION_EVENT': function(context, payload) {
              this.replaceState(payload);
            }
          }
        }
      },
      Actions: {
        myAction: function(context, payload, done) {
          context.Dispatcher.emit('MY_ACTION_EVENT', payload);
        },
        myOtherAction: function(context, payload, done) {
          context.Dispatcher.emit('MY_OTHER_ACTION_EVENT', payload);
        }
      }
    });

    test.strictEqual(typeof flux.context.Stores.myStore.getState(), 'object', 'should have correct state');
    test.strictEqual(flux.context.Stores.myStore.getState().hello, 'world', 'should have correct state');
    test.strictEqual(flux.context.Stores.myStore.getState().age, 28, 'should have correct state');

    flux.Actions.myAction({
      hello: 'goodbye',
      age: 50
    });

    test.strictEqual(typeof flux.context.Stores.myStore.getState(), 'object', 'should have correct state');
    test.strictEqual(flux.context.Stores.myStore.getState().hello, 'goodbye', 'should have correct state');
    test.strictEqual(flux.context.Stores.myStore.getState().age, 50, 'should have correct state');

    flux.Actions.myOtherAction({
      hello: 'wazzup'
    });

    test.strictEqual(typeof flux.context.Stores.myStore.getState(), 'object', 'should have correct state');
    test.strictEqual(flux.context.Stores.myStore.getState().hello, 'wazzup', 'should have correct state');
    test.strictEqual(typeof flux.context.Stores.myStore.getState().age, 'undefined', 'should have correct state');

    test.done();
  },
  'socket actors should update state correctly (by calling actions)': function(test) {
    test.expect(9);

    var socket = new eventEmitter();

    var flux = Flux({
      Stores: {
        myStore: {
          getInitialState: function() {
            return {
              hello: 'world',
              age: 28
            };
          },
          handlers: {
            'MY_ACTION_EVENT': function(context, payload) {
              this.setState(payload);
            },
            'MY_OTHER_ACTION_EVENT': function(context, payload) {
              this.replaceState(payload);
            }
          }
        }
      },
      Actions: {
        myAction: function(context, payload, done) {
          context.Dispatcher.emit('MY_ACTION_EVENT', payload);
        },
        myOtherAction: function(context, payload, done) {
          context.Dispatcher.emit('MY_OTHER_ACTION_EVENT', payload);
        }
      },
      Actors: {
        'some-socket-event': function(context, payload) {
          context.Actions.myAction(payload);
        },
        'some-other-socket-event': function(context, payload) {
          context.Actions.myOtherAction(payload);
        }
      },
      socket: socket
    });

    test.strictEqual(typeof flux.context.Stores.myStore.getState(), 'object', 'should have correct state');
    test.strictEqual(flux.context.Stores.myStore.getState().hello, 'world', 'should have correct state');
    test.strictEqual(flux.context.Stores.myStore.getState().age, 28, 'should have correct state');

    socket.emit('some-socket-event', {
      hello: 'goodbye',
      age: 50
    });

    test.strictEqual(typeof flux.context.Stores.myStore.getState(), 'object', 'should have correct state');
    test.strictEqual(flux.context.Stores.myStore.getState().hello, 'goodbye', 'should have correct state');
    test.strictEqual(flux.context.Stores.myStore.getState().age, 50, 'should have correct state');

    socket.emit('some-other-socket-event', {
      hello: 'wazzup'
    });

    test.strictEqual(typeof flux.context.Stores.myStore.getState(), 'object', 'should have correct state');
    test.strictEqual(flux.context.Stores.myStore.getState().hello, 'wazzup', 'should have correct state');
    test.strictEqual(typeof flux.context.Stores.myStore.getState().age, 'undefined', 'should have correct state');

    test.done();
  },
  'socket actors should update state correctly (by dispatching store events)': function(test) {
    test.expect(9);

    var socket = new eventEmitter();

    var flux = Flux({
      Stores: {
        myStore: {
          getInitialState: function() {
            return {
              hello: 'world',
              age: 28
            };
          },
          handlers: {
            'MY_ACTION_EVENT': function(context, payload) {
              this.setState(payload);
            },
            'MY_OTHER_ACTION_EVENT': function(context, payload) {
              this.replaceState(payload);
            }
          }
        }
      },
      Actions: {
        myAction: function(context, payload, done) {
          context.Dispatcher.emit('MY_ACTION_EVENT', payload);
        },
        myOtherAction: function(context, payload, done) {
          context.Dispatcher.emit('MY_OTHER_ACTION_EVENT', payload);
        }
      },
      Actors: {
        'some-socket-event': function(context, payload) {
          context.Dispatcher.emit('MY_ACTION_EVENT', payload);
        },
        'some-other-socket-event': function(context, payload) {
          context.Dispatcher.emit('MY_OTHER_ACTION_EVENT', payload);
        }
      },
      socket: socket
    });

    test.strictEqual(typeof flux.context.Stores.myStore.getState(), 'object', 'should have correct state');
    test.strictEqual(flux.context.Stores.myStore.getState().hello, 'world', 'should have correct state');
    test.strictEqual(flux.context.Stores.myStore.getState().age, 28, 'should have correct state');

    socket.emit('some-socket-event', {
      hello: 'goodbye',
      age: 50
    });

    test.strictEqual(typeof flux.context.Stores.myStore.getState(), 'object', 'should have correct state');
    test.strictEqual(flux.context.Stores.myStore.getState().hello, 'goodbye', 'should have correct state');
    test.strictEqual(flux.context.Stores.myStore.getState().age, 50, 'should have correct state');

    socket.emit('some-other-socket-event', {
      hello: 'wazzup'
    });

    test.strictEqual(typeof flux.context.Stores.myStore.getState(), 'object', 'should have correct state');
    test.strictEqual(flux.context.Stores.myStore.getState().hello, 'wazzup', 'should have correct state');
    test.strictEqual(typeof flux.context.Stores.myStore.getState().age, 'undefined', 'should have correct state');

    test.done();
  },
  'custom setState and replaceState should be possible': function(test) {
    test.expect(9);

    var socket = new eventEmitter();

    var flux = Flux({
      Stores: {
        myStore: {
          getInitialState: function() {
            return {
              hello: 'world',
              age: 28
            };
          },
          setState: function(emitUpdate, newState) {
            this.state = assign(this.state, newState);
            emitUpdate();
          },
          replaceState: function(emitUpdate, newState) {
            this.state = assign({}, newState);
            emitUpdate();
          },
          getState: function() {
            return assign(Array.isArray(this.state) ? [] : {}, this.state);
          },
          handlers: {
            'MY_ACTION_EVENT': function(context, payload) {
              this.setState(payload);
            },
            'MY_OTHER_ACTION_EVENT': function(context, payload) {
              this.replaceState(payload);
            }
          }
        }
      },
      Actions: {
        myAction: function(context, payload, done) {
          context.Dispatcher.emit('MY_ACTION_EVENT', payload);
        },
        myOtherAction: function(context, payload, done) {
          context.Dispatcher.emit('MY_OTHER_ACTION_EVENT', payload);
        }
      },
      Actors: {
        'some-socket-event': function(context, payload) {
          context.Dispatcher.emit('MY_ACTION_EVENT', payload);
        },
        'some-other-socket-event': function(context, payload) {
          context.Dispatcher.emit('MY_OTHER_ACTION_EVENT', payload);
        }
      },
      socket: socket
    });

    test.strictEqual(typeof flux.context.Stores.myStore.getState(), 'object', 'should have correct state');
    test.strictEqual(flux.context.Stores.myStore.getState().hello, 'world', 'should have correct state');
    test.strictEqual(flux.context.Stores.myStore.getState().age, 28, 'should have correct state');

    socket.emit('some-socket-event', {
      hello: 'goodbye',
      age: 50
    });

    test.strictEqual(typeof flux.context.Stores.myStore.getState(), 'object', 'should have correct state');
    test.strictEqual(flux.context.Stores.myStore.getState().hello, 'goodbye', 'should have correct state');
    test.strictEqual(flux.context.Stores.myStore.getState().age, 50, 'should have correct state');

    socket.emit('some-other-socket-event', {
      hello: 'wazzup'
    });

    test.strictEqual(typeof flux.context.Stores.myStore.getState(), 'object', 'should have correct state');
    test.strictEqual(flux.context.Stores.myStore.getState().hello, 'wazzup', 'should have correct state');
    test.strictEqual(typeof flux.context.Stores.myStore.getState().age, 'undefined', 'should have correct state');

    test.done();
  },
  'should be able to dehydrate and rehydrate a flux instance': function(test) {
    test.expect(42);

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

    var flux = Flux({
      Stores: filledStoreDefinitions
    });

    test.strictEqual(typeof flux.context.Stores.myStore.getState(), 'object', 'should have correct state');
    test.strictEqual(flux.context.Stores.myStore.getState().hello, 'world', 'should have correct state');
    test.strictEqual(flux.context.Stores.myStore.getState().age, 28, 'should have correct state');
    test.strictEqual(typeof flux.context.Stores.myOtherStore.getState(), 'object', 'should have correct state');
    test.strictEqual(Array.isArray(flux.context.Stores.myOtherStore.getState()), true, 'should have correct state');
    test.strictEqual(flux.context.Stores.myOtherStore.getState()[0], 'hello', 'should have correct state');
    test.strictEqual(flux.context.Stores.myOtherStore.getState()[1], 'goodbye', 'should have correct state');

    var filledAppState = flux.dehydrate();

    test.strictEqual(typeof filledAppState, 'object', 'should have correct state');
    test.strictEqual(typeof filledAppState.myStore, 'object', 'should have correct state');
    test.strictEqual(filledAppState.myStore.hello, 'world', 'should have correct state');
    test.strictEqual(filledAppState.myStore.age, 28, 'should have correct state');
    test.strictEqual(typeof filledAppState.myOtherStore, 'object', 'should have correct state');
    test.strictEqual(Array.isArray(filledAppState.myOtherStore), true, 'should have correct state');
    test.strictEqual(filledAppState.myOtherStore[0], 'hello', 'should have correct state');
    test.strictEqual(filledAppState.myOtherStore[1], 'goodbye', 'should have correct state');

    var otherFlux = Flux({
      Stores: emptyStoreDefinitions
    });

    test.strictEqual(typeof otherFlux.context.Stores.myStore.getState(), 'object', 'should have correct state');
    test.strictEqual(typeof otherFlux.context.Stores.myStore.getState().hello, 'undefined', 'should have correct state');
    test.strictEqual(typeof otherFlux.context.Stores.myStore.getState().age, 'undefined', 'should have correct state');
    test.strictEqual(typeof otherFlux.context.Stores.myOtherStore.getState(), 'object', 'should have correct state');
    test.strictEqual(Array.isArray(otherFlux.context.Stores.myOtherStore.getState()), true, 'should have correct state');
    test.strictEqual(otherFlux.context.Stores.myOtherStore.getState().length, 0, 'should have correct state');

    var emptyAppState = otherFlux.dehydrate();

    test.strictEqual(typeof emptyAppState.myStore, 'object', 'should have correct state');
    test.strictEqual(typeof emptyAppState.myStore.hello, 'undefined', 'should have correct state');
    test.strictEqual(typeof emptyAppState.myStore.age, 'undefined', 'should have correct state');
    test.strictEqual(typeof emptyAppState.myOtherStore, 'object', 'should have correct state');
    test.strictEqual(Array.isArray(emptyAppState.myOtherStore), true, 'should have correct state');
    test.strictEqual(emptyAppState.myOtherStore.length, 0, 'should have correct state');

    otherFlux.rehydrate(filledAppState);

    test.strictEqual(typeof otherFlux.context.Stores.myStore.getState(), 'object', 'should have correct state');
    test.strictEqual(otherFlux.context.Stores.myStore.getState().hello, 'world', 'should have correct state');
    test.strictEqual(otherFlux.context.Stores.myStore.getState().age, 28, 'should have correct state');
    test.strictEqual(typeof otherFlux.context.Stores.myOtherStore.getState(), 'object', 'should have correct state');
    test.strictEqual(Array.isArray(otherFlux.context.Stores.myOtherStore.getState()), true, 'should have correct state');
    test.strictEqual(otherFlux.context.Stores.myOtherStore.getState()[0], 'hello', 'should have correct state');
    test.strictEqual(otherFlux.context.Stores.myOtherStore.getState()[1], 'goodbye', 'should have correct state');

    var rehydratedAppState = otherFlux.dehydrate();

    test.strictEqual(typeof rehydratedAppState, 'object', 'should have correct state');
    test.strictEqual(typeof rehydratedAppState.myStore, 'object', 'should have correct state');
    test.strictEqual(rehydratedAppState.myStore.hello, 'world', 'should have correct state');
    test.strictEqual(rehydratedAppState.myStore.age, 28, 'should have correct state');
    test.strictEqual(typeof rehydratedAppState.myOtherStore, 'object', 'should have correct state');
    test.strictEqual(Array.isArray(rehydratedAppState.myOtherStore), true, 'should have correct state');
    test.strictEqual(rehydratedAppState.myOtherStore[0], 'hello', 'should have correct state');
    test.strictEqual(rehydratedAppState.myOtherStore[1], 'goodbye', 'should have correct state');

    
    test.done();
  }
};
