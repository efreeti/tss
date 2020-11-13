export interface FunctionCallExpression {
	type: 'FunctionCallExpression';
	functionName: string;
	parameters: Array<ValueExpression>;
}

export interface ContextObjectExpression {
	type: 'ContextObjectExpression';
}

export interface StringExpression {
	type: 'StringExpression';
	string: string;
}

export interface StringsConcatenationExpression {
	type: 'StringsConcatenationExpression';
	expressions: Array<ValueExpression>;
}

export type ValueExpression =
	FunctionCallExpression |
	ContextObjectExpression |
	StringExpression |
	StringsConcatenationExpression;
