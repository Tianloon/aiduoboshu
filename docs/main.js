// 主要JavaScript功能
class ProjectDemo {
    constructor() {
        this.init();
        this.setupAnimations();
        this.setupInteractions();
    }

    init() {
        // 初始化数据
        this.projectData = {
            efficiency: 28,
            coverage: 99.2,
            costReduction: 30,
            marketSize: 27.4,
            patentCount: 2
        };
        
        this.isAnimating = false;
    }

    setupAnimations() {
        // 页面加载动画
        anime({
            targets: '.hero-content > *',
            translateY: [50, 0],
            opacity: [0, 1],
            delay: anime.stagger(200),
            duration: 800,
            easing: 'easeOutExpo'
        });

        // 数字计数器动画
        this.animateCounters();
        
        // 滚动动画
        this.setupScrollAnimations();
    }

    animateCounters() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const suffix = counter.dataset.suffix || '';
            
            anime({
                targets: counter,
                innerHTML: [0, target],
                duration: 2000,
                round: 1,
                easing: 'easeOutExpo',
                update: function(anim) {
                    counter.innerHTML = Math.round(anim.animatables[0].target.innerHTML) + suffix;
                }
            });
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    this.animateElement(entry.target);
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    animateElement(element) {
        anime({
            targets: element,
            translateY: [30, 0],
            opacity: [0, 1],
            duration: 600,
            easing: 'easeOutExpo'
        });
    }

    setupInteractions() {
        // 智能分区演示器
        this.setupZoningDemo();
        
        // 导航交互
        this.setupNavigation();
        
        // 按钮悬停效果
        this.setupHoverEffects();
    }

    scrollToDemo() {
        const el = document.getElementById('zoning-demo');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    }

    setupZoningDemo() {
        const startBtn = document.getElementById('start-zoning');
        const resetBtn = document.getElementById('reset-zoning');
        const terrainCanvas = document.getElementById('terrain-canvas');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                if (!this.isAnimating) {
                    this.startZoningAnimation();
                }
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetZoningDemo();
            });
        }
    }

    startZoningAnimation() {
        this.isAnimating = true;
        const canvas = document.getElementById('terrain-canvas');
        const ctx = canvas.getContext('2d');
        
        // 设置画布大小
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // 创建地形数据
        const terrainData = this.generateTerrainData();
        
        // 动画分区过程
        this.animateZoning(ctx, terrainData);
    }

    generateTerrainData() {
        const canvas = document.getElementById('terrain-canvas');
        const width = canvas.width;
        const height = canvas.height;
        const data = [];
        
        for (let x = 0; x < width; x += 8) {
            for (let y = 0; y < height; y += 8) {
                const complexity = this.calculateTerrainComplexity(x, y);
                data.push({ x, y, complexity });
            }
        }
        
        return data;
    }

    calculateTerrainComplexity(x, y) {
        // 创建更真实的地形复杂度分布
        const centerX = 200;
        const centerY = 150;
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        
        // 创建多个地形特征
        const complexity1 = Math.sin(distance * 0.03) * 0.5;
        const complexity2 = Math.cos(x * 0.02) * Math.sin(y * 0.02) * 0.3;
        const complexity3 = Math.random() * 0.2 - 0.1;
        
        return complexity1 + complexity2 + complexity3;
    }

    animateZoning(ctx, terrainData) {
        let currentIndex = 0;
        const animateStep = () => {
            if (currentIndex < terrainData.length) {
                // 每次绘制多个点以加快动画
                for (let i = 0; i < 5; i++) {
                    if (currentIndex < terrainData.length) {
                        const point = terrainData[currentIndex];
                        const color = this.getZoneColor(point.complexity);
                        
                        ctx.fillStyle = color;
                        ctx.fillRect(point.x, point.y, 8, 8);
                        
                        currentIndex++;
                    }
                }
                requestAnimationFrame(animateStep);
            } else {
                this.isAnimating = false;
                this.showZoningResults();
            }
        };
        
        animateStep();
    }

    getZoneColor(complexity) {
        if (complexity < -0.3) return '#3b82f6'; // 简单区域 - 蓝色
        if (complexity < 0.3) return '#f59e0b';  // 中等区域 - 橙色
        return '#ef4444'; // 复杂区域 - 红色
    }

    showZoningResults() {
        const results = document.getElementById('zoning-results');
        if (results) {
            results.innerHTML = `
                <div class="text-center space-y-4">
                    <h4 class="text-lg font-semibold text-blue-900">分区完成</h4>
                    <div class="grid grid-cols-3 gap-4 text-sm">
                        <div class="bg-blue-100 p-3 rounded">
                            <div class="text-blue-600 font-medium">简单区域</div>
                            <div class="text-2xl font-bold text-blue-900">45%</div>
                        </div>
                        <div class="bg-orange-100 p-3 rounded">
                            <div class="text-orange-600 font-medium">中等区域</div>
                            <div class="text-2xl font-bold text-orange-900">35%</div>
                        </div>
                        <div class="bg-red-100 p-3 rounded">
                            <div class="text-red-600 font-medium">复杂区域</div>
                            <div class="text-2xl font-bold text-red-900">20%</div>
                        </div>
                    </div>
                </div>
            `;
            results.classList.remove('hidden');
        }
    }

    resetZoningDemo() {
        const canvas = document.getElementById('terrain-canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const results = document.getElementById('zoning-results');
        if (results) {
            results.classList.add('hidden');
        }
        
        this.isAnimating = false;
    }

    // animateCounters defined earlier in class; keep single implementation to avoid override issues

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href && href !== '#') {
                    window.location.href = href;
                }
            });
        });
    }

    setupHoverEffects() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                anime({
                    targets: button,
                    scale: 1.05,
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });
            
            button.addEventListener('mouseleave', () => {
                anime({
                    targets: button,
                    scale: 1,
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new ProjectDemo();
});

// 全局函数
function scrollToDemo() {
    document.getElementById('zoning-demo').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// 背景粒子动画
class ParticleBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.init();
    }

    init() {
        const hero = document.querySelector('.hero-bg');
        if (hero) {
            hero.appendChild(this.canvas);
            this.resize();
            this.createParticles();
            this.animate();
            window.addEventListener('resize', () => this.resize());
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// 初始化背景动画
document.addEventListener('DOMContentLoaded', () => {
    new ParticleBackground();
});