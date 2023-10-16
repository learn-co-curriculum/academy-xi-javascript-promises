# Handling Asynchronous Code: Callbacks and Promises

## Learning Goals

- Review Synchronous vs. Asynchronous JavaScript
- Use a Callback Function to Handle Asynchronous Code
- Use Promises to Handle Asynchronous Code

## Introduction

In previous lessons we've learned how to use the `fetch` method to fetch data
from an API, and we've discussed the difference between synchronous and
asynchronous code. In this lesson, we'll dig a little deeper into how
asynchronous code works and how we can handle it to make sure we get the results
we need.

We have provided code files for a couple of examples that we will be working
through in this lesson. Go ahead and fork and clone the repo so you can follow
along.

## Synchronous vs. Asynchronous JavaScript: An Example

To help us review the difference between synchronous and asynchronous code,
let's consider an example. In the `quotes.js` file, you will see some very
simple code that accesses a random quote from an array, saves it to a variable,
then logs the variable to the console.

To execute the code, run `node quotes.js` in the terminal. You should see a
random quote from the array logged to your terminal.

The code in `quotes.js` is synchronous, meaning that the lines are executed in
order, from top to bottom, and the JavaScript engine waits for the execution of
each line to finish before continuing to the next line. Another way to put this
is that synchronous code is **blocking** — whatever comes after it can't run
until it's done executing. However, because the command to randomly select a
quote from the array executes in a fraction of a second, there is basically no
delay before the quote is logged to the terminal.

But let's imagine that instead of randomly selecting a quote from an array,
we're instead fetching a random quote from an API. To mock this behavior, we can
use `setTimeout()`, which, as we learned in an earlier lesson, is an
asynchronous method provided by JavaScript. Let's update `quotes.js` to do this.

First, we'll replace the definition of the `quote` variable with a `getQuote()`
function and add `setTimeout()` inside it. We then add the code that's used to
"fetch" the quote inside the `setTimeout()` and return the result. Finally,
we'll update the `console.log()` to call `getQuote()`. Once you've made these
changes, the code should look like this:

```js
// Use setTimeout to mock the delay that would occur with a fetch to an API
const getQuote = () => {
    setTimeout(() => {
        return quotes[(Math.floor(Math.random() * quotes.length))];
    }, 2000)
}

console.log("Our quote is: ", getQuote());
```

Now, if you run `node quote.js`, you should see the following logged in the
terminal:

```console
// => Our quote is: undefined
```

You may also notice a short delay before you regain control of the terminal
while our mocked fetch finishes executing.

Asynchronous code is **non-blocking** — JavaScript continues on to the next line
of code while the asynchronous code runs in the background. But this is causing
a problem for us: the quote is undefined at the point the `console.log()`
executes because the mocked "fetch" hasn't completed yet. Obviously, if the code
that follows an asynchronous code block depends on the results the asynchronous
code returns — as is the case in this example — our code isn't going to function
as intended.

Fortunately for us, there are some tools we can use to delay the execution of
code (in our example, the `console.log()`) until after the asynchronous code has
finished executing, ensuring that the quote is available to be logged. One
possible approach is to use callback functions. Let's take a look at how that
works.

## Using a Callback Function to Handle Asynchronous Code

We need to delay the execution of the logging of the quote until after the quote
is available to be logged. To do this, we'll first add a callback as a parameter
in the definition of our asynchronous function, `getQuote()`. We'll also need to
pass the quote to the callback as an argument, so we need to modify the code
inside `setTimeout()` to save the results of our "fetch" into a variable.
Finally, we call the callback, passing the variable we created:

```js
// Add a callback as a parameter
const getQuote = (callback) => {
    setTimeout(() => {
        // Save the returned quote into a variable
        const quote = quotes[(Math.floor(Math.random() * quotes.length))];
        // Call the callback
        callback(quote);
    }, 2000);
}
```

The `setTimeout()` method is asynchronous but, because the code _inside_
`setTimeout()` is synchronous, the JavaScript engine will finish executing the
first line, which "fetches" the quote, before it executes the next line, which
calls the callback.

Then, instead of calling `console.log()` directly, we'll call our `getQuote()`
function, passing in our callback function. We'll pass an inline callback
function, but of course we could use a named function instead:

```js
// Call getQuote, passing in the callback function
getQuote(function(quote) {
    console.log("Our quote is: ", quote);
})
```

If you update the code in `quotes.js` as shown above and run it, you'll once
again see a pause, but this time the `console.log()` doesn't happen until the
mocked fetch completes, so the quote is logged instead of 'undefined'. Using a
callback "blocks" the `console.log()` from executing too soon.

