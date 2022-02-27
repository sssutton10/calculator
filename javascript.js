// Global variables
let equation = document.querySelector('.equation')
let tempResult = document.querySelector('.temp-result')
let eqStr = '' // Store the operators for equation evaluation

function add(a, b){
    return a+b
}

function substract(a, b){
    return a-b
}

function multiply(a, b){
    return a*b
}

function divide(a, b){
    return a/b
}

function operate(sign, num1, num2){
    switch (sign){
        case '+':
            return add(num1, num2)
        case '-':
            return substract(num1, num2)
        case '*':
            return multiply(num1, num2)
        default:
            return divide(num1, num2)
    }   
}

// If keypress matches a button, fire the button click event
function keyPress(e){
    const valButton = document.querySelector(`button[data-key="${e.keyCode}"]`)
    if(!valButton){return}
    const event = new MouseEvent('click', {view:window})
    valButton.dispatchEvent(event)
}

function numberPress(e){
    equation.textContent += this.textContent
}

document.addEventListener('keyup', keyPress)
let buttons = document.querySelectorAll('.number')
buttons.forEach(element => element.addEventListener('click', numberPress))