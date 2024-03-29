#include <iostream>
#include <sstream>
#include <fstream>
#include <algorithm>
#include <string>
using namespace std;
string multiply(string &num1, string num2) {
    string res;
    int a, b, c, m, n, l, k, sum, carry;
    char d;

    m = num1.size() - 1;
    n = num2.size() - 1;
    carry = 0;
    for (int i = m; i >= 0; i--) {
        for (int j = n; j >= 0; j--) {
            l = res.size() - 1;
            a = num1[i] - '0';
            b = num2[j] - '0';
            k = (m-i) + (n-j);

            if (l >= k) c = res[l-k] - '0';
            else c = 0;

            sum = a * b + c + carry;
            carry = sum / 10;
            d = char(sum % 10 + '0');

            if (l >= k) res[l-k] = d;
            else res.insert(0, &d, 1);

            if (j == 0 && carry) {
                d = char(carry + '0');
                res.insert(0, &d, 1);
                carry = 0;
            }
        }
    }

    return res[0] == '0' ? "0" : res;
}
int main(){
    string s = "123";
    cout<< multiply(s, "456");
    return 0;
}