So this doesn't seem so bad, right? All we have to do to take back control of
when our `console.log()` executes is pass it as a callback to our asynchronous
function. But what if we have a _series_ of steps we need to accomplish, each of
which is dependent on the results of the previous function call?

### A More Complicated Example

Let's imagine that we're writing code to display the next time the
[International Space Station][iss] will be passing over our location. We might
do something like the following:

[iss]: https://www.nasa.gov/international-space-station/

Step 1: Get the user's location
Step 2: Translate the location into a latitude and longitude
Step 3: Retrieve the next sighting for those coordinates
Step 4: Display the info

We can imagine writing a function to accomplish each step in the chain, then
calling them in order, each time passing the result from the previous function
call as an argument:

```js
const location = getLocation();
const coords = getCoords(location);
const nextSighting = getNextSighting(coords);
displayNextSighting(nextSighting);
```

This is the same situation we had with the random quote code, just multiplied.
If `getLocation()` is an asynchronous function, then the value of `location`
will be `undefined` when it's passed into `getLatLong()`, causing the code to
error out. So we need to make sure `getLatLong()` isn't called until after
`getLocation()` has finished executing.

As before, we can accomplish this using a callback function:

```js
function getLocation(callback) {
    console.log("Getting the user's location...");
    // Code to retrieve the location and save it to a variable
    callback(location);
};

getLocation(getLatLong);
```

With this setup, `getLatLong()` won't be executed until after the code
retrieving the location completes. But what if `getLatLong()` is asynchronous as
well? Then we would also need to pass the _next_ function in the series,
`getNextSighting()`, into `getLatLong()` as a callback:

```js
function getLocation(callback) {
    console.log("Getting the user's location...");
    // Code to retrieve the location and save it to a variable
    callback(location, getNextSighting);
};

getLocation(getLatLong);
```

In the code above, `getLocation()` is called, passing `getLatLong()` as a
callback. Then, when `getLatLong()` is called inside the function, both the
fetched location and `getNextSighting()` are passed as arguments.

Then, if `getNextSighting()` is also asynchronous, the final function in the
chain, `displayNextSighting()`, would need to be passed into _it_ as a callback.
As you can see, this gets very complicated very quickly! Plus, it results in
code that is difficult to read and to understand.

You can see a mocked version of what the full code might look like in the
`issSighting.js` file. The code in this file effectively has a series of
functions nested within each other. To see this more clearly, take a look
at the function call:

```js
getLocation((location) => {
    getCoords(location, (coords) => {
        getNextSighting(coords, (nextSighting) => {
            displayNextSighting(nextSighting);
        })
    })
});
```

Each indented section of code is the callback for the function that immediately
wraps it, so the callback for `getLocation()` consists of everything between the
first set of curly braces, the callback for `getCoords()` consists of everything
between the second set, and so forth. This pattern of multiple levels of nesting
is what JavaScript programmers refer to as "[callback hell][cb-hell]".

For a long time, callback functions were the only available option for handling
code that depends on the results of asynchronous code, but fortunately, that is
no longer the case. With ES6, a better option for handling asynchronous code was
released: the [`Promise`][promise] object.

> Note: yet another option for handling asynchronous code was released in a more
> recent version of JavaScript: [`async`][async]/[`await`][await]. We will not
> be covering async/await in this course, but feel free to [check it
> out][async-await] if you're interested in learning more.

[cb-hell]: https://www.geeksforgeeks.org/what-to-understand-callback-and-callback-hell-in-javascript/

## JavaScript Promises

So what exactly is a promise? According to [MDN][], "A promise is an object
returned by an asynchronous function, which represents the current state of the
operation." But what does that mean, exactly?

[MDN]: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises

Let's look at an example: we'll run an asynchronous method — specifically, we'll
`fetch` a random dad joke from an API — and take a look at how it works.

Go ahead and navigate to [api-ninjas.com/api/dadjokes][api-ninjas] in Chrome and
open the console, then paste in the code below and press enter.

[api-ninjas]: https://api-ninjas.com/api/dadjokes

```js
fetch("https://api.api-ninjas.com/v1/dadjokes")
  .then((resp) => resp.json())
  .then((json) => console.log(json[0].joke));
```

The first thing that appears in the console should look like this:

```console
Promise {<pending>}
```

When the asynchronous method `fetch` is executed, it immediately returns a
`Promise` object. The status of the Promise at that point is _pending_,
indicating that the fetch hasn't completed yet. The Promise will remain in this
state until the fetch has finished executing.

Once the fetch has completed (which may happen very quickly), the next thing
you see should be the returned random dad joke logged to the console, e.g.:

