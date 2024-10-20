import java.util.EmptyStackException;
import java.util.Scanner;
import java.util.Stack;

abstract class ExpressionNode {
    public abstract double evaluate();

    public abstract void printTree(String prefix, boolean isLeft);
}

class NumberNode extends ExpressionNode {
    private final double value;

    public NumberNode(double value) {
        this.value = value;
    }

    @Override
    public double evaluate() {
        return value;
    }

    @Override
    public void printTree(String prefix, boolean isLeft) {
        if (value % 1 == 0)
            System.out.println(prefix + (isLeft ? "├── " : "└── ") + (int) value);
        else
            System.out.println(prefix + (isLeft ? "├── " : "└── ") + value);
    }
}

class OperationNode extends ExpressionNode {
    private final char operator;
    private final ExpressionNode left, right;

    public OperationNode(char operator, ExpressionNode left, ExpressionNode right) {
        this.operator = operator;
        this.left = left;
        this.right = right;
    }

    @Override
    public double evaluate() {
        double leftVal = left.evaluate();
        double rightVal = right.evaluate();
        return switch (operator) {
            case '+' -> leftVal + rightVal;
            case '-' -> leftVal - rightVal;
            case '*' -> leftVal * rightVal;
            case '/' -> {
                if (rightVal == 0) {
                    throw new ArithmeticException("Division by zero");
                }
                yield leftVal / rightVal;
            }
            default -> throw new IllegalArgumentException("Unknown operator: " + operator);
        };
    }

    @Override
    public void printTree(String prefix, boolean isLeft) {
        System.out.println(prefix + (isLeft ? "├── " : "└── ") + operator);
        left.printTree(prefix + (isLeft ? "│   " : "    "), true);
        right.printTree(prefix + (isLeft ? "│   " : "    "), false);
    }
}

public class ExpressionEvaluator {
    private static boolean isOperator(char c) {
        return c == '+' || c == '-' || c == '*' || c == '/';
    }

    public static ExpressionNode buildExpressionTree(String expression) {
        Stack<Character> operators = new Stack<>();
        Stack<ExpressionNode> operands = new Stack<>();

        for (int i = 0; i < expression.length(); i++) {
            char c = expression.charAt(i);

            if (Character.isLetter(c))
                throw new IllegalArgumentException("Alphabet character appear in operation");
            if (Character.isWhitespace(c))
                continue; // Skip whitespaces

            if (Character.isDigit(c)) {
                StringBuilder sb = new StringBuilder();
                while (i < expression.length()
                        && (Character.isDigit(expression.charAt(i)) || expression.charAt(i) == '.')) {
                    sb.append(expression.charAt(i++));
                }
                i--; // step back after parsing number
                operands.push(new NumberNode(Double.parseDouble(sb.toString())));
            } else if (c == '(')
                operators.push(c);
            else if (c == ')') {
                while (!operators.isEmpty() && operators.peek() != '(')
                    processAnOperator(operators, operands);
                if (!operators.isEmpty())
                    operators.pop(); // Remove the '('
                else
                    throw new IllegalArgumentException("Mismatched parentheses");

            } else if (isOperator(c)) {
                // Handle operator precedence
                while (!operators.isEmpty() && precedence(operators.peek()) >= precedence(c))
                    processAnOperator(operators, operands);
                operators.push(c);
            }
        }

        // Process the remaining operators
        while (!operators.isEmpty()) {
            processAnOperator(operators, operands);
        }

        if (operands.size() != 1) {
            throw new IllegalArgumentException("Invalid expression");
        }

        return operands.pop(); // The final tree root
    }

    private static void processAnOperator(Stack<Character> operators, Stack<ExpressionNode> operands) {
        if (operators.isEmpty() || operands.size() < 2) {
            throw new IllegalArgumentException("Invalid expression");
        }
        char operator = operators.pop();
        ExpressionNode right = operands.pop();
        ExpressionNode left = operands.pop();
        operands.push(new OperationNode(operator, left, right));
    }

    private static int precedence(char operator) {
        return switch (operator) {
            case '+' -> 0;
            case '-' -> 0;
            case '*' -> 1;
            case '/' -> 1;
            default -> -1;
        };
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter the arithmetic operations: ");
        String expression = scanner.nextLine();
        try {
            ExpressionNode root = buildExpressionTree(expression);
            double result = root.evaluate();
            if (result % 1 == 0)
                System.out.println("Result: " + (int) result);
            else
                System.out.println("Result: " + result);

            root.printTree("", true); // Visualize the tree
        } catch (EmptyStackException | ArithmeticException | IllegalArgumentException e) {
            System.out.println("Invalid arithmetic operations: " + e.getMessage() + "!");
        } catch (Exception e) {
            System.out.println("An unexpected error occurred: " + e.getMessage() + "!");
        }
    }
}
