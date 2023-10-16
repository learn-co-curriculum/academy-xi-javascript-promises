const quotes = [
    "I've had to learn to fight all my life – got to learn to keep smiling. If you smile things will work out. - Serena Williams", 
    "Nothing is worth more than laughter. It is strength to laugh and to abandon oneself, to be light. – Frida Kahlo", 
    "You cannot shake hands with a clenched fist. – Indira Gandhi", 
    "There's power in allowing yourself to be known and heard, in owning your unique story, in using your authentic voice. – Michelle Obama", 
    "No one can make you feel inferior without your consent. – Eleanor Roosevelt", 
    "Pursuing peace means rising above one's own wants, needs, and emotions. – Benazir Bhutto", 
    "Let us make our future now, and let us make our dreams tomorrow’s reality. – Malala Yousafzai", 
    "I’ve learned that making a ‘living’ is not the same as ‘making a life.’ – Maya Angelou"
]

const quote = quotes[(Math.floor(Math.random() * quotes.length))];
console.log("Our quote is: ", quote);
