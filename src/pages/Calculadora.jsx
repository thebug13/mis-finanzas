import { useState, useCallback, useEffect } from 'react';

const BUTTONS = [
  { label: 'AC', type: 'clear', wide: false },
  { label: '+/-', type: 'sign', wide: false },
  { label: '%', type: 'percent', wide: false },
  { label: '÷', type: 'operator', value: '/', wide: false },
  { label: '7', type: 'digit', wide: false },
  { label: '8', type: 'digit', wide: false },
  { label: '9', type: 'digit', wide: false },
  { label: '×', type: 'operator', value: '*', wide: false },
  { label: '4', type: 'digit', wide: false },
  { label: '5', type: 'digit', wide: false },
  { label: '6', type: 'digit', wide: false },
  { label: '−', type: 'operator', value: '-', wide: false },
  { label: '1', type: 'digit', wide: false },
  { label: '2', type: 'digit', wide: false },
  { label: '3', type: 'digit', wide: false },
  { label: '+', type: 'operator', value: '+', wide: false },
  { label: '0', type: 'digit', wide: true },
  { label: '.', type: 'decimal', wide: false },
  { label: '=', type: 'equals', wide: false },
];

function formatDisplay(value) {
  if (!value || value === 'Error') return value || '0';
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  // Format with commas for thousands
  const parts = value.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export default function Calculadora() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState([]);

  const calculate = useCallback((a, b, op) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    switch (op) {
      case '+': return numA + numB;
      case '-': return numA - numB;
      case '*': return numA * numB;
      case '/': return numB === 0 ? 'Error' : numA / numB;
      default: return numB;
    }
  }, []);

  const handleDigit = useCallback((digit) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay((prev) => prev === '0' ? digit : prev.length < 12 ? prev + digit : prev);
    }
  }, [waitingForOperand]);

  const handleDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay((prev) => prev + '.');
    }
  }, [display, waitingForOperand]);

  const handleOperator = useCallback((op) => {
    const current = parseFloat(display);
    if (prevValue !== null && !waitingForOperand) {
      const result = calculate(prevValue, current, operator);
      const resultStr = result === 'Error' ? 'Error' : String(parseFloat(result.toFixed(10)));
      setDisplay(resultStr);
      setPrevValue(result === 'Error' ? null : resultStr);
      setExpression(`${resultStr} ${op === '/' ? '÷' : op === '*' ? '×' : op === '-' ? '−' : op}`);
    } else {
      setPrevValue(display);
      setExpression(`${display} ${op === '/' ? '÷' : op === '*' ? '×' : op === '-' ? '−' : op}`);
    }
    setOperator(op);
    setWaitingForOperand(true);
  }, [display, prevValue, operator, waitingForOperand, calculate]);

  const handleEquals = useCallback(() => {
    if (prevValue === null || operator === null) return;
    const current = parseFloat(display);
    const result = calculate(prevValue, current, operator);
    const resultStr = result === 'Error' ? 'Error' : String(parseFloat(result.toFixed(10)));
    const expr = `${expression} ${display} =`;
    setHistory((prev) => [{ expr, result: resultStr }, ...prev.slice(0, 9)]);
    setDisplay(resultStr);
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(true);
    setExpression('');
  }, [prevValue, operator, display, expression, calculate]);

  const handleClear = useCallback(() => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setExpression('');
  }, []);

  const handleSign = useCallback(() => {
    setDisplay((prev) => prev.startsWith('-') ? prev.slice(1) : prev === '0' ? '0' : '-' + prev);
  }, []);

  const handlePercent = useCallback(() => {
    const val = parseFloat(display);
    setDisplay(String(val / 100));
  }, [display]);

  const handleButton = useCallback((btn) => {
    if (btn.type === 'digit') handleDigit(btn.label);
    else if (btn.type === 'decimal') handleDecimal();
    else if (btn.type === 'operator') handleOperator(btn.value);
    else if (btn.type === 'equals') handleEquals();
    else if (btn.type === 'clear') handleClear();
    else if (btn.type === 'sign') handleSign();
    else if (btn.type === 'percent') handlePercent();
  }, [handleDigit, handleDecimal, handleOperator, handleEquals, handleClear, handleSign, handlePercent]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') handleDigit(e.key);
      else if (e.key === '.') handleDecimal();
      else if (e.key === '+') handleOperator('+');
      else if (e.key === '-') handleOperator('-');
      else if (e.key === '*') handleOperator('*');
      else if (e.key === '/') { e.preventDefault(); handleOperator('/'); }
      else if (e.key === 'Enter' || e.key === '=') handleEquals();
      else if (e.key === 'Escape') handleClear();
      else if (e.key === 'Backspace') {
        setDisplay((prev) => prev.length > 1 ? prev.slice(0, -1) : '0');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleDecimal, handleOperator, handleEquals, handleClear]);

  const displayLen = display.replace(',', '').length;
  const fontSize = displayLen > 10 ? 'text-3xl' : displayLen > 7 ? 'text-4xl' : 'text-5xl';

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div>
        <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-white">Calculadora</h2>
        <p className="text-center text-sm text-slate-500">También puedes usar el teclado</p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-4 lg:flex-row lg:max-w-2xl lg:items-start">
        {/* Calculadora */}
        <div className="w-full max-w-sm mx-auto lg:mx-0 overflow-hidden rounded-3xl bg-slate-900 shadow-2xl dark:bg-slate-800 ring-1 ring-white/10">
          {/* Pantalla */}
          <div className="px-6 pb-4 pt-8 text-right">
            <p className="mb-1 h-5 text-sm text-slate-400 truncate">{expression || '\u00a0'}</p>
            <p className={`${fontSize} font-light text-white transition-all duration-100 truncate`}>
              {formatDisplay(display)}
            </p>
          </div>

          {/* Botones */}
          <div className="grid grid-cols-4 gap-px bg-slate-700 dark:bg-slate-600">
            {BUTTONS.map((btn, i) => {
              const isOperator = btn.type === 'operator';
              const isEquals = btn.type === 'equals';
              const isFn = btn.type === 'clear' || btn.type === 'sign' || btn.type === 'percent';
              const isActiveOp = isOperator && operator === btn.value && waitingForOperand;

              return (
                <button
                  key={i}
                  onClick={() => handleButton(btn)}
                  className={`
                    ${btn.wide ? 'col-span-2' : ''}
                    flex items-center justify-center
                    py-5 text-xl font-medium
                    transition-all duration-75 active:scale-95
                    select-none
                    ${isEquals
                      ? 'bg-emerald-500 text-white hover:bg-emerald-400 active:bg-emerald-600'
                      : isOperator
                        ? isActiveOp
                          ? 'bg-white text-amber-500 hover:bg-slate-100'
                          : 'bg-amber-500 text-white hover:bg-amber-400 active:bg-amber-600'
                        : isFn
                          ? 'bg-slate-600 text-white hover:bg-slate-500 dark:bg-slate-500 dark:hover:bg-slate-400'
                          : 'bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600'
                    }
                  `}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Historial */}
        <div className="w-full max-w-sm mx-auto lg:mx-0 lg:flex-1">
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Historial</h3>
              {history.length > 0 && (
                <button
                  onClick={() => setHistory([])}
                  className="text-xs text-slate-400 hover:text-red-500 transition"
                >
                  Limpiar
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">
                Los cálculos aparecerán aquí
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {history.map((h, i) => (
                  <div
                    key={i}
                    className="cursor-pointer px-4 py-3 transition hover:bg-slate-50 dark:hover:bg-slate-750"
                    onClick={() => {
                      setDisplay(h.result);
                      setPrevValue(null);
                      setOperator(null);
                      setWaitingForOperand(true);
                      setExpression('');
                    }}
                  >
                    <p className="text-xs text-slate-400 truncate">{h.expr}</p>
                    <p className="text-right text-lg font-semibold text-slate-800 dark:text-white">
                      {formatDisplay(h.result)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
