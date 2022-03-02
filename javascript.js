'use-strict';

// Global variables
let equation = document.querySelector('.equation')
let tempResult = document.querySelector('.temp-result')
let tempNum = '' // Storing the number being typed to allow for multi-digit numbers
let ops = [] // Push operators and numbers to respective arrays as typed, pop when deleting
let nums = []
let priorOffsetHeight = 0 // For checking if text wraps - if so then half size

function add(a, b){
    return a+b
}

function subtract(a, b){
    return a-b
}

function multiply(a, b){
    return a*b
}

function divide(a, b){
    if(b == 0){return 'Dummy'}
    return a/b
}

function operate(sign, num1, num2){
    switch (sign){
        case '+':
            return add(num1, num2)
        case '−':
            return subtract(num1, num2)
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
    const event = new MouseEvent('click')
    valButton.dispatchEvent(event)
}

function buttonPress(e){
    equation.textContent += this.textContent
    fontSizeAdjust(equation)
    tempResult.textContent = handleDecimalDisplay(numOperatorAction(this.classList[0], this.textContent))
}

function handleDecimalDisplay(x){
    if(!x){return ''}
    if(!(String(x).includes('.'))){return x}
    let decPos = String(x).indexOf('.')
    let retStr = String(x).substring(0, decPos+6) // include a max of five digits in the display
    
}

function evalEquation(opList, numList){
    let retNum
    for(let i=0; i < opList.length; i++){
        if((i == opList.length - 1) && (opList.length != numList.length+1)){
            retNum = operate(opList[i], retNum ?? numList[i], parseFloat(tempNum) ?? numList[i+1])
        }
        else{
            retNum = operate(opList[i], retNum || numList[i], numList[i+1])
        }
    }
    return retNum
}

function numOperatorAction(bType, char){
    if (bType == 'operator'){
        tempResult.textContent = ''
        ops.push(char)
        nums.push(parseFloat(tempNum))
        tempNum = ''
        return ''
    }
    else if (bType == 'number'){
        tempNum += char
        return evalEquation(ops, nums)
    }
    return '' // This shouldn't ever be used
}

function equalsPress(e){
    if(isNaN(equation.textContent.slice(-1))){return} // disable button if last entered button is not a number
    equation.textContent = `${tempResult.textContent}`
    tempResult.textContent = ''
    ops = []
    nums = []
    tempNum = equation.textContent
    equation.style.fontSize = '2rem'
}

function backspacePress(e){
    equation.textContent = equation.textContent.slice(0, equation.textContent.length-1)
    remChar = tempNum.slice(-1)
    tempNum = tempNum.slice(0, tempNum.length - 1)
    if(isNaN(parseFloat(remChar))){
        ops.pop()
        tempResult.textContent = evalEquation(ops, nums)
    }
    else if(isNaN(parseFloat(tempNum.slice(-1)))){
        tempResult.textContent = ''
        nums = equation.textContent.split(/[+−÷\*]/).filter(x => x).map(x => parseFloat(x))
    }
    else{
        tempResult.textContent = evalEquation(ops, nums)
    }
}

function decimalPress(e){
    tempNum += this.textContent
    equation.textContent += this.textContent
}

// Button event listeners for basic calculating
document.addEventListener('keyup', keyPress)

let buttons = document.querySelectorAll('.number')
buttons.forEach(element => element.addEventListener('click', buttonPress))

let operators = document.querySelectorAll('.operator')
operators.forEach(element => element.addEventListener('click', buttonPress))

document.querySelector('.equals').addEventListener('click', equalsPress)
document.querySelector('.backspace').addEventListener('click', backspacePress)
document.querySelector('.decimal').addEventListener('click', decimalPress)

// Clear button
function clearScreen(e){
    equation.textContent = ''
    tempResult.textContent = ''
    priorOffsetHeight = 0
    ops = []
    nums = []
    tempNum = ''
    equation.style.fontSize = '2rem'
    console.log('Hi')
    document.querySelector('.clear').blur()
}

document.querySelector('.clear').addEventListener('click', clearScreen)

// Font size function for equation div - if it tries to wrap then decrease the font size
function fontSizeAdjust(div){
    if((div.offsetHeight > priorOffsetHeight) && (priorOffsetHeight > 0)){
        currSize = parseInt(getComputedStyle(div)['font-size'].slice(0, -2))
        newSize = currSize / 2 + 'px'
        div.style.fontSize = newSize
    }
    else if((div.offsetHeight < priorOffsetHeight) && (div.offsetHeight > 0)){
        currSize = parseInt(getComputedStyle(div)['font-size'].slice(0, -2))
        newSize = currSize * 2 + 'px'
        div.style.fontSize = newSize
    }
    priorOffsetHeight = div.offsetHeight
}