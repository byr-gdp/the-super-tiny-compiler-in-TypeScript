// 源码解析 Token
export interface Token {
  type: string;
  value: string;
}

// AST 节点
export interface Node {
  type: string;
  value?: string;
  params?: Node [];
  body?: Node [];
}