```console
Dogs can’t operate MRI machines — but cats-can.
```

Once the quote is logged to the console, the status of the Promise will update
to _fulfilled_, indicating that it completed successfully. You can see this by
clicking the disclosure triangle to expand the Promise; it should look something
like this:

![Fulfilled promise](https://curriculum-content.s3.amazonaws.com/phase-1/javascript-promises/fulfilled_promise.png)

If a Promise completes _unsuccessfully_ (for example, because of a network or
server issue), the status of the request would be _rejected_ instead.

## Using Promises

The `Promise` object includes two methods that can be used to "handle" the
information that is eventually returned when execution of the asynchronous code
is complete: `then()` and `catch()`. `then()` will be executed if the Promise
resolves successfully (i.e., its status is _fulfilled_), and `catch()` will be
executed if the code fails (its status is _rejected_).

We can look at an example of using the `then()` method in our dad joke fetch
code:

```js
fetch("https://api.api-ninjas.com/v1/dadjokes")
  .then((resp) => resp.json())
  .then((data) => console.log(data[0].joke));
```

The fetch is executed in the first line and immediately returns a Promise with
status _pending_. The `then()` method will not be called until the execution of
the `fetch()` is complete. At that point, the value returned by the fetch (in
this case, the joke) is automatically passed into the first `then()`. We capture
the value by assigning a parameter name (`resp`) so we can use it in the
callback function we've specified. In this case, the callback calls the `json()`
method on `resp`, which will translate the response received from the API into
JSON.

The `json()` method is _also_ asynchronous so it, too, returns a Promise. This
means its eventual return value (the JSON-ified joke) can _also_ be handled
using `then()`. As before, the return value is automatically passed into
`then()` when the `json()` method resolves, captured by specifying a parameter
name for it (`data`), and, finally, logged to the console.

In each step, the `then()` method automatically calls its callback as soon as
the preceding promise is resolved, and passes in the value it receives.

### Handling Errors

But what happens if one of our Promises does _not_ successfully resolve? Say,
for example, the api-ninjas server is down. In that case, we would likely see
something like this in the console:

![rejected promise error](https://curriculum-content.s3.amazonaws.com/phase-1/javascript-promises/rejected_promise.png)

This error indicates that the fetch did not complete successfully (`TypeError:
Failed to fetch`) and that, furthermore, our code is not handling the error
(`Uncaught (in promise)`). Best practice indicates that we should have code in
place that will execute if the Promise is rejected. That's where `catch()` comes
in.

Let's update our code to add `catch()`:

```js
fetch("https://api.api-ninjas.com/v1/dadjokes")
  .then((resp) => resp.json())
  .then((json) => console.log(json[0].joke))
  .catch((err) => console.log("Something went wrong: ", err));
```

If either of our asynchronous methods (`fetch()` or `json()`) does not complete
successfully for some reason (i.e., the Promise is rejected), the two `then()`
methods will be skipped over and the `catch()` will execute instead, logging the
error received from the fetch call to the console. Of course, in a live
application, either the joke (if the fetch was successful) or the error (if it
wasn't) would be rendered to the screen where the user could see it.

## Advantages of Promises over Callbacks

One major advantage of using Promises is that it results in code that is much
easier to read and follow than "callback hell" code. Using promises, it is much
clearer what is being called in what order, and which methods depend on the
results of an earlier method call.

Furthermore, Promises do a lot of the work of handling asynchronous code for
you. When asynchronous code completes successfully, the `then()` method is
called automatically; all the developer needs to do is define the callback that
will handle the result. Error handling works in the same way when the code does
not complete successfully, through the `catch()` method. With callbacks, on the
other hand, all of the branching logic and error handling would need to be coded
explicitly for each function in the chain.

## Conclusion

While use of asynchronous code can be very helpful for keeping code that takes a
long time to execute from blocking the code that comes after it, it can also
cause problems. Specifically, if any subsequent functions depend on the results
of an asynchronous function, we may not get the intended results. In the past,
the only way to handle this problem was through the use of callback functions,
often leading to the situation referred to as callback hell.

With ES6, Promises were added to JavaScript, providing a better option. Promises
make asynchronous code cleaner and easier to read and understand, provide better
handling of asynchronous process, and have error handling built in.

## Resources

- [MDN: Promise][promise]
- [MDN: Using Promises][using-promises]
- [JavaScript Promises — Tutorial for Beginners](https://colorcode.io/videos/js-promises)
- [Async Await vs. Promises — JavaScript Tutorial for Beginners][async-await]

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[using-promises]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
[async]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
[await]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await
[async-await]: https://www.colorcode.io/videos/js-async-await
