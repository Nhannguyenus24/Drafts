// Bubble sort     O(n^2)
void bubbleSort(int a[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (a[j] > a[j + 1]) {
                int temp = a[j];
                a[j] = a[j + 1];
                a[j + 1] = temp;
            }
        }
    }
}

// Selection sort O(n^2)
void selectionSort(int a[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIndex = i;
        for (int j = i + 1; j < n; j++) {
            if (a[j] < a[minIndex]) {
                minIndex = j;
            }
        }
        int temp = a[minIndex];
        a[minIndex] = a[i];
        a[i] = temp;
    }
}

// Insertion sort O(n^2)
void insertionSort(int a[], int n) {
    for (int i = 1; i < n; i++) {
        int key = a[i];
        int j = i - 1;
        while (j >= 0 && a[j] > key) {
            a[j + 1] = a[j];
            j--;
        }
        a[j + 1] = key;
    }
}

// Heap sort O(nlogn)
void heapify(int a[], int n, int i) {
    int largest = i;     
    int left = 2 * i + 1;    
    int right = 2 * i + 2;   
    if (left < n && a[left] > a[largest])
        largest = left;
    if (right < n && a[right] > a[largest])
        largest = right;

    if (largest != i) {
        int temp = a[i];
        a[i] = a[largest];
        a[largest] = temp;
        heapify(a, n, largest);
    }
}

void heapSort(int a[], int n) {
    
    for (int i = n / 2 - 1; i >= 0; i--) 
        heapify(a, n, i);
    for (int i = n - 1; i >= 0; i--) {
        int temp = a[0];
        a[0] = a[i];
        a[i] = temp;
        heapify(a, i, 0);
    }
}

// Quick sort O(n^2)
int partition(int a[], int low, int high) {
    int pivot = a[low];    
    int i = low + 1;  

    for (int j = low + 1; j <= high; j++) {
        if (a[j] < pivot) {
            int temp = a[i];
            a[i] = a[j];
            a[j] = temp;
            i++;   
        }
    }  
    int temp = a[low];
    a[low] = a[i - 1];
    a[i - 1] = temp;
    return (i - 1);   
}
void quickSort(int a[], int low, int high) {
    if (low < high) {
        int pi = partition(a, low, high);
        quickSort(a, low, pi - 1);
        quickSort(a, pi + 1, high);
    }
}

// Merge sort O(nlogn)
void merge(int a[], int low, int mid, int high) {
    int leftSize = mid - low + 1;    
    int rightSize = high - mid;    
    int left[leftSize];
    int right[rightSize];
    for (int i = 0; i < leftSize; i++)
        left[i] = a[low + i];
    for (int j = 0; j < rightSize; j++)
        right[j] = a[mid + 1 + j];

    int i = 0;  
    int j = 0;  
    int k = low;  
    while (i < leftSize && j < rightSize) {
        if (left[i] <= right[j]) {
            a[k] = left[i];
            i++;
        }
        else {
            a[k] = right[j];
            j++;
        }
        k++;
    }
    while (i < leftSize) {
        a[k] = left[i];
        i++;
        k++;
    }
    while (j < rightSize) {
        a[k] = right[j];
        j++;
        k++;
    }
}

void mergeSort(int a[], int low, int high) {
    if (low < high) {
        int mid = low + (high - low) / 2;
        mergeSort(a, low, mid);
        mergeSort(a, mid + 1, high);
        merge(a, low, mid, high);
    }
}

// Counting sort O(n + max_element)
void countingSort(int a[], int n) {
    int maxElement = a[0];
    for (int i = 1; i < n; i++) {
        if (a[i] > maxElement) {
            maxElement = a[i];
        }
    }
    int count[maxElement + 1] = { 0 };
    for (int i = 0; i < n; i++) {
        count[a[i]]++;
    }
    for (int i = 1; i <= maxElement; i++) {
        count[i] += count[i - 1];
    }
    int sortedArray[n];
    for (int i = n - 1; i >= 0; i--) {
        sortedArray[count[a[i]] - 1] = a[i];
        count[a[i]]--;
    }
    for (int i = 0; i < n; i++) {
        a[i] = sortedArray[i];
    }
}

// Radix sort O(kn) k is the number of digits of max_element
void countSort(int*& a, int n, int base) {
    int count[10] = { 0 }, i;
    int* output = new int[n];
    for (i = 0; i < n; i++)
        count[(a[i] / base) % 10]++;
    for (i = 1; i < 10; i++)
        count[i] += count[i - 1];
    for (i = n - 1; i >= 0; i--) {
        output[count[(a[i] / base) % 10] - 1] = a[i];
        count[(a[i] / base) % 10]--;
    }
    for (int i = 0; i < n; i++)
        a[i] = output[i];
    delete[] output;
}
void radixSort(int* a, int n) {
    int Max = a[0];
    for (int i = 1; i < n; i++)
        if (a[i] > Max)
            Max = a[i];
    for (int base = 1; Max / base > 0; base *= 10)
        countSort(a, n, base);
}
