#include "sort_with_count_compare.h"

void selectionSort_c(int a[], int n, long long& count_compare) {
    for (int i = 0; ++count_compare && i < n - 1; i++) {
        int minIndex = i;
        for (int j = i + 1; ++count_compare && j < n; j++) {
            if (++count_compare && a[j] < a[minIndex]) {
                minIndex = j;
            }
        }
        int temp = a[minIndex];
        a[minIndex] = a[i];
        a[i] = temp;
    }
}
// void insertionSort_c(int a[], int n, long long& count_compare) {
//     for (int i = 1; ++count_compare && i < n; i++) {
//         int key = a[i];
//         int j = i - 1;
//         while (++count_compare && j >= 0 && ++count_compare && a[j] > key) {
//             a[j + 1] = a[j];
//             j--;
//         }
//         a[j + 1] = key;
//     }
// }

void insertionSort_c(int a[], int n, long long& count_compare) { //binary insertion sort
	for(int i = 1; ++count_compare && i < n;i++) {
		int key = a[i];
		int left = 0, right = i-1 ;
		while( ++count_compare && right >= left) {
		  int m = (left + right) / 2;
		  if(++count_compare && key < a[m] ) right = m - 1;
		  else left = m + 1;
		 }
		 for( int j= i - 1; ++count_compare && j >= left; j-- ) 
			a[j+1]=a[j];
		 a[left] = key;
	}
}

void bubbleSort_c(int a[], int n, long long& count_compare) {
    bool swapped;
    for (int i = 0; ++count_compare && i < n - 1; i++) {
        swapped = false;
        for (int j = 0; ++count_compare && j < n - i - 1; j++) {
            if (++count_compare && a[j] > a[j + 1]) {
                int temp = a[j];
                a[j] = a[j + 1];
                a[j + 1] = temp;
                swapped = true;
            }
        }
        if (++count_compare && !swapped)
            break;
    }
}
void shakerSort_c(int a[], int n, long long& count_compare) {
    int low = 0, high = n - 1;
    bool swapped = true;

    while (++count_compare && swapped == true)
    {
        swapped = false;

        for (int i = low; ++count_compare && i < high; i += 1)
        {
            if (++count_compare && a[i] > a[i + 1])
            {
                int temp = a[i];
                a[i] = a[i + 1];
                a[i + 1] = temp;
                swapped = true;
            }
        }

        if (++count_compare && swapped == false)
            break;

        swapped = false;
        high -= 1;

        for (int i = high; ++count_compare && i > low; i -= 1)
        {
            if (++count_compare&& a[i] < a[i - 1])
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
void shellSort_c(int a[], int n, long long& count_compare) {
    for (int gap = n / 2; ++count_compare && gap > 0; gap /= 2)
    {
        for (int i = gap; ++count_compare && i < n; i += 1)
        {
            int temp = a[i];
            int j = i;
            while (++count_compare && j >= gap && ++count_compare && a[j - gap] > temp)
            {
                a[j] = a[j - gap];
                j -= gap;
            }
            a[j] = temp;
        }
    }
}
void heapify_c(int a[], int n, int i, long long& count_compare) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    if (++count_compare && left < n && ++count_compare && a[left] > a[largest])
        largest = left;
    if (++count_compare && right < n && ++count_compare && a[right] > a[largest])
        largest = right;

    if (++count_compare && largest != i) {
        int temp = a[i];
        a[i] = a[largest];
        a[largest] = temp;
        heapify_c(a, n, largest, count_compare);
    }
}

void heapSort_c(int a[], int n, long long& count_compare) {

    for (int i = n / 2 - 1; ++count_compare && i >= 0; i--)
        heapify_c(a, n, i, count_compare);
    for (int i = n - 1; ++count_compare && i >= 0; i--) {
        int temp = a[0];
        a[0] = a[i];
        a[i] = temp;
        heapify_c(a, i, 0, count_compare);
    }
}

void merge_c(int a[], int low, int mid, int high, long long& count_compare) {
    int leftSize = mid - low + 1;
    int rightSize = high - mid;
    int* left = new int[leftSize];
    int* right = new int[rightSize];
    for (int i = 0; ++count_compare && i < leftSize; i++)
        left[i] = a[low + i];
    for (int j = 0; ++count_compare && j < rightSize; j++)
        right[j] = a[mid + 1 + j];

    int i = 0;
    int j = 0;
    int k = low;
    while (++count_compare && i < leftSize && ++count_compare && j < rightSize) {
        if (++count_compare && left[i] <= right[j]) {
            a[k] = left[i];
            i++;
        }
        else {
            a[k] = right[j];
            j++;
        }
        k++;
    }
    while (++count_compare && i < leftSize) {
        a[k] = left[i];
        i++;
        k++;
    }
    while (++count_compare && j < rightSize) {
        a[k] = right[j];
        j++;
        k++;
    }
    delete[] left;
    delete[] right;
}



void merge_sort_c(int a[], int low, int high, long long& count_compare) {
    if (++count_compare && low < high) {
        int mid = low + (high - low) / 2;
        merge_sort_c(a, low, mid, count_compare);
        merge_sort_c(a, mid + 1, high, count_compare);
        merge_c(a, low, mid, high, count_compare);
    }
}

void mergeSort_c(int a[], int n, long long& count_compare) {
    merge_sort_c(a, 0, n - 1, count_compare);
}


//int partition_c(int a[], int low, int high, long long& count_compare) {
//    int pivot = a[low];
//    int i = low + 1;
//
//    for (int j = low + 1; ++count_compare && j <= high; j++)
//    {
//        if (++count_compare && a[j] < pivot)
//        {
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
//void quick_sort_c(int a[], int low, int high, long long& count_compare) {
//    if (++count_compare && low < high) {
//        int pi = partition_c(a, low, high, count_compare);
//        quick_sort_c(a, low, pi - 1, count_compare);
//        quick_sort_c(a, pi + 1, high, count_compare);
//    }
//}
//void quickSort_c(int a[], int n, long long& count_compare) {
//    quick_sort_c(a, 0, n - 1, count_compare);
//}

int partition_c(int arr[], int low, int high, long long& count_compare) {
    int x = arr[high];
    int i = (low - 1);

    for (int j = low; ++count_compare && j <= high - 1; j++) {
        if (++count_compare && arr[j] <= x) {
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
void quick_sort_c(int arr[], int low, int high, long long& count_compare) {
    int* stack = new int[high - low + 1];
    int top = -1;
    stack[++top] = low;
    stack[++top] = high;
    while (++count_compare && top >= 0) {
        high = stack[top--];
        low = stack[top--];
        int p = partition_c(arr, low, high, count_compare);
        if (++count_compare && p - 1 > low) {
            stack[++top] = low;
            stack[++top] = p - 1;
        }
        if (++count_compare && p + 1 < high) {
            stack[++top] = p + 1;
            stack[++top] = high;
        }
    }
    delete[] stack;
}
void quickSort_c(int arr[], int n, long long& count_compare) {
    quick_sort_c(arr, 0, n - 1, count_compare);
}


void countingSort_c(int a[], int n, long long& count_compare) {
    int maxElement = a[0];
    for (int i = 1; ++count_compare && i < n; i++) {
        if (++count_compare && a[i] > maxElement) {
            maxElement = a[i];
        }
    }
    int* count = new int[maxElement + 1];
    for (int i = 0; ++count_compare && i < maxElement + 1; i++)
        count[i] = 0;
    int* sortedArray = new int[n];
    for (int i = 0; ++count_compare && i < n; i++) {
        count[a[i]]++;
    }
    for (int i = 1; ++count_compare && i <= maxElement; i++) {
        count[i] += count[i - 1];
    }
    for (int i = n - 1; ++count_compare && i >= 0; i--) {
        sortedArray[count[a[i]] - 1] = a[i];
        count[a[i]]--;
    }
    for (int i = 0; ++count_compare && i < n; i++) {
        a[i] = sortedArray[i];
    }
    delete[] count;
    delete[] sortedArray;
}



void count_c(int a[], int n, int base, long long& count_compare) {
    int count[10] = { 0 }, i;
    int* output = new int[n];
    for (i = 0; ++count_compare && i < n; i++)
        count[(a[i] / base) % 10]++;
    for (i = 1; ++count_compare && i < 10; i++)
        count[i] += count[i - 1];
    for (i = n - 1; ++count_compare && i >= 0; i--) {
        output[count[(a[i] / base) % 10] - 1] = a[i];
        count[(a[i] / base) % 10]--;
    }
    for (int i = 0; ++count_compare && i < n; i++)
        a[i] = output[i];
    delete[] output;
}
void radixSort_c(int a[], int n, long long& count_compare) {
    int Max = a[0];
    for (int i = 1; ++count_compare && i < n; i++)
        if (++count_compare && a[i] > Max)
            Max = a[i];
    for (int base = 1; ++count_compare && Max / base > 0; base *= 10)
        count_c(a, n, base, count_compare);
}


void flashSort_c(int a[], int n, long long& count_compare) {
    int minValue = a[0];
    int maxIndex = 0;
    int lengthToConsider = int(0.45 * n);
    int* countArray = new int[lengthToConsider];

    for (int i = 0; ++count_compare && i < lengthToConsider; i++)
        countArray[i] = 0;

    for (int i = 1; ++count_compare && i < n; i++)
    {
        if (++count_compare && a[i] < minValue)
            minValue = a[i];
        if (++count_compare && a[i] > a[maxIndex])
            maxIndex = i;
    }

    if (++count_compare && a[maxIndex] == minValue)
    {
        delete[] countArray;
        return;
    }

    double coefficient = (double)(lengthToConsider - 1) / (a[maxIndex] - minValue);

    for (int i = 0; ++count_compare && i < n; i++)
    {
        int countIndex = int(coefficient * (a[i] - minValue));
        countArray[countIndex] += 1;
    }

    for (int i = 1; ++count_compare && i < lengthToConsider; i++)
        countArray[i] += countArray[i - 1];

    int temp = a[maxIndex];
    a[maxIndex] = a[0];
    a[0] = temp;

    int elementsMoved = 0;
    int currentIndex = 0;
    int countIndex = lengthToConsider - 1;
    int tempIndex = 0;
    int flash;

    while (++count_compare && elementsMoved < n - 1)
    {
        while (++count_compare && currentIndex > countArray[countIndex] - 1)
        {
            currentIndex += 1;
            countIndex = int(coefficient * (a[currentIndex] - minValue));
        }
        flash = a[currentIndex];
        if (++count_compare && countIndex < 0)
            break;
        while (++count_compare && currentIndex != countArray[countIndex])
        {
            countIndex = int(coefficient * (flash - minValue));
            int hold = a[tempIndex = --countArray[countIndex]];
            a[tempIndex] = flash;
            flash = hold;
            elementsMoved += 1;
        }
    }

    delete[] countArray;

    for (int i = 1; ++count_compare && i < n; i++)
    {
        int key = a[i];
        int j = i - 1;
        while (++count_compare && j >= 0 && ++count_compare && a[j] > key)
        {
            a[j + 1] = a[j];
            j -= 1;
        }
        a[j + 1] = key;
    }
}
