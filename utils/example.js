export function ParenthesesDisplay() {
    const currentInput = formulaDisplay.textContent;
    const tokens = currentInput.match(/\d+(\.\d+)?|\D/g) || []; // 현재 입력값을 토큰화
    
    const openParenCount = tokens.filter(token => token === '(').length;
    const closeParenCount = tokens.filter(token => token === ')').length;
    
    // 여는 괄호의 개수가 닫는 괄호와 같거나 적으면 여는 괄호를 입력
    if (openParenCount <= closeParenCount) {
        // 여는 괄호 다음에 바로 연산자가 오지 않도록 예외처리
        if (tokens.length === 0 || operators.includes(tokens[tokens.length - 1])) {
            formulaDisplay.textContent += '(';
        }
    } else {
        // 닫는 괄호를 입력하기 위해서는 반드시 수식이 유효한 형태여야 함 (숫자-연산자-숫자)
        const lastToken = tokens[tokens.length - 1];
        if (!operators.includes(lastToken) && lastToken !== '(') {
            formulaDisplay.textContent += ')';
        }
    }
}
