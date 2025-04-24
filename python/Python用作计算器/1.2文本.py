# 文本由str类型表示，称为字符串
# 可以由成对的单引号('...')和成对的双引号("...")表示

print("Hello World!!!")
print('Hello World!!')

#要标明引号本身，我们需要对它进行“转义”，即在前面加一个“\”。
print('doesn\'t')  # 使用 \' 来转义单引号...
print("doesn't")  # ...或者改用双引号
print('"Yes," they said.')
print("\"Yes,\" they said.")
print('"Isn\'t," they said.')

print('C:some\name') # \n表示换行符
print(r'C:some\name') # 引号前加r取消字符转义，使用原始字符串
print(3 * 'un' + 'ium') # 字符串可以用+合并，也可用*重复
print('Hello''World') # 相邻的字符串会自动合并，只能用于两个字面值，不能用于变量或表达式

pre = 'py'
print(pre + 'thon')# 合并多个变量，或者合并变量与字面值，要用+
print(pre[0]) # 字符串支持索引，[0]为第一个字母p的索引值
print(pre[-1]) # 索引值可以用负数，pre的y的索引-1
word = 'python'
print(word[2:5]) # 从 2 号位 (含) 到 5 号位 (不含) 的字符
print(word[:2])   # 从开头到 2 号位 (不含) 的字符
print(word[4:])   # 从 4 号位 (含) 到末尾
print(word[-2:])  # 从倒数第二个 (含) 到末尾
print(word[:2] + word[2:]) # 输出结果包含切片开始，但不包含切片结束。因此，s[:i] + s[i:] 总是等于 s
'''
print(word[2:] = 'py')
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: 'str' object does not support item assignment
'''
# python字符不可更改，属于不可变变量
print('J' + word[1:]) # 要生成不同的字符串，应新建一个字符串
s = 'supercalifragilisticexpialidocious'
print(len(s)) # 内置函数len()返回字符串的长度
