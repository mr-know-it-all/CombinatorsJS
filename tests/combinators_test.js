const {
  idiot,
  kestrel,
  kite,
  not,
  and,
  or,
  xor,
  equals,
  conditional,
  mockingBird,
  omega,
  vireo,
  thrush,
  Y,
  zero,
  one,
  two,
  three,
  succ,
  plus,
  pred,
  sub,
  mult
} = require('../src/combinators.js');

// numbers
// inspired by: http://matt.might.net/articles/js-church/
function getNumber(n) {return n(x => x+1)(0);}
function getNumeral(n) {
 return f => z => {
   for (let i = 0; i < n; i++) z = f(z);
   return z;
 }
}

runTests();

async function runTests() {
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
  ].forEach(([x, result], index) => {
    expect(`not ${index}`, result.name, not(x).name);
  });

  // and test
  [
    [kestrel, kestrel, kestrel, 'is true'],
    [kestrel, kite, kite, 'is false'],
    [kite, kestrel, kite, 'is false'],
    [kite, kite, kite, 'is false']
  ].forEach(([x, y, result, value], index) => {
    expect(`and ${index}`, result.name, and(x)(y).name);
    expect(`and ${index}`, value, and(x)(y)('is true')('is false'));
  });

  // or test
  [
    [kestrel, kestrel, kestrel, 'is true'],
    [kestrel, kite, kestrel, 'is true'],
    [kite, kestrel, kestrel, 'is true'],
    [kite, kite, kite, 'is false']
  ].forEach(([x, y, result, value], index) => {
    expect(`or ${index}`, result.name, or(x)(y).name);
    expect(`or ${index}`, value, or(x)(y)('is true')('is false'));
  });

  // xor test
  [
    [kestrel, kestrel, kite, 'is false'],
    [kestrel, kite, kestrel, 'is true'],
    [kite, kestrel, kestrel, 'is true'],
    [kite, kite, kite, 'is false']
  ].forEach(([x, y, result, value], index) => {
    expect(`xor ${index}`, result.name, xor(x)(y).name);
    expect(`xor ${index}`, value, xor(x)(y)('is true')('is false'));
  });

  // equals test
  [
    [kestrel, kestrel, kestrel, 'is true'],
    [kestrel, kite, kite, 'is false'],
    [kite, kestrel, kite, 'is false'],
    [kite, kite, kestrel, 'is true']
  ].forEach(([x, y, result, value], index) => {
    expect(`equals ${index}`, result.name, equals(x)(y).name);
    expect(`equals ${index}`, value, equals(x)(y)('is true')('is false'));
  });

  // conditional test
  [
    [kestrel, kestrel, 'true branch'],
    [kestrel, kite, 'false branch'],
    [kite, kestrel, 'false branch'],
    [kite, kite, 'true branch']
  ].forEach(([x, y, conditionalBranch], index) => {
    expect(
      `conditional ${index}`,
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
  const isAvailable = userName => () => `${userName} is available`;
  const isNotAvailable = userName => () => `${userName} is not available`;

  await getUserJohn().then(({name, available}) => {
    expect(
      'test kite and kestrel with return values',
      'John is not available',
      available(isAvailable(name))(isNotAvailable(name))()
    );
  });

  await getUserJoe().then(({name, available}) => {
    available(isAvailable(name))(isNotAvailable(name))()
  });

  const bothAvailable = () => 'Both John and Joe are available';
  const notBothAvailable = () => 'John and Joe are not both available';

  await Promise.all([
    getUserJohn(),
    getUserJoe()
  ]).then(([
    John,
    Joe
  ]) => {
    expect(
      'test conditional and equality 1',
      'John and Joe are not both available',
       conditional(
         equals(John.available)(Joe.available)
       )(bothAvailable)(notBothAvailable)()
    );
  });

  // mockingBird and omega test
  try {omega();} catch(e) {
    expect(
      'mockingBird and omega test',
      'RangeError',
      e.name
    );
  }

  // vireo test
  [
    [kestrel, kestrel, kestrel],
    [kestrel, kite, kite],
    [kite, kestrel, kite],
    [kite, kite, kestrel]
  ].forEach(([x, y, result], index) => {
    expect(`vireo ${index}`, result.name, vireo(x)(y)(equals).name);
  });

  // Y test
  const factorialBuilder = function(factorialFn) {
    return n => n < 2 ? 1 : n * factorialFn(n - 1);
  };

  [
    [5, 120],
    [12, 479001600]
  ].forEach(([n, result], index) => {
    expect(`Y factorial ${index}`, result, Y(factorialBuilder)(n))
  });

  const lengthBuilder = function(lengthFn) {
    return ([x, ...xs]) => x === undefined ? 0 : 1 + lengthFn(xs);
  };

  [
    [[1, 2, 3, 4, 5, 6], 6],
    [['a', 'b', 'c', 'd'], 4]
  ].forEach(([xs, result], index) => {
    expect(`Y length ${index}`, result, Y(lengthBuilder)(xs));
  });

  const sumBuilder = function(sumFn) {
    return ([x, ...xs]) => x === undefined ? 0 : x + sumFn(xs);
  };

  [
    [[1, 2, 3, 4, 5, 6], 21],
    [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 55]
  ].forEach(([xs, result], index) => {
    expect(`Y sum ${index}`, result, Y(sumBuilder)(xs));
  });

   const reduceBuilder = function(reduceFn) {
    return ([fn, [x, ...xs], acc]) => x === undefined ? acc : reduceFn([fn, xs, fn(acc, x)]);
  };

  [
    [
      (acc, v) => acc + v,
      [1, 2, 3, 4, 5, 6, 42],
      0,
      63
    ],
    [
      (acc, v) => acc * v,
      [1, 2, 3, 4, 5, 6],
      1,
      720
    ],
    [
      (acc, [x, y]) => vireo(x)(y)(equals).name === kestrel.name ? [...acc, 'one equality'] : acc,
      [[kestrel, kestrel], [kite, kite], [kite, kestrel], [kite, kite], [kite, kite]],
      [],
      [`one equality`, 'one equality', 'one equality', 'one equality']
    ],
    [ // same as above only more "lambda like"
      (acc, [x, y]) => vireo(x)(y)(equals)([...acc, 'one true equality'])(acc),
      [[kestrel, kestrel], [kite, kite], [kite, kestrel], [kite, kite], [kite, kite]],
      [],
      ['one true equality', 'one true equality', 'one true equality', 'one true equality']
    ],
    [
      (acc, v) => v % 2 === 0 ? [...acc, v] : acc,
      [1, 2, 3, 4, 5, 6],
      [],
      [2, 4, 6]
    ]
  ].forEach(([fn, xs, initialValue, result], index) => {
    expect(`Y reduce ${index}`, result, Y(reduceBuilder)([fn, xs, initialValue]));
  });

  // getNumber test
  [
    [zero, 0],
    [one, 1],
    [two, 2]
  ].forEach(([n, result], index) => {
    expect(`getNumber test ${index}`, result, getNumber(n));
  });

  // getNumeral test
  [
    [zero, 0],
    [one, 1],
    [two, 2]
  ].forEach(([n, result], index) => {
    expect(`getNumeral test ${index}`, getNumber(getNumeral(result)), getNumber(n));
  });

  // succ test
  [
    [zero, 1],
    [one, 2],
    [three, 4]
  ].forEach(([n, result], index) => {
    expect(`succ test ${index}`, result, getNumber(succ(n)));
  });

  // plus test
  [
    [zero, one, 1],
    [one, one, 2],
    [three, one, 4],
    [three, three, 6],
    [three, two, 5]
  ].forEach(([x, y, result], index) => {
    expect(`plus test ${index}`, result, getNumber(plus(x)(y)));
  });

  // sub test
  [
    [one, zero, 1],
    [one, one, 0],
    [three, one, 2],
    [three, three, 0],
    [three, two, 1]
  ].forEach(([x, y, result], index) => {
    expect(`sub test ${index}`, result, getNumber(sub(x)(y)));
  });

   // mult test
  [
    [one, one, 1],
    [one, two, 2],
    [three, one, 3],
    [three, three, 9],
    [three, two, 6]
  ].forEach(([x, y, result], index) => {
    expect(`mult test ${index}`, result, getNumber(mult(x)(y)));
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
