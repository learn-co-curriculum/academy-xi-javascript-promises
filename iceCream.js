const promiseIceCream = (homeworkDone) => {
    const prom = new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(prom);
            homeworkDone ? resolve() : reject();
            console.log(prom);
        }, 1000)
    })
    return prom
}

// ADVANCED: Immediately Invoked Function Expression (IIFE)
// Below we've initialized homeworkDone to true and created an IIFE 
// that will randomly set it to false approximately half the time.
// You may recall that function definitions are STATEMENTS; by wrapping
// our function in parentheses, we've turned it into an EXPRESSION which
// returns the function. We then appended the () at the end, which 
// immediately invokes the function.

// We don't need to give our function a name because we never call it. 
// We want it to run every time we load the page, so we invoke it at 
// the same time we define the function.

// let homeworkDone = true;

// (() => {
//     const randomNum = Math.random();
//     if (randomNum < 0.5) {
//         homeworkDone = false;
//     }
// })();

const setHomeworkDone = () => {
    if (Math.random() < 0.5) {
        return true
    } else {
        return false
    }
}

const homeworkDone = setHomeworkDone();
const msg = document.getElementById("message");

promiseIceCream(homeworkDone)
    .then(() => {
        msg.innerText = "What flavor do you want?";
        msg.style.color = "green";
    })
    .catch(() => {
        msg.innerText = "Not until you finish your homework!";
        msg.style.color = "red";
    })
