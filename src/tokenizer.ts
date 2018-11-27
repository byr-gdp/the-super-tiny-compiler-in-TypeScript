import { Token } from './types';

function tokenizer(input: string): Token[] {
  let current = 0;
  let tokens: Token[] = [];

  while (current < input.length) {
    let char = input[current];

    if (char === '(' || char === ')') {
      tokens.push({
        type: 'paren',
        value: char,
      });

      current += 1;
      continue;
    }

    let WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current += 1;
      continue;
    }

    const NUMBERS = /[0-9]/;
    if (NUMBERS.test(char)) {
      let value = '';

      while (NUMBERS.test(char)) {
        value += char;
        char = input[++current];
      }

      tokens.push({
        type: 'number',
        value,
      });

      continue;
    }

    if (char === '"') {
      let value = '';

      char = input[++current];

      while (char !== '"') {
        value += char;
        char = input[++current];
      }

      char = input[++current];

      tokens.push({
        type: 'string',
        value,
      });

      continue;
    }

    const LETTERS = /[a-z]/i;
    if (LETTERS.test(char)) {
      let value = '';

      while (LETTERS.test(char)) {
        value += char;
        char = input[++current];
      }

      tokens.push({
        type: 'name',
        value,
      });

      continue;
    }

    throw new TypeError(`I don't know what this character is: ${char}`);
  }

  return tokens;
}

export default tokenizer;
