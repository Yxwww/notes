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

> a pure function is a function has referential transparency

*referential transparency*: we could take that function call and replace it with its return, the rest of the program will behave transparently.

- haskell compiler will take an advantage of this and speed up function calls

*memoization* memorizing the work that's been done, new function will store the result of the input , return the result of that memory over and over again.

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

not / negate: eliminate points (param)

```javascript
function isOdd(v) {
  return v$ 2 === 1;
}

function isEven(v) { // there's a point v
  return !isOdd(v);
}

isEven(4);

// we create a utilty
function not (fn) {
  return function negated(...args) {
    return !fn(...args);
  }
}
```
### practice - currying

```javascript
var output = console.log.bind(console); // to support certain browser do hard bind console

function printIf(predicate) {
  return function(msg) {
    if (predicate(msg)) {
      output(msg);
    }
  }
}

function isShortEnough(str) {
  return str.length <= 4;
}
// Goal: refactor this to point-free
function isLongEnough(str) {
  return !isShortEnough(str);
}
var msg1 = 'hello';
// point version of printIf
printIf(isShortEnough)(msg1)

// provided util
function when(fn) {
  return function(predicate) {
    return function(...args) {
      if(predicate(...args)) {
        return fn(...args);
      }
    }
  }
}

// MARK: Solution

// point free refactor
function not(fn) {
  return function negated(msg) {
    return !fn(msg);
  }
}

var printIf = when(output);
// point free style of printIf
printIf(isShortEnough)(msg1)
```

## Composition

> Core part of FP

> motivation create boundary of what and how, make easier to reason about

```javascript
function sum(x, y) {
  return x+ y;
}
function mult(x, y) {
  return x * y;
}

// imperative international shipping rate
// (3*4) + 5
var x_y = mult(3, 4);
sum(x_y, 5); // 17

// ## Iteration 1:
// reduce space style 1
sum( multi(3, 4), 5);

// ## Iteration 2:
// reducer space style 2, abstraction
function multAndSum(x, y, z) {
  return sum( mult(x, y), z); // cares about how
}

multAndSum(3, 4, 5);
// more declarative, DRY code ? not biggest motivation,
// create boundary of what and how, multAndSum only care about what

```

### Higher Order Function

> either or both takes one or more functions and or makes an function as output

```javascript
// ## Iteration 3:

// a machine making machine, higher order function
// take output of fn1, pump it into the input of fn2
function pipe2(fn1, fn2) {
  return function piped(arg1, arg2, arg3) {
    return fn2(
      fn1(arg1, arg2),
      arg3
    )
  }
}

var multAndSum = pipe2(mult, sum);
multAndSum(3,4,5);
```


```javascript
// standard utility compose & pipe
foo(bar(baz(2))); // Note: baz run first
compose(foo, bar, baz)(2); // right to left use compose
pipe(baz, bar, foo)(2); // left to right order use pipe
// both compose / pipe are standard
// sometimes pipe called flow to right
```

- practice

```javascript
function increment(x) {
  return x +1;
}
function double(x) {
  return x*2;
}
var f = composeRight(incrememt, double);
var p = composeRight(double, incrememt);
f(3)  // 7
p(3); // 8


// solution

// my take: need to make it point-free
function composeRight(fn1, fn2) {
  return function(..args) {
    return fn1(fn2(...args));
  }
}
```

- exercise - make your own compose && pipe

```javascript

// using gather operater
function pipe(...fns) {
  // remember result pipe as input to next function
  return function(input) {
    var result;
    for (var i=0; i< fns.length; i++ ) {
      result = fns[i](result);
    }
    return result;
  }
}

function compose(...args) {
  // reverse pipe
  return pipe(...fns.reverse());
}
```

## immutability

```javascript
const y = 3
y++; // not allowed
```

> constant the variable itself cannot be resigned, assignment immutability

`const` keyword , block scope, only the block const is in can re-assign it.

Immutability mean value immutability, not assignment immutability

Signal don't worry to it cannot be changed vs. Prevention to change

ImmutableJS, `set` will change list, stores diff instead of completely clone the new array ( like Git )


## Closure and Side Effects

JS inspired by Scheme lang introduced closure (enables multi-paradigm)

> Closure: is when a function "remembers" the variables around it even when that function is executed elsewhere

Note: around the function not just inside. See unary function example below. Unary and One are both high confidence to be pure functions

closure: Take a function and give it a memory

Write a function reference a variable inside of another function. If a function can be a value/passed around.

