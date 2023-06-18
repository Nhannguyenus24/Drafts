"""
---------.|.---------
------.|..|..|.------
---.|..|..|..|..|.---
-------WELCOME-------
---.|..|..|..|..|.---
------.|..|..|.------
---------.|.---------
"""
def WELCOME(number):
    #size number x 3number
    char = ".|."
    fillchar = "-"
    text = "WELCOME"
    s = char
    for i in range(number):
        if i == (number - 1)/2 :
            print(text.center(number * 3,fillchar))
            s = s[:- len(char)]
            s = s[:- len(char)]
            continue
        else:
            print(s.center(number * 3,fillchar))
        if i > (number - 1)/2:
            s = s[:- len(char)]
            s = s[:- len(char)]
        else:
            s += char
            s += char

"""
--------e--------
------e-d-e------
----e-d-c-d-e----
--e-d-c-b-c-d-e--
e-d-c-b-a-b-c-d-e
--e-d-c-b-c-d-e--
----e-d-c-d-e----
------e-d-e------
--------e-------- """
def rangoli(size):
    alphabet = "abcdefghijklmnopqrstuvwxyz"
    width = (size - 1) * 4 + 1
    rows = []
    for i in range(size):
        left = '-'.join(alphabet[size - i - 1:size])
        row = left[::-1] + left[1:]
        rows.append(row.center(width, '-'))
    print('\n'.join(rows))
    print('\n'.join(rows[:size-1][::-1]))
