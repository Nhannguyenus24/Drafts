#Import libraries
import random
import heapq
import timeit
import tracemalloc
from pympler import asizeof
# 1. Search Strategies Implementation
# 1.1. Breadth-first search (BFS)
def bfs(arr, source, destination):
    path = []
    visited = {}
    queue = [source]
    visited[source] = None
    while queue:
        current = queue.pop(0)
        if current == destination:
            while current != None:
                path.append(current)
                current = visited[current]
            return visited, path[::-1], queue
        for neighbor, num in enumerate(arr[current]):
            if num != 0 and neighbor not in visited:
                visited[neighbor] = current
                queue.append(neighbor)
    return visited, None, queue

# 1.2. Depth-first search (DFS)
def dfs(arr, source, destination):
    path = []
    visited = {}
    visit = set()
    visited[source] = None
    def dfs_recursive(current):
        if current == destination:
            return True 
        visit.add(current)
        for neighbor, cost in enumerate(arr[current]):
            if cost > 0 and neighbor not in visit:
                visited[neighbor] = current 
                if dfs_recursive(neighbor):
                    return True
        return False
    if dfs_recursive(source):
        current = destination
        while current != None:
            path.append(current)
            current = visited[current]
        return visited, path[::-1]
    else:
        return visited, None

# 1.3. Uniform-cost search (UCS)
def ucs(arr, source, destination):
    open_set = []
    heapq.heappush(open_set, (0, source))
    cost_so_far = {source: 0}
    visited = {}
    visited[source] = None
    path = []
    while open_set:
        current_cost, current = heapq.heappop(open_set)
        
        if current == destination:
            while current != None:
                path.append(current)
                current = visited[current]
            return visited, path[::-1], open_set, cost_so_far
        
        for neighbor, cost in enumerate(arr[current]):
            if cost > 0:
                new_cost = current_cost + cost
                if neighbor not in cost_so_far or new_cost < cost_so_far[neighbor]:
                    cost_so_far[neighbor] = new_cost
                    priority = new_cost
                    heapq.heappush(open_set, (priority, neighbor))
                    visited[neighbor] = current
    
    return visited, None, open_set, cost_so_far

# 1.4. Iterative deepening search (IDS)
# 1.4.a. Depth-limited search
def dls(arr, source, destination, depth_limit):
    def dls_recursive(current, depth):
        if depth > depth_limit:
            return False
        if current == destination:
            return True
        visit.add(current)
        for neighbor, cost in enumerate(arr[current]):
            if cost > 0 and neighbor not in visit:
                visited[neighbor] = current
                if dls_recursive(neighbor, depth + 1):
                    return True
        return False
    path = []
    visited = {}
    visit = set()
    visited[source] = None
    if dls_recursive(source, 0):
        current = destination
        while current != None:
            path.append(current)
            current = visited[current]
        return visited, path[::-1]
    else:
        return visited, None

# 1.4.b. IDS
def ids(arr, source, destination):
    for depth_limit in range(len(arr[0])):
        visited, path = dls(arr, source, destination, depth_limit)
        if path != None:
            return visited, path
    return visited, None

# 1.5. Greedy best first search (GBFS)
def gbfs(arr, source, destination, heuristic):
    path = []
    visited = {}
    current = source
    visited[source] = None
    
    while current != destination:
        h = float('inf')
        min_index = None
        
        for neighbor, cost in enumerate(arr[current]):
            if cost != 0 and neighbor not in visited:
                if heuristic[neighbor] < h:
                    min_index = neighbor
                    h = heuristic[neighbor]
                    visited[neighbor] = current
        
        if min_index is None:
            return visited, None
        
        current = min_index
    
    while current != None:
        path.append(current)
        current = visited[current]
    return visited, path[::-1]


# 1.6. Graph-search A* (AStar)
def astar(arr, source, destination, heuristic):
    path = []
    visited = {}
    current = source
    visited[source] = None
    while len(visited) < len(arr[0]):
        h = float('inf')
        for neighbor, cost in enumerate(arr[current]):
            if cost != 0 and neighbor not in visited:
                if neighbor == destination:
                    visited[neighbor] = current
                    current = neighbor
                    while current != None:
                        path.append(current)
                        current = visited[current]
                    return visited, path[::-1]
                if cost + heuristic[neighbor] < h:
                    min_index = neighbor 
                    h = cost + heuristic[neighbor]
        visited[min_index] = current
        current = min_index    
    return visited, None

