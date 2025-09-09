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
            '신비로운 숲 속의 마법사',
            '미래 도시의 스카이라인',
            '평화로운 호수가 있는 산 풍경',
            '우주 정거장에서 바라본 지구',
            '고대 성 안의 도서관',
            '꽃이 가득한 아름다운 정원',
            '바다 위를 나는 드래곤',
            '눈 덮인 산맥과 오로라',
            '사이버펑크 스타일의 거리',
            '판타지 세계의 떠다니는 섬'
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

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImagePromptCreator();
});

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