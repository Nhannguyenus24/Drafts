def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    # Divide the list into two halves
    mid = len(arr) // 2
    left_half = arr[:mid]
    right_half = arr[mid:]
    
    # Recursive calls to sort the sublists
    left_half = merge_sort(left_half)
    right_half = merge_sort(right_half)
    
    # Merge the sorted sublists
    return merge(left_half, right_half)

def merge(left, right):
    merged = []
    left_index = 0
    right_index = 0
    
    # Compare elements from both sublists and merge them
    while left_index < len(left) and right_index < len(right):
        if left[left_index] < right[right_index]:
            merged.append(left[left_index])
            left_index += 1
        else:
            merged.append(right[right_index])
            right_index += 1
    
    # Append remaining elements, if any
    merged.extend(left[left_index:])
    merged.extend(right[right_index:])
    
    return merged
