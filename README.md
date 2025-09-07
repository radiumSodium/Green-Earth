# Assignment 6 | Green Earth
<hr>
<img src="assets/1.png">
<hr>

## Q1: Difference between var, let, and const
`var`: Function scoped, Can be redecleared and updated.
`let`: Block scoped, Can be updated but not redecleared in the same scope.
`const`: Block scoped, cannot be updated or redecleared.

## Q2: Difference between map(), forEach(), and filter()

`map`: Returns a new array with transformed elements.
`forEach()`: Go through each element and do not return a new array.

`filter()`: Return a new array containing element that satisfy given condition.

## Q3: Arrow functions in ES6
A shorter syntex for writing functions. Do not have their own this. Great for callback use.
```js
const add = (a, b)=> a+b;
```

## Q4:How destructuring assignment works in ES6
A way to unpack values from arrays or properties from objects into variables.

With destructuring we can get values from any array or objects to variable easily.

```js
const numbers = [1, 2, 3];
const [a, b] = numbers; 
```

## Q5: Template literals in ES6, How are they different from string concatenation?
Strings defined with bacticks. Also known as custom stirng. Allow string interpolation and multiline string.
```js
const name = "Sojibul";
console.log(`Hello, ${name}!`);
```
String concatenation use `+` operator to concate multiple string together to create a long text.

like: 
```js
let name = "Rana";
let sentence = "Hello," + " " + name + "!"; 
```