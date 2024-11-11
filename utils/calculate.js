import { operators, numbers } from './global.js';

export function calculate(tokens) {
  // 예외처리: 마지막이 연산자로 끝나는 경우
  if (operators.includes(tokens[tokens.length - 1])) {
    return;
  }

  // 1. 괄호 앞뒤에 * 연산자 추가
  tokens = multipleHandler(tokens);

  // 2. 괄호 계산 먼저 처리
  tokens = calcParentheses(tokens);

  // 3. 연산자 우선순위 계산
  return calcOperators(tokens);
}

// 괄호 앞뒤에 * 연산자 추가 함수
function multipleHandler(tokens) {
  for (let i = 0; i < tokens.length; i++) {
    // 여는 괄호 앞에 숫자가 있으면 * 추가
    if (tokens[i] === '(' && numbers.includes(tokens[i - 1])) {
      tokens.splice(i, 0, 'x');
      i++;
    }

    // 닫는 괄호 뒤에 숫자가 있으면 * 추가
    if (tokens[i] === ')' && numbers.includes(tokens[i + 1])) {
      tokens.splice(i + 1, 0, 'x');
    }
  }
  return tokens;
}

// 괄호 내부 계산 함수
function calcParentheses(tokens) {
  let exp = tokens.join('');

  // 괄호 안의 가장 안쪽 수식을 계산
  const regex = /\(([^()]+)\)/;

  // 정규표현식으로 괄호 안의 수식을 찾고 반복 처리
  while (regex.test(exp)) {
    exp = exp.replace(regex, (innerExp) => {
      const innerTokens = innerExp.replace(/[()]/g, '').match(/\d+(\.\d+)?|\D/g) || [];
      return calcOperators(innerTokens);
    });
  }

  // 최종 계산된 수식 반환
  const finalTokens = exp.match(/\d+(\.\d+)?|\D/g) || [];
  return finalTokens;
}

// 연산자 우선순위 계산 함수
function calcOperators(tokens) {
  const operate = (a, operator, b) => {
    a = parseFloat(a);
    b = parseFloat(b);

    switch (operator) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case 'x':
        return a * b;
      case '÷':
        return b !== 0 ? a / b : NaN;
      default:
        return 0;
    }
  };

  // 1. 곱셈과 나눗셈 처리
  let i = 0;
  while (i < tokens.length) {
    if (tokens[i] === 'x' || tokens[i] === '÷') {
      const result = operate(tokens[i - 1], tokens[i], tokens[i + 1]);
      tokens.splice(i - 1, 3, result);
      i -= 1;
    }
    i++;
  }

  // 2. 덧셈과 뺄셈 처리
  i = 0;
  while (i < tokens.length) {
    if (tokens[i] === '+' || tokens[i] === '-') {
      const result = operate(tokens[i - 1], tokens[i], tokens[i + 1]);
      tokens.splice(i - 1, 3, result);
      i -= 1;
    }
    i++;
  }

  return tokens[0];
}