```javascript
function unary(fn) {
  return function one(arg) {
    return fn(arg);  // closure remembers fn
  }
}

// is unary pure ? : yes ? - lol high degree of confidence
// how about function one ? seems like it behave as pure function, fn can't be redefined , high degree of confidence
```

## Generalized to Specialized

### Partial Application

```javascript
function add(x, y) {
  return x + y;
}

function partial(fn, ...firstArgs) {
  // partial application
  return function applied(...lastArgs) {
    return fn(...firstArgs, ...lastArgs);
  }
}
// specialized function for general function add
var addTo10 = partial(add, 10);

addTo10(32); // 42
```

practice: `ajax` utilities focused on fetching users

```javascript

function ajax(url, opts) [
  fetch(ajax)
]

function lookupUsers(url, ...firstArgs) {
  return function applied(...lastArgs) {
    return ajax(`/user/${url}`, ...firstArgs, ...lastArgs)
  }
}

lookupUsers('/all') // should send ajax to "/users/all"
```


### Partial Application vs Currying

*Similarity* - partial application and curriying are two techniques to specialize a generalized function

ie: `.bind(this, ...args)` ignore `this`

*Difference* - Partial take some of args now and the rest later. Currying provide a little bit at a time.

```javascript
var add3 = curry(function add3(x, y,z) {
  return x + y + z;
});
var f = add3(3);
var p = f(4);

p(5);          // 12
add3(3)(4)(5); // 12
// create more and more function with specialization
```

## Recursion

> isomophism of iteration

### example

```javascript
// sum array of integer
function sumIter(...nums) {
  var sum = 0
  for(var i = 0; i<nums.length; i++) {
    sum = sum + nums[i];
  }
  return sum;
}

sumIter(3,4,5,6,7,8,9);
```


itr-1:

```javascript
function sumIter(sum, ...nums) {
  for (var i=0; i< nums.length; i++) {
    sum = sum + nums[i];
  }
  return sum;
}

sumIter(3,4,5)
```

```javascript
// param sum in fp is call head, ...nums is tail
function sumIter(sum, ...nums) {
  if (nums.lenght===0) {
    return sum;
  }

  return sum + sumIter(...nums);
}
sumRecur(3,4,5)


// OR peak into the second number to save one more function call when sumIter(3,4)

function sumRecur(sum, num=0,...nums) {
  if(nums.length == 0) return sum + nums;
  return sum + sumRecur(num, ...nums);
}
```


## Proper tail calls - in ES6

what's going to happen after calling recursive function ?
Preserve state (stack frame): keep track of variable (state) of the function when nested recursion is called.

Call stack is limited as memory is limited.

Improvement (TCO - tail call optimization):
- elimnimate memory creation in each recursion.
- overwrite existing stack frame OR create a new stack frame throw away the old one
- `sum + sumRecur(num, ...nums)` tells engine things are not done yet.
  - maximum call stack in IE3,4 was like 13

If you write your code in PTC(proper tail calls) form ,then you will never run out of memory for recursion

```javascript
"use strict" // PTC requires strict mode

function foo(x) {
  if (x< 10) retrurn x;
  return bar(x); // PTC form very end of the flow control
}
function bar(x) {
  return x / 2;
}

foo(42):

// recursive scenario

function foo(x) {
  if (x%2 == 1) {
    x = Math.round(x/3);
  }
  else {
    x = x/2;
  }
  if (x < 10) return x;
  return foo(x); // PTC form
}

// refactor sumRecur

function sumRecur(sum, num, ...nums) {
  if (nums.length == 0) return sum + num;
  return sum + sumRecur(num, ...nums): // OLD  - goal to get rid of sum var
}

function sumRecur(...nums) {
  return recur(...nums);

  function recur(sum, num, ...nums) {
    sum += num;
    if (nums.length===0) return sum;
    return recur(sum, ...nums); // ptc form
  }
}

sumRecur(3,4,5)
// to make recur only get to recreate once

var sumRecur = (function() {
  return function()
})

```


## List Transformation

## Culmination Solutions

Exercises:

1. Write two functions, each which return a fixexd nu,ber(different from each other)  when called
```javascript
function fn1() {
  return 1;
}
function fn2() {
  return 2;
}
```

2. Write an `add()` function that takes two numbers and adds them and returns the result. Call `add(..)` with the results of your two functions from (1) and print the result to the console

```javascript
function add(num1, num2) {
  return num1 + num2;
}
console.log(add(fn1(), fn2()));
```

