// 代码游乐场功能
class CodePlayground {
    constructor() {
        this.editor = document.getElementById('codeEditor');
        this.preview = document.getElementById('previewFrame');
        this.console = document.getElementById('consoleOutput');
        this.languageSelector = document.getElementById('languageSelector');
        this.templatesPanel = document.getElementById('templatesPanel');
        this.consolePanel = document.getElementById('consolePanel');
        
        this.currentLanguage = 'html';
        this.isConsoleVisible = false;
        this.isTemplatesVisible = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDefaultTemplate();
        this.setupAutoSave();
        this.interceptConsole();
    }

    setupEventListeners() {
        // 语言切换
        this.languageSelector.addEventListener('change', (e) => {
            this.currentLanguage = e.target.value;
            this.updateEditorMode();
        });

        // 实时预览
        this.editor.addEventListener('input', () => {
            this.debounce(this.updatePreview.bind(this), 500)();
        });

        // 键盘快捷键
        this.editor.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // 点击外部关闭模板面板
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.templates-panel') && !e.target.closest('[onclick*="toggleTemplates"]')) {
                this.hideTemplates();
            }
        });
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + Enter 运行代码
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            this.runCode();
        }
        
        // Ctrl/Cmd + S 保存
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            this.saveCode();
        }
        
        // Tab 键处理
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.editor.selectionStart;
            const end = this.editor.selectionEnd;
            const value = this.editor.value;
            
            this.editor.value = value.substring(0, start) + '  ' + value.substring(end);
            this.editor.selectionStart = this.editor.selectionEnd = start + 2;
        }
    }

    updateEditorMode() {
        // 根据语言更新编辑器样式和提示
        const placeholder = {
            'html': '<!-- 在这里编写HTML代码 -->\n<!DOCTYPE html>\n<html>\n<head>\n  <title>我的页面</title>\n</head>\n<body>\n  \n</body>\n</html>',
            'css': '/* 在这里编写CSS样式 */\nbody {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n}',
            'javascript': '// 在这里编写JavaScript代码\nconsole.log("Hello, Galaxy!");\n\n// 你的代码...',
            'react': '// React组件示例\nfunction App() {\n  return (\n    <div>\n      <h1>Hello, React!</h1>\n    </div>\n  );\n}\n\nReactDOM.render(<App />, document.getElementById("root"));'
        };
        
        if (!this.editor.value.trim()) {
            this.editor.placeholder = placeholder[this.currentLanguage] || '在这里编写代码...';
        }
    }

    loadDefaultTemplate() {
        const defaultCode = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🌌 我的银河页面</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f0f23 50%, #000000 100%);
            color: white;
            min-height: 100vh;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
            padding: 40px 20px;
        }
        
        h1 {
            font-size: 3rem;
            margin-bottom: 20px;
            background: linear-gradient(45deg, #ffffff, #87ceeb);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .star {
            position: absolute;
            background: white;
            border-radius: 50%;
            animation: twinkle 2s infinite;
        }
        
        @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌌 欢迎来到我的银河</h1>
        <p>在这里开始你的编程之旅！</p>
        <button onclick="createStar()">✨ 创建星星</button>
    </div>
    
    <script>
        function createStar() {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.width = Math.random() * 3 + 1 + 'px';
            star.style.height = star.style.width;
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 2 + 's';
            
            document.body.appendChild(star);
            
            setTimeout(() => {
                star.remove();
            }, 5000);
        }
        
        // 自动创建一些星星
        for (let i = 0; i < 20; i++) {
            setTimeout(createStar, i * 200);
        }
    </script>
</body>
</html>`;
        
        this.editor.value = defaultCode;
        this.updatePreview();
    }

    runCode() {
        this.updatePreview();
        this.logToConsole('🚀 代码已运行', 'info');
    }

    updatePreview() {
        const code = this.editor.value;
        let previewContent = '';
        
        switch (this.currentLanguage) {
            case 'html':
                previewContent = code;
                break;
            case 'css':
                previewContent = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>${code}</style>
                    </head>
                    <body>
                        <div class="demo-content">
                            <h1>CSS 预览</h1>
                            <p>这是一个段落文本。</p>
                            <button>按钮</button>
                            <div class="box">盒子元素</div>
                        </div>
                    </body>
                    </html>
                `;
                break;
            case 'javascript':
                previewContent = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            #output { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px; }
                        </style>
                    </head>
                    <body>
                        <h1>JavaScript 预览</h1>
                        <div id="output"></div>
                        <script>
                            // 重定向console.log到页面
                            const output = document.getElementById('output');
                            const originalLog = console.log;
                            console.log = function(...args) {
                                output.innerHTML += args.join(' ') + '<br>';
                                originalLog.apply(console, args);
                            };
                            
                            try {
                                ${code}
                            } catch (error) {
                                output.innerHTML += '<span style="color: red;">错误: ' + error.message + '</span><br>';
                            }
                        </script>
                    </body>
                    </html>
                `;
                break;
            case 'react':
                previewContent = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
                        <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
                        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                        </style>
                    </head>
                    <body>
                        <div id="root"></div>
                        <script type="text/babel">
                            ${code}
                        </script>
                    </body>
                    </html>
                `;
                break;
        }
        
        const blob = new Blob([previewContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        this.preview.src = url;
        
        // 清理旧的URL
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    clearCode() {
        this.editor.value = '';
        this.updatePreview();
        this.logToConsole('🗑️ 代码已清空', 'info');
    }

    toggleTemplates() {
        this.isTemplatesVisible = !this.isTemplatesVisible;
        this.templatesPanel.classList.toggle('show', this.isTemplatesVisible);
    }

    hideTemplates() {
        this.isTemplatesVisible = false;
        this.templatesPanel.classList.remove('show');
    }

    toggleConsole() {
        this.isConsoleVisible = !this.isConsoleVisible;
        this.consolePanel.classList.toggle('show', this.isConsoleVisible);
        
        const btn = document.querySelector('[onclick="toggleConsole()"]');
        btn.classList.toggle('active', this.isConsoleVisible);
    }

    loadTemplate(templateName) {
        const templates = {
            'html-basic': `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML 基础页面</title>
</head>
<body>
    <header>
        <h1>欢迎来到我的网站</h1>
        <nav>
            <a href="#home">首页</a>
            <a href="#about">关于</a>
            <a href="#contact">联系</a>
        </nav>
    </header>
    
    <main>
        <section id="home">
            <h2>首页内容</h2>
            <p>这是一个基础的HTML页面结构。</p>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2024 我的网站</p>
    </footer>
</body>
</html>`,

            'css-animation': `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            margin: 0;
            padding: 40px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        
        .animation-container {
            text-align: center;
        }
        
        .floating-box {
            width: 100px;
            height: 100px;
            background: linear-gradient(45deg, #ff6b6b, #feca57);
            border-radius: 20px;
            margin: 20px auto;
            animation: float 3s ease-in-out infinite;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .pulse-text {
            color: white;
            font-size: 2rem;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.1); }
        }
        
        .rainbow-border {
            padding: 20px;
            border: 3px solid;
            border-image: linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet) 1;
            margin-top: 30px;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
        }
    </style>
</head>
<body>
    <div class="animation-container">
        <h1 class="pulse-text">🎨 CSS 动画展示</h1>
        <div class="floating-box"></div>
        <div class="rainbow-border">
            <p style="color: white; margin: 0;">这是一个彩虹边框的盒子！</p>
        </div>
    </div>
</body>
</html>`,

            'js-interactive': `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: linear-gradient(135deg, #74b9ff, #0984e3);
            color: white;
            min-height: 100vh;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            text-align: center;
        }
        
        button {
            background: #00b894;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px;
            transition: all 0.3s ease;
        }
        
        button:hover {
            background: #00a085;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        
        .counter {
            font-size: 3rem;
            margin: 20px 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .color-box {
            width: 200px;
            height: 200px;
            margin: 20px auto;
            border-radius: 20px;
            transition: all 0.5s ease;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>⚡ JavaScript 交互示例</h1>
        
        <div class="counter" id="counter">0</div>
        <button onclick="increment()">➕ 增加</button>
        <button onclick="decrement()">➖ 减少</button>
        <button onclick="reset()">🔄 重置</button>
        
        <div class="color-box" id="colorBox" onclick="changeColor()"></div>
        <p>点击上面的方块改变颜色！</p>
        
        <button onclick="showTime()">🕐 显示时间</button>
        <div id="timeDisplay"></div>
    </div>
    
    <script>
        let count = 0;
        
        function increment() {
            count++;
            updateCounter();
        }
        
        function decrement() {
            count--;
            updateCounter();
        }
        
        function reset() {
            count = 0;
            updateCounter();
        }
        
        function updateCounter() {
            document.getElementById('counter').textContent = count;
        }
        
        function changeColor() {
            const colors = ['#ff7675', '#74b9ff', '#00b894', '#fdcb6e', '#e17055', '#a29bfe'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            document.getElementById('colorBox').style.backgroundColor = randomColor;
        }
        
        function showTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('zh-CN');
            document.getElementById('timeDisplay').innerHTML = 
                '<p style="font-size: 1.5rem; margin-top: 20px;">🕐 当前时间: ' + timeString + '</p>';
        }
        
        // 初始化颜色
        changeColor();
    </script>
</body>
</html>`,

            'react-component': `<!DOCTYPE html>
<html>
<head>
    <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .app {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .todo-item {
            display: flex;
            align-items: center;
            padding: 10px;
            border-bottom: 1px solid #eee;
        }
        
        .todo-item.completed {
            text-decoration: line-through;
            opacity: 0.6;
        }
        
        input[type="text"] {
            flex: 1;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 16px;
        }
        
        button {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            margin-left: 10px;
            font-size: 16px;
        }
        
        button:hover {
            background: #5a6fd8;
        }
    </style>
</head>
<body>
    <div id="root"></div>
    
    <script type="text/babel">
        function TodoApp() {
            const [todos, setTodos] = React.useState([
                { id: 1, text: '学习 React', completed: false },
                { id: 2, text: '构建项目', completed: false }
            ]);
            const [inputValue, setInputValue] = React.useState('');
            
            const addTodo = () => {
                if (inputValue.trim()) {
                    setTodos([...todos, {
                        id: Date.now(),
                        text: inputValue,
                        completed: false
                    }]);
                    setInputValue('');
                }
            };
            
            const toggleTodo = (id) => {
                setTodos(todos.map(todo =>
                    todo.id === id ? { ...todo, completed: !todo.completed } : todo
                ));
            };
            
            const deleteTodo = (id) => {
                setTodos(todos.filter(todo => todo.id !== id));
            };
            
            return (
                <div className="app">
                    <h1>🚀 React Todo 应用</h1>
                    
                    <div style={{ display: 'flex', marginBottom: '20px' }}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="添加新任务..."
                            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                        />
                        <button onClick={addTodo}>添加</button>
                    </div>
                    
                    <div>
                        {todos.map(todo => (
                            <div key={todo.id} className={\`todo-item \${todo.completed ? 'completed' : ''}\`}>
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => toggleTodo(todo.id)}
                                    style={{ marginRight: '10px' }}
                                />
                                <span style={{ flex: 1 }}>{todo.text}</span>
                                <button 
                                    onClick={() => deleteTodo(todo.id)}
                                    style={{ background: '#e74c3c', marginLeft: '10px' }}
                                >
                                    删除
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <p style={{ marginTop: '20px', color: '#666' }}>
                        总计: {todos.length} 项，已完成: {todos.filter(t => t.completed).length} 项
                    </p>
                </div>
            );
        }
        
        ReactDOM.render(<TodoApp />, document.getElementById('root'));
    </script>
</body>
</html>`,

            'galaxy-theme': `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 25%, #0f0f23 50%, #000000 100%);
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            min-height: 100vh;
            overflow-x: hidden;
        }
        
        .galaxy-container {
            position: relative;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .content {
            text-align: center;
            z-index: 10;
            max-width: 800px;
            padding: 40px 20px;
        }
        
        .title {
            font-size: 4rem;
            margin-bottom: 20px;
            background: linear-gradient(45deg, #ffffff, #87ceeb, #ffffff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: glow 3s ease-in-out infinite alternate;
        }
        
        @keyframes glow {
            0% { text-shadow: 0 0 20px rgba(255, 255, 255, 0.5); }
            100% { text-shadow: 0 0 30px rgba(135, 206, 235, 0.8), 0 0 40px rgba(135, 206, 235, 0.6); }
        }
        
        .subtitle {
            font-size: 1.5rem;
            margin-bottom: 40px;
            opacity: 0.9;
        }
        
        .star {
            position: absolute;
            background: white;
            border-radius: 50%;
            animation: twinkle 3s infinite;
        }
        
        .star.small {
            width: 1px;
            height: 1px;
            animation-duration: 2s;
        }
        
        .star.medium {
            width: 2px;
            height: 2px;
            animation-duration: 3s;
            box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
        }
        
        .star.large {
            width: 3px;
            height: 3px;
            animation-duration: 4s;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.9);
        }
        
        @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
        }
        
        .shooting-star {
            position: absolute;
            width: 2px;
            height: 2px;
            background: linear-gradient(45deg, #ffffff, #87ceeb);
            border-radius: 50%;
            box-shadow: 0 0 10px #87ceeb;
            animation: shoot 3s linear infinite;
        }
        
        @keyframes shoot {
            0% {
                transform: translateX(-100px) translateY(100px);
                opacity: 0;
            }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% {
                transform: translateX(300px) translateY(-300px);
                opacity: 0;
            }
        }
        
        .cta-button {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 18px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        
        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.4);
        }
    </style>
</head>
<body>
    <div class="galaxy-container">
        <div class="content">
            <h1 class="title">🌌 银河系探索</h1>
            <p class="subtitle">在无尽的星空中发现编程的奥秘</p>
            <button class="cta-button" onclick="createShootingStar()">🌠 召唤流星</button>
            <button class="cta-button" onclick="addStars()">⭐ 添加星星</button>
        </div>
    </div>
    
    <script>
        // 创建初始星星
        function createStars() {
            for (let i = 0; i < 100; i++) {
                createStar();
            }
        }
        
        function createStar() {
            const star = document.createElement('div');
            star.className = 'star';
            
            // 随机大小
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
            star.style.animationDelay = Math.random() * 3 + 's';
            
            document.body.appendChild(star);
        }
        
        function createShootingStar() {
            const shootingStar = document.createElement('div');
            shootingStar.className = 'shooting-star';
            shootingStar.style.left = Math.random() * 100 + '%';
            shootingStar.style.top = Math.random() * 100 + '%';
            
            document.body.appendChild(shootingStar);
            
            setTimeout(() => {
                shootingStar.remove();
            }, 3000);
        }
        
        function addStars() {
            for (let i = 0; i < 20; i++) {
                setTimeout(createStar, i * 100);
            }
        }
        
        // 初始化
        createStars();
        
        // 定期创建流星
        setInterval(() => {
            if (Math.random() < 0.3) {
                createShootingStar();
            }
        }, 2000);
    </script>
</body>
</html>`
        };
        
        if (templates[templateName]) {
            this.editor.value = templates[templateName];
            this.updatePreview();
            this.hideTemplates();
            this.logToConsole(`📋 已加载模板: ${templateName}`, 'info');
        }
    }

    refreshPreview() {
        this.updatePreview();
        this.logToConsole('🔄 预览已刷新', 'info');
    }

    downloadCode() {
        const code = this.editor.value;
        const language = this.currentLanguage;
        const extension = {
            'html': 'html',
            'css': 'css',
            'javascript': 'js',
            'react': 'jsx'
        }[language] || 'txt';
        
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `galaxy-code.${extension}`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.logToConsole(`💾 代码已下载为 galaxy-code.${extension}`, 'success');
    }

    saveCode() {
        const code = this.editor.value;
        localStorage.setItem('playground-code', code);
        localStorage.setItem('playground-language', this.currentLanguage);
        this.logToConsole('💾 代码已保存到本地存储', 'success');
    }

    loadSavedCode() {
        const savedCode = localStorage.getItem('playground-code');
        const savedLanguage = localStorage.getItem('playground-language');
        
        if (savedCode) {
            this.editor.value = savedCode;
            this.updatePreview();
        }
        
        if (savedLanguage) {
            this.currentLanguage = savedLanguage;
            this.languageSelector.value = savedLanguage;
        }
    }

    setupAutoSave() {
        // 每30秒自动保存
        setInterval(() => {
            if (this.editor.value.trim()) {
                this.saveCode();
            }
        }, 30000);
    }

    interceptConsole() {
        // 拦截console输出到我们的控制台
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        
        console.log = (...args) => {
            this.logToConsole(args.join(' '), 'info');
            originalLog.apply(console, args);
        };
        
        console.error = (...args) => {
            this.logToConsole(args.join(' '), 'error');
            originalError.apply(console, args);
        };
        
        console.warn = (...args) => {
            this.logToConsole(args.join(' '), 'warn');
            originalWarn.apply(console, args);
        };
    }

    logToConsole(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logLine = document.createElement('div');
        logLine.className = `console-line console-${type}`;
        logLine.innerHTML = `<span style="opacity: 0.7;">[${timestamp}]</span> ${message}`;
        
        this.console.appendChild(logLine);
        this.console.scrollTop = this.console.scrollHeight;
        
        // 限制日志数量
        if (this.console.children.length > 100) {
            this.console.removeChild(this.console.firstChild);
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// 全局函数
function runCode() {
    playground.runCode();
}

function clearCode() {
    playground.clearCode();
}

function toggleTemplates() {
    playground.toggleTemplates();
}

function toggleConsole() {
    playground.toggleConsole();
}

function downloadCode() {
    playground.downloadCode();
}

function refreshPreview() {
    playground.refreshPreview();
}

function loadTemplate(templateName) {
    playground.loadTemplate(templateName);
}

// 初始化代码游乐场
let playground;
document.addEventListener('DOMContentLoaded', function() {
    playground = new CodePlayground();
    playground.loadSavedCode();
    
    // 欢迎消息
    setTimeout(() => {
        playground.logToConsole('🎮 欢迎来到代码游乐场！', 'info');
        playground.logToConsole('💡 提示: 使用 Ctrl+Enter 快速运行代码', 'info');
    }, 1000);
}); 