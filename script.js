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
            languageToggle: document.getElementById('language-toggle'),
            helpBtn: document.getElementById('help-btn'),
            helpModal: document.getElementById('help-modal'),
            closeHelp: document.getElementById('close-help'),
            historyList: document.getElementById('history-list'),
            clearHistory: document.getElementById('clear-history'),
            toast: document.getElementById('toast')
        };

        this.history = JSON.parse(localStorage.getItem('promptHistory') || '[]');
        this.currentPrompt = '';
        this.isEnglishMode = localStorage.getItem('languageMode') === 'EN';
        
        // Character counters
        this.setupCharCounters();
        this.initializeLanguage();
    }

    initializeLanguage() {
        const langIndicator = this.elements.languageToggle.querySelector('.lang-indicator');
        langIndicator.textContent = this.isEnglishMode ? 'EN' : 'KO';
        
        if (this.isEnglishMode) {
            this.elements.languageToggle.classList.add('active');
            this.elements.languageToggle.title = 'English ↔ Korean prompts (Currently: English)';
        } else {
            this.elements.languageToggle.classList.remove('active');
            this.elements.languageToggle.title = '한국어 ↔ 영어 프롬프트 (현재: 한국어)';
        }
        
        // Apply language settings on page load
        this.updateUILanguage();
    }
    
    updateCharCounters() {
        // Update all character counters
        const basicCounter = this.elements.basicIdea.parentNode.querySelector('.char-counter');
        if (basicCounter) {
            const length = this.elements.basicIdea.value.length;
            basicCounter.textContent = `${length}/200`;
            basicCounter.style.color = length > 180 ? '#f56565' : '#718096';
        }
        
        if (this.elements.additionalDetails) {
            const additionalCounter = this.elements.additionalDetails.parentNode.querySelector('.char-counter');
            if (additionalCounter) {
                const length = this.elements.additionalDetails.value.length;
                additionalCounter.textContent = `${length}/300`;
                additionalCounter.style.color = length > 280 ? '#f56565' : '#718096';
            }
        }
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
        
        // Language and help
        this.elements.languageToggle.addEventListener('click', () => this.toggleLanguage());
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
        
        this.showToast(
            this.isEnglishMode ? 'Random settings applied!' : '랜덤 설정이 적용되었습니다!'
        );
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
                <p>${this.isEnglishMode ? "Select options and click 'Generate Prompt' button!" : "옵션을 선택하고 '프롬프트 생성하기' 버튼을 눌러주세요!"}</p>
            </div>
        `;
        
        this.updateStats('');
        this.showToast(
            this.isEnglishMode ? 'Form cleared.' : '폼이 초기화되었습니다.'
        );
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
        let complexity = this.isEnglishMode ? 'Simple' : '간단';
        
        if (words > 50) complexity = this.isEnglishMode ? 'Complex' : '복잡';
        else if (words > 25) complexity = this.isEnglishMode ? 'Medium' : '보통';
        
        this.elements.wordCount.textContent = words;
        this.elements.charCount.textContent = chars;
        this.elements.complexity.textContent = complexity;
    }

    showLoading() {
        this.elements.generateBtn.innerHTML = this.isEnglishMode ? 
            '<i class="fas fa-spinner fa-spin"></i> Generating...' : 
            '<i class="fas fa-spinner fa-spin"></i> 생성 중...';
        this.elements.generateBtn.disabled = true;
        this.elements.resultContent.classList.add('loading');
    }

    hideLoading() {
        this.elements.generateBtn.innerHTML = this.isEnglishMode ? 
            '<i class="fas fa-magic"></i> Generate Prompt' : 
            '<i class="fas fa-magic"></i> 프롬프트 생성하기';
        this.elements.generateBtn.disabled = false;
        this.elements.resultContent.classList.remove('loading');
    }

    copyPrompt() {
        if (!this.currentPrompt) {
            this.showToast(
                this.isEnglishMode ? 'No prompt to copy.' : '복사할 프롬프트가 없습니다.', 
                'error'
            );
            return;
        }

        navigator.clipboard.writeText(this.currentPrompt).then(() => {
            this.showToast(
                this.isEnglishMode ? 'Prompt copied to clipboard!' : '프롬프트가 클립보드에 복사되었습니다!'
            );
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = this.currentPrompt;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast(
                this.isEnglishMode ? 'Prompt copied!' : '프롬프트가 복사되었습니다!'
            );
        });
    }

    savePrompt() {
        if (!this.currentPrompt) {
            this.showToast(
                this.isEnglishMode ? 'No prompt to save.' : '저장할 프롬프트가 없습니다.', 
                'error'
            );
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
        
        this.showToast(
            this.isEnglishMode ? 'Prompt saved as file!' : '프롬프트가 파일로 저장되었습니다!'
        );
    }

    sharePrompt() {
        if (!this.currentPrompt) {
            this.showToast(
                this.isEnglishMode ? 'No prompt to share.' : '공유할 프롬프트가 없습니다.', 
                'error'
            );
            return;
        }

        if (navigator.share) {
            navigator.share({
                title: this.isEnglishMode ? 'AI Image Prompt' : 'AI 이미지 프롬프트',
                text: this.currentPrompt
            });
        } else {
            this.copyPrompt();
            this.showToast(
                this.isEnglishMode ? 
                'Prompt copied to clipboard. Paste it anywhere!' : 
                '프롬프트가 클립보드에 복사되었습니다. 원하는 곳에 붙여넣기 하세요!'
            );
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
                    <p>${this.isEnglishMode ? 'No generation history' : '생성 기록이 없습니다'}</p>
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
                this.showToast(
                    this.isEnglishMode ? 'Prompt copied!' : '프롬프트가 복사되었습니다!'
                );
            });
        });
    }

    clearHistoryData() {
        this.history = [];
        localStorage.removeItem('promptHistory');
        this.renderHistory();
        this.showToast(
            this.isEnglishMode ? 'History cleared.' : '기록이 삭제되었습니다.'
        );
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
        
        this.showToast(
            this.isEnglishMode ? `${templateName} template applied!` : `${templateName} 템플릿이 적용되었습니다!`
        );
        this.generatePrompt();
    }

    toggleLanguage() {
        this.isEnglishMode = !this.isEnglishMode;
        localStorage.setItem('languageMode', this.isEnglishMode ? 'EN' : 'KO');
        
        const langIndicator = this.elements.languageToggle.querySelector('.lang-indicator');
        langIndicator.textContent = this.isEnglishMode ? 'EN' : 'KO';
        
        if (this.isEnglishMode) {
            this.elements.languageToggle.classList.add('active');
            this.elements.languageToggle.title = 'English ↔ Korean prompts (Currently: English)';
        } else {
            this.elements.languageToggle.classList.remove('active');
            this.elements.languageToggle.title = '한국어 ↔ 영어 프롬프트 (현재: 한국어)';
        }
        
        // Update all UI text based on language
        this.updateUILanguage();
        
        this.showToast(
            this.isEnglishMode ? 
            'English mode enabled (better for AI)' : 
            '한국어 모드 활성화됨', 
            'info'
        );
        
        // Clear current prompt to avoid confusion
        this.elements.basicIdea.value = '';
        this.updateCharCounters();
    }

    updateUILanguage() {
        const translations = {
            ko: {
                // Header
                appTitle: 'Image Prompt Creator',
                heroTitle: 'AI 이미지 프롬프트 생성기',
                heroSubtitle: '창의적이고 구체적인 AI 이미지 생성 프롬프트를 자동으로 만들어보세요',
                
                // Form labels
                basicIdea: '기본 아이디어',
                basicIdeaPlaceholder: '예: 고양이, 판타지 성, 우주 정거장...',
                imageStyle: '이미지 스타일',
                mood: '분위기',
                colorPalette: '색상 팔레트',
                composition: '구도',
                timeOfDay: '시간대',
                quality: '품질',
                additionalDetails: '추가 세부사항',
                additionalDetailsPlaceholder: '추가하고 싶은 세부 요소나 특징을 입력하세요',
                excludeElements: '제외할 요소',
                excludePlaceholder: '이미지에서 제외하고 싶은 요소들을 입력하세요',
                artistStyle: '아티스트 스타일',
                
                // Buttons
                generateBtn: '프롬프트 생성하기',
                randomBtn: '랜덤 생성',
                clearBtn: '초기화',
                advancedOptions: '고급 옵션',
                
                // Actions
                copyBtn: '복사',
                saveBtn: '저장',
                shareBtn: '공유',
                
                // Image generation
                generateImageBtn: '이미지 생성하기',
                downloadImageBtn: '이미지 다운로드',
                regenerateBtn: '재생성',
                apiKeyLabel: 'Hugging Face API 키',
                apiKeyPlaceholder: 'hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                apiKeyHint: '키는 자동으로 저장됩니다',
                
                // Results
                resultTitle: '생성된 프롬프트',
                statsTitle: '통계',
                wordCount: '단어',
                charCount: '글자',
                complexity: '복잡도',
                
                // History
                historyTitle: '생성 기록',
                clearHistoryBtn: '기록 삭제',
                
                // Complexity levels
                simple: '간단',
                medium: '보통',
                complex: '복잡'
            },
            en: {
                // Header
                appTitle: 'Image Prompt Creator',
                heroTitle: 'AI Image Prompt Generator',
                heroSubtitle: 'Automatically create creative and detailed AI image generation prompts',
                
                // Form labels
                basicIdea: 'Basic Idea',
                basicIdeaPlaceholder: 'e.g., cat, fantasy castle, space station...',
                imageStyle: 'Image Style',
                mood: 'Mood',
                colorPalette: 'Color Palette',
                composition: 'Composition',
                timeOfDay: 'Time of Day',
                quality: 'Quality',
                additionalDetails: 'Additional Details',
                additionalDetailsPlaceholder: 'Enter additional elements or features you want to include',
                excludeElements: 'Exclude Elements',
                excludePlaceholder: 'Enter elements you want to exclude from the image',
                artistStyle: 'Artist Style',
                
                // Buttons
                generateBtn: 'Generate Prompt',
                randomBtn: 'Random Generate',
                clearBtn: 'Clear',
                advancedOptions: 'Advanced Options',
                
                // Actions
                copyBtn: 'Copy',
                saveBtn: 'Save',
                shareBtn: 'Share',
                
                // Image generation
                generateImageBtn: 'Generate Image',
                downloadImageBtn: 'Download Image',
                regenerateBtn: 'Regenerate',
                apiKeyLabel: 'Hugging Face API Key',
                apiKeyPlaceholder: 'hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                apiKeyHint: 'Key will be saved automatically',
                
                // Results
                resultTitle: 'Generated Prompt',
                statsTitle: 'Statistics',
                wordCount: 'Words',
                charCount: 'Characters',
                complexity: 'Complexity',
                
                // History
                historyTitle: 'Generation History',
                clearHistoryBtn: 'Clear History',
                
                // Complexity levels
                simple: 'Simple',
                medium: 'Medium',
                complex: 'Complex'
            }
        };

        const lang = this.isEnglishMode ? 'en' : 'ko';
        const t = translations[lang];

        // Update hero section
        const heroTitle = document.querySelector('.hero-content h2');
        const heroSubtitle = document.querySelector('.hero-content p');
        if (heroTitle) heroTitle.textContent = t.heroTitle;
        if (heroSubtitle) heroSubtitle.textContent = t.heroSubtitle;

        // Update form labels
        const updateLabel = (id, text) => {
            const label = document.querySelector(`label[for="${id}"]`);
            if (label) {
                const required = label.querySelector('.required');
                label.innerHTML = text + (required ? ' <span class="required">*</span>' : '');
            }
        };

        updateLabel('basic-idea', t.basicIdea);
        updateLabel('image-style', t.imageStyle);
        updateLabel('mood', t.mood);
        updateLabel('color-palette', t.colorPalette);
        updateLabel('composition', t.composition);
        updateLabel('time-of-day', t.timeOfDay);
        updateLabel('quality', t.quality);
        updateLabel('additional-details', t.additionalDetails);
        updateLabel('exclude-elements', t.excludeElements);
        updateLabel('artist-style', t.artistStyle);
        updateLabel('api-key-input', t.apiKeyLabel);

        // Update placeholders
        if (this.elements.basicIdea) this.elements.basicIdea.placeholder = t.basicIdeaPlaceholder;
        if (this.elements.additionalDetails) this.elements.additionalDetails.placeholder = t.additionalDetailsPlaceholder;
        if (this.elements.excludeElements) this.elements.excludeElements.placeholder = t.excludePlaceholder;
        const apiKeyInput = document.getElementById('api-key-input');
        if (apiKeyInput) apiKeyInput.placeholder = t.apiKeyPlaceholder;

        // Update buttons
        if (this.elements.generateBtn) {
            this.elements.generateBtn.innerHTML = `<i class="fas fa-magic"></i> ${t.generateBtn}`;
        }
        if (this.elements.randomBtn) {
            this.elements.randomBtn.innerHTML = `<i class="fas fa-dice"></i> ${t.randomBtn}`;
        }
        if (this.elements.clearBtn) {
            this.elements.clearBtn.innerHTML = `<i class="fas fa-eraser"></i> ${t.clearBtn}`;
        }

        // Update advanced options
        const advancedToggle = document.getElementById('advanced-toggle');
        if (advancedToggle) {
            advancedToggle.innerHTML = `<i class="fas fa-cog"></i> ${t.advancedOptions} <i class="fas fa-chevron-down"></i>`;
        }

        // Update action buttons
        if (this.elements.copyBtn) {
            this.elements.copyBtn.innerHTML = `<i class="fas fa-copy"></i> ${t.copyBtn}`;
        }
        if (this.elements.saveBtn) {
            this.elements.saveBtn.innerHTML = `<i class="fas fa-download"></i> ${t.saveBtn}`;
        }
        if (this.elements.shareBtn) {
            this.elements.shareBtn.innerHTML = `<i class="fas fa-share"></i> ${t.shareBtn}`;
        }

        // Update image generation buttons
        const generateImageBtn = document.getElementById('generate-image-btn');
        const downloadImageBtn = document.getElementById('download-image-btn');
        const regenerateBtn = document.getElementById('regenerate-btn');
        
        if (generateImageBtn) {
            generateImageBtn.innerHTML = `<i class="fas fa-image"></i> ${t.generateImageBtn}`;
        }
        if (downloadImageBtn) {
            downloadImageBtn.innerHTML = `<i class="fas fa-download"></i> ${t.downloadImageBtn}`;
        }
        if (regenerateBtn) {
            regenerateBtn.innerHTML = `<i class="fas fa-redo"></i> ${t.regenerateBtn}`;
        }

        // Update API key hint
        const apiKeyHint = document.querySelector('.api-key-hint');
        if (apiKeyHint) apiKeyHint.textContent = t.apiKeyHint;

        // Update result section titles
        const resultTitle = document.querySelector('.result-title');
        if (resultTitle) resultTitle.textContent = t.resultTitle;

        const statsTitle = document.querySelector('.stats h3');
        if (statsTitle) statsTitle.textContent = t.statsTitle;

        // Update stats labels
        const wordCountLabel = document.querySelector('.stat-item:nth-child(1) .stat-label');
        const charCountLabel = document.querySelector('.stat-item:nth-child(2) .stat-label');
        const complexityLabel = document.querySelector('.stat-item:nth-child(3) .stat-label');
        
        if (wordCountLabel) wordCountLabel.textContent = t.wordCount;
        if (charCountLabel) charCountLabel.textContent = t.charCount;
        if (complexityLabel) complexityLabel.textContent = t.complexity;

        // Update history section
        const historyTitle = document.querySelector('.history h3');
        if (historyTitle) historyTitle.textContent = t.historyTitle;
        
        if (this.elements.clearHistory) {
            this.elements.clearHistory.innerHTML = `<i class="fas fa-trash"></i> ${t.clearHistoryBtn}`;
        }

        // Update complexity display in stats if needed
        this.complexityTranslations = {
            '간단': t.simple,
            '보통': t.medium, 
            '복잡': t.complex,
            'Simple': t.simple,
            'Medium': t.medium,
            'Complex': t.complex
        };

        // Update result placeholder
        const placeholder = document.querySelector('.placeholder p');
        if (placeholder) {
            placeholder.textContent = this.isEnglishMode ? 
                "Select options and click 'Generate Prompt' button!" : 
                "옵션을 선택하고 '프롬프트 생성하기' 버튼을 눌러주세요!";
        }

        // Update image generation section
        const imageGenTitle = document.querySelector('.image-generation h3');
        if (imageGenTitle) {
            imageGenTitle.textContent = this.isEnglishMode ? '✨ AI Image Generation' : '✨ AI 이미지 생성';
        }

        const imageInstructions = document.querySelector('.canvas-placeholder p');
        if (imageInstructions) {
            imageInstructions.textContent = this.isEnglishMode ? 
                "Generate a prompt first, then click 'Generate Image'" : 
                "프롬프트를 생성한 후 '이미지 생성하기'를 클릭하세요";
        }

        // Update template section
        const templateTitle = document.querySelector('.templates h3');
        if (templateTitle) {
            templateTitle.textContent = this.isEnglishMode ? 'Preset Templates' : '프리셋 템플릿';
        }

        // Update template cards
        const templateCards = document.querySelectorAll('.template-card');
        const templateTranslations = {
            portrait: {
                ko: { title: '인물 사진', desc: '사실적인 인물 사진 생성용' },
                en: { title: 'Portrait', desc: 'For realistic portrait generation' }
            },
            landscape: {
                ko: { title: '풍경 사진', desc: '아름다운 자연 풍경 생성용' },
                en: { title: 'Landscape', desc: 'For beautiful nature scenes' }
            },
            fantasy: {
                ko: { title: '판타지', desc: '판타지 아트워크 생성용' },
                en: { title: 'Fantasy', desc: 'For fantasy artwork generation' }
            },
            scifi: {
                ko: { title: '공상과학', desc: '미래적 SF 이미지 생성용' },
                en: { title: 'Sci-Fi', desc: 'For futuristic SF images' }
            },
            anime: {
                ko: { title: '애니메이션', desc: '애니메이션 스타일 생성용' },
                en: { title: 'Animation', desc: 'For animation style generation' }
            },
            abstract: {
                ko: { title: '추상 미술', desc: '추상적 아트워크 생성용' },
                en: { title: 'Abstract Art', desc: 'For abstract artwork generation' }
            }
        };

        templateCards.forEach(card => {
            const template = card.dataset.template;
            const titleEl = card.querySelector('h4');
            const descEl = card.querySelector('p');
            
            if (template && templateTranslations[template]) {
                const trans = templateTranslations[template][lang];
                if (titleEl && trans) titleEl.textContent = trans.title;
                if (descEl && trans) descEl.textContent = trans.desc;
            }
        });

        // Update dropdown options
        this.updateDropdownOptions();

        // Update HTML labels that are not handled by updateLabel function
        const htmlLabels = {
            ko: {
                'option-group-image-style': '이미지 스타일',
                'option-group-mood': '분위기/무드', 
                'option-group-color-palette': '색상 팔레트',
                'option-group-composition': '구도/시점',
                'option-group-time-of-day': '시간대',
                'option-group-quality': '품질 설정'
            },
            en: {
                'option-group-image-style': 'Image Style',
                'option-group-mood': 'Mood/Atmosphere',
                'option-group-color-palette': 'Color Palette', 
                'option-group-composition': 'Composition',
                'option-group-time-of-day': 'Time of Day',
                'option-group-quality': 'Quality Settings'
            }
        };

        const labelTexts = htmlLabels[lang];
        
        // Update option group labels
        const optionGroups = document.querySelectorAll('.option-group');
        optionGroups.forEach((group, index) => {
            const label = group.querySelector('label');
            if (label) {
                const selectId = group.querySelector('select')?.id;
                let key = '';
                
                if (selectId === 'image-style') key = 'option-group-image-style';
                else if (selectId === 'mood') key = 'option-group-mood';
                else if (selectId === 'color-palette') key = 'option-group-color-palette';
                else if (selectId === 'composition') key = 'option-group-composition';
                else if (selectId === 'time-of-day') key = 'option-group-time-of-day';
                else if (selectId === 'quality') key = 'option-group-quality';
                
                if (key && labelTexts[key]) {
                    label.textContent = labelTexts[key];
                }
            }
        });

        // Update character counter labels (e.g., "0/200" -> stays same but context changes)
        const charCounters = document.querySelectorAll('.char-counter');
        // Character counters stay numeric so no translation needed
        
        // Update stats complexity display if there's already a value
        const complexityEl = this.elements.complexity;
        if (complexityEl && this.complexityTranslations) {
            const currentText = complexityEl.textContent;
            if (this.complexityTranslations[currentText]) {
                complexityEl.textContent = this.complexityTranslations[currentText];
            }
        }
    }

    updateDropdownOptions() {
        const optionTranslations = {
            imageStyle: {
                ko: {
                    '': '선택하세요',
                    'photorealistic': '사실적',
                    'anime': '애니메이션',
                    'digital-art': '디지털 아트',
                    'oil-painting': '유화',
                    'watercolor': '수채화',
                    'sketch': '스케치',
                    '3d-render': '3D 렌더',
                    'pixel-art': '픽셀 아트',
                    'comic': '만화',
                    'vintage': '빈티지'
                },
                en: {
                    '': 'Select style',
                    'photorealistic': 'Photorealistic',
                    'anime': 'Anime',
                    'digital-art': 'Digital Art',
                    'oil-painting': 'Oil Painting',
                    'watercolor': 'Watercolor',
                    'sketch': 'Sketch',
                    '3d-render': '3D Render',
                    'pixel-art': 'Pixel Art',
                    'comic': 'Comic',
                    'vintage': 'Vintage'
                }
            },
            mood: {
                ko: {
                    '': '선택하세요',
                    'bright-cheerful': '밝고 쾌활한',
                    'dark-mysterious': '어둡고 신비한',
                    'calm-peaceful': '차분하고 평화로운',
                    'dramatic-intense': '극적이고 강렬한',
                    'dreamy-ethereal': '꿈같고 환상적인',
                    'nostalgic': '향수를 자아내는',
                    'futuristic': '미래적인',
                    'romantic': '로맨틱한',
                    'scary-horror': '무섭고 공포스러운'
                },
                en: {
                    '': 'Select mood',
                    'bright-cheerful': 'Bright & Cheerful',
                    'dark-mysterious': 'Dark & Mysterious',
                    'calm-peaceful': 'Calm & Peaceful',
                    'dramatic-intense': 'Dramatic & Intense',
                    'dreamy-ethereal': 'Dreamy & Ethereal',
                    'nostalgic': 'Nostalgic',
                    'futuristic': 'Futuristic',
                    'romantic': 'Romantic',
                    'scary-horror': 'Scary & Horror'
                }
            },
            colorPalette: {
                ko: {
                    '': '선택하세요',
                    'warm': '따뜻한 색상',
                    'cool': '차가운 색상',
                    'monochrome': '흑백',
                    'pastel': '파스텔',
                    'vibrant': '생동감 있는',
                    'earth-tones': '자연색',
                    'neon': '네온',
                    'sunset': '석양',
                    'ocean': '바다'
                },
                en: {
                    '': 'Select palette',
                    'warm': 'Warm Colors',
                    'cool': 'Cool Colors',
                    'monochrome': 'Monochrome',
                    'pastel': 'Pastel',
                    'vibrant': 'Vibrant',
                    'earth-tones': 'Earth Tones',
                    'neon': 'Neon',
                    'sunset': 'Sunset',
                    'ocean': 'Ocean'
                }
            },
            composition: {
                ko: {
                    '': '선택하세요',
                    'close-up': '클로즈업',
                    'medium-shot': '중간샷',
                    'wide-shot': '와이드샷',
                    'birds-eye': '조감도',
                    'low-angle': '로우앵글',
                    'high-angle': '하이앵글',
                    'first-person': '1인칭 시점',
                    'panoramic': '파노라마'
                },
                en: {
                    '': 'Select composition',
                    'close-up': 'Close-up',
                    'medium-shot': 'Medium Shot',
                    'wide-shot': 'Wide Shot',
                    'birds-eye': 'Bird\'s Eye View',
                    'low-angle': 'Low Angle',
                    'high-angle': 'High Angle',
                    'first-person': 'First Person',
                    'panoramic': 'Panoramic'
                }
            },
            timeOfDay: {
                ko: {
                    '': '선택하세요',
                    'dawn': '새벽',
                    'morning': '아침',
                    'noon': '정오',
                    'afternoon': '오후',
                    'sunset': '석양',
                    'dusk': '황혼',
                    'night': '밤',
                    'midnight': '자정'
                },
                en: {
                    '': 'Select time',
                    'dawn': 'Dawn',
                    'morning': 'Morning',
                    'noon': 'Noon',
                    'afternoon': 'Afternoon',
                    'sunset': 'Sunset',
                    'dusk': 'Dusk',
                    'night': 'Night',
                    'midnight': 'Midnight'
                }
            },
            quality: {
                ko: {
                    '': '선택하세요',
                    'ultra-detailed': '초고해상도',
                    'high-quality': '고품질',
                    '8k': '8K 해상도',
                    '4k': '4K 해상도',
                    'hd': 'HD 품질',
                    'masterpiece': '걸작품질'
                },
                en: {
                    '': 'Select quality',
                    'ultra-detailed': 'Ultra Detailed',
                    'high-quality': 'High Quality',
                    '8k': '8K Resolution',
                    '4k': '4K Resolution',
                    'hd': 'HD Quality',
                    'masterpiece': 'Masterpiece'
                }
            },
            artistStyle: {
                ko: {
                    '': '선택하세요',
                    'van-gogh': '반 고흐',
                    'picasso': '피카소',
                    'monet': '모네',
                    'da-vinci': '레오나르도 다 빈치',
                    'banksy': '뱅크시',
                    'studio-ghibli': '스튜디오 지브리',
                    'disney': '디즈니',
                    'cyberpunk': '사이버펑크'
                },
                en: {
                    '': 'Select artist',
                    'van-gogh': 'Van Gogh',
                    'picasso': 'Picasso',
                    'monet': 'Monet',
                    'da-vinci': 'Da Vinci',
                    'banksy': 'Banksy',
                    'studio-ghibli': 'Studio Ghibli',
                    'disney': 'Disney',
                    'cyberpunk': 'Cyberpunk'
                }
            }
        };

        const lang = this.isEnglishMode ? 'en' : 'ko';
        
        Object.keys(optionTranslations).forEach(selectId => {
            const select = document.getElementById(selectId.replace(/([A-Z])/g, '-$1').toLowerCase());
            if (select) {
                const options = select.querySelectorAll('option');
                options.forEach(option => {
                    const value = option.value;
                    const translations = optionTranslations[selectId][lang];
                    if (translations && translations[value]) {
                        option.textContent = translations[value];
                    }
                });
            }
        });
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
        this.loadSavedAPIKey();
    }
    
    setupEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generateImage());
        this.downloadBtn.addEventListener('click', () => this.downloadImage());
        this.regenerateBtn.addEventListener('click', () => this.generateImage());
        
        // Auto-save API key when user types
        this.apiKeyInput.addEventListener('input', () => this.saveAPIKey());
        this.apiKeyInput.addEventListener('paste', () => {
            // Small delay to allow paste to complete
            setTimeout(() => this.saveAPIKey(), 100);
        });
    }
    
    saveAPIKey() {
        const apiKey = this.apiKeyInput.value.trim();
        if (apiKey && apiKey.length > 10) {
            // Only save if it looks like a valid API key
            localStorage.setItem('hf_api_key', apiKey);
            console.log('🔑 API key saved securely in browser');
        }
    }
    
    loadSavedAPIKey() {
        const savedKey = localStorage.getItem('hf_api_key');
        if (savedKey) {
            this.apiKeyInput.value = savedKey;
            this.apiKeyInput.style.borderColor = '#43e97b'; // Green border to indicate saved
            console.log('🔑 API key loaded from browser storage');
        }
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
    
    async testSimpleAPI() {
        const apiKey = this.apiKeyInput.value.trim();
        if (!apiKey) {
            console.log('❌ No API key for testing');
            return null;
        }

        console.log('🧪 Testing simple API call...');
        
        // Try the most reliable model
        const model = 'black-forest-labs/FLUX.1-dev';
        
        try {
            const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: "a beautiful cat"
                })
            });
            
            console.log(`🎯 API Response: ${response.status}`);
            
            if (response.ok) {
                console.log('✅ API working!');
                return model;
            } else {
                const errorText = await response.text();
                console.log('❌ API Error:', errorText);
                return null;
            }
            
        } catch (error) {
            console.log('❌ Network Error:', error.message);
            return null;
        }
    }

    async generateWithHuggingFace(prompt) {
        try {
            console.log('Attempting to generate with prompt:', prompt);
            
            const apiKey = this.apiKeyInput.value.trim();
            
            if (!apiKey) {
                console.log('No API key provided, skipping API call');
                this.promptCreator.showToast('API 키가 필요합니다. 키를 입력하거나 Canvas 생성을 사용하세요.', 'info');
                return false;
            }

            // Test simple API first
            const workingModel = await this.testSimpleAPI();
            if (!workingModel) {
                this.promptCreator.showToast('API 연결 실패. Canvas 생성을 사용합니다.', 'info');
                return false;
            }
            
            console.log('✅ Using working model:', workingModel);
            this.promptCreator.showToast('🎨 AI 이미지 생성 중...', 'info');
            
            // Make the simplest possible request
            const response = await fetch(`https://api-inference.huggingface.co/models/${workingModel}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: prompt
                })
            });
            
            console.log('API Response status:', response.status);
            console.log('API Response headers:', [...response.headers.entries()]);
            
            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}`;
                try {
                    const errorData = await response.text();
                    console.log('Error response:', errorData);
                    errorMessage += `: ${errorData}`;
                } catch (e) {
                    console.log('Could not read error response');
                }
                
                if (response.status === 503) {
                    this.promptCreator.showToast('모델 로딩 중... 30초 후 다시 시도해주세요.', 'error');
                    return false;
                } else if (response.status === 429) {
                    this.promptCreator.showToast('요청 한도 초과. 잠시 후 다시 시도해주세요.', 'error');
                    return false;
                } else if (response.status === 401 || response.status === 403) {
                    this.promptCreator.showToast('API 키 권한이 부족합니다. Inference Endpoints 권한이 있는 새 토큰을 생성해주세요.', 'error');
                    console.log('API 키 권한 문제: https://huggingface.co/settings/tokens 에서 "Inference API" 또는 "write" 권한으로 새 토큰 생성');
                    return false;
                } else if (response.status === 400) {
                    this.promptCreator.showToast('잘못된 요청입니다. 프롬프트를 확인해주세요.', 'error');
                    return false;
                } else {
                    this.promptCreator.showToast(`API 오류 (${response.status}): ${errorMessage}`, 'error');
                    return false;
                }
            }
            
            const imageBlob = await response.blob();
            await this.displayGeneratedImage(imageBlob);
            
            this.promptCreator.showToast('AI 이미지 생성 완료!', 'success');
            return true;
            
        } catch (error) {
            console.error('Hugging Face API error:', error);
            
            if (error.message.includes('fetch') || error.name === 'TypeError') {
                this.promptCreator.showToast(`네트워크 오류: ${error.message}`, 'error');
            } else if (error.message.includes('CORS')) {
                this.promptCreator.showToast('CORS 오류. API 접근이 차단되었습니다.', 'error');
            } else {
                this.promptCreator.showToast(`API 오류: ${error.message}`, 'error');
            }
            
            console.log('Falling back to Canvas generation');
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
        
        gradient.addColorStop(0, this.addOpacity(data.colors[0], 0.25));
        gradient.addColorStop(0.5, this.addOpacity(data.colors[1], 0.12));
        gradient.addColorStop(1, this.addOpacity(data.colors[2], 0.38));
        
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
        // Return original color - no modification to avoid parsing issues
        return color;
    }
    
    brightenColor(color) {
        // Return original color - no modification to avoid parsing issues  
        return color;
    }
    
    addOpacity(color, opacity) {
        // Safely add opacity to hex color
        const alpha = Math.floor(opacity * 255).toString(16).padStart(2, '0');
        return color + alpha;
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
    
    // Debug function for direct API testing
    window.testHuggingFaceAPI = async (apiKey, prompt = "a cat") => {
        console.log('🔍 Direct API Test Starting...');
        try {
            const response = await fetch('https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ inputs: prompt })
            });
            
            console.log('📊 Response Status:', response.status);
            console.log('📋 Response Headers:', Object.fromEntries(response.headers.entries()));
            
            if (response.ok) {
                console.log('✅ API Test SUCCESS!');
                const blob = await response.blob();
                console.log('📦 Received blob size:', blob.size, 'bytes');
                return true;
            } else {
                const errorText = await response.text();
                console.log('❌ API Test FAILED:', errorText);
                return false;
            }
        } catch (error) {
            console.log('💥 Network Error:', error);
            return false;
        }
    };
    
    console.log('💡 Debug: Type "testHuggingFaceAPI(\'your_api_key\')" in console to test API directly');
});