3. Wirte and `add2(..)` that takes two functions instead of two numbers, and it calls those two functions and then sends those values to `add(..)` , just like you did in (2) above.

```javascript
function add2(fn1, fn2) {
  return add(fn1(), fn2())
}
console.log(add2(fn1, fn2));
```

4. Replace your two functions from (1) with a single function that takes a value and returns a function back, where the returned function will return the value when it's called

utility name: `constant`

```javascript
function constant(val) {
  return function() {
    return val;
  };
}

add2(constant(2), constant(3))
```

5. Write an `addn(..)` that can take an array of 2 or more functions ,and using only `add2(..)`, adds them together. Try it with a loop. Try it without a loop(recursion). Try it with built-in array functional helpers (map/reduce)

```javascript
// Try with loop
function addn(fns) {
  if (fns.length==0) {
    return 0;
  }
  var array = fns.slice();
  var first, second, sum;
  for (var i=0; i < array.length, i++) {
    first = array[i];
    second = array[i+1];
    array[i+1] = add2(first, second);
  }
  return array[]
}
addn(constant(1),constant(2)) // 3;

// better approach leave add in the end
function addn(fns) {
  fns = fns.slice();
  while (fns.length > 2) {
    let [fn0, fn1, ...rest] = fns;
    fns = [
      function() { // returns function instead of directly do calculation right away, delay the calculation til the very end
        return add2(fn0, fn1);
      },
      ...rest
    ]
  }
  return add2(fns[0], fns[1])
}

addn([constant(1), constant(2)])


// Try with recursion
function addn(first, second, ...fns) {
  first = add2(first, second)
  if(fns.length > 0) {
    return addn(first, fns)
  }
  return addn(first)
}
addn(constant(1),constant(2)) // 3;
// Recursion with array as args
function addn([fn0, fn1, ...fns]) {
  if (fns.length > 0) {
    return addn([
      function () {
        return add2(fn0, fn1);
      },
      ...fns
    ])
  }
}
addn([constaint(3), constant(5)])

// Try reduce with args array
function addn([...fns]) {
  return fns.reduce(function(composedFn, cur) {
    return [
      function() {
        add2(composedFn, cur)
      }
    ]
  })() // as reduce return a giant function need to invoke
}

```

exercise 6:

Start with an array of odd and even numbers (with some duplicates), and trim it down to only have unique values.

```javascript

// my approach with filter
const array = [1,2,3,4,5,6,1,2,3,4]
function filterRemember(array) {
  return array.filter(rememberFilter());
  function rememberFilter() {
    const existedElem = [];
    return function isElementOccurred(element) {
      console.log(existedElem.indexOf(element))
      if (existedElem.indexOf(element) !== -1) {
        return false
      }
      existedElem.push(element)
      return true
    }
  }
}
var arr = filterRemember(array)
console.log(arr)

// solution with filter
array.filter(function(v, index, arr){
  if (index === arr.indexOf(v)) {
    return true;
  }
  return false;
});

// solution indicate using reduce
// attemp with reduce
const array = [1,2,3,4,5,6,1,2,3,4]
var arr = array.reduce(function(acc, cur) {
  if (acc.indexOf(cur) === -1) {
    return acc.concat(cur) // use concat to enforece immutability
  }
  return acc
}, []) // as reduce accumulator remembers existed elements
console.log(arr)
```

exercise 6 and 7

```javascript
const array = [1,2,3,4,5,6,1,2,3,4]
var sum =
addn(
  array.reduce(function(acc, cur) { // reducer
    if (acc.indexOf(cur) === -1) {
      return acc.concat(cur) // use concat to enforece immutability
    }
    return acc
  }, []) // as reduce accumulator remembers existed elements
  .filter(function(v) { // predicate
    return v % 2 ==0;
  })
  .map(constant) // turn them into constant with map
)

console.log(arr)
```

currently we don't know how to compose functions with different shape
ie: reducer, predicate, constant


## Fusion

> Fusion with similiar shape of operator

```javascript
function add1(v) {
  return v + 1;
}
function mul2(v) {return v * 2};
function div3(v) { return v / 3};

var list = [1,2,3,4];
lis.map(add1).map(mul2).map(div3);
// problem ... create three intermediate list memory waste

function composeRight(fn1, fn2) {
  return function(...args) {
    return fn1(fn2(...args));
  }
}
// when the shape of the operator is compatible
list.map(
  [div3,mul2, add1].reduce(composeRight)
)

```


## Transducing

> Fusion with not similiar shape of operator

Note: difficult to wrap head around but not difficult to use




