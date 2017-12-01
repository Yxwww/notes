# Functional-lite 2 - Kyle Simpson

## Provable and readable

- use a pattern that’s mathematically proven, if there’s a bug in the test is test not written properly.
- if a code that you do not understand, is a code you can not trust. Vice versa.
  - Example: experience ? A piece of code that worked but not idea why it worked…
- *Motivation* reader and author be able to trust and read the code without too much processing power
- The most readable code is the code that doesn’t have to be read at all. Our brain should be focused on the stuff that really matters (business logic)
- Our goal is for better communication with people
- *Abstraction*
    - tell me what abstraction is ?
            - general answer: abstraction hides details (basic sense it is)
      - hide details => encapsulation
      - complected => tightly tied together
      - abstraction =>  semantic boundary between two tightly tied rope

## Pure Function

- A function without a return keyword is not a function it's a procedure.
- impure function: In order to understand what line 91777 does, you have to compute 1-91776 in your head to be able to understand what 91777 does
- *Side effect*
  - side effect is unavoidable => eliminate side effect as much as possible.
  - react-redux, side effect happens at the end of calling `render` function

## Purify Functions

- observably act as pure function
- function F itself is not pure, but as long as it contains all relative side effects within itself we say it's pure function
  - encap possible side effects in the function
  - function do side effects then reset back to the state before function is invoked
    - F contains f() which is impure, record pre f state, after f() , reverse back to original state. Still consider as observably pure
      - nasty but see if worth it
  - if return multiple value easy solution is return as array

- anytime calling the function with the same input, we always gonna get the same output

### example

```javascript
function bar(x,y) {
  var z;
  foo(x);
  return [y,z]

  function foo(x) {
    y++; // impure
    z = x + y
  }
}

bar(20, 5) // [6,120]

// record state before impure function and reset after impure function
function bar(curX, curY) {
  var [origY, origZ] = [y, z]; // record state
  y = curY; // impure by the looks - rely on outer scope var
  foo(curX); // impure function invoke has something todo with y, z
  var [newY, newZ] = [y,z]; //record impure result
  [y, z] = [origY, origZ]; // return back to original state - before impure function invoked
  return [newY, newZ]
}
```

## Understand impurity

- cannot say a function is 100% pure
- purity is a confidence level. Given:

```javascript
// pure ??
function foo(x) {
  return bar(x)
}
// pure
function bar(y) {
  return y+1;
}
foo(1);
```

I can say `foo` is pure. Given what I see in this program `foo` is gonna behave as pure

```javascript
function foo(bar) {
  return function() {
    return bar(x)
  }
}
// pure ?
foo(function(v) {
    return v*2;
})(3); // 6
```

### Confidence level

if we always give `foo` the same function, are we always gonna get the same function structure returns from `foo` ? ... high degree of *confidence*

Now

```javascript
function getID(obj) {
  return obj.id; // looks pure ? as it all based on input ?
}

getId({
  get id() {
    return Math.random();  // where is your confidence level ?
  }
})
```

if we can trust it, we can understand it.

## Arguments

- stick with unary/binary functions
- produce unary/binary from nnary(variadic) function

```javascript
function unary(fn) {
  return function one(arg) {
    return fn(arg);
  }
}
 function binary(fn) {
   return function two(arg1, arg2) {
     return fn(arg1, arg2);
   }
 }

function f(...args) {
  console.log(args)
}

var g = unary(f);
var h = binary(f)

g(1,2,3,4) // [1]
h(1,2,3,4) // [1,2]
```

```javascript
// produce a function flip the first two argument
function flip(fn) {
  return function flipped(arg1, arg2, ...args) {
    return fn(arg2, arg1, ...args);
  }
}
function f(...args) {
  console.log(args);
}
var g = flip(f); // g transpose f

g(1,2,3,4) // [2,1,3,4]
```

`.apply`

```javascript
// spread/apply args for function f
function spreadArgs(fn) {
  return function spread(args) {
    return fn(...args)
  }
}
function f(x, y, z, w) {
  console.log(x + y + z + w)
}
var g = spreadArgs(f);
g([1,2,3,4]);
```

### homework

`.unapply` or `.gather`

```javascript
function gatherArgs(fn) {
  return function gather(...args) {
    return fn(..args)
  }
}
function f(x, y, z, w) {
  console.log(x + y + z + w)
}
var g = gatherArgs(f);
g(1,2,3,4);
```

## POINT-FREE style

> *point* - input towards a function
> *point-free* - get rid of param mapping between the param and argument pass through

```javascript
// v is point - input of the function
foo(function(v) {
  return bar(v);
});
// why not - map v through
foo(bar);
```

```javascript
function isOdd(v) {
  return v$ 2 === 1;
}

function isEven(v) { // there's a point v
  return !isOdd(v);
}

isEven(isOdd)
isEven(4);
```

