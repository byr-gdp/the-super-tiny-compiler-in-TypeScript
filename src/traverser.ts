
import { INode, IVisitor } from './@types';

export function traverser(ast: INode, visitor: IVisitor) {
  function traverseArray(array: INode[], parent: INode) {
    array.forEach(child => {
      traverseINode(child, parent);
    });
  }

  function traverseINode(node: INode, parent: INode | null) {
    let methods = visitor[node.type];

    if (methods && methods.enter) {
      methods.enter(node, parent);
    }

    switch (node.type) {
      case 'Program':
        node.body && traverseArray(node.body, node);
        break;
      case 'CallExpression':
        node.params && traverseArray(node.params, node);
        break;
      case 'NumberLiteral':
      case 'StringLiteral':
        break;
      default:
        throw new TypeError(node.type);
    }

    if (methods && methods.exit) {
      methods.exit(node, parent);
    }
  }

  traverseINode(ast, null);
}

export const visitor: IVisitor = {
  NumberLiteral: {
    enter(node: INode, parent: INode) {
      parent._context && parent._context.push({
        type: 'NumberLiteral',
        value: node.value,
      });
    },
  },

  StringLiteral: {
    enter(node: INode, parent: INode) {
      parent._context && parent._context.push({
        type: 'StringLiteral',
        value: node.value,
      });
    },
  },

  CallExpression: {
    enter(node: INode, parent: INode) {
      let expression : any = {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          // 原文这里为什么使用 node.value 是不对的
          // name: node.name,
          name: node.value,
        },
        arguments: [],
      };

      node._context = expression.arguments;

      // 如果父节点不是函数调用的话，则当前当作一个表达式。
      // 函数调用如：add(2, substract(4, 2)) 中的 subtract。
      // 表达式如：'2' + substract(4, 2) 中的 substract。
      if (parent.type !== 'CallExpression') {
        expression = {
          type: 'ExpressionStatement',
          expression,
        };
      }

      parent._context && parent._context.push(expression);
    },
  },
};
