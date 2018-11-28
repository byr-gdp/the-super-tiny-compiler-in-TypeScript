import test from 'ava';
import tokenizer from '../dist/tokenizer';
import parser from '../dist/parser';

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

test('parser', (t) => {
  const tokens = [
    { type: 'paren', value: '(' },
    { type: 'name', value: 'add' },
    { type: 'number', value: '2' },
    { type: 'paren', value: '(' },
    { type: 'name', value: 'subtract' },
    { type: 'number', value: '4' },
    { type: 'number', value: '2' },
    { type: 'paren', value: ')' },
    { type: 'paren', value: ')' }
  ];

  const ast = parser(tokens);
  // console.log(JSON.stringify(ast, '', 2));

  // 输出结果如下：
  // {
  //   "type": "Program",
  //   "body": [
  //     {
  //       "type": "CallExpression",
  //       "value": "add",
  //       "params": [
  //         {
  //           "type": "NumberLiteral",
  //           "value": "2"
  //         },
  //         {
  //           "type": "CallExpression",
  //           "value": "subtract",
  //           "params": [
  //             {
  //               "type": "NumberLiteral",
  //               "value": "4"
  //             },
  //             {
  //               "type": "NumberLiteral",
  //               "value": "2"
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   ]
  // }

  t.is(typeof ast === 'object', true, 'ast is an object');
});
