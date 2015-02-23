var Flux = require('./lib')

exports['should be correct'] = function(test) {
  test.expect(1);
  test.strictEqual(true, true, 'should be equal');
  test.done();
};
