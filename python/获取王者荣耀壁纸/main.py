import requests
import os
import time


def download_king_of_glory_wallpapers(save_folder='wallpapers'):
    # 创建保存目录
    os.makedirs(save_folder, exist_ok=True)

    # 获取英雄列表
    hero_list_url = 'https://pvp.qq.com/web201605/js/herolist.json'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }

    try:
        response = requests.get(hero_list_url, headers=headers)
        heros = response.json()

        for hero in heros:
            hero_id = hero['ename']
            hero_name = hero['cname']
            skin_count = len(hero['skin_name'].split('|'))

            print(f'正在下载 {hero_name} 的皮肤...')

            for skin_num in range(1, skin_count + 1):
                # 构造图片URL
                img_url = f'https://game.gtimg.cn/images/yxzj/img201606/skin/hero-info/{hero_id}/{hero_id}-bigskin-{skin_num}.jpg'

                # 下载图片
                img_data = requests.get(img_url, headers=headers).content

                # 保存文件
                filename = f"{hero_name}_{skin_num}.jpg"
                save_path = os.path.join(save_folder, filename)

                with open(save_path, 'wb') as f:
                    f.write(img_data)

                print(f'已下载: {filename}')
                time.sleep(0.5)  # 添加请求间隔

        print('所有壁纸下载完成！')

    except Exception as e:
        print(f'发生错误: {str(e)}')


# 使用示例
download_king_of_glory_wallpapers()