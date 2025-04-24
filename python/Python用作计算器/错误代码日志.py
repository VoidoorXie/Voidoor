# 2025.4.24
rgb = ['Red','Green','Blue'] #创建rgb列表
rgba = rgb # 并不简单获得列表内容，变量rgba引用现有列表rgb的内存地址，更改其中一个变量就是更改公用内存中的值
rgba.append('Alph')
print(rgb)
print(rgba)
rgb = rgba.append('NewListContent')
# 分解动作：
# 1. 地址0x1000的列表追加元素 → ['Red','Green','Blue','Alph','NewListContent']
# 2. append()返回None
# 3. rgb变量现在指向None对象
print(rgba)
print(rgb)


