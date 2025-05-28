// 银河背景生成器
class GalaxyBackground {
    constructor() {
        this.container = null;
        this.stars = [];
        this.shootingStars = [];
        this.nebulae = [];
        this.init();
    }

    init() {
        this.createContainer();
        this.createStars();
        this.createNebulae();
        this.createGalaxyArm();
        this.startShootingStars();
        this.addResizeListener();
    }

    createContainer() {
        // 创建银河背景容器
        this.container = document.createElement('div');
        this.container.className = 'galaxy-background';
        document.body.insertBefore(this.container, document.body.firstChild);

        // 创建星空层
        const starsLayer = document.createElement('div');
        starsLayer.className = 'stars-layer';
        this.container.appendChild(starsLayer);
    }

    createStars() {
        const starsLayer = this.container.querySelector('.stars-layer');
        const starCount = 200;

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // 随机分配星星大小
            const size = Math.random();
            if (size < 0.7) {
                star.classList.add('small');
            } else if (size < 0.9) {
                star.classList.add('medium');
            } else {
                star.classList.add('large');
            }

            // 随机位置
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            
            // 随机动画延迟
            star.style.animationDelay = Math.random() * 3 + 's';

            starsLayer.appendChild(star);
            this.stars.push(star);
        }
    }

    createNebulae() {
        const nebulaTypes = ['purple', 'blue', 'pink'];
        const nebulaCount = 5;

        for (let i = 0; i < nebulaCount; i++) {
            const nebula = document.createElement('div');
            nebula.className = 'nebula ' + nebulaTypes[Math.floor(Math.random() * nebulaTypes.length)];
            
            // 随机大小和位置
            const size = 100 + Math.random() * 200;
            nebula.style.width = size + 'px';
            nebula.style.height = size + 'px';
            nebula.style.left = Math.random() * 100 + '%';
            nebula.style.top = Math.random() * 100 + '%';
            
            // 随机动画延迟
            nebula.style.animationDelay = Math.random() * 20 + 's';

            this.container.appendChild(nebula);
            this.nebulae.push(nebula);
        }
    }

    createGalaxyArm() {
        const galaxyArm = document.createElement('div');
        galaxyArm.className = 'galaxy-arm';
        this.container.appendChild(galaxyArm);
    }

    createShootingStar() {
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';
        
        // 随机起始位置
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        shootingStar.style.left = startX + '%';
        shootingStar.style.top = startY + '%';
        
        // 随机动画持续时间
        const duration = 3 + Math.random() * 5;
        shootingStar.style.animationDuration = duration + 's';

        this.container.appendChild(shootingStar);
        this.shootingStars.push(shootingStar);

        // 动画结束后移除元素
        setTimeout(() => {
            if (shootingStar.parentNode) {
                shootingStar.parentNode.removeChild(shootingStar);
            }
            const index = this.shootingStars.indexOf(shootingStar);
            if (index > -1) {
                this.shootingStars.splice(index, 1);
            }
        }, duration * 1000);
    }

    startShootingStars() {
        // 定期创建流星
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% 概率创建流星
                this.createShootingStar();
            }
        }, 2000);
    }

    addResizeListener() {
        window.addEventListener('resize', () => {
            // 重新调整星星位置
            this.stars.forEach(star => {
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
            });
        });
    }

    // 添加交互效果
    addInteractiveEffects() {
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            // 根据鼠标位置轻微调整星云位置
            this.nebulae.forEach((nebula, index) => {
                const offsetX = (mouseX - 0.5) * 20 * (index + 1);
                const offsetY = (mouseY - 0.5) * 20 * (index + 1);
                nebula.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            });
        });

        // 点击创建流星效果
        document.addEventListener('click', (e) => {
            if (Math.random() < 0.5) {
                this.createShootingStar();
            }
        });
    }

    // 性能优化：减少动画数量
    optimizePerformance() {
        // 检测设备性能
        const isLowPerformance = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isLowPerformance) {
            // 移动设备减少星星数量
            const starsToRemove = this.stars.slice(100);
            starsToRemove.forEach(star => {
                if (star.parentNode) {
                    star.parentNode.removeChild(star);
                }
            });
            this.stars = this.stars.slice(0, 100);
            
            // 减少星云数量
            const nebulaeToRemove = this.nebulae.slice(2);
            nebulaeToRemove.forEach(nebula => {
                if (nebula.parentNode) {
                    nebula.parentNode.removeChild(nebula);
                }
            });
            this.nebulae = this.nebulae.slice(0, 2);
        }
    }
}

// 页面加载完成后初始化银河背景
document.addEventListener('DOMContentLoaded', function() {
    const galaxy = new GalaxyBackground();
    galaxy.addInteractiveEffects();
    galaxy.optimizePerformance();
    
    // 添加到全局对象以便调试
    window.galaxyBackground = galaxy;
});

// 导出类以便其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GalaxyBackground;
} 