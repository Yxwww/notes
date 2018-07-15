

## Paralel

## Concurrency

### Non Interaction

### Interaction

### Gate

```javascript
if (a && b)
```

### Latch

```javascript
function foo(x) {
	a = x * 2;
	baz();
}

function bar(x) {
	a = x / 2;
	baz();
}

function baz() {
	console.log( a );
}
```
see who calls `baz` first

### Cooperation

Process data in batch with `setTimeout` or `process.nextTick`

### Jobs

Promise based on this. Happens at the end of current event loop, instead of the new one.

```javascript
console.log( "A" );

setTimeout( function(){
	console.log( "B" );
}, 0 );

// theoretical "Job API"
schedule( function(){
	console.log( "C" );

	schedule( function(){
		console.log( "D" );
	} );
} );

// would produce A, C ,D , B
```



