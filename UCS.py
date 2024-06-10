import heapq

def ucs(maze, start, end):
    # Các bước di chuyển theo thứ tự ưu tiên: RIGHT, DOWN, LEFT, UP
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
    priority_queue = [(0, start)]  # Hàng đợi ưu tiên, phần tử là (chi phí, tọa độ)
    visited = set()
    parent = {start: None}
    cost = {start: 0}

    while priority_queue:
        current_cost, current = heapq.heappop(priority_queue)
    
    
        # Kiểm tra nếu đã đến đích
        if current == end:
            path = []
            while current:
                path.append(current)
                current = parent[current]
            
            for i in visited:
                maze[i[0]][i[1]] = 2
            return path[::-1]  # Trả về đường đi từ start đến end

        if current in visited:
            continue
        visited.add(current)

        # Kiểm tra các ô lân cận
        for direction in directions:
            neighbor = (current[0] + direction[0], current[1] + direction[1])
            new_cost = current_cost + 1  # Giả sử chi phí di chuyển giữa các ô là 1

            if (0 <= neighbor[0] < len(maze) and
                0 <= neighbor[1] < len(maze[0]) and
                maze[neighbor[0]][neighbor[1]] == 0 and
                (neighbor not in cost or new_cost < cost[neighbor])):
                cost[neighbor] = new_cost
                heapq.heappush(priority_queue, (new_cost, neighbor))
                parent[neighbor] = current

    return None  # Trả về None nếu không tìm thấy đường đi

# Ví dụ mê cung, 0 là đường đi, 1 là tường
maze = [
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1],
[1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1],
[1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
[1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
[1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1],
[0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
[1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1],
[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
[1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1],
[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
[1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,1],
[1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
[1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
]

start = (9, 0)  # Điểm xuất phát
end = (11, 30)    # Điểm đích

path = ucs(maze, start, end)
print("Đường đi từ điểm xuất phát đến điểm đích:", path)
for list in maze:
    print(list)
