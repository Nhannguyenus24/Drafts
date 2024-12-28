#pragma once
using namespace std;

void selectionSort_c(int a[], int n, long long & count_compare);
void insertionSort_c(int a[], int n, long long &count_compare);
void bubbleSort_c(int a[], int n, long long &count_compare);
void shakerSort_c(int a[], int n, long long & count_compare);
void shellSort_c(int a[], int n, long long &count_compare);
void heapify_c(int a[], int n, int i, long long & count_compare);
void heapSort_c(int a[], int n, long long &count_compare);
void merge_c(int a[], int low, int mid, int high,long long &count_compare);
void merge_sort_c(int a[], int low, int high,long long &count_compare);
void mergeSort_c(int a[], int n,long long &count_compare);
int partition_c(int a[], int low, int high,long long &count_compare);
void quick_sort_c(int a[], int low, int high,long long &count_compare);
void quickSort_c(int a[], int n,long long &count_compare);
void countingSort_c(int a[],int n,long long &count_compare);
void count_c(int a[], int n, int base,long long& count_compare);
void radixSort_c (int a[], int n,long long &count_compare);
void flashSort_c(int a[], int n,long long &count_compare);
