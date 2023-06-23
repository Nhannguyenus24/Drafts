#include <iostream>
#include <string>
#include <algorithm>
#include <Windows.h>
#include <vector>
#include <fstream>
#include <ctime>
using namespace std;
struct Examinee{
    string id;
    float math, literature, physic, chemistry, biology, history, geography, civic_education, natural_science,
social_science, foreign_language;
};
void swap(int*a, int* b){
    int temp = *a;
    *a = *b;
    *b = temp;
}
int* sum(int* a, int* b){
    int c = *a + *b;
    int* s = &c;
    return s;
}
void inputArray(int*& a, int &n){
    cin>>n;
    int* t = new int[n];
    for (int i = 0; i < n; i++)
        cin>>t[i];
    a = t;
}
void printArray(int* a, int n){
    for (int i = 0; i < n; i++)
        cout<<a[i]<<" ";
    cout<<endl;
}
int* findMax(int* arr, int n){
    int* max = new int;
    *max = arr[0];
    for (int i = 0; i < n; i++){
        if (arr[i] > *max)
            *max = arr[i];
    }
    return max;
}
int* findLongestAscendingSubarray(int* a, int n, int &length){
    int maxlen = 1, len = 1; int* start = a; int* currentStart = a;
    for (int i = 1; i < n; i++){
        if (a[i] > a[i-1]){
            len++;
        }
        else{
            if (len > maxlen){
                maxlen = len;
                start = currentStart;
            }
            currentStart = a + i;
            len = 1;
        }
    }
    if (len > maxlen){
        maxlen = len;
        start = currentStart;
    }
    length = maxlen;
    return start;
}
void swapArrays(int*& a, int*& b, int& na, int& nb){
    int* c = a;
    a = b;
    b = c;
    int temp = na;
    na = nb;
    nb = temp;
}
int* concatenate2Arrays(int* a, int* b, int na, int nb){
    int* rel = new int[na + nb];
    for (int i = 0; i < na; i++)
        rel[i] = a[i];
    for (int i = na; i < na + nb; i++)
        rel[i] = b[i];
}
int* merge2Arrays(int* a, int* b, int na, int nb, int&nc){
    int* c = concatenate2Arrays( a,  b,  na, nb);
    nc = nb + na;
    sort(c,c+nc);
    return c;
}
void generateMatrix1(int**& a, int& length, int& width){
    cin>>length>>width;
    srand(time(0));
      
    int** rel = new int*[length];
    for (int i = 0; i < length; i++){
        rel[i] = new int[width];
    }
    for (int i = 0; i < length; i++){
        for (int j = 0; j < width; j++)
            rel[i][j] = rand()%51;
    }
    a = rel;
}
int** generateMatrix2(int* a, int* b, int na, int nb){
    int** rel = new int*[na];
    for (int i = 0; i < na; i++){
        rel[i] = new int[nb];
    }
    return rel;
}
int** tranposeMatrix(int** a, int length, int width){
    int** rel = new int*[width];
    for (int i = 0; i < width; i++){
        rel[i] = new int[length];
    }
    for (int i = 0; i < length; i++){
        for (int j = 0; j < width; j++)
            rel[j][i] = a[i][j];
    }
    return rel;
}
 Examinee readExaminee(string line_info){
    Examinee e;
    float a[11] = {0};
    e.id = line_info.substr(0,9);
    int index = 0;
    string score = "";
    for (int i = 11; i < line_info.length();i++){
        if (index == 11)
            break;
        if (line_info[i] == ','){
            if (score == "")
                a[index] = 0;
            else    
                a[index] = stof(score);
            index++;
            score = "";
        }
        else{
            score += line_info[i];
        }
    }
    e.math = a[0], e.literature = a[1], e.physic = a[2], e.chemistry = a[3], e.biology = a[4], e.history = a[5], e.geography = a[6], e.civic_education = a[7], e.natural_science = a[8],
e.social_science = a[9], e.foreign_language = a[10];
    e.natural_science = e.physic + e.chemistry + e. biology;
    e.social_science = e.history + e.geography + e.civic_education;

    return e;
 }
 vector<Examinee> readExamineeList(string file_name){
    vector<Examinee> rel;
    fstream in(file_name);
    string line;
    getline(in,line);
    while(getline(in,line)){
        Examinee e = readExaminee(line);
        rel.push_back(e);
    }
    
    in.close();
    return rel;
 }
 void print(vector<Examinee> rel, string output_file){
    fstream out(output_file);
    for (int i = 0; i < rel.size();i++){
        float total = rel[i].math + rel[i].literature + rel[i].foreign_language + rel[i].natural_science + rel[i].social_science;
        out<<rel[i].id<<" "<<total<<endl;
    }
    out.close();
 }
int main(){
    int a = 1, b = 2;
    cout<<sum(&a,&b);
    return 0;
}