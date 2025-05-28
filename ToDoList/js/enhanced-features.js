// 增强功能模块
class EnhancedFeatures {
    constructor() {
        this.isDarkTheme = false;
        this.isFullscreen = false;
        this.searchData = [];
        this.init();
    }

    init() {
        this.loadTheme();
        this.initSearch();
        this.initKeyboardShortcuts();
        this.initScrollEffects();
        this.loadSearchData();
        this.initNotifications();
    }

    // 主题切换功能
    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        document.body.classList.toggle('dark-theme', this.isDarkTheme);
        
        // 更新按钮图标
        const themeBtn = document.querySelector('.floating-toolbar .toolbar-btn');
        themeBtn.textContent = this.isDarkTheme ? '☀️' : '🌙';
        
        // 保存主题偏好
        localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
        
        // 显示通知
        this.showNotification(
            this.isDarkTheme ? '🌙 已切换到暗色主题' : '☀️ 已切换到亮色主题',
            'success'
        );
    }

    // 加载保存的主题
    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            this.isDarkTheme = true;
            document.body.classList.add('dark-theme');
            const themeBtn = document.querySelector('.floating-toolbar .toolbar-btn');
            if (themeBtn) themeBtn.textContent = '☀️';
        }
    }

    // 返回顶部功能
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // 创建流星效果
        if (window.galaxyBackground) {
            window.galaxyBackground.createShootingStar();
        }
    }

    // 全屏模式切换
    toggleFullscreen() {
        if (!this.isFullscreen) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    // 监听全屏状态变化
    handleFullscreenChange() {
        this.isFullscreen = !!(document.fullscreenElement || 
                              document.webkitFullscreenElement || 
                              document.msFullscreenElement);
        
        const fullscreenBtn = document.querySelectorAll('.toolbar-btn')[3];
        if (fullscreenBtn) {
            fullscreenBtn.textContent = this.isFullscreen ? '🔲' : '🔳';
        }
    }

    // 初始化搜索功能
    initSearch() {
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) {
            let searchTimeout;
            
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.performSearch(e.target.value);
                }, 300);
            });

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(e.target.value);
                } else if (e.key === 'Escape') {
                    e.target.value = '';
                    this.clearSearch();
                }
            });
        }
    }

    // 加载搜索数据
    loadSearchData() {
        this.searchData = [
            { title: 'HTML 基础星球', url: 'frontend/html.html', category: '前端', keywords: ['html', 'html5', '标签', '网页结构'] },
            { title: 'CSS 美化星云', url: 'frontend/css.html', category: '前端', keywords: ['css', 'css3', '样式', '布局', '动画'] },
            { title: 'JavaScript 动力核心', url: 'frontend/javascript.html', category: '前端', keywords: ['javascript', 'js', 'es6', 'dom', '异步'] },
            { title: 'React 框架', url: 'frontend/frameworks.html', category: '前端', keywords: ['react', '组件', 'jsx', 'hooks'] },
            { title: 'Vue 框架', url: 'frontend/frameworks.html', category: '前端', keywords: ['vue', '响应式', '组件', 'vuex'] },
            { title: 'Node.js 绿色引擎', url: 'backend/nodejs.html', category: '后端', keywords: ['nodejs', 'express', 'api', '服务器'] },
            { title: 'Python 智慧之蛇', url: 'backend/python.html', category: '后端', keywords: ['python', 'flask', 'django', 'fastapi'] },
            { title: 'Java 企业战舰', url: 'backend/java.html', category: '后端', keywords: ['java', 'spring', 'springboot', '微服务'] },
            { title: 'MySQL 数据库', url: 'database/sql.html', category: '数据库', keywords: ['mysql', 'sql', '关系型', '数据库'] },
            { title: 'MongoDB 数据库', url: 'database/nosql.html', category: '数据库', keywords: ['mongodb', 'nosql', '文档型', '数据库'] },
            { title: 'Docker 容器', url: 'devops/docker.html', category: 'DevOps', keywords: ['docker', '容器', '镜像', '部署'] },
            { title: 'Kubernetes', url: 'devops/kubernetes.html', category: 'DevOps', keywords: ['kubernetes', 'k8s', '容器编排', '集群'] },
            { title: 'Git 版本控制', url: 'tools/git.html', category: '工具', keywords: ['git', '版本控制', '分支', '协作'] },
            { title: 'VS Code 编辑器', url: 'tools/ide.html', category: '工具', keywords: ['vscode', 'ide', '编辑器', '开发工具'] }
        ];
    }

    // 执行搜索
    performSearch(query) {
        if (!query.trim()) {
            this.clearSearch();
            return;
        }

        const results = this.searchData.filter(item => {
            const searchText = query.toLowerCase();
            return item.title.toLowerCase().includes(searchText) ||
                   item.category.toLowerCase().includes(searchText) ||
                   item.keywords.some(keyword => keyword.includes(searchText));
        });

        this.displaySearchResults(results, query);
    }

    // 显示搜索结果
    displaySearchResults(results, query) {
        // 移除之前的搜索结果
        this.clearSearch();

        if (results.length === 0) {
            this.showNotification(`🔍 未找到与"${query}"相关的内容`, 'warning');
            return;
        }

        // 创建搜索结果容器
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results';
        resultsContainer.innerHTML = `
            <div class="search-results-header">
                <h3>🔍 搜索结果 (${results.length})</h3>
                <button class="close-search" onclick="enhancedFeatures.clearSearch()">✕</button>
            </div>
            <div class="search-results-list">
                ${results.map(result => `
                    <div class="search-result-item" onclick="window.location.href='${result.url}'">
                        <div class="result-title">${this.highlightText(result.title, query)}</div>
                        <div class="result-category">${result.category}</div>
                    </div>
                `).join('')}
            </div>
        `;

        // 插入到搜索框下方
        const searchContainer = document.querySelector('.search-container');
        searchContainer.appendChild(resultsContainer);

        // 添加样式
        this.addSearchResultsStyles();
    }

    // 高亮搜索文本
    highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark class="search-highlight">$1</mark>');
    }

    // 清除搜索结果
    clearSearch() {
        const resultsContainer = document.querySelector('.search-results');
        if (resultsContainer) {
            resultsContainer.remove();
        }
    }

    // 添加搜索结果样式
    addSearchResultsStyles() {
        if (document.querySelector('#search-results-styles')) return;

        const style = document.createElement('style');
        style.id = 'search-results-styles';
        style.textContent = `
            .search-results {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--card-background);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius-lg);
                box-shadow: var(--shadow-lg);
                z-index: 1000;
                max-height: 400px;
                overflow-y: auto;
                backdrop-filter: blur(20px);
            }
            
            .search-results-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                border-bottom: 1px solid var(--border-color);
                background: var(--light-gray);
            }
            
            .search-results-header h3 {
                margin: 0;
                font-size: 1rem;
                color: var(--secondary-color);
            }
            
            .close-search {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: var(--text-secondary);
                padding: 4px;
                border-radius: 50%;
                transition: var(--transition);
            }
            
            .close-search:hover {
                background: var(--border-color);
                color: var(--text-color);
            }
            
            .search-result-item {
                padding: 12px 20px;
                cursor: pointer;
                transition: var(--transition);
                border-bottom: 1px solid var(--border-light);
            }
            
            .search-result-item:hover {
                background: var(--card-hover);
            }
            
            .search-result-item:last-child {
                border-bottom: none;
            }
            
            .result-title {
                font-weight: 600;
                color: var(--secondary-color);
                margin-bottom: 4px;
            }
            
            .result-category {
                font-size: 0.85rem;
                color: var(--text-secondary);
            }
        `;
        document.head.appendChild(style);
    }

    // 初始化键盘快捷键
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K 聚焦搜索框
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('globalSearch');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }
            
            // Ctrl/Cmd + D 切换主题
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                this.toggleTheme();
            }
            
            // F11 全屏模式
            if (e.key === 'F11') {
                e.preventDefault();
                this.toggleFullscreen();
            }
            
            // 空格键召唤流星
            if (e.key === ' ' && e.target === document.body) {
                e.preventDefault();
                if (window.galaxyBackground) {
                    window.galaxyBackground.createShootingStar();
                }
            }
        });

        // 监听全屏状态变化
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('msfullscreenchange', () => this.handleFullscreenChange());
    }

    // 初始化滚动效果
    initScrollEffects() {
        let lastScrollTop = 0;
        const toolbar = document.querySelector('.floating-toolbar');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // 工具栏自动隐藏/显示
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                toolbar.style.transform = 'translateY(-50%) translateX(100px)';
                toolbar.style.opacity = '0.7';
            } else {
                toolbar.style.transform = 'translateY(-50%) translateX(0)';
                toolbar.style.opacity = '1';
            }
            
            lastScrollTop = scrollTop;
        });
    }

    // 通知系统
    initNotifications() {
        // 创建通知容器
        const notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(notificationContainer);
    }

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            background: var(--card-background);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 12px 16px;
            margin-bottom: 8px;
            box-shadow: var(--shadow-lg);
            backdrop-filter: blur(20px);
            pointer-events: auto;
            transform: translateX(100%);
            transition: var(--transition);
            font-weight: 500;
            max-width: 300px;
            word-wrap: break-word;
        `;

        // 根据类型设置颜色
        switch (type) {
            case 'success':
                notification.style.borderLeftColor = 'var(--success-color)';
                notification.style.borderLeftWidth = '4px';
                break;
            case 'warning':
                notification.style.borderLeftColor = 'var(--warning-color)';
                notification.style.borderLeftWidth = '4px';
                break;
            case 'error':
                notification.style.borderLeftColor = 'var(--error-color)';
                notification.style.borderLeftWidth = '4px';
                break;
            default:
                notification.style.borderLeftColor = 'var(--info-color)';
                notification.style.borderLeftWidth = '4px';
        }

        const container = document.getElementById('notification-container');
        container.appendChild(notification);

        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // 自动隐藏
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);

        // 点击关闭
        notification.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }

    // 添加页面加载动画
    addLoadingAnimation() {
        const elements = document.querySelectorAll('.nav-item, .feature-card, .stat-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// 全局函数
function toggleTheme() {
    enhancedFeatures.toggleTheme();
}

function scrollToTop() {
    enhancedFeatures.scrollToTop();
}

function toggleFullscreen() {
    enhancedFeatures.toggleFullscreen();
}

function performGlobalSearch() {
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
        enhancedFeatures.performSearch(searchInput.value);
    }
}

// 初始化增强功能
let enhancedFeatures;
document.addEventListener('DOMContentLoaded', function() {
    enhancedFeatures = new EnhancedFeatures();
    
    // 添加加载动画
    setTimeout(() => {
        enhancedFeatures.addLoadingAnimation();
    }, 500);
    
    // 显示欢迎消息
    setTimeout(() => {
        enhancedFeatures.showNotification('🌌 欢迎来到全栈开发银河系！', 'success', 4000);
    }, 1000);
}); 