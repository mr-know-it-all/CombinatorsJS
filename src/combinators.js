module.exports = {
  idiot,
  kestrel,
  kite,
  not,
  and,
  or,
  xor,
  equals,
  conditional
};

function idiot(x) {return x;}
function kestrel(x) {return y => x;}
function kite(x) {return y => y;}
function not(x) {return x(kite)(kestrel);}
function and(x) {return y => x(y)(x);}
function or(x) {return y => x(x)(y);}
function xor(x) {return y => x(not(y))(y);}
function equals(x) {return y => x(y)(not(y));}
function conditional(p) {return x => y => p(x)(y);}
