import { INode, IToken } from './@types';

export function parser(tokens: IToken[]) {
  let current = 0;

  function walk(): INode {
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

      let node: INode = {
        type: 'CallExpression',
        value: token.value,
        params: [],
      };

      token = tokens[++current];

      while (
        (token.type !== 'paren') ||
        (token.type === 'paren' && token.value !== ')')
      ) {
        node.params!.push(walk());
        token = tokens[current];
      }

      current += 1;
      return node;
    }

    throw new TypeError(token.type);
  }

  const ast: INode = {
    type: 'Program',
    body: [],
  }

  while (current < tokens.length) {
    ast.body!.push(walk());
  }

  return ast;
}
