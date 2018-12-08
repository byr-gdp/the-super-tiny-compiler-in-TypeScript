import test from 'ava';
import tokenizer from '../dist/tokenizer';
import parser from '../dist/parser';
import {
  traverser,
  visitor
} from '../dist/traverser';
import { codeGenerator } from '../dist/generator';

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
  const tokens = [{
      type: 'paren',
      value: '('
    },
    {
      type: 'name',
      value: 'add'
    },
    {
      type: 'number',
      value: '2'
    },
    {
      type: 'paren',
      value: '('
    },
    {
      type: 'name',
      value: 'subtract'
    },
    {
      type: 'number',
      value: '4'
    },
    {
      type: 'number',
      value: '2'
    },
    {
      type: 'paren',
      value: ')'
    },
    {
      type: 'paren',
      value: ')'
    }
  ];

  const ast = parser(tokens);
  console.log(JSON.stringify(ast, '', 2));

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

test('traverser', (t) => {
  const ast = {
    "type": "Program",
    "body": [{
      "type": "CallExpression",
      "value": "add",
      "params": [{
          "type": "NumberLiteral",
          "value": "2"
        },
        {
          "type": "CallExpression",
          "value": "subtract",
          "params": [{
              "type": "NumberLiteral",
              "value": "4"
            },
            {
              "type": "NumberLiteral",
              "value": "2"
            }
          ]
        }
      ]
    }],
  };

  const newAst = {
    type: 'Program',
    body: [],
  };

  ast._context = newAst.body;

  traverser(ast, visitor);

  console.log(JSON.stringify(newAst, '', 2));
  // 返回结果：
  // {
  //   "type": "Program",
  //   "body": [
  //     {
  //       "type": "ExpressionStatement",
  //       "expression": {
  //         "type": "CallExpression",
  //         "callee": {
  //           "type": "Identifier",
  //           "name": "add"
  //         },
  //         "arguments": [
  //           {
  //             "type": "NumberLiteral",
  //             "value": "2"
  //           },
  //           {
  //             "type": "CallExpression",
  //             "callee": {
  //               "type": "Identifier",
  //               "name": "subtract"
  //             },
  //             "arguments": [
  //               {
  //                 "type": "NumberLiteral",
  //                 "value": "4"
  //               },
  //               {
  //                 "type": "NumberLiteral",
  //                 "value": "2"
  //               }
  //             ]
  //           }
  //         ]
  //       }
  //     }
  //   ]
  // }

  t.is(typeof newAst === 'object', true, 'new ast is an object');
});

test('generator', (t) => {
  const ast =  {
    "type": "Program",
    "body": [
      {
        "type": "ExpressionStatement",
        "expression": {
          "type": "CallExpression",
          "callee": {
            "type": "Identifier",
            "name": "add"
          },
          "arguments": [
            {
              "type": "NumberLiteral",
              "value": "2"
            },
            {
              "type": "CallExpression",
              "callee": {
                "type": "Identifier",
                "name": "subtract"
              },
              "arguments": [
                {
                  "type": "NumberLiteral",
                  "value": "4"
                },
                {
                  "type": "NumberLiteral",
                  "value": "2"
                }
              ]
            }
          ]
        }
      }
    ]
  };

  const code = codeGenerator(ast);
  console.log(code);

  t.is(code === 'add(2, subtract(4, 2));', true, 'code generator is fine');
});
