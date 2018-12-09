/**
 * 类型定义文件
 */

// 源码解析 Token
export interface IToken {
  type: string;
  value: string;
}

// AST 节点
export interface INode {
  type: string;
  value?: string;
  params?: INode [];
  body?: INode [];
  name?: string;
  _context?: INode [];
  callee?: any;
  arguments?: INode [];
  expression?: IExpression;
}

// Visitor
export interface IVisitor {
  [key: string]: {
    enter?: Function;
    exit?: Function;
  }
}

// Expression
// TODO: interface 扩展
export interface IExpression {
  type: string;
  callee: {
    type: string;
    name: string;
  };
  arguments: INode [];
}