import { Token, Node } from './types';

function parser(tokens: Token[]) {
  let current = 0;

  function walk(): Node {
    let token = tokens[current];

    if (token.type === 'number') {
      current += 1;

      return {
        type: 'NumberLiteral',
        value: token.value,
      };
    }

    if (token.type === 'string') {
      current += 1;

      return {
        type: 'StringLiteral',
        value: token.value,
      };
    }

    if (token.type === 'paren' && token.value === '(') {
      token = tokens[++current];

      let node: Node = {
        type: 'CallExpression',
        value: token.value,
        params: [],
      };

      token = tokens[++current];

      while (
        (token.type !== 'paren') ||
        (token.type === 'paren' && token.value !== ')')
      ) {
        // FIXME: optional property
        node.params && node.params.push(walk());
        token = tokens[current];
      }

      current += 1;
      return node;
    }

    throw new TypeError(token.type);
  }

  const ast: Node = {
    type: 'Program',
    body: [],
  }

  while (current < tokens.length) {
    // FIXME: optional property
    ast.body && ast.body.push(walk());
  }

  return ast;
}

export default parser;