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
