#include "Sort.h"

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

// void insertionSort(int a[], int n) {
//     for (int i = 1; i < n; i++) {
//         int key = a[i];
//         int j = i - 1;
//         while (j >= 0 && a[j] > key) {
//             a[j + 1] = a[j];
//             j--;
//         }
//         a[j + 1] = key;
//     }
// }

void insertionSort(int a[], int n) { // binary insertion sort
	for(int i = 1; i < n;i++) {
		int key = a[i];
		int left = 0, right = i-1 ;
		while(right >= left) {
		  int m = (left + right) / 2;
		  if( key < a[m] ) right = m - 1;
		  else left = m + 1;
		 }
		 for( int j= i - 1;j >= left; j-- ) 
			a[j+1]=a[j];
		 a[left] = key;
	}
}

void bubbleSort(int a[], int n) {
    bool swapped;
    for (int i = 0; i < n - 1; i++) {
        swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (a[j] > a[j + 1]) {
                int temp = a[j];
                a[j] = a[j + 1];
                a[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped)
            break;
    }
}

void shakerSort(int a[], int n) {
    int low = 0, high = n - 1;
    bool swapped = true;

    while (swapped == true)
    {
        swapped = false;

        for (int i = low; i < high; i += 1)
        {
            if (a[i] > a[i + 1])
            {
                int temp = a[i];
                a[i] = a[i + 1];
                a[i + 1] = temp;
                swapped = true;
            }
        }

        if (swapped == false)
            break;

        swapped = false;
        high -= 1;

        for (int i = high; i > low; i -= 1)
        {
            if (a[i] < a[i - 1])
            {
                int temp = a[i];
                a[i] = a[i - 1];
                a[i - 1] = temp;
                swapped = true;
            }
        }

        low += 1;
    }
}

void shellSort(int a[], int n) {
    for (int gap = n / 2; gap > 0; gap /= 2)
    {
        for (int i = gap; i < n; i += 1)
        {
            int temp = a[i];
            int j = i;
            while (j >= gap && a[j - gap] > temp)
            {
                a[j] = a[j - gap];
                j -= gap;
            }
            a[j] = temp;
        }
    }
}

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

void merge(int a[], int low, int mid, int high) {
    int leftSize = mid - low + 1;
    int rightSize = high - mid;
    int* left = new int[leftSize];
    int* right = new int[rightSize];
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
    delete[] left;
    delete[] right;
}

void merge_sort(int a[], int low, int high) {
    if (low < high) {
        int mid = low + (high - low) / 2;
        merge_sort(a, low, mid);
        merge_sort(a, mid + 1, high);
        merge(a, low, mid, high);
    }
}

void mergeSort(int a[], int n) {
    merge_sort(a, 0, n - 1);
}

//int partition(int a[], int low, int high) {
//    int pivot = a[low];
//    int i = low + 1;
//
//    for (int j = low + 1; j <= high; j++) {
//        if (a[j] < pivot) {
//            int temp = a[i];
//            a[i] = a[j];
//            a[j] = temp;
//            i++;
//        }
//    }
//    int temp = a[low];
//    a[low] = a[i - 1];
//    a[i - 1] = temp;
//    return (i - 1);
//}
//void quick_sort(int a[], int low, int high) {
//    if (low < high) {
//        int pi = partition(a, low, high);
//        quick_sort(a, low, pi - 1);
//        quick_sort(a, pi + 1, high);
//    }
//}
//
//void quickSort(int a[], int n) {
//    quick_sort(a, 0, n - 1);
//}

int partition(int arr[], int low, int high) {
    int x = arr[high];
    int i = (low - 1);

    for (int j = low; j <= high - 1; j++) {
        if (arr[j] <= x) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[high];
    arr[high] = arr[i + 1];
    arr[i + 1] = temp;
    return (i + 1);
}
void quick_sort(int arr[], int low, int high) {
    int* stack = new int[high - low + 1];
    int top = -1;
    stack[++top] = low;
    stack[++top] = high;
    while (top >= 0) {
        high = stack[top--];
        low = stack[top--];
        int p = partition(arr, low, high);
        if (p - 1 > low) {
            stack[++top] = low;
            stack[++top] = p - 1;
        }
        if (p + 1 < high) {
            stack[++top] = p + 1;
            stack[++top] = high;
        }
    }
    delete[] stack;
}
void quickSort(int arr[], int n) {
    quick_sort(arr, 0, n - 1);
}

void countingSort(int a[], int n) {
    int maxElement = a[0];
    for (int i = 1; i < n; i++) {
        if (a[i] > maxElement) {
            maxElement = a[i];
        }
    }
    int* count = new int[maxElement + 1];
    for (int i = 0; i < maxElement + 1; i++)
        count[i] = 0;
    int* sortedArray = new int[n];
    for (int i = 0; i < n; i++) {
        count[a[i]]++;
    }
    for (int i = 1; i <= maxElement; i++) {
        count[i] += count[i - 1];
    }
    for (int i = n - 1; i >= 0; i--) {
        sortedArray[count[a[i]] - 1] = a[i];
        count[a[i]]--;
    }
    for (int i = 0; i < n; i++) {
        a[i] = sortedArray[i];
    }
    delete[] count;
    delete[] sortedArray;
}

void count(int a[], int n, int base) {
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
void radixSort(int a[], int n) {
    int Max = a[0];
    for (int i = 1; i < n; i++)
        if (a[i] > Max)
            Max = a[i];
    for (int base = 1; Max / base > 0; base *= 10)
        count(a, n, base);
}

void flashSort(int a[], int n) {
    int minValue = a[0];
    int maxIndex = 0;
    int lengthToConsider = int(0.45 * n);
    int* countArray = new int[lengthToConsider];

    for (int i = 0; i < lengthToConsider; i++)
        countArray[i] = 0;

    for (int i = 1; i < n; i++)
    {
        if (a[i] < minValue)
            minValue = a[i];
        if (a[i] > a[maxIndex])
            maxIndex = i;
    }

    if (a[maxIndex] == minValue)
    {
        delete[] countArray;
        return;
    }

    double coefficient = (double)(lengthToConsider - 1) / (a[maxIndex] - minValue);

    for (int i = 0; i < n; i++)
    {
        int countIndex = int(coefficient * (a[i] - minValue));
        countArray[countIndex] += 1;
    }

    for (int i = 1; i < lengthToConsider; i++)
        countArray[i] += countArray[i - 1];

    int temp = a[maxIndex];
    a[maxIndex] = a[0];
    a[0] = temp;

    int elementsMoved = 0;
    int currentIndex = 0;
    int countIndex = lengthToConsider - 1;
    int tempIndex = 0;
    int flash;

    while (elementsMoved < n - 1)
    {
        while (currentIndex > countArray[countIndex] - 1)
        {
            currentIndex += 1;
            countIndex = int(coefficient * (a[currentIndex] - minValue));
        }
        flash = a[currentIndex];
        if (countIndex < 0)
            break;
        while (currentIndex != countArray[countIndex])
        {
            countIndex = int(coefficient * (flash - minValue));
            int hold = a[tempIndex = --countArray[countIndex]];
            a[tempIndex] = flash;
            flash = hold;
            elementsMoved += 1;
        }
    }

    delete[] countArray;

    for (int i = 1; i < n; i++)
    {
        int key = a[i];
        int j = i - 1;
        while (j >= 0 && a[j] > key)
        {
            a[j + 1] = a[j];
            j -= 1;
        }
        a[j + 1] = key;
    }
}
