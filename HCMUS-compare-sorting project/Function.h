#pragma once
#include "Sort.h"
#include "sort_with_count_compare.h"
#include "DataGenerator.h"
#include <string>
using namespace std;

void cloneArray(int source[], int des[], int size);
double runningTime(int a[], int n, void (*ptr)(int[], int));
bool checkExist(char name[], string array[], int len, int& order);
bool isNumber(char num[]);
void command(int argc, char* argv[]);
void Algorithm_mode(int argc, char* argv[]);
void Comparison_mode(int argc, char* argv[]);

