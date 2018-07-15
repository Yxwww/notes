const R = require('ramda');
const {
    compose,
    gte,
    reduce,
    filter,
    pipe,
    lte,
} = R;
const gte10 = R.gte(10);
const numbers = [0, 5, 15, 25, 35];
const sumBetween20And10 = compose(
    filter(lte(10)),
    filter(gte(20)),
);
console.log(gte10(20));
console.log(sumBetween20And10(numbers));

console.log(reduce(sumBetween20And10, 0)(numbers));
console.log(
    pipe(
        reduce(sumBetween20And10, 0)
    )(numbers)
);
