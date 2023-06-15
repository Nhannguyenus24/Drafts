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

