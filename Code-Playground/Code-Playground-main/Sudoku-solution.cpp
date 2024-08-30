#include <iostream>
#include <conio.h>
#include <Windows.h>
using namespace std;

#define BLACK 0
#define WHITE 7
#define LIGHT_GREEN 10
const int N = 9;
#pragma region setting
void setConsoleTitle() {
	SetConsoleTitle(L"SUDOKU"); // SUDOKU
}

void gotoxy(int pX, int pY) {
	SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), COORD{ (short)pX, (short)pY });
}

void setConsoleColor(int background, int text) {
	SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), background * 16 + text);
}

void DisableResizeWindow() {
	HWND hWnd = GetConsoleWindow();
	SetWindowLong(hWnd, GWL_STYLE, GetWindowLong(hWnd, GWL_STYLE) & ~WS_SIZEBOX);
}

void SetWindowSize(SHORT width, SHORT height) {
	HANDLE hStdout = GetStdHandle(STD_OUTPUT_HANDLE);
	SMALL_RECT WindowSize;
	WindowSize.Top = 0;
	WindowSize.Left = 0;
	WindowSize.Right = width;
	WindowSize.Bottom = height;
	SetConsoleWindowInfo(hStdout, 1, &WindowSize);
}

void exitScreen() {
	system("cls");
	exit(0);
}
#pragma endregion
void drawBoard() {
	int k = 0, q = 0;
	gotoxy(1, 2);
	putchar(201);
	gotoxy(39, 2);
	putchar(187);
	gotoxy(1, 22);
	putchar(200);
	gotoxy(39, 22);
	putchar(188);
	for (int i = 1; i <= 39; i += 38) {
		for (int j = 3; j <= 21; j++) {
			gotoxy(i, j);
			putchar(186);

		}
	}

	for (int i = 2; i <= 22; i = i + 20) {
		for (int j = 2; j <= 38; j++) {
			gotoxy(j, i);
			putchar(205);

		}
	}
	int h = 0;
	for (int i = 4; i <= 20; i += 2) {
		for (int j = 2; j <= 38; j++) {

			gotoxy(j, i);
			putchar(196);
			q++;
			if (q == 3) {
				q = 0;
				j++;
				h++;
				if (h == 3) {
					j++;
					h = 0;
				}
				else {
					gotoxy(j, i);
					putchar(179);
				}

			}
		}
		k++;
		if (k == 2) {
			k = 0;
			i += 3;
		}
	}
	k = 0, q = 0;
	for (int i = 3; i <= 21; i += 2) {
		for (int j = 3; j <= 37; j += 4) {

			q++;
			if (q == 3) {
				q = 0;
				j++;
			}
			else {
				gotoxy(j + 2, i);
				putchar(179);
			}
		}
		k++;
		if (k == 3) {
			k = 0;
			i++;
		}
	}
	for (int i = 8; i <= 15; i += 7) {
		for (int j = 2; j <= 38; j++) {
			gotoxy(j, i);
			putchar(196);
			gotoxy(j, i + 1);
			putchar(196);
		}
	}

	for (int i = 13; i <= 26; i += 13) {
		for (int j = 3; j <= 21; j++) {
			gotoxy(i, j);
			putchar(179);
			gotoxy(i + 1, j);
			putchar(179);
		}
	}
}

bool isSafe(int** grid, int row, int col, int n) {
	for (int i = 0; i < N; i++) {
		if (grid[row][i] == n) {
			return false;
		}
	}
	for (int i = 0; i < N; i++) {
		if (grid[i][col] == n) {
			return false;
		}
	}
	int x = row - row % 3;
	int y = col - col % 3;
	for (int i = x; i < x + 3; i++) {
		for (int j = y; j < y + 3; j++) {
			if (grid[i][j] == n) {
				return false;
			}
		}
	}
	return true;
}
bool solveSudoku(int** grid, int row, int col) {
	if (row == N - 1 && col == N) {
		return true;
	}
	if (col == N) {
		row++;
		col = 0;
	}
	if (grid[row][col] > 0) {
		return solveSudoku(grid, row, col + 1);
	}
	for (int i = 1; i <= 9; i++) {
		if (isSafe(grid, row, col, i)) {
			grid[row][col] = i;
			if (solveSudoku(grid, row, col + 1)) {
				return true;
			}
			grid[row][col] = 0;
		}
	}
	return false;
}
int** input() {
	int** grid = new int* [9];
	for (int i = 0; i < 9; i++)
		grid[i] = new int[9];
	int k = 0, q = 0;
	int y = 0, z = 0;
	for (int i = 3; i < 21; i += 2) {
		for (int j = 3; j < 37; j += 4) {
			setConsoleColor(LIGHT_GREEN, LIGHT_GREEN);
			gotoxy(j - 1 + y, i + z);
			cout << "   ";
			setConsoleColor(BLACK, WHITE);
			gotoxy(45, 7);
			cout << "Input (" << (i - 3) / 2 + 1 << "," << (j - 3) / 4 + 1 << "): ";
			gotoxy(58, 7);
			cin >> grid[(i - 3) / 2][(j - 3) / 4];
				gotoxy(57, 7);
				cout << "          ";
				gotoxy(j + y, i + z);
				if (grid[(i - 3) / 2][(j - 3) / 4] == 0)
					cout << " ";
				else
					cout << grid[(i - 3) / 2][(j - 3) / 4];
				gotoxy(j - 1 + y, i + z);
				cout << " ";
				gotoxy(j + 1 + y, i + z);
				cout << " ";
				q++;
				if (q == 3) {
					q = 0;
					y++;
				}
		}
		y = 0;
		k++;
		if (k == 3) {
			k = 0;
			z++;
		}
	}
	return grid;
}
int main() {
		drawBoard();
		gotoxy(45, 6);
		cout << "Input 0 => white space!";
		int** grid = input();
		system("cls");
		if (solveSudoku(grid, 0, 0)) {
			drawBoard();
			int k = 0, q = 0;
			int y = 0, z = 0;
			for (int i = 3; i < 21; i += 2) {
				for (int j = 3; j < 37; j += 4) {
					gotoxy(j + y, i + z);
						cout << grid[(i - 3) / 2][(j - 3) / 4];
					q++;
					if (q == 3) {
						q = 0;
						y++;
					}
				}
				y = 0;
				k++;
				if (k == 3) {
					k = 0;
					z++;
				}
			}
			gotoxy(45, 7);
			cout << "Your result. ";
		}
		else {
			cout << "No solution! ";
		}
		system("pause");
	exitScreen();
	return 0;
}
