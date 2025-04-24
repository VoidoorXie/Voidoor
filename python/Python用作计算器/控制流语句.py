'''
# if 语句
x = float(input("请输入一个数："))
if x < 0 :
    print("您输入的值小于0。")
elif x == 0 :
    print("您输入的值为0。")
elif x > 0 :
    print("您输入的值大于0。")
else :
    print("我不知道还有什么，这只是一个示例，哈哈")
'''

# for语句
words = ['cat','window','defenestrate']
for w in words :
    print(w,len(w))

users = {'han':'active','elwinire':'inactive','牛哄哄的名字':'active'} #创建字典users
for user,status in users.copy().items(): #遍历users
    if status == 'inactive':    # 如果status的值为inactive
        del users[user]         # 删除项
active_users = {} #创建空集active_users
for user,status in users.items(): #遍历字典users
    if status == 'active':        #如果status的值为active
        active_users[user] = status # 空集中添加项
print(active_users) #输出字典active_users

for i in range(5) : # 循环五次，并给i赋值
    print(i)    #打印i的值
