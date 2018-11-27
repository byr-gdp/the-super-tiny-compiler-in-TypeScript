import test from 'ava';
import tokenizer from '../dist/tokenizer';

test('tokenizer', (t) => {
  const tokens = tokenizer('(add 2 (subtract 4 2))');
  // 应该返回9个 token
  // [
  // { type: 'paren', value: '(' },
  // { type: 'name', value: 'add' },
  // { type: 'number', value: '2' },
  // { type: 'paren', value: '(' },
  // { type: 'name', value: 'subtract' },
  // { type: 'number', value: '4' },
  // { type: 'number', value: '2' },
  // { type: 'paren', value: ')' },
  // { type: 'paren', value: ')' }
  // ]

  t.is(tokens.length === 9, true, 'it shoud contain 9 tokens');
});