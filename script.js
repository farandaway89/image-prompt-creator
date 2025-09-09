// Image Prompt Creator - JavaScript Functionality
// Modern ES6+ Implementation with Enhanced Features

class ImagePromptCreator {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.setupTemplates();
        this.loadHistory();
    }

    init() {
        this.elements = {
            basicIdea: document.getElementById('basic-idea'),
            imageStyle: document.getElementById('image-style'),
            mood: document.getElementById('mood'),
            colorPalette: document.getElementById('color-palette'),
            composition: document.getElementById('composition'),
            timeOfDay: document.getElementById('time-of-day'),
            quality: document.getElementById('quality'),
            additionalDetails: document.getElementById('additional-details'),
            excludeElements: document.getElementById('exclude-elements'),
            artistStyle: document.getElementById('artist-style'),
            
            // Buttons
            generateBtn: document.getElementById('generate-btn'),
            randomBtn: document.getElementById('random-btn'),
            clearBtn: document.getElementById('clear-btn'),
            advancedToggle: document.getElementById('advanced-toggle'),
            
            // Results
            resultContent: document.getElementById('result-content'),
            wordCount: document.getElementById('word-count'),
            charCount: document.getElementById('char-count'),
            complexity: document.getElementById('complexity'),
            
            // Actions
            copyBtn: document.getElementById('copy-btn'),
            saveBtn: document.getElementById('save-btn'),
            shareBtn: document.getElementById('share-btn'),
            
            // Other
            advancedContent: document.getElementById('advanced-content'),
            themeToggle: document.getElementById('theme-toggle'),
            helpBtn: document.getElementById('help-btn'),
            helpModal: document.getElementById('help-modal'),
            closeHelp: document.getElementById('close-help'),
            historyList: document.getElementById('history-list'),
            clearHistory: document.getElementById('clear-history'),
            toast: document.getElementById('toast')
        };

        this.history = JSON.parse(localStorage.getItem('promptHistory') || '[]');
        this.currentPrompt = '';
        
        // Character counters
        this.setupCharCounters();
    }

    setupEventListeners() {
        // Main buttons
        this.elements.generateBtn.addEventListener('click', () => this.generatePrompt());
        this.elements.randomBtn.addEventListener('click', () => this.generateRandom());
        this.elements.clearBtn.addEventListener('click', () => this.clearForm());
        
        // Advanced toggle
        this.elements.advancedToggle.addEventListener('click', () => this.toggleAdvanced());
        
        // Result actions
        this.elements.copyBtn.addEventListener('click', () => this.copyPrompt());
        this.elements.saveBtn.addEventListener('click', () => this.savePrompt());
        this.elements.shareBtn.addEventListener('click', () => this.sharePrompt());
        
        // Theme and help
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.elements.helpBtn.addEventListener('click', () => this.showHelp());
        this.elements.closeHelp.addEventListener('click', () => this.hideHelp());
        
        // History
        this.elements.clearHistory.addEventListener('click', () => this.clearHistoryData());
        
        // Modal close on backdrop click
        this.elements.helpModal.addEventListener('click', (e) => {
            if (e.target === this.elements.helpModal) {
                this.hideHelp();
            }
        });

        // Real-time input validation
        this.elements.basicIdea.addEventListener('input', () => this.validateInput());
        
        // Template cards
        document.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', () => this.applyTemplate(card.dataset.template));
        });
    }

    setupCharCounters() {
        // Basic idea counter
        this.elements.basicIdea.addEventListener('input', () => {
            const counter = this.elements.basicIdea.parentNode.querySelector('.char-counter');
            const length = this.elements.basicIdea.value.length;
            counter.textContent = `${length}/200`;
            counter.style.color = length > 180 ? '#f56565' : '#718096';
        });

        // Additional details counter
        if (this.elements.additionalDetails) {
            this.elements.additionalDetails.addEventListener('input', () => {
                const counter = this.elements.additionalDetails.parentNode.querySelector('.char-counter');
                const length = this.elements.additionalDetails.value.length;
                counter.textContent = `${length}/300`;
                counter.style.color = length > 280 ? '#f56565' : '#718096';
            });
        }
    }

    generatePrompt() {
        if (!this.validateInput()) return;

        this.showLoading();
        
        // Simulate API call delay for better UX
        setTimeout(() => {
            const prompt = this.buildPrompt();
            this.displayResult(prompt);
            this.updateStats(prompt);
            this.addToHistory(prompt);
            this.hideLoading();
        }, 800);
    }

    buildPrompt() {
        const parts = [];
        
        // Basic idea (required)
        const basicIdea = this.elements.basicIdea.value.trim();
        if (basicIdea) {
            parts.push(basicIdea);
        }

        // Style and quality
        const style = this.elements.imageStyle.value;
        const quality = this.elements.quality.value;
        
        if (style) {
            const styleMap = {
                'photorealistic': 'photorealistic, ultra realistic, highly detailed',
                'anime': 'anime style, manga art, cel shading',
                'digital-art': 'digital art, concept art, artstation trending',
                'oil-painting': 'oil painting, classical art, painterly',
                'watercolor': 'watercolor painting, soft brushstrokes, artistic',
                'sketch': 'pencil sketch, hand drawn, artistic sketch',
                '3d-render': '3D render, cinema 4D, octane render',
                'pixel-art': 'pixel art, 8-bit style, retro gaming',
                'comic': 'comic book style, graphic novel art',
                'vintage': 'vintage style, retro aesthetic, aged'
            };
            parts.push(styleMap[style] || style);
        }

        // Mood and atmosphere
        const mood = this.elements.mood.value;
        if (mood) {
            const moodMap = {
                'bright-cheerful': 'bright and cheerful, vibrant, happy atmosphere',
                'dark-mysterious': 'dark and mysterious, moody lighting, atmospheric',
                'calm-peaceful': 'calm and peaceful, serene, tranquil mood',
                'dramatic-intense': 'dramatic lighting, intense atmosphere, cinematic',
                'dreamy-ethereal': 'dreamy and ethereal, soft focus, fantasy lighting',
                'nostalgic': 'nostalgic atmosphere, warm memories, vintage feel',
                'futuristic': 'futuristic, sci-fi atmosphere, advanced technology',
                'romantic': 'romantic atmosphere, warm lighting, intimate',
                'scary-horror': 'scary atmosphere, horror elements, dark mood'
            };
            parts.push(moodMap[mood] || mood);
        }

        // Color palette
        const colorPalette = this.elements.colorPalette.value;
        if (colorPalette) {
            const colorMap = {
                'warm': 'warm colors, golden tones, cozy palette',
                'cool': 'cool colors, blue tones, calming palette',
                'monochrome': 'monochrome, black and white, grayscale',
                'pastel': 'pastel colors, soft tones, gentle palette',
                'vibrant': 'vibrant colors, saturated, bold palette',
                'earth-tones': 'earth tones, natural colors, organic palette',
                'neon': 'neon colors, glowing, electric palette',
                'sunset': 'sunset colors, orange and pink tones',
                'ocean': 'ocean colors, blue and teal tones'
            };
            parts.push(colorMap[colorPalette] || colorPalette);
        }

        // Composition and perspective
        const composition = this.elements.composition.value;
        if (composition) {
            const compositionMap = {
                'close-up': 'close-up shot, detailed view, macro perspective',
                'medium-shot': 'medium shot, balanced composition',
                'wide-shot': 'wide shot, expansive view, landscape composition',
                'birds-eye': 'bird\'s eye view, aerial perspective, top-down',
                'low-angle': 'low angle shot, dramatic perspective, looking up',
                'high-angle': 'high angle shot, looking down, elevated view',
                'first-person': 'first person perspective, POV shot',
                'panoramic': 'panoramic view, wide aspect ratio, sweeping vista'
            };
            parts.push(compositionMap[composition] || composition);
        }

        // Time of day
        const timeOfDay = this.elements.timeOfDay.value;
        if (timeOfDay) {
            const timeMap = {
                'dawn': 'dawn lighting, early morning, soft light',
                'morning': 'morning light, bright and fresh, golden hour',
                'noon': 'noon lighting, bright daylight, high sun',
                'afternoon': 'afternoon light, warm and comfortable',
                'sunset': 'sunset lighting, golden hour, warm glow',
                'dusk': 'dusk lighting, twilight, purple hour',
                'night': 'night scene, artificial lighting, dark atmosphere',
                'midnight': 'midnight, deep darkness, mysterious lighting'
            };
            parts.push(timeMap[timeOfDay] || timeOfDay);
        }

        // Artist style (advanced)
        const artistStyle = this.elements.artistStyle.value;
        if (artistStyle) {
            const artistMap = {
                'van-gogh': 'in the style of Van Gogh, swirling brushstrokes, post-impressionist',
                'picasso': 'in the style of Picasso, cubist, abstract forms',
                'monet': 'in the style of Monet, impressionist, soft brushwork',
                'da-vinci': 'in the style of Leonardo da Vinci, Renaissance, detailed',
                'banksy': 'in the style of Banksy, street art, stencil art',
                'studio-ghibli': 'Studio Ghibli style, anime, whimsical',
                'disney': 'Disney animation style, character design',
                'cyberpunk': 'cyberpunk aesthetic, neon, futuristic'
            };
            parts.push(artistMap[artistStyle] || artistStyle);
        }

        // Additional details
        const additionalDetails = this.elements.additionalDetails.value.trim();
        if (additionalDetails) {
            parts.push(additionalDetails);
        }

        // Quality settings
        if (quality) {
            const qualityMap = {
                'ultra-detailed': 'ultra detailed, 8K resolution, sharp focus',
                'high-quality': 'high quality, detailed, professional',
                '8k': '8K resolution, ultra high definition',
                '4k': '4K resolution, high definition',
                'hd': 'HD quality, clear and crisp',
                'masterpiece': 'masterpiece, award winning, gallery quality'
            };
            parts.push(qualityMap[quality] || quality);
        }

        // Negative prompts
        const excludeElements = this.elements.excludeElements.value.trim();
        let finalPrompt = parts.join(', ');
        
        if (excludeElements) {
            finalPrompt += `\n\nNegative prompt: ${excludeElements}, low quality, blurry, distorted`;
        } else {
            finalPrompt += '\n\nNegative prompt: low quality, blurry, distorted, ugly, bad anatomy';
        }

        return finalPrompt;
    }

    generateRandom() {
        // Random selections
        const randomSelections = {
            imageStyle: ['photorealistic', 'anime', 'digital-art', 'oil-painting', 'watercolor'],
            mood: ['bright-cheerful', 'dark-mysterious', 'calm-peaceful', 'dramatic-intense', 'dreamy-ethereal'],
            colorPalette: ['warm', 'cool', 'pastel', 'vibrant', 'earth-tones'],
            composition: ['close-up', 'medium-shot', 'wide-shot', 'birds-eye', 'low-angle'],
            timeOfDay: ['dawn', 'morning', 'sunset', 'dusk', 'night'],
            quality: ['ultra-detailed', 'high-quality', '8k', 'masterpiece']
        };

        const randomIdeas = [
            'mysterious wizard in enchanted forest',
            'futuristic city skyline at sunset',
            'peaceful mountain lake landscape',
            'earth view from space station',
            'ancient castle library with magical books',
            'beautiful garden full of colorful flowers',
            'majestic dragon flying over ocean',
            'snow covered mountains with aurora',
            'cyberpunk street with neon lights',
            'floating fantasy island in sky'
        ];

        // Apply random selections
        this.elements.basicIdea.value = this.getRandomItem(randomIdeas);
        this.elements.imageStyle.value = this.getRandomItem(randomSelections.imageStyle);
        this.elements.mood.value = this.getRandomItem(randomSelections.mood);
        this.elements.colorPalette.value = this.getRandomItem(randomSelections.colorPalette);
        this.elements.composition.value = this.getRandomItem(randomSelections.composition);
        this.elements.timeOfDay.value = this.getRandomItem(randomSelections.timeOfDay);
        this.elements.quality.value = this.getRandomItem(randomSelections.quality);

        // Trigger change events for character counters
        this.elements.basicIdea.dispatchEvent(new Event('input'));
        
        this.showToast('랜덤 설정이 적용되었습니다!');
        this.generatePrompt();
    }

    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    clearForm() {
        // Clear all inputs
        Object.values(this.elements).forEach(element => {
            if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT')) {
                element.value = '';
            }
        });

        // Reset character counters
        document.querySelectorAll('.char-counter').forEach(counter => {
            counter.textContent = '0/' + (counter.textContent.includes('200') ? '200' : '300');
            counter.style.color = '#718096';
        });

        // Clear results
        this.elements.resultContent.innerHTML = `
            <div class="placeholder">
                <i class="fas fa-lightbulb"></i>
                <p>옵션을 선택하고 '프롬프트 생성하기' 버튼을 눌러주세요!</p>
            </div>
        `;
        
        this.updateStats('');
        this.showToast('폼이 초기화되었습니다.');
    }

    toggleAdvanced() {
        const content = this.elements.advancedContent;
        const icon = this.elements.advancedToggle.querySelector('.fa-chevron-down');
        
        if (content.classList.contains('show')) {
            content.classList.remove('show');
            icon.style.transform = 'rotate(0deg)';
        } else {
            content.classList.add('show');
            icon.style.transform = 'rotate(180deg)';
        }
    }

    validateInput() {
        const basicIdea = this.elements.basicIdea.value.trim();
        const isValid = basicIdea.length > 0;
        
        this.elements.generateBtn.disabled = !isValid;
        
        if (!isValid) {
            this.elements.generateBtn.style.opacity = '0.5';
            this.elements.generateBtn.style.cursor = 'not-allowed';
        } else {
            this.elements.generateBtn.style.opacity = '1';
            this.elements.generateBtn.style.cursor = 'pointer';
        }
        
        return isValid;
    }

    displayResult(prompt) {
        this.currentPrompt = prompt;
        this.elements.resultContent.innerHTML = `<pre>${prompt}</pre>`;
        this.elements.resultContent.style.whiteSpace = 'pre-wrap';
        this.elements.resultContent.style.fontFamily = 'inherit';
    }

    updateStats(prompt) {
        const words = prompt.trim() ? prompt.trim().split(/\s+/).length : 0;
        const chars = prompt.length;
        let complexity = '간단';
        
        if (words > 50) complexity = '복잡';
        else if (words > 25) complexity = '보통';
        
        this.elements.wordCount.textContent = words;
        this.elements.charCount.textContent = chars;
        this.elements.complexity.textContent = complexity;
    }

    showLoading() {
        this.elements.generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 생성 중...';
        this.elements.generateBtn.disabled = true;
        this.elements.resultContent.classList.add('loading');
    }

    hideLoading() {
        this.elements.generateBtn.innerHTML = '<i class="fas fa-magic"></i> 프롬프트 생성하기';
        this.elements.generateBtn.disabled = false;
        this.elements.resultContent.classList.remove('loading');
    }

    copyPrompt() {
        if (!this.currentPrompt) {
            this.showToast('복사할 프롬프트가 없습니다.', 'error');
            return;
        }

        navigator.clipboard.writeText(this.currentPrompt).then(() => {
            this.showToast('프롬프트가 클립보드에 복사되었습니다!');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = this.currentPrompt;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('프롬프트가 복사되었습니다!');
        });
    }

    savePrompt() {
        if (!this.currentPrompt) {
            this.showToast('저장할 프롬프트가 없습니다.', 'error');
            return;
        }

        const blob = new Blob([this.currentPrompt], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prompt-${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('프롬프트가 파일로 저장되었습니다!');
    }

    sharePrompt() {
        if (!this.currentPrompt) {
            this.showToast('공유할 프롬프트가 없습니다.', 'error');
            return;
        }

        if (navigator.share) {
            navigator.share({
                title: 'AI 이미지 프롬프트',
                text: this.currentPrompt
            });
        } else {
            this.copyPrompt();
            this.showToast('프롬프트가 클립보드에 복사되었습니다. 원하는 곳에 붙여넣기 하세요!');
        }
    }

    addToHistory(prompt) {
        const historyItem = {
            id: Date.now(),
            prompt: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
            fullPrompt: prompt,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('ko-KR')
        };

        this.history.unshift(historyItem);
        if (this.history.length > 10) {
            this.history = this.history.slice(0, 10);
        }

        localStorage.setItem('promptHistory', JSON.stringify(this.history));
        this.renderHistory();
    }

    loadHistory() {
        this.renderHistory();
    }

    renderHistory() {
        if (this.history.length === 0) {
            this.elements.historyList.innerHTML = `
                <div class="history-empty">
                    <i class="fas fa-history"></i>
                    <p>생성 기록이 없습니다</p>
                </div>
            `;
            return;
        }

        this.elements.historyList.innerHTML = this.history.map(item => `
            <div class="history-item" data-id="${item.id}">
                <div class="history-content">
                    <p class="history-prompt">${item.prompt}</p>
                    <span class="history-date">${item.date}</span>
                </div>
                <div class="history-actions">
                    <button class="btn-icon history-view" title="전체 보기">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon history-copy" title="복사">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners for history items
        this.elements.historyList.querySelectorAll('.history-view').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                this.currentPrompt = this.history[index].fullPrompt;
                this.displayResult(this.currentPrompt);
                this.updateStats(this.currentPrompt);
            });
        });

        this.elements.historyList.querySelectorAll('.history-copy').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                navigator.clipboard.writeText(this.history[index].fullPrompt);
                this.showToast('프롬프트가 복사되었습니다!');
            });
        });
    }

    clearHistoryData() {
        this.history = [];
        localStorage.removeItem('promptHistory');
        this.renderHistory();
        this.showToast('기록이 삭제되었습니다.');
    }

    setupTemplates() {
        this.templates = {
            portrait: {
                basicIdea: '아름다운 여성의 초상화',
                imageStyle: 'photorealistic',
                mood: 'calm-peaceful',
                colorPalette: 'warm',
                composition: 'close-up',
                quality: 'ultra-detailed'
            },
            landscape: {
                basicIdea: '장엄한 산 풍경과 호수',
                imageStyle: 'photorealistic',
                mood: 'calm-peaceful',
                colorPalette: 'cool',
                composition: 'wide-shot',
                timeOfDay: 'sunset',
                quality: '8k'
            },
            fantasy: {
                basicIdea: '마법의 숲 속 요정',
                imageStyle: 'digital-art',
                mood: 'dreamy-ethereal',
                colorPalette: 'pastel',
                composition: 'medium-shot',
                timeOfDay: 'dusk',
                quality: 'masterpiece'
            },
            scifi: {
                basicIdea: '미래 도시의 스카이라인',
                imageStyle: '3d-render',
                mood: 'futuristic',
                colorPalette: 'neon',
                composition: 'wide-shot',
                timeOfDay: 'night',
                quality: '8k'
            },
            anime: {
                basicIdea: '귀여운 애니메이션 캐릭터',
                imageStyle: 'anime',
                mood: 'bright-cheerful',
                colorPalette: 'vibrant',
                composition: 'medium-shot',
                quality: 'high-quality'
            },
            abstract: {
                basicIdea: '추상적인 기하학적 패턴',
                imageStyle: 'digital-art',
                mood: 'dramatic-intense',
                colorPalette: 'vibrant',
                composition: 'close-up',
                quality: 'ultra-detailed'
            }
        };
    }

    applyTemplate(templateName) {
        const template = this.templates[templateName];
        if (!template) return;

        Object.keys(template).forEach(key => {
            const element = this.elements[key === 'basicIdea' ? 'basicIdea' : key];
            if (element) {
                element.value = template[key];
            }
        });

        // Trigger change events
        this.elements.basicIdea.dispatchEvent(new Event('input'));
        
        this.showToast(`${templateName} 템플릿이 적용되었습니다!`);
        this.generatePrompt();
    }

    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        
        this.elements.themeToggle.innerHTML = isDark ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
            
        localStorage.setItem('darkTheme', isDark);
    }

    showHelp() {
        this.elements.helpModal.classList.add('show');
    }

    hideHelp() {
        this.elements.helpModal.classList.remove('show');
    }

    showToast(message, type = 'success') {
        const toast = this.elements.toast;
        const toastMessage = toast.querySelector('.toast-message');
        const toastIcon = toast.querySelector('i');
        
        toastMessage.textContent = message;
        
        if (type === 'error') {
            toast.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
            toastIcon.className = 'fas fa-exclamation-circle';
        } else if (type === 'info') {
            toast.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
            toastIcon.className = 'fas fa-info-circle';
        } else {
            toast.style.background = 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
            toastIcon.className = 'fas fa-check-circle';
        }
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// This initialization is moved to the bottom

// Add some CSS for history items
const additionalCSS = `
.history-item {
    background: var(--bg-secondary);
    border-radius: var(--border-radius);
    padding: var(--spacing-sm);
    margin-bottom: var(--spacing-xs);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid rgba(102, 126, 234, 0.1);
    transition: all 0.3s ease;
}

.history-item:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: rgba(102, 126, 234, 0.3);
}

.history-content {
    flex: 1;
}

.history-prompt {
    font-size: var(--font-size-sm);
    color: var(--text-primary);
    margin-bottom: 4px;
    line-height: 1.4;
}

.history-date {
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
}

.history-actions {
    display: flex;
    gap: var(--spacing-xs);
}

.history-view, .history-copy {
    width: 32px;
    height: 32px;
    font-size: var(--font-size-sm);
}
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// ========================================
// Image Generation Module
// ========================================

class ImageGenerator {
    constructor(promptCreator) {
        this.promptCreator = promptCreator;
        this.canvas = document.getElementById('image-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.placeholder = document.getElementById('canvas-placeholder');
        this.generateBtn = document.getElementById('generate-image-btn');
        this.downloadBtn = document.getElementById('download-image-btn');
        this.regenerateBtn = document.getElementById('regenerate-btn');
        this.imageActions = document.getElementById('image-actions');
        this.apiKeyInput = document.getElementById('api-key-input');
        
        this.currentImageBlob = null;
        this.setupEventListeners();
        this.setupCanvas();
    }
    
    setupEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generateImage());
        this.downloadBtn.addEventListener('click', () => this.downloadImage());
        this.regenerateBtn.addEventListener('click', () => this.generateImage());
    }
    
    setupCanvas() {
        // Set canvas size
        this.canvas.width = 512;
        this.canvas.height = 512;
        
        // Enable image generation when prompt is available
        const originalDisplayResult = this.promptCreator.displayResult.bind(this.promptCreator);
        this.promptCreator.displayResult = (prompt) => {
            originalDisplayResult(prompt);
            this.enableImageGeneration();
        };
    }
    
    enableImageGeneration() {
        this.generateBtn.disabled = false;
        this.generateBtn.style.opacity = '1';
        this.generateBtn.style.cursor = 'pointer';
    }
    
    async generateImage() {
        if (!this.promptCreator.currentPrompt) {
            this.promptCreator.showToast('먼저 프롬프트를 생성해주세요!', 'error');
            return;
        }
        
        this.showLoading();
        
        try {
            // Extract clean prompt for image generation
            const cleanPrompt = this.extractImagePrompt(this.promptCreator.currentPrompt);
            
            // Try Hugging Face API first, fallback to Canvas if failed
            const success = await this.generateWithHuggingFace(cleanPrompt);
            
            if (!success) {
                // Fallback to Canvas generation
                const promptData = this.parsePrompt(this.promptCreator.currentPrompt);
                this.createAbstractArt(promptData);
                this.promptCreator.showToast('Using fallback Canvas generation', 'info');
            }
            
            this.hideLoading();
            this.showImageActions();
            
        } catch (error) {
            console.error('Image generation failed:', error);
            this.hideLoading();
            this.promptCreator.showToast('이미지 생성에 실패했습니다. 다시 시도해주세요.', 'error');
        }
    }
    
    extractImagePrompt(fullPrompt) {
        // Extract main prompt without negative prompts
        const parts = fullPrompt.split('\n\nNegative prompt:');
        return parts[0].trim();
    }
    
    async generateWithHuggingFace(prompt) {
        try {
            console.log('Attempting to generate with prompt:', prompt);
            
            const apiKey = this.apiKeyInput.value.trim();
            const model = "stabilityai/stable-diffusion-2-1";
            
            const headers = {
                'Content-Type': 'application/json',
            };
            
            // Add API key if provided, otherwise use free tier
            if (apiKey) {
                headers['Authorization'] = `Bearer ${apiKey}`;
                console.log('Using provided API key');
            } else {
                console.log('Using free tier (no API key)');
            }
            
            this.promptCreator.showToast('AI 이미지 생성 중...', 'info');
            
            const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    inputs: prompt
                })
            });
            
            console.log('API Response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                
                if (response.status === 503) {
                    this.promptCreator.showToast('모델 로딩 중... 잠시 후 다시 시도해주세요.', 'error');
                    return false;
                } else if (response.status === 429) {
                    this.promptCreator.showToast('요청 한도 초과. API 키를 입력하거나 잠시 후 다시 시도해주세요.', 'error');
                    return false;
                } else {
                    throw new Error(`API Error: ${response.status}`);
                }
            }
            
            const imageBlob = await response.blob();
            await this.displayGeneratedImage(imageBlob);
            
            this.promptCreator.showToast('AI 이미지 생성 완료!', 'success');
            return true;
            
        } catch (error) {
            console.error('Hugging Face API error:', error);
            
            if (error.message.includes('fetch')) {
                this.promptCreator.showToast('네트워크 오류. 인터넷 연결을 확인해주세요.', 'error');
            } else {
                this.promptCreator.showToast('API 호출 실패. Canvas 생성으로 전환합니다.', 'info');
            }
            
            return false;
        }
    }
    
    async displayGeneratedImage(blob) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(blob);
            
            img.onload = () => {
                // Clear canvas and draw the image
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
                
                // Store blob for download
                this.currentImageBlob = blob;
                
                // Clean up
                URL.revokeObjectURL(url);
                resolve();
            };
            
            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('Failed to load generated image'));
            };
            
            img.src = url;
        });
    }
    
    parsePrompt(prompt) {
        const data = {
            colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c'],
            mood: 'neutral',
            complexity: 'medium',
            style: 'abstract',
            shapes: 'mixed'
        };
        
        // Parse colors from prompt
        if (prompt.includes('warm colors') || prompt.includes('warm')) {
            data.colors = ['#ff6b6b', '#ffa500', '#ffd700', '#ff4757'];
        } else if (prompt.includes('cool colors') || prompt.includes('cool')) {
            data.colors = ['#3742fa', '#2f3542', '#40407a', '#706fd3'];
        } else if (prompt.includes('pastel')) {
            data.colors = ['#ffeaa7', '#fab1a0', '#fd79a8', '#fdcb6e'];
        } else if (prompt.includes('vibrant')) {
            data.colors = ['#e17055', '#0984e3', '#00b894', '#fdcb6e'];
        } else if (prompt.includes('neon')) {
            data.colors = ['#00ff00', '#ff00ff', '#00ffff', '#ffff00'];
        } else if (prompt.includes('monochrome')) {
            data.colors = ['#2d3436', '#636e72', '#b2bec3', '#ddd'];
        }
        
        // Parse mood
        if (prompt.includes('dark') || prompt.includes('mysterious')) {
            data.mood = 'dark';
            data.colors = data.colors.map(c => this.darkenColor(c));
        } else if (prompt.includes('bright') || prompt.includes('cheerful')) {
            data.mood = 'bright';
            data.colors = data.colors.map(c => this.brightenColor(c));
        } else if (prompt.includes('dreamy') || prompt.includes('ethereal')) {
            data.mood = 'dreamy';
        } else if (prompt.includes('dramatic') || prompt.includes('intense')) {
            data.mood = 'dramatic';
        }
        
        // Parse complexity
        const wordCount = prompt.split(' ').length;
        if (wordCount > 50) data.complexity = 'complex';
        else if (wordCount < 25) data.complexity = 'simple';
        
        // Parse style
        if (prompt.includes('geometric')) data.style = 'geometric';
        else if (prompt.includes('organic')) data.style = 'organic';
        else if (prompt.includes('abstract')) data.style = 'abstract';
        else if (prompt.includes('pattern')) data.style = 'pattern';
        
        return data;
    }
    
    createAbstractArt(data) {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Create gradient background
        this.createGradientBackground(data);
        
        // Add layers based on complexity
        const layers = data.complexity === 'simple' ? 2 : data.complexity === 'complex' ? 6 : 4;
        
        for (let i = 0; i < layers; i++) {
            this.addArtLayer(data, i, layers);
        }
        
        // Add final effects
        this.addEffects(data);
    }
    
    createGradientBackground(data) {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Create radial gradient
        const gradient = ctx.createRadialGradient(
            width/2, height/2, 0,
            width/2, height/2, Math.max(width, height)/2
        );
        
        gradient.addColorStop(0, data.colors[0] + '40');
        gradient.addColorStop(0.5, data.colors[1] + '20');
        gradient.addColorStop(1, data.colors[2] + '60');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }
    
    addArtLayer(data, layerIndex, totalLayers) {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const opacity = 0.8 - (layerIndex * 0.15);
        
        ctx.globalAlpha = opacity;
        
        switch (data.style) {
            case 'geometric':
                this.drawGeometricShapes(data, layerIndex);
                break;
            case 'organic':
                this.drawOrganicShapes(data, layerIndex);
                break;
            case 'pattern':
                this.drawPatterns(data, layerIndex);
                break;
            default:
                this.drawAbstractShapes(data, layerIndex);
        }
        
        ctx.globalAlpha = 1;
    }
    
    drawGeometricShapes(data, layer) {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const shapeCount = 5 + layer * 2;
        
        for (let i = 0; i < shapeCount; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = 20 + Math.random() * 100;
            const color = data.colors[Math.floor(Math.random() * data.colors.length)];
            
            ctx.fillStyle = color + Math.floor(50 + Math.random() * 100).toString(16);
            
            if (Math.random() > 0.5) {
                // Rectangle
                ctx.fillRect(x - size/2, y - size/2, size, size);
            } else {
                // Circle
                ctx.beginPath();
                ctx.arc(x, y, size/2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    
    drawOrganicShapes(data, layer) {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const shapeCount = 3 + layer;
        
        for (let i = 0; i < shapeCount; i++) {
            const centerX = Math.random() * width;
            const centerY = Math.random() * height;
            const color = data.colors[Math.floor(Math.random() * data.colors.length)];
            
            ctx.fillStyle = color + Math.floor(30 + Math.random() * 80).toString(16);
            
            this.drawBlobShape(centerX, centerY, 50 + Math.random() * 100);
        }
    }
    
    drawPatterns(data, layer) {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const spacing = 40 + layer * 10;
        
        const color = data.colors[layer % data.colors.length];
        ctx.strokeStyle = color + '80';
        ctx.lineWidth = 2 + Math.random() * 3;
        
        // Draw grid pattern
        for (let x = 0; x < width; x += spacing) {
            for (let y = 0; y < height; y += spacing) {
                if (Math.random() > 0.7) {
                    ctx.beginPath();
                    ctx.arc(x, y, 5 + Math.random() * 10, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }
        }
    }
    
    drawAbstractShapes(data, layer) {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const shapeCount = 4 + layer * 2;
        
        for (let i = 0; i < shapeCount; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const color = data.colors[Math.floor(Math.random() * data.colors.length)];
            
            ctx.fillStyle = color + Math.floor(40 + Math.random() * 120).toString(16);
            
            // Random abstract shape
            const shapeType = Math.floor(Math.random() * 4);
            
            switch (shapeType) {
                case 0:
                    this.drawWaveShape(x, y, 100 + Math.random() * 100);
                    break;
                case 1:
                    this.drawSpiralShape(x, y, 50 + Math.random() * 80);
                    break;
                case 2:
                    this.drawTriangleShape(x, y, 60 + Math.random() * 100);
                    break;
                default:
                    this.drawBlobShape(x, y, 40 + Math.random() * 120);
            }
        }
    }
    
    drawBlobShape(centerX, centerY, size) {
        const ctx = this.ctx;
        const points = 8 + Math.floor(Math.random() * 8);
        const angleStep = (Math.PI * 2) / points;
        
        ctx.beginPath();
        
        for (let i = 0; i <= points; i++) {
            const angle = i * angleStep;
            const radiusVariation = 0.7 + Math.random() * 0.6;
            const radius = size * radiusVariation;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.closePath();
        ctx.fill();
    }
    
    drawWaveShape(x, y, size) {
        const ctx = this.ctx;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        
        for (let i = 0; i <= size; i += 10) {
            const waveY = y + Math.sin(i * 0.1) * 20;
            ctx.lineTo(x + i, waveY);
        }
        
        ctx.stroke();
    }
    
    drawSpiralShape(centerX, centerY, size) {
        const ctx = this.ctx;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        
        const maxRadius = size;
        const steps = 50;
        
        for (let i = 0; i <= steps; i++) {
            const angle = (i / steps) * Math.PI * 4;
            const radius = (i / steps) * maxRadius;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            ctx.lineTo(x, y);
        }
        
        ctx.stroke();
    }
    
    drawTriangleShape(x, y, size) {
        const ctx = this.ctx;
        
        ctx.beginPath();
        ctx.moveTo(x, y - size/2);
        ctx.lineTo(x - size/2, y + size/2);
        ctx.lineTo(x + size/2, y + size/2);
        ctx.closePath();
        ctx.fill();
    }
    
    addEffects(data) {
        if (data.mood === 'dreamy') {
            this.addGlowEffect();
        } else if (data.mood === 'dramatic') {
            this.addShadowEffect();
        } else if (data.mood === 'bright') {
            this.addSparkleEffect(data);
        }
    }
    
    addGlowEffect() {
        const ctx = this.ctx;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 20;
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.3;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.globalCompositeOperation = 'source-over';
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
    
    addShadowEffect() {
        const ctx = this.ctx;
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 15;
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = 0.4;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.globalCompositeOperation = 'source-over';
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
    
    addSparkleEffect(data) {
        const ctx = this.ctx;
        const sparkleCount = 20;
        
        ctx.fillStyle = '#ffffff';
        
        for (let i = 0; i < sparkleCount; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = 2 + Math.random() * 4;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    darkenColor(color) {
        // Simple color darkening
        const factor = 0.6;
        return color + Math.floor(255 * factor).toString(16).padStart(2, '0');
    }
    
    brightenColor(color) {
        // Simple color brightening
        return color + 'CC';
    }
    
    showLoading() {
        this.generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 생성 중...';
        this.generateBtn.disabled = true;
        this.canvas.parentElement.classList.add('canvas-generating');
    }
    
    hideLoading() {
        this.generateBtn.innerHTML = '<i class="fas fa-image"></i> 이미지 생성하기';
        this.generateBtn.disabled = false;
        this.canvas.parentElement.classList.remove('canvas-generating');
        this.placeholder.classList.add('hidden');
    }
    
    showImageActions() {
        this.imageActions.style.display = 'flex';
    }
    
    downloadImage() {
        const link = document.createElement('a');
        link.download = `ai-generated-image-${Date.now()}.png`;
        
        // Use original AI image if available, otherwise use canvas
        if (this.currentImageBlob) {
            link.href = URL.createObjectURL(this.currentImageBlob);
        } else {
            link.href = this.canvas.toDataURL();
        }
        
        link.click();
        
        // Clean up object URL if used
        if (this.currentImageBlob) {
            setTimeout(() => URL.revokeObjectURL(link.href), 100);
        }
        
        this.promptCreator.showToast('이미지가 다운로드되었습니다!');
    }
}

// Initialize Image Generator with Prompt Creator
document.addEventListener('DOMContentLoaded', () => {
    // Single initialization point to avoid conflicts
    window.promptCreator = new ImagePromptCreator();
    window.imageGenerator = new ImageGenerator(window.promptCreator);
});