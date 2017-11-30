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

if we always give `foo` the same function, are we always gonna get the same function structure returns from `foo` ? ... high degree of `confidence`

