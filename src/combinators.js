module.exports = {
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
  lark,
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
};

function idiot(x) {return x; }
function kestrel(x) {return y => x; }
function kite(x) {return y => y; }
function not(x) {return x(kite)(kestrel);}
function and(x) {return y => x(y)(x);}
function or(x) {return y => x(x)(y);}
function xor(x) {return y => x(not(y))(y);}
function equals(x) {return y => x(y)(not(y));}
function conditional(p) {return x => y => p(x)(y);}
function blueBird(x) {return y => z => x(y(z));}
function mockingBird(x) {return x(x);}
function omega() {return mockingBird(mockingBird);}
function vireo(x) {return y => fn => fn(x)(y);}
function thrush(fn) {return x => y => fn(y)(x);}
function lark(x) {return y => x(y)(y);}
function Y(fn) {return (x => x(x))(y => fn(v => (y(y))(v)));};


// numbers
function zero(f) {return x => x; }
function one(f) {return x => f(x);}
function two(f) {return x => f(f(x));}
function three(f) {return x => f(f(f(x)));}

function succ(n) {return f => z => f(n(f)(z));}
function plus(x) {return y => x(succ)(y);}
function pred(n) {return f => z => (n(g => (h => h(g(f)))))(() => z)(u => u);}
function sub(n) {return m => (m(pred))(n);}
function mult(n) {return blueBird(n);}
