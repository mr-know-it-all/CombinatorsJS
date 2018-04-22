const {
  idiot,
  kestrel,
  kite,
  not,
  and,
  or,
  xor,
  equals,
  conditional
} = require('../src/combinators.js');

runTests();

function runTests() {
  // idiot test
  expect('idiot', 42, idiot(42));
  expect('idiot', {life: 42}, idiot({life: 42}));

  // kestrel test
  expect('kestrel', 42, kestrel(42)(51));
  expect('kestrel', {life: 42}, kestrel({life: 42})(51));

  // kite test
  expect('kite', 42, kite(51)(42));
  expect('kite', {life: 42}, kite(51)({life: 42}));

  // not test
  [
    [kestrel, kite],
    [kite, kestrel]
  ].forEach(([x, result]) => {
    expect('not', result.name, not(x).name);
  });

  // and test
  [
    [kestrel, kestrel, kestrel, 'is true'],
    [kestrel, kite, kite, 'is false'],
    [kite, kestrel, kite, 'is false'],
    [kite, kite, kite, 'is false']
  ].forEach(([x, y, result, value]) => {
    expect('and', result.name, and(x)(y).name);
    expect('and', value, and(x)(y)('is true')('is false'));
  });

  // or test
  [
    [kestrel, kestrel, kestrel, 'is true'],
    [kestrel, kite, kestrel, 'is true'],
    [kite, kestrel, kestrel, 'is true'],
    [kite, kite, kite, 'is false']
  ].forEach(([x, y, result, value]) => {
    expect('or', result.name, or(x)(y).name);
    expect('or', value, or(x)(y)('is true')('is false'));
  });

  // xor test
  [
    [kestrel, kestrel, kite, 'is false'],
    [kestrel, kite, kestrel, 'is true'],
    [kite, kestrel, kestrel, 'is true'],
    [kite, kite, kite, 'is false']
  ].forEach(([x, y, result, value]) => {
    expect('xor', result.name, xor(x)(y).name);
    expect('xor', value, xor(x)(y)('is true')('is false'));
  });

  // equals test
  [
    [kestrel, kestrel, kestrel, 'is true'],
    [kestrel, kite, kite, 'is false'],
    [kite, kestrel, kite, 'is false'],
    [kite, kite, kestrel, 'is true']
  ].forEach(([x, y, result, value]) => {
    expect('equals', result.name, equals(x)(y).name);
    expect('equals', value, equals(x)(y)('is true')('is false'));
  });

  // conditional test
  [
    [kestrel, kestrel, 'true branch'],
    [kestrel, kite, 'false branch'],
    [kite, kestrel, 'false branch'],
    [kite, kite, 'true branch']
  ].forEach(([x, y, conditionalBranch]) => {
    expect(
      'conditional',
      conditionalBranch,
      conditional(equals(x)(y))('true branch')('false branch')
    );
  });

  // program flow with boolean encodings test 1
  const getUserJohn = () => new Promise((resolve, _) => setTimeout(() => resolve({
    name: 'John', available: kite
  }), 500));
  const getUserJoe = () => new Promise((resolve, _) => setTimeout(() => resolve({
    name: 'Joe', available: kestrel
  }), 500));
  const isAvailable = userName => () => console.log(`${userName} is available`);
  const isNotAvailable = userName => () => console.log(`${userName} is not available`);

  getUserJohn().then(({name, available}) => {
    available(isAvailable(name))(isNotAvailable(name))()
  });
  getUserJoe().then(({name, available}) => {
    available(isAvailable(name))(isNotAvailable(name))()
  });

  const bothAvailable = () => console.log('Both John and Joe are available');
  const notBothAvailable = () => console.log('John and Joe are not both available');

  Promise.all([
    getUserJohn(),
    getUserJoe()
  ]).then(([
    John,
    Joe
  ]) => {
    conditional(
      equals(John.available)(Joe.available)
    )(bothAvailable)(notBothAvailable)()
  });
}

function serialize(x) {
  return JSON.stringify(x);
}

function expect(name, expectation, actual) {
  console.log(`RUNNING: ${name}`);
  if(serialize(expectation) === serialize(actual)) {console.log("TEST passed!");}
  else
    console.warn(`TEST >> ${name} << failed!`),
    console.log("expectation:"),
    console.log(expectation),
    console.log("actual:"),
    console.log(actual);
}
