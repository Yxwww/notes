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

`concatAll` `mergeAll` `SwitchLatest`

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

As soon as takeUntil stops, will complete the source collection.


## mergeAll & Switch Latest

`mergeAll`

```javascript
{
    {1}
      {2} ..... {3}
           {4}
}.mergeAll()

{1, 2, 4, 3}
```

`switchLatest`

```javascript
{
    {1},
      {2 .......... 3},
        { } // this observable kills {3}
           {4}
}.switchLatest()

{1...2...4} // where did {3} go ? { } as it's a new observable comes with
```

instead of building machine to compute the answer, we are building the answer declaratively

## Netflix search box

- What collections do I have?
- What collections do I want ?
- How do I get the collections that I have to the collections I want?
- Once I got the collection that I want what I am I gonna do with the data that comes out of it ?

For auto complete box:

Collection we have:

1. key press
2. ajax to server after key press

```javascript
var searchResultSets =
    keyPresses.
    throttle(250).
    map(
        key => getJSON('/searchResults?q=' + input.value).
        retry(3).
        takeUntil(keyPresses)
        ).
    concatAll(); // concat all with takeUntil is like switchLatest

// refactor with switchLatest
var searchResultSets =
    keyPresses.
    throttle(250).
    map( // creates two dimensional event
        key => getJSON('/searchResults?q=' + input.value). // getJSON will call xhr.abort()
        retry(3)
        ).
    switchLatest(); // concat all with takeUntil is like switchLatest



searchResultSets.forEach(
    resultSet => updateSearchResults(resultSet),
    error => showMessage('the server appears to be down')
)
```

Promises are not good with user interface design <= Promises cannot be cancelled, retry


## Multi-dimension collections

```javascript
var authorizations =
   player.
      init().
      map(() =>
         playAttempts.
            map(movieId =>
               player.authorize(movieId).
		       catch(e => Observable.empty). // catch and do nothing
                     takeUntil(cancels)).
            concatAll())). // two concatAll here because, concatAll only flattens 2D-array. As this is 3D array so we have to concatAll twice
      concatAll();

authorizations.forEach(
   license => player.play(license),
   error => showDialog(“Sorry, can’t play right now.”));
```


`concatMap`, concatAll + map

```javascript
Array.prototype.concatMap = function(projectionFunctionThatReturnsArray) {
    return this.
	map(function(item) {
		// ------------   INSERT CODE HERE!  ----------------------------
		// Apply the projection function to each item. The projection
		// function will return a new child array. This will create a
		// two-dimensional array.
		// ------------   INSERT CODE HERE!  ----------------------------
     return projectionFunctionThatReturnsArray(item);
	}).
	// apply the concatAll function to flatten the two-dimensional array
	concatAll();
};
```
