import {
	ValueExpression,
	ContextObjectExpression,
	StringExpression,
	StringsConcatenationExpression,
	FunctionCallExpression,
} from '@ts-ss/ast';

export class ExpressionSerializer {
	serializeValueExpressionToString(expression: ValueExpression): string {
		if (expression.type === 'FunctionCallExpression') {
			return this.serializeFunctionCallExpressionToString(expression);
		} else if (expression.type === 'StringExpression') {
			return this.serializeStringExpressionToString(expression);
		} else if (expression.type === 'StringsConcatenationExpression') {
			return this.serializeStringsConcatenationExpressionToString(expression);
		} else {
			return this.serializeContextObjectExpressionToString(expression);
		}
	}

	serializeContextObjectExpressionToString(expression: ContextObjectExpression): string {
		return '.';
	}

	serializeStringExpressionToString(expression: StringExpression): string {
		return `'${expression.string}'`;
	}

	serializeStringsConcatenationExpressionToString(expression: StringsConcatenationExpression): string {
		return `'${expression.expressions.map((item) => {
			if (item.type === 'StringExpression') {
				return item.string;
			} else {
				return `$\{${this.serializeValueExpressionToString(expression)}}`;
			}
		})}'`;
	}

	serializeFunctionCallExpressionToString(expression: FunctionCallExpression): string {
		return `${expression.functionName}(${this.serializeExpressionListToParamsString(expression.parameters)})`;
	}

	serializeExpressionListToParamsString(expressions: Array<ValueExpression>): string {
		return expressions.map((item) => this.serializeValueExpressionToString(item)).join(', ');
	}
}