# 1.7. Hill-climbing First-choice (HC)
def hc(arr, source, destination, heuristic):
    path = []
    visited = {}
    current = source
    visited[source] = None
    neighbors = list(range(len(heuristic)))
    while current != destination:
        random.shuffle(neighbors)
        found_better_neighbor = False
        for random_neighbor in neighbors:
            if arr[current][random_neighbor] != 0 and random_neighbor not in visited:
                visited[random_neighbor] = current 
                if heuristic[random_neighbor] < heuristic[current]:
                    current = random_neighbor
                    found_better_neighbor = True
                    break
        
        if not found_better_neighbor:
            return visited, None
    
    while current != None:
        path.append(current)
        current = visited[current]
    return visited, path[::-1]

def read_graph(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        num_nodes = int(file.readline().strip())
        start, goal = map(int, file.readline().strip().split())
        adjacency_matrix = []
        for _ in range(num_nodes):
            row = list(map(int, file.readline().strip().split()))
            adjacency_matrix.append(row)
        
        heuristic_weights = list(map(int, file.readline().strip().split()))
    
    return num_nodes, start, goal, adjacency_matrix, heuristic_weights

def list_to_string(numbers):
    if numbers == None:
        return '-1'
    return ' -> '.join([str(num) for num in numbers])

def path_cost(arr, path):
    cost = 0
    if path == None:
        return -1
    for i in range(len(path) - 1):
        cost += arr[path[i]][path[i + 1]]
    return cost
# 2. Main function
if __name__ == "__main__":
    # Read the input data
    file_path = input("Enter the path to the input file: ")
    num_nodes, start, goal, adjacency_matrix, heuristic_weights = read_graph(file_path)
    
    #Memory measuring
    tracemalloc.start()
    
    snapshot1 = tracemalloc.take_snapshot()
    bfs_v, bfs_p, bfs_queue = bfs(adjacency_matrix, start, goal)
    snapshot2 = tracemalloc.take_snapshot()
    top_stats = snapshot2.compare_to(snapshot1, 'lineno')
    bfs_memory = (sum(stat.size for stat in top_stats) / 1024) + asizeof.asizeof(bfs_v) / 1024 + asizeof.asizeof(bfs_queue) / 1024
    
    snapshot1 = tracemalloc.take_snapshot()
    dfs_v, dfs_p = dfs(adjacency_matrix, start, goal)
    snapshot2 = tracemalloc.take_snapshot()
    top_stats = snapshot2.compare_to(snapshot1, 'lineno')
    dfs_memory = sum(stat.size for stat in top_stats) / 1024 + asizeof.asizeof(dfs_v) / 1024
    
    snapshot1 = tracemalloc.take_snapshot()
    ucs_v, ucs_p, ucs_set, ucs_cost_so_far = ucs(adjacency_matrix, start, goal)
    snapshot2 = tracemalloc.take_snapshot()
    top_stats = snapshot2.compare_to(snapshot1, 'lineno')
    ucs_memory = sum(stat.size for stat in top_stats) / 1024 + asizeof.asizeof(ucs_v) / 1024 + asizeof.asizeof(ucs_set) / 1024 + asizeof.asizeof(ucs_cost_so_far) / 1024
    
    snapshot1 = tracemalloc.take_snapshot()
    ids_v, ids_p = ids(adjacency_matrix, start, goal)
    snapshot2 = tracemalloc.take_snapshot()
    top_stats = snapshot2.compare_to(snapshot1, 'lineno')
    ids_memory = sum(stat.size for stat in top_stats) / 1024 + asizeof.asizeof(ids_v) / 1024
    
    snapshot1 = tracemalloc.take_snapshot()
    gbfs_v, gbfs_p = gbfs(adjacency_matrix, start, goal, heuristic_weights)
    snapshot2 = tracemalloc.take_snapshot()
    top_stats = snapshot2.compare_to(snapshot1, 'lineno')
    gbfs_memory = sum(stat.size for stat in top_stats) / 1024 + asizeof.asizeof(gbfs_v) / 1024
    
    snapshot1 = tracemalloc.take_snapshot()
    a_v, a_p = astar(adjacency_matrix, start, goal, heuristic_weights)
    snapshot2 = tracemalloc.take_snapshot()
    top_stats = snapshot2.compare_to(snapshot1, 'lineno')  
    a_memory = sum(stat.size for stat in top_stats) / 1024 + asizeof.asizeof(a_v) / 1024
    
    snapshot1 = tracemalloc.take_snapshot()
    hc_v, hc_p = hc(adjacency_matrix, start, goal, heuristic_weights)
    snapshot2 = tracemalloc.take_snapshot()
    top_stats = snapshot2.compare_to(snapshot1, 'lineno')
    hc_memory = sum(stat.size for stat in top_stats) / 1024 + asizeof.asizeof(hc_v) / 1024
    tracemalloc.stop()
    #Time measuring
    bfs_time = timeit.timeit(lambda: bfs(adjacency_matrix, start, goal), number=100) / 100
    dfs_time = timeit.timeit(lambda: dfs(adjacency_matrix, start, goal), number=100) / 100
    ucs_time = timeit.timeit(lambda: ucs(adjacency_matrix, start, goal), number=100) / 100
    ids_time = timeit.timeit(lambda: ids(adjacency_matrix, start, goal), number=100) / 100
    gbfs_time = timeit.timeit(lambda: gbfs(adjacency_matrix, start, goal, heuristic_weights), number=100) / 100
    a_time = timeit.timeit(lambda: astar(adjacency_matrix, start, goal, heuristic_weights), number=100) / 100
    hc_time = timeit.timeit(lambda: hc(adjacency_matrix, start, goal, heuristic_weights), number=100) / 100

    #Show the output data
    with open('output.txt', 'w', encoding='utf-8') as file:
        file.write("BFS:\n")
        file.write(f"Visited: {bfs_v}\n")
        file.write("Path: " + list_to_string(bfs_p) + "\n")
        file.write(f'Cost: {path_cost(adjacency_matrix, bfs_p)}\n')
        file.write(f'Time: {bfs_time:.10f} seconds\n')
        file.write(f'Memory: {bfs_memory:.10f} KiB\n\n')
        
        file.write("DFS:\n")
        file.write(f"Visited: {dfs_v}\n")
        file.write("Path: " + list_to_string(dfs_p) + "\n")
        file.write(f'Cost: {path_cost(adjacency_matrix, dfs_p)}\n')
        file.write(f'Time: {dfs_time:.10f} seconds\n')
        file.write(f'Memory: {dfs_memory:.10f} KiB\n\n')
        
        file.write("UCS:\n")
        file.write(f"Visited: {ucs_v}\n")
        file.write("Path: " + list_to_string(ucs_p) + "\n")
        file.write(f'Cost: {path_cost(adjacency_matrix, ucs_p)}\n')
        file.write(f'Time: {ucs_time:.10f} seconds\n')
        file.write(f'Memory: {ucs_memory:.10f} KiB\n\n')
        
        file.write("IDS:\n")
        file.write(f"Visited: {ids_v}\n")
        file.write("Path: " + list_to_string(ids_p) + "\n")
        file.write(f'Cost: {path_cost(adjacency_matrix, ids_p)}\n')
        file.write(f'Time: {ids_time:.10f} seconds\n')
        file.write(f'Memory: {ids_memory:.10f} KiB\n\n')
        
        file.write("GBFS:\n")
        file.write(f"Visited: {gbfs_v}\n")
        file.write("Path: " + list_to_string(gbfs_p) + "\n")
        file.write(f'Cost: {path_cost(adjacency_matrix, gbfs_p)}\n')
        file.write(f'Time: {gbfs_time:.10f} seconds\n')
        file.write(f'Memory: {gbfs_memory:.10f} KiB\n\n')
        
        file.write("A*:\n")
        file.write(f"Visited: {a_v}\n")
        file.write("Path: " + list_to_string(a_p) + "\n")
        file.write(f'Cost: {path_cost(adjacency_matrix, a_p)}\n')
        file.write(f'Time: {a_time:.10f} seconds\n')
        file.write(f'Memory: {a_memory:.10f} KiB\n\n')
        
        file.write("Hill-climbing:\n")
        file.write(f"Visited: {hc_v}\n")
        file.write("Path: " + list_to_string(hc_p) + "\n")
        file.write(f'Cost: {path_cost(adjacency_matrix, hc_p)}\n')
        file.write(f'Time: {hc_time:.10f} seconds\n')
        file.write(f'Memory: {hc_memory:.10f} KiB\n\n')
    pass