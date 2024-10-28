const inputField = document.querySelector('.cal-ipt'); // 사용자 입력 필드
const resultField = document.querySelector('.result'); // 계산 결과 필드
const buttons = document.querySelectorAll('.cal-btn'); // 모든 버튼

// 전역 변수
let currentInput = ''; // 현재 입력 값

// 유틸리티 함수
const isLastCharOperator = function () {
  return /[+\-*/%]/.test(currentInput.slice(-1));
};

const isLastDecimalPoint = function () {
  return currentInput.slice(-1) === '.';
};

const isFirstOperator = function (isOperator) {
  return currentInput === '' && isOperator;
};

const isRepeatOperator = function (isOperator) {
  return isLastCharOperator() && isOperator;
};

const isRepeatDecimal = function (value) {
  return isLastDecimalPoint() && value === '.';
};

const isOperatorAfterOpenParenthesis = function (value) {
  return currentInput.slice(-1) === '(' && !/[0-9]/.test(value);
};

const isInsideParenthesis = function (value) {
  const openCount = (currentInput.match(/\(/g) || []).length;
  const closeCount = (currentInput.match(/\)/g) || []).length;
  const pattern = /\([0-9]+[+\-*/][0-9]+\)$/;
  if (openCount > closeCount) {
    return pattern.test(currentInput) || value !== ')';
  }
  return true;
};

// 입력 관련 함수
const updateInput = function (value) {
  currentInput += value;
  inputField.value = currentInput;
  resultField.textContent = ''; // 결과 초기화
};

const clearInput = function () {
  currentInput = '';
  inputField.value = currentInput;
  resultField.textContent = '';
};

const removeLastCharacter = function () {
  currentInput = currentInput.slice(0, -1);
  inputField.value = currentInput;
};

// 계산 관련 함수
const calculate = function (expression) {
  expression = expression.replace(/(\d)(\()/g, '$1*$2');
  const tokens = expression.match(/(\d+(\.\d+)?|\D)/g);

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === '*' || tokens[i] === '/') {
      const left = Number(tokens[i - 1]);
      const right = Number(tokens[i + 1]);
      const result = tokens[i] === '*' ? left * right : left / right;
      tokens.splice(i - 1, 3, result);
      i--;
    }
  }

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === '+' || tokens[i] === '-') {
      const left = Number(tokens[i - 1]);
      const right = Number(tokens[i + 1]);
      const result = tokens[i] === '+' ? left + right : left - right;
      tokens.splice(i - 1, 3, result);
      i--;
    }
  }

  return decimalCalculate(Number(tokens[0]));
};

const decimalCalculate = function (result) {
  return result % 1 !== 0 ? parseFloat(result.toFixed(13)) : result;
};

const displayResult = function (result) {
  resultField.textContent = result;
  currentInput = '';
};

const calculateResult = function () {
  if (isLastCharOperator() || isLastDecimalPoint()) return;
  displayResult(calculate(currentInput));
};

// 입력 처리 함수
const handleInput = function (value, isOperator) {
  if (
    isFirstOperator(value, isOperator) ||
    isRepeatOperator(isOperator) ||
    isRepeatDecimal(value)
  ) {
    return;
  }
  if (isOperatorAfterOpenParenthesis(value) || !isInsideParenthesis(value)) {
    return;
  }
  updateInput(value);
};

const handleParenthesis = function () {
  const openCount = (currentInput.match(/\(/g) || []).length;
  const closeCount = (currentInput.match(/\)/g) || []).length;
  updateInput(openCount === closeCount ? '(' : ')');
};

const convertPercentage = function () {
  const match = currentInput.match(/(\d+(\.\d+)?)$/);
  if (match) {
    const lastNumber = match[0];
    const percentValue = Number(lastNumber) * 0.01;
    currentInput = currentInput.slice(0, -lastNumber.length) + percentValue;
    inputField.value = currentInput;
  }
};

// 이벤트 핸들러
const handleButtonClick = function (event) {
  const btnEvent = event.target;
  const value = btnEvent.value;

  if (value === 'C') {
    clearInput();
  } else if (value === '=') {
    calculateResult();
  } else if (value === 'del') {
    removeLastCharacter();
  } else if (value === '%') {
    convertPercentage();
  } else if (value === '()') {
    handleParenthesis();
  } else {
    handleInput(value, btnEvent.classList.contains('operator'));
  }
};

const handleKeyPress = function (event) {
  const key = event.key;

  if (/^[0-9+\-*/().]$/.test(key)) {
    handleInput(key, /[+\-*/]/.test(key));
  } else if (key === 'Enter') {
    calculateResult();
  } else if (key === 'Backspace') {
    removeLastCharacter();
  } else if (key === 'c' || key === 'C') {
    clearInput();
  }
};

// 이벤트 리스너 설정
buttons.forEach((button) => {
  button.addEventListener('click', handleButtonClick);
});

document.addEventListener('keydown', handleKeyPress);
