'use-strict';

// Global variables
let equation = document.querySelector('.equation')
let tempResult = document.querySelector('.temp-result')
let tempNum = '' // Storing the number being typed to allow for multi-digit numbers
let fullNum // Store full, unrounded number so there aren't issues with calculating rounded numbers
let ops = [] // Push operators and numbers to respective arrays as typed, pop when deleting
let nums = []
let priorOffsetHeight = 0 // For checking if text wraps - if so then half size
let positiveMessage = false

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
    if(positiveMessage){return}
    equation.textContent += this.textContent
    fontSizeAdjust(equation)
    tempResult.textContent = handleDecimalDisplay(numOperatorAction(this.classList[0], this.textContent))
}

function handleDecimalDisplay(x){
    if(!x && x != 0){return ''}
    fullNum = x // For avoiding rounding issues
    if(!(String(x).includes('.'))){return x}
    return Math.round(x*100000)/100000// include a max of five digits in the display
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
    if(positiveMessage){return}
    if(isNaN(equation.textContent.slice(-1)) || tempResult.textContent == ''){return} // disable button if last entered button is not a number
    equation.textContent = `${tempResult.textContent}`
    tempResult.textContent = ''
    ops = []
    nums = []
    tempNum = String(fullNum)
    returnLength = []
    equation.style.fontSize = '2rem'
}

function backspacePress(e){
    if(positiveMessage){return}

    equation.textContent = equation.textContent.slice(0, equation.textContent.length-1)
    remChar = tempNum.slice(-1)
    tempNum = tempNum.slice(0, tempNum.length - 1)
    if(remChar == '.'){
        tempResult.textContent = handleDecimalDisplay(evalEquation(ops, nums)) // for good measure
    }
    else if(isNaN(parseFloat(remChar))){
        ops.pop()
        tempResult.textContent = handleDecimalDisplay(evalEquation(ops, nums))
    }
    else if(isNaN(parseFloat(tempNum.slice(-1))) && tempNum.slice(-1) != '.'){
        tempResult.textContent = ''
        nums = equation.textContent.split(/[+−÷\*]/).filter(x => x).map(x => parseFloat(x))
    }
    else{
        tempResult.textContent = handleDecimalDisplay(evalEquation(ops, nums))
    }
    fontSizeAdjust(equation)
}

function decimalPress(e){
    if(positiveMessage){return}
    if(equation.textContent.includes('.')){return}
    tempNum += this.textContent
    equation.textContent += this.textContent
}

function negativePress(e){
    if(positiveMessage){return}
    if(equation.textContent.slice(-1).match(/[0-9]/)){return}
    equation.textContent += '-'
    tempNum += '-'
}

function happyPress(e){
    let randNum = Math.floor(Math.random() * 4)
    switch (randNum){
        case 0:
            equation.textContent = 'Hello There!'
            break
        case 1:
            equation.textContent = 'You rock!'
            break
        case 2:
            equation.textContent = 'Keep your head up!'
            break
        case 3:
            equation.textContent = 'Never give up!'
            break
    }
    positiveMessage = true
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
document.querySelector('.negative').addEventListener('click', negativePress)
document.querySelector('.happy').addEventListener('click', happyPress)

// Clear button
function clearScreen(e){
    equation.textContent = ''
    tempResult.textContent = ''
    priorOffsetHeight = 0
    ops = []
    nums = []
    tempNum = ''
    returnLength = []
    equation.style.fontSize = '2rem'
    document.querySelector('.clear').blur()
    positiveMessage = false
}

document.querySelector('.clear').addEventListener('click', clearScreen)

// Font size function for equation div - if it tries to wrap then decrease the font size
let returnLength = [] // Will be stored once reached the first time
let resultScreen = document.querySelector('.resultScreen')
let resultScreen_cutoff = parseFloat(getComputedStyle(resultScreen)['width'].replace('px', '')) - 24

function fontSizeAdjust(div){
    if(parseFloat(getComputedStyle(equation)['width'].replace('px', '')) > resultScreen_cutoff){
        returnLength.push(equation.textContent.length)
        currSize = parseInt(getComputedStyle(div)['font-size'].slice(0, -2))
        newSize = currSize / 2 + 'px'
        div.style.fontSize = newSize
    }
    else if(equation.textContent.length < returnLength[returnLength.length-1]){
        currSize = parseInt(getComputedStyle(div)['font-size'].slice(0, -2))
        newSize = currSize * 2 + 'px'
        div.style.fontSize = newSize
        returnLength.pop()
    }
}