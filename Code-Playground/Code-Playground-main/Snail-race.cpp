#include <iostream>
#include <Windows.h>
#include <conio.h>
#include <string>
#include <ctime>
#include <algorithm>
using namespace std;

int maximum_snails = 8;
int maximum_name_length = 10;

#define BLACK 0
#define GREEN 2
#define RED 4
#define WHITE 7

// MOVEMENT
#define KEY_UP 72
#define KEY_DOWN 80
#define KEY_LEFT 75
#define KEY_RIGHT 77

void gotoxy(int x, int y) {
	COORD coord;
	coord.X = x;
	coord.Y = y;
	SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), coord);
}
void setConsoleColor(int background, int text) {
	SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), background * 16 + text);
}
void showCursor(bool show) {
	CONSOLE_CURSOR_INFO info = { 1, show };
	SetConsoleCursorInfo(GetStdHandle(STD_OUTPUT_HANDLE), &info);
}void printSnail(int length, int y, string name) {
	for (int i = 0; i < length; i++) {
		gotoxy(i, y);
		cout << ".";
		gotoxy(i, y - 1);
		cout << " ";
	}
	gotoxy(length, y);
	cout << "@v";
	gotoxy(length, y - 1);
	cout << name;
}

int random(int start, int end, int i) {
	srand(time(0));
	int t = abs(rand() * rand() * rand() * rand() * rand() * rand() * rand() * rand() * i);
	for (int x = 0; x < i; x++) {
		t *= i;
		t *= rand();
		t = abs(t);
	}
	return abs(t) % (start - end + 1) + start;
}
void Game() {
	int t;
	string order[8] = { "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth"};
	system("cls");
	gotoxy(0, 0);
	cout << "How many snails participate in the race? (2 - 8)";
	gotoxy(2, 1);
	cout << "->";
	gotoxy(4, 1);
	showCursor(true);
	cin >> t;
	cin.ignore();
	string* name = new string[t];
	int* score = new int[t];
	for (int i = 0; i < t; i++) {
		gotoxy(0, 2 + i * 2);
		cout << "Enter the " << order[i] << " snail's name! (less than 10 characters)";
		gotoxy(2, i * 2 + 3);
		cout << "->";
		gotoxy(4, i * 2 + 3);
		showCursor(true);
		cin >> name[i];
		score[i] = 0;
	}
	showCursor(false);
	system("cls");
	gotoxy(0, 0);
	cout << "Start";
	gotoxy(100, 0);
	cout << "Finish";
	gotoxy(0, 1);
	cout << "|";
	gotoxy(100, 1);
	cout << "|";
	gotoxy(41, 0);
	cout << "~~Snail Race~~";
	for (int i = 0; i < t; i++) {
		gotoxy(100, 2 + i * 2);
		cout << "|";
		gotoxy(100, 3 + i * 2);
		cout << "|";
		printSnail(score[i], 3 + i * 2, name[i]);
	}
	Sleep(2000);
	int max = 0;
	int winning = 0;
	bool win = false;
	while (true) {
		for (int i = 0; i < t; i++) {
			if (score[i] >= 100) {
				win = true;
				if (score[i] > max){
					max = score[i];
					winning = i;
				}
			}
		}
		if (win)
			goto End;
		for (int i = 0; i < t; i++) {
			score[i] += random(1, 7, i);
			printSnail(score[i], 3 + i * 2, name[i]);
		}
		Sleep(1000);
	}
End:
	Sleep(2000);
	system("cls");
	gotoxy(0, 0);
	cout << "The winner is " << name[winning];
	gotoxy(0, 1);
	delete[] name;
	delete[] score;
	system("Pause");
}
void Menu() {
	Start:
	system("cls");
	cout << "================================" << endl;
	cout << "----------SNAIL'S RACE----------" << endl;
	cout << "================================" << endl;
	int choice = 1;
	char key;
	int set[] = { 4, 7 };
	showCursor(false);
	do {
		setConsoleColor(BLACK, set[0]);
		gotoxy(0, 4);
		cout << ((set[0] == 4) ? ">>   START     " : "     START   ");
		setConsoleColor(BLACK, set[1]);
		gotoxy(0, 5); 
		cout << ((set[1] == 4) ? ">>   EXIT     " : "     EXIT   ");
		key = _getch();
		if (key == KEY_UP && (choice == 2))
			choice--;
		if (key == KEY_DOWN && (choice == 1))
			choice++;
		if (key == '\r') {
			if (choice == 1) {
				Game();
				goto Start;
			}
			else {
				system("cls");
				setConsoleColor(BLACK, WHITE);
				exit(0);
			}
		}
		set[0] = 7;
		set[1] = 7;
		if (choice == 1) 
			set[0] = 4;
		else
			set[1] = 4;
	} while (true);
}
int main() {
	Menu();
	return 0;
}