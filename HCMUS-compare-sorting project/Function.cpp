#include "Function.h"
#include <iostream>
#include <cstring>
#include <fstream>
#include <cctype>
#include <chrono>


typedef void (*sortf_ptr)(int[], int);
typedef void (*sortc_ptr)(int[], int, long long&);
sortf_ptr sortfArray[11] = { selectionSort, insertionSort, bubbleSort, shakerSort, shellSort, heapSort, mergeSort, quickSort, countingSort, radixSort, flashSort };
sortc_ptr sortcArray[11] = { selectionSort_c, insertionSort_c, bubbleSort_c, shakerSort_c, shellSort_c, heapSort_c, mergeSort_c, quickSort_c, countingSort_c, radixSort_c, flashSort_c };
string sortnArray[11] = { "selection-sort", "insertion-sort", "bubble-sort", "shaker-sort", "shell-sort", "heap-sort", "merge-sort", "quick-sort", "counting-sort", "radix-sort", "flash-sort" };
string inputOrder[4] = { "-rand", "-sorted", "-rev", "-nsorted" };
string outputParameter[3] = { "-time", "-comp", "-both" };
string dataType[4] = { "Randomize", "Sorted", "Reversed", "Nearly Sorted" };
string generateFile[4] = { "input_1.txt", "input_3.txt", "input_4.txt", "input_2.txt" };

void cloneArray(int source[], int des[], int size) {
    for (int i = 0; i < size; i++)
        des[i] = source[i];
}
double runningTime(int a[], int n, void (*ptr)(int[], int)) {
    auto start = chrono::high_resolution_clock::now();
    ptr(a, n);
    auto end = chrono::high_resolution_clock::now();
    chrono::duration<double, milli> elapsed = end - start;
    return elapsed.count();
}

bool isNumber(char num[]) {
    for (int i = 0; num[i] != '\0'; i++) {
        if (!isdigit(num[i]))
            return false;
    }
    return true;
}
bool checkExist(char name[], string array[], int len, int& order) {
    for (int i = 0; i < len; i++) {
        if (strcmp(name, array[i].c_str()) == 0){
            order = i;
            return true;
        }
    }
    return false;
}

void command(int argc, char* argv[]) {
    if (argv[1] != NULL && strcmp(argv[1], "-a") == 0) {
        cout << "ALGORITHM MODE" << endl;
        Algorithm_mode(argc, argv);
    }
    else if (argv [1] != NULL && strcmp(argv[1], "-c") == 0) {
        cout << "COMPARISON MODE" << endl;
        Comparison_mode(argc, argv);
    }
    else
        cout << "Input wrong command!" << endl;
}
void Algorithm_mode(int argc, char* argv[]) {
    const char* file = ".txt";
    int input_order, output_order, sort_order, size;
    if (argc == 5) {
        if (checkExist(argv[2], sortnArray, 11, sort_order) 
            && (strstr(argv[3], file) != NULL) 
            && checkExist(argv[4], outputParameter, 3, output_order)) {
            //Command 1
            cout << "Algorithm: " << argv[2] << endl;
            cout << "Input file: " << argv[3] << endl;
            fstream in(argv[3]);
            in >> size;
            int* arr = new int[size];
            int* arr2 = new int[size];
            for (int i = 0; i < size; i++)
                in >> arr[i];
            in.close();
            cout << "Input size: " << size << endl;
            cout << "-------------------------" << endl;
            cloneArray(arr, arr2, size);
            if (output_order == 2 || output_order == 0) {
                sortf_ptr sort = sortfArray[sort_order];
                double time = runningTime(arr, size, sort);
                cout << "Running time: " << time << endl;
            }
            if (output_order == 1 || output_order == 2) {
                long long comparisions = 0;
                sortc_ptr sort_count_compare = sortcArray[sort_order];
                sort_count_compare(arr2, size, comparisions);
                cout << "Comparisions: " << comparisions << endl;
            }
            ofstream out("output.txt");
            out << size << endl;
            for (int i = 0; i < size; i++)
                out << arr[i] << " ";
            out.close();
            delete[] arr;
            delete[] arr2;
        }
        else if (checkExist(argv[2], sortnArray, 11, sort_order) 
            && isNumber(argv[3]) 
            && checkExist(argv[4], outputParameter, 3, output_order)) {
            //Command 3
            size = atoi(argv[3]);
            cout << "Algorithm: " << argv[2] << endl;
            cout << "Input size: " << size << endl;
            int* arr = new int[size];
            int* arr2 = new int[size];
            for (int i = 0; i < 4; i++) {
                cout << endl << "Input order: " << dataType[i] << endl << "-------------------------" << endl;
                GenerateData(arr, size, i);
                ofstream in(generateFile[i]);
                in << size << endl;
                for (int i = 0; i < size; i++)
                    in << arr[i] << " ";
                in.close();
                cloneArray(arr, arr2, size);
                if (output_order == 2 || output_order == 0) {
                    sortf_ptr sort = sortfArray[sort_order];
                    double time = runningTime(arr2, size, sort);
                    cout << "Running time: " << time << endl;
                }
                if (output_order == 1 || output_order == 2) {
                    long long comparisions = 0;
                    sortc_ptr sort_count_compare = sortcArray[sort_order];
                    sort_count_compare(arr, size, comparisions);
                    cout << "Comparisions: " << comparisions << endl;
                }
            }
            delete[] arr;
            delete[] arr2;
        }
        else
            cout << "Input wrong command!" << endl;
    }
    else if (argc == 6) {
        if (checkExist(argv[2], sortnArray, 11, sort_order) 
            && isNumber(argv[3]) 
            && checkExist(argv[4], inputOrder, 4, input_order) 
            && checkExist(argv[5], outputParameter, 3, output_order)) {
            //Command 2
            size = atoi(argv[3]);
            cout << "Algorithm: " << argv[2] << endl;
            cout << "Input size: " << size << endl;
            cout << "Input order: " << dataType[input_order] << endl;
            cout << "-------------------------" << endl;
            int* arr = new int[size];
            int* arr2 = new int[size];
            GenerateData(arr, size, input_order);
            ofstream in("input.txt");
            in << size << endl;
            for (int i = 0; i < size; i++)
                in << arr[i] << " ";
            in.close();
            cloneArray(arr, arr2, size);
            if (output_order == 2 || output_order == 0) {
                sortf_ptr sort = sortfArray[sort_order];
                double time = runningTime(arr, size, sort);
                cout << "Running time: " << time << endl;
            }
            if (output_order == 1 || output_order == 2) {
                long long comparisions = 0;
                sortc_ptr sort_count_compare = sortcArray[sort_order];
                sort_count_compare(arr2, size, comparisions);
                cout << "Comparisions: " << comparisions << endl;
            }
            ofstream out("output.txt");
            out << size << endl;
            for (int i = 0; i < size; i++)
                out << arr[i] << " ";
            out.close();
            delete[] arr;
            delete[] arr2;
        }
        else {
            cout << "Input wrong command!" << endl;
        }
    }
    else
        cout << "Input wrong command!" << endl;
}
void Comparison_mode(int argc, char* argv[]) {
    const char* file = ".txt";
    int sort_order1, sort_order2, input_order, size;
    if (argc == 5) {
        if (checkExist(argv[2], sortnArray, 11, sort_order1) 
            && checkExist(argv[3], sortnArray, 11, sort_order2) 
            && (strstr(argv[4], file) != NULL)) {
            //Command 4
            fstream in(argv[4]);
            in >> size;
            int* arr = new int[size];
            for (int i = 0; i < size; i++)
                in >> arr[i];
            in.close();
            cout << "Algorithm: " << argv[2] << " | " << argv[3] << endl;
            cout << "Input file: " << argv[4] << endl;
            cout << "------------------------" << endl;
            int* arr2 = new int[size];
            cloneArray(arr, arr2, size);
            sortf_ptr sort1 = sortfArray[sort_order1];
            sortf_ptr sort2 = sortfArray[sort_order2];
            double time1 = runningTime(arr2, size, sort1);
            cloneArray(arr, arr2, size);
            double time2 = runningTime(arr2, size, sort2);
            cloneArray(arr, arr2, size);
            long long comparision1 = 0, comparision2 = 0;
            sortc_ptr sort_count_compare1 = sortcArray[sort_order1];
            sortc_ptr sort_count_compare2 = sortcArray[sort_order2];
            sort_count_compare1(arr, size, comparision1);
            sort_count_compare2(arr2, size, comparision2);
            cout << "Running time: " << time1 << " | " << time2 << endl;
            cout << "Comparisions: " << comparision1 << " | " << comparision2 << endl;
            delete[] arr;
            delete[] arr2;
        }
        else
            cout << "Input wrong command!" << endl;
    }
    else if (argc == 6) {
        if (checkExist(argv[2], sortnArray, 11, sort_order1) 
            && checkExist(argv[3], sortnArray, 11, sort_order2) 
            && isNumber(argv[4]) 
            && checkExist(argv[5], inputOrder, 4, input_order)) {
            //Command 5
            size = atoi(argv[4]);
            int* arr = new int[size];
            GenerateData(arr, size, input_order);
            ofstream in("input.txt");
            in << size << endl;
            for (int i = 0; i < size; i++)
                in << arr[i] << " ";
            in.close();
            cout << "Algorithm: " << argv[2] << " | " << argv[3] << endl;
            cout << "Input size: " << size << endl;
            cout << "Input order: " << dataType[input_order] << endl;
            cout << "------------------------" << endl;
            int* arr2 = new int[size];
            cloneArray(arr, arr2, size);
            sortf_ptr sort1 = sortfArray[sort_order1];
            sortf_ptr sort2 = sortfArray[sort_order2];
            double time1 = runningTime(arr2, size, sort1);
            cloneArray(arr, arr2, size);
            double time2 = runningTime(arr2, size, sort2);
            cloneArray(arr, arr2, size);
            long long comparision1 = 0, comparision2 = 0;
            sortc_ptr sort_count_compare1 = sortcArray[sort_order1];
            sortc_ptr sort_count_compare2 = sortcArray[sort_order2];
            sort_count_compare1(arr, size, comparision1);
            sort_count_compare2(arr2, size, comparision2);
            cout << "Running time: " << time1 << " | " << time2 << endl;
            cout << "Comparisions: " << comparision1 << " | " << comparision2 << endl;
            delete[] arr;
            delete[] arr2;
        }
        else
            cout << "Input wrong command!" << endl;
    }
    else
        cout << "Input wrong command!" << endl;
}
