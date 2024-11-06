import { operators } from './global.js';

export function calculate(tokens) {
    // 연산자 우선순위 함수는 그대로 유지
    const operate = (a, operator, b) => {
        a = parseFloat(a);
        b = parseFloat(b);
        
        switch (operator) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return b !== 0 ? a / b : NaN; // 0으로 나눌 경우 NaN 반환
            default: return 0;
        }
    };

    // 예외처리 1. 마지막이 연산자로 끝나는 경우
    if(operators.includes(tokens[tokens.length - 1])){
        return;
    }

    // 1. 곱셈, 나눗셈 우선 처리
    let i = 0;
    while (i < tokens.length) {
        if (tokens[i] === '*' || tokens[i] === '/') {
            const result = operate(tokens[i - 1], tokens[i], tokens[i + 1]);
            tokens.splice(i - 1, 3, result); // 계산된 결과로 대체
            i -= 1; // 인덱스 조정
        }
        i++;
    }

    // 2. 덧셈, 뺄셈 처리
    i = 0;
    while (i < tokens.length) {
        if (tokens[i] === '+' || tokens[i] === '-') {
            const result = operate(tokens[i - 1], tokens[i], tokens[i + 1]);
            tokens.splice(i - 1, 3, result); // 계산된 결과로 대체
            i -= 1; // 인덱스 조정
        }
        i++;
    }

    // 최종 결과 반환
    return tokens[0];
}