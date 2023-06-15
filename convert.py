def convert(number, base):
    num = 1
    result = ""
    list = ["A", "B", "C", "D", "E", "F"]
    while num <= number:
        num *= base
    num //= base
    while num != 0:
        remainder = number % num
        number -= remainder
        res = number // num
        if res >= 10:
            result += list[res - 10]
        else:
            result += str(res)
        number = remainder
        num //= base
    return result
