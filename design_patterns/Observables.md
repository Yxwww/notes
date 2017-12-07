# Async Programming with Rx.js - Jafar Husain

## Collections

Stream of Events vs. List

Using functional programming techniques on data structure List to solve async programming challenges.

`concacAll` - flattens 2-D array into 1-D array


## Iterator  and Observers

Iterator patterns:

```javascript
var iterator = [0, 1, 2].iterator();
console.log(iterator.next())
// {value: 0, done: false}
console.log(iterator.next())
console.log(iterator.next())
// {value: 2, done: false}
console.log(iterator.next())
// {done: true}

// consumed by new for of
```

Observer Patterns:

```javascript
document.addEventListener('mousemove', (e) => {
    console.log(e)
})
```

Challenge - sees connection between iterator pattern and Observer pattern

Iterator: pull items out.
Observer pattern: observer iterate you.

Lots of Push APIs:

DOM events,
websockets,
Server-sent Events,
...

We should have one interface for push streams in JS - Observable

Observable = Collection + Time;

> A collection arrives overtime

```javascript
// fromEvent
Observable.fromEvent = function(dom, eventName) {
    // return Observable object
    return {
        forEach: function(observer) {
            var handler = (e) => observer: onNext(e);
            dom.addEventListener(eventName, handler);
            // returning subscription object
            return {
                dispose: function() {
                    dom.removeEventListener(eventName, handler);
                }
            }
        }
    }
}
```

## Flatten

Three main ways to flatten Observable of Observables

`concatAll`

Solves `race condition`: top -> down, left -> right, right order

But doesn't solve starvation, say one stream takes infinite amount of events coming in, then next steam in concatAll won't happen


```javascript
{
    ...1,
    ....{2.......3},
    .....{},
    .......{4}
}.concatAll()

{
    ....1....2...3.4,
}

// even tho 4 arrives earlier than 3 , but 4 will behanded after 3. which is solves race condition
```

Hot Observable: dom events, push API
Cold Observables:

what if Observables are infinite, ie UI events. When do we halt or use the next stream if there are stream happens after.

Flattened Observable dispose(), won't affect inner observable

## TakeUntil

```javascript
{..1...2....3}.takeUntil( // source collection
{........4})              // stop collection

// yield
{..1...2..}

```
