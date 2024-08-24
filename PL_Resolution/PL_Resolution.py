def read_input(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        lines = file.readlines()
    
    def parse_clause(clause_line):
        return sorted([clause.strip() for clause in clause_line.split() if clause.strip() and clause.strip() != 'OR'])

    alpha = parse_clause(lines[0].strip())
    
    num_clauses = int(lines[1].strip())
    
    clauses = [parse_clause(lines[i].strip()) for i in range(2, 2 + num_clauses)]
    
    return alpha, clauses

def sort_literals(literals):
    sorted_literals = sorted(literals, key=lambda lit: (lit.lstrip('-'), lit))
    return sorted_literals

def resolve(clause1, clause2):
    clause1 = set(clause1)
    clause2 = set(clause2)
    for literal in clause1:
        opposite_literal = f'-{literal}' if not literal.startswith('-') else literal[1:]
        if opposite_literal in clause2:
            new_clause = (clause1 - {literal}) | (clause2 - {opposite_literal})
            return sorted(list(new_clause))
        
    return None

def is_useless_clause(clause):
    for literal in clause:
        opposite_literal = f'-{literal}' if not literal.startswith('-') else literal[1:]
        
        if opposite_literal in clause:
            return True
    return False

def PL_resolution(alpha, clauses):
    for literal in alpha:
        if not literal.startswith('-'):
            clauses.append('-{literal}')
        else:
            clauses.append(literal[1:])
    iterations = [] 
    found_empty_clause = False 
    iterative = 1
    while True: 
        pairs = [(ci, cj) for ci in clauses for cj in clauses if ci != cj]
        new = []
        
        for (ci, cj) in pairs:
            resolvent = resolve(ci, cj)
            if resolvent is not None:
                if len(resolvent) == 0:
                    found_empty_clause = True  
                if resolvent not in clauses and resolvent not in new:
                    new.append(resolvent)
        
        filtered_new_clauses = [clause for clause in new if not is_useless_clause(clause)]
        iterations.append(filtered_new_clauses) 
        
        print(f"The {iterative} loop resolves {len(filtered_new_clauses)} new clauses.")
        iterative += 1
        
        if found_empty_clause:
            return iterations, "YES"
        
        if len(filtered_new_clauses) == 0:
            return iterations, "NO"
        
        clauses.extend(filtered_new_clauses) 

def main():
    input_filename = input("Enter the testcase file: ")
    output_filename = 'output.txt'
    
    try:
        alpha, clauses = read_input(input_filename)
    except FileNotFoundError:
        print(f"Error: No such file or directory: '{input_filename}'.")
        return
    except IOError:
        print(f"Error when trying to read file: '{input_filename}'.")
        return
    
    iterations, result = PL_resolution(alpha, clauses)
    print(f"Result: {result}.")
    sorted_iterations = [[sort_literals(clause) for clause in iteration] for iteration in iterations]

    with open(output_filename, 'w', encoding='utf-8') as file:
        for iteration_clauses in sorted_iterations:
            file.write(f"{len(iteration_clauses)}\n")
            for clause in iteration_clauses:
                if len(clause) == 0:
                    file.write("{}\n")
                else:
                    file.write(f"{' OR '.join(clause)}\n")
        file.write(result)
    
    print(f"Success! The results have been written to '{output_filename}'.")

if __name__ == "__main__":
    main()
