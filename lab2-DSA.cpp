#include <iostream>
#include <algorithm>
#include <iomanip>
#include <string>
#include <sstream>
#include <ctime>
#include <vector>
using namespace std;

// Operation counting: Assignments and Comparisons
string fillRight(int size, char fill_character, int number) {
	string format;
	ostringstream oss;
	oss << setw(size) << setfill(' ') << number;
	format = oss.str();
	return format;
}

int squaresum(int n, int& count_assign, int& count_compare) {
	int i = 1; ++count_assign;
	int sum = 0; ++count_assign;
		while (++count_compare && i <= n) {
		sum += i * i; ++count_assign;
		i += 1; ++count_assign;
	}
	return sum;
}


int somesum(int n, int& count_assign, int& count_compare) {
	int sum = 0, i = 1, j; count_assign += 2;
	while (++ count_compare && i <= n) {
		j = n - i;	++count_assign;
		while (++count_compare && j <= i * i) {
			sum = sum + i * j; ++count_assign;
			j += 1;	++count_assign;
		}
		i += 1;	++count_assign;
	}
	return sum;
}

int squaresum_recursion(int n, int& count_assign, int& count_compare) {
	if (++count_compare && n < 1)
		return 0;
	else
		count_assign += 2;
		return n * n + squaresum_recursion(n - 1, count_assign, count_compare);
}
void printTableAnalysis(int (*ptr)(int, int&, int&)){
	int compare, assign, result;
	cout << "  n    Assigments    Comparisons" << endl;
	for (int i = 0; i <= 500; i += 25) {
		compare = 0, assign = 0;
		result = ptr(i, assign, compare);
		cout << fillRight(3, ' ', i) << "    " << fillRight(10, ' ', assign) << "    " << fillRight(11, ' ', compare) << endl;
	}
}

// Algorithm Design

void majorityElement1(int* A, int n, int& count_assign, int& count_compare) {
	int count;
	int i = 0, j; count_assign++;
	for (i; i < n; i++) {
		count_compare++, count_assign++;
		count = 0; ++count_assign;
		j = 0; ++count_assign;
		for (j; j < n; j++) {
			count_compare++, count_assign++;
			if (count_compare++ && A[i] == A[j]) {
				count++; ++count_assign;
			}
			if (count_compare++ && count >= n) {
				cout << A[i] << endl;
				return;
			}
		}
	}
	cout << "NO";
}
void majorityElement2(int* A, int n, int& count_assign, int& count_compare) {
	int count;
	int i = 0, j; count_assign++;
	for (i; i <= n / 2; i++) {
		count_compare++, count_assign++;
		count = 0; ++count_assign;
		j = 0; ++count_assign;
		for (j; j < n; j++) {
			count_compare++, count_assign++;
			if (count_compare++ && A[i] == A[j]) {
				count++; ++count_assign;
			}
		}
		if (count_compare++ && count >= n) {
			cout << A[i] << endl;
			return;
		}
	}
	cout << "NO";
}

int GCD1(int u, int v, int& count_assign, int& count_compare) {
	int i = u; ++count_assign;
	for (i; i >= 1; i--) {
		++count_compare, ++count_assign;
		if (count_compare += 2 && u % i == 0 && v % i == 0) {
			return i;
		}
	}
}
int GCD2(int u, int v, int& count_assign, int& count_compare) {
	int temp;
	if (++count_compare && v > u) {
		temp = v; 
		v = u;
		u = v;
		count_assign += 3;
	}
	while (true) {
		temp = u % v; count_assign++;
		if (++count_compare && temp == 0) {
			return v;
		}
		u = v; ++count_assign;
		v = temp; ++count_assign;
	}
}
bool checkDuplicate(vector<string> words, string word) {
	for (int i = 0; i < words.size(); i++) {
		if (word == words[i])
			return false;
	}
	return true;
}
void wordCloudProblem1( vector<string> words, int& count_assign, int& count_compare) {
	vector<string> duplicate;
	int count;
	for (int i = 0; i < words.size(); i++) {
		if (checkDuplicate(duplicate, words[i]))
			duplicate.push_back(words[i]);
	}
	for (int i = 0; i < duplicate.size(); i++) {
		count = 0;
		for (int j = 0; j < words.size(); j++) {
			if (duplicate[i] == words[j])
				count++;
		}
		cout << duplicate[i] << " = " << count << endl;
	}
}
void wordCloudProblem2(vector<string> words, int& count_assign, int& count_compare) {
	sort(words.begin(), words.end());
	string temp = words[0];
	int i = 1, count = 1; count_assign += 0;
	for (i; i < words.size(); i++) {
		++count_compare;	++count_assign;
		if (count_compare && words[i] == temp) {
			count++; count_assign++;
		}
		else {
			cout << temp << " = " << count << endl;
			temp = words[i]; count_assign++;
			count = 1; count_assign++;
		}
	}
}

void SeeSawProblem1(int left, int right, vector<int> hats) {
	for (int i = 0; i < hats.size(); i++) {
		for (int j = 0; j < hats.size(); j++) {
			if (left + hats[i] == right + hats[j]) {
				cout << "left + W[" << i << "] = right + W[" << j << "]" << endl;
				return;
			}
		}
	}
	cout << "Not possible!" << endl;
}
void SeeSawProblem2(int left, int right, vector<int> hats) {
	sort(hats.begin(), hats.end());

	for (int i = 0; i < hats.size(); i++) {
		for (int j = i + 1; j < hats.size(); j++) {
			if (left + hats[i] == right + hats[j]) {
				cout << "left + W[" << i << "] = right + W[" << j << "]" << endl;
				return;
			}
		}
	}
	cout << "Not possible!" << endl;
}
int main() {

	system("pause");
	return 0;
}