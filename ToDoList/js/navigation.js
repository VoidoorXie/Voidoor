// 通用导航功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化功能
    initNavigation();
    initSearch();
    initScrollEffects();
    initAnimations();
    initKeyboardShortcuts();
    
    // 侧边栏导航点击事件
    function initNavigation() {
        const sidebarLinks = document.querySelectorAll('.sidebar-list a[href^="#"]');
        
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // 平滑滚动到目标元素
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // 更新活跃状态
                    updateActiveNavItem(this);
                    
                    // 添加视觉反馈
                    addClickFeedback(this);
                }
            });
        });
    }
    
    // 搜索功能
    function initSearch() {
        const searchBox = document.querySelector('.search-box');
        if (searchBox) {
            let searchTimeout;
            
            searchBox.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                const searchTerm = this.value.toLowerCase().trim();
                
                // 防抖处理
                searchTimeout = setTimeout(() => {
                    performSearch(searchTerm);
                }, 300);
            });
            
            // 添加搜索快捷键
            searchBox.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    this.value = '';
                    performSearch('');
                    this.blur();
                }
            });
        }
    }
    
    function performSearch(searchTerm) {
        const sections = document.querySelectorAll('section, .section');
        let visibleCount = 0;
        
        sections.forEach(section => {
            const text = section.textContent.toLowerCase();
            const isVisible = text.includes(searchTerm) || searchTerm === '';
            
            section.style.display = isVisible ? 'block' : 'none';
            if (isVisible) visibleCount++;
            
            // 高亮搜索结果
            if (searchTerm && isVisible) {
                highlightSearchTerm(section, searchTerm);
            } else {
                removeHighlight(section);
            }
        });
        
        // 显示搜索结果统计
        showSearchStats(visibleCount, sections.length, searchTerm);
    }
    
    // 滚动效果
    function initScrollEffects() {
        // 返回顶部功能
        const backToTopBtn = document.querySelector('[onclick="window.scrollTo(0,0)"]');
        if (backToTopBtn) {
            backToTopBtn.onclick = function(e) {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            };
        }
        
        // 监听滚动，高亮当前章节
        window.addEventListener('scroll', throttle(updateActiveSection, 100));
        
        // 滚动进度条
        createScrollProgress();
    }
    
    // 动画效果
    function initAnimations() {
        // 观察器用于元素进入视口时的动画
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });
        
        // 观察所有section元素
        document.querySelectorAll('section, .demo-section, .feature-card').forEach(el => {
            observer.observe(el);
        });
    }
    
    // 键盘快捷键
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Ctrl/Cmd + K 聚焦搜索框
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchBox = document.querySelector('.search-box');
                if (searchBox) {
                    searchBox.focus();
                    searchBox.select();
                }
            }
            
            // Escape 清除搜索
            if (e.key === 'Escape') {
                const searchBox = document.querySelector('.search-box');
                if (searchBox && document.activeElement === searchBox) {
                    searchBox.value = '';
                    performSearch('');
                    searchBox.blur();
                }
            }
        });
    }
});

// 更新活跃导航项
function updateActiveNavItem(activeLink) {
    // 移除所有活跃状态
    document.querySelectorAll('.sidebar-list a').forEach(link => {
        link.classList.remove('active');
    });
    
    // 添加活跃状态
    activeLink.classList.add('active');
}

// 更新活跃章节
function updateActiveSection() {
    const sections = document.querySelectorAll('section[id], .section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            const correspondingLink = document.querySelector(`.sidebar-list a[href="#${sectionId}"]`);
            if (correspondingLink) {
                updateActiveNavItem(correspondingLink);
            }
        }
    });
}

// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 折叠/展开侧边栏功能
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebar && mainContent) {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    }
}

// 主题切换功能
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// 加载保存的主题
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// 页面加载时应用主题
document.addEventListener('DOMContentLoaded', loadTheme);

// 辅助函数
function addClickFeedback(element) {
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
        element.style.transform = '';
    }, 150);
}

function highlightSearchTerm(section, term) {
    // 简单的文本高亮实现
    const walker = document.createTreeWalker(
        section,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }
    
    textNodes.forEach(textNode => {
        const text = textNode.textContent;
        const regex = new RegExp(`(${term})`, 'gi');
        if (regex.test(text)) {
            const highlightedText = text.replace(regex, '<mark class="search-highlight">$1</mark>');
            const span = document.createElement('span');
            span.innerHTML = highlightedText;
            textNode.parentNode.replaceChild(span, textNode);
        }
    });
}

function removeHighlight(section) {
    const highlights = section.querySelectorAll('.search-highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
    });
}

function showSearchStats(visible, total, term) {
    let statsElement = document.querySelector('.search-stats');
    if (!statsElement) {
        statsElement = document.createElement('div');
        statsElement.className = 'search-stats';
        const infoBar = document.querySelector('.info-bar');
        if (infoBar) {
            infoBar.appendChild(statsElement);
        }
    }
    
    if (term) {
        statsElement.textContent = `找到 ${visible} / ${total} 个结果`;
        statsElement.style.display = 'block';
    } else {
        statsElement.style.display = 'none';
    }
}

function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        const progressBarFill = document.querySelector('.scroll-progress-bar');
        if (progressBarFill) {
            progressBarFill.style.width = scrollPercent + '%';
        }
    });
}

// 添加复制代码功能
function addCopyCodeButtons() {
    const codeBlocks = document.querySelectorAll('.code');
    codeBlocks.forEach(block => {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-code-btn';
        copyBtn.innerHTML = '📋 复制';
        copyBtn.onclick = () => copyCodeToClipboard(block, copyBtn);
        
        block.style.position = 'relative';
        block.appendChild(copyBtn);
    });
}

function copyCodeToClipboard(codeBlock, button) {
    const code = codeBlock.querySelector('pre').textContent;
    navigator.clipboard.writeText(code).then(() => {
        button.innerHTML = '✅ 已复制';
        button.style.background = 'var(--success-color)';
        setTimeout(() => {
            button.innerHTML = '📋 复制';
            button.style.background = '';
        }, 2000);
    });
}

// 初始化复制按钮
document.addEventListener('DOMContentLoaded', addCopyCodeButtons); 