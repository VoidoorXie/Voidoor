liebiao = [1,4,9,16,25] # 创建列表
print(liebiao) # 打印列表
# 列表支持索引和切片
print(liebiao[1]) # 索引
print(liebiao[1:4]) # 切片
print(liebiao + [36,49,64,81,100]) # 列表支持合并操作
cubes = [1,8,27,65,125] # 创建名为cubes的列表
cubes[3] = 4**3 # 更改cubes中第四位的值
print(cubes) # 打印更改后的列表
cubes.append(216) # 使用列表list.append()方法，在列表末尾添加新值
print(cubes) # 打印cubes列表

rgb = ['Red','Green','Blue'] #创建rgb列表
rgba = rgb # 并不简单获得列表内容，变量rgba引用现有列表rgb的内存地址，更改其中一个变量就是更改公用内存中的值
rgba.append('Alph') # 列表rgb增加项Alph
print(rgb) # 打印列表rgb
print(rgba) # 打印列表rgba
rgba.append('NewListContent') # 列表rgba增加项NewListContent
print(rgba) # 打印列表rgba
print(rgb) # 打印列表rgb

a = ['a','b','c'] # 创建列表a并赋值
b = [1,2,3] # 创建列表b并赋值
c = [a,b] # 创建列表c并将列表a和列表b赋值给c，称之为嵌套列表
print(c) # 打印列表c
