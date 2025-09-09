import gradio as gr
import random
import json
from datetime import datetime

# 프롬프트 생성을 위한 데이터
STYLES = {
    "photorealistic": "photorealistic, ultra realistic, highly detailed",
    "anime": "anime style, manga style, cel shading",
    "digital-art": "digital art, concept art, artstation trending",
    "oil-painting": "oil painting, classical art, fine art",
    "watercolor": "watercolor painting, soft brushstrokes",
    "sketch": "pencil sketch, line art, hand drawn",
    "3d-render": "3D render, octane render, cinema 4d",
    "pixel-art": "pixel art, 8-bit style, retro gaming",
    "comic": "comic book style, graphic novel art",
    "vintage": "vintage style, retro, aged paper texture"
}

MOODS = {
    "bright-cheerful": "bright, cheerful, vibrant, happy, uplifting",
    "dark-mysterious": "dark, mysterious, moody, atmospheric, shadowy",
    "calm-peaceful": "calm, peaceful, serene, tranquil, zen-like",
    "dramatic-intense": "dramatic, intense, dynamic, powerful, striking",
    "dreamy-ethereal": "dreamy, ethereal, magical, surreal, otherworldly",
    "nostalgic": "nostalgic, melancholic, vintage, emotional",
    "futuristic": "futuristic, sci-fi, cyberpunk, high-tech, neon",
    "romantic": "romantic, soft, warm, intimate, gentle",
    "scary-horror": "scary, horror, creepy, dark, ominous"
}

COLORS = {
    "warm": "warm colors, golden hour, amber, orange, red tones",
    "cool": "cool colors, blue, cyan, purple, cold tones",
    "monochrome": "black and white, monochrome, grayscale",
    "pastel": "pastel colors, soft tones, muted palette",
    "vibrant": "vibrant colors, saturated, bright, colorful",
    "earth-tones": "earth tones, brown, beige, natural colors",
    "neon": "neon colors, electric, glowing, fluorescent",
    "sunset": "sunset colors, orange, pink, purple sky",
    "ocean": "ocean colors, blue, turquoise, aqua"
}

COMPOSITIONS = {
    "close-up": "close-up shot, detailed face, macro photography",
    "medium-shot": "medium shot, waist up, portrait style",
    "wide-shot": "wide shot, full body, environmental",
    "birds-eye": "bird's eye view, aerial view, top down",
    "low-angle": "low angle shot, dramatic perspective",
    "high-angle": "high angle shot, looking down",
    "first-person": "first person view, POV shot",
    "panoramic": "panoramic view, wide landscape, sweeping"
}

TIME_OF_DAY = {
    "dawn": "dawn, early morning light, soft sunrise",
    "morning": "morning light, bright daylight",
    "noon": "midday sun, harsh lighting, bright",
    "afternoon": "afternoon light, golden hour approach",
    "sunset": "sunset, golden hour, warm lighting",
    "dusk": "dusk, twilight, blue hour",
    "night": "night time, dark, artificial lighting",
    "midnight": "midnight, very dark, moonlight"
}

QUALITY = {
    "ultra-detailed": "ultra detailed, 8k resolution, masterpiece",
    "high-quality": "high quality, professional, award winning",
    "8k": "8k resolution, ultra high definition",
    "4k": "4k resolution, high definition",
    "hd": "HD quality, sharp, clear",
    "masterpiece": "masterpiece, museum quality, exceptional"
}

ARTIST_STYLES = {
    "van-gogh": "in the style of Vincent van Gogh, swirling brushstrokes",
    "picasso": "in the style of Pablo Picasso, cubist, geometric",
    "monet": "in the style of Claude Monet, impressionist",
    "da-vinci": "in the style of Leonardo da Vinci, renaissance",
    "banksy": "in the style of Banksy, street art, stencil",
    "studio-ghibli": "Studio Ghibli style, Miyazaki, anime",
    "disney": "Disney style, animated, family friendly",
    "cyberpunk": "cyberpunk style, neon, futuristic, dark"
}

# 템플릿 프리셋
TEMPLATES = {
    "portrait": {
        "style": "photorealistic",
        "mood": "calm-peaceful",
        "color": "warm",
        "composition": "close-up",
        "quality": "ultra-detailed"
    },
    "landscape": {
        "style": "photorealistic",
        "mood": "calm-peaceful", 
        "color": "earth-tones",
        "composition": "wide-shot",
        "time": "sunset",
        "quality": "8k"
    },
    "fantasy": {
        "style": "digital-art",
        "mood": "dreamy-ethereal",
        "color": "vibrant",
        "composition": "wide-shot",
        "quality": "masterpiece"
    },
    "scifi": {
        "style": "3d-render",
        "mood": "futuristic",
        "color": "neon",
        "composition": "wide-shot",
        "quality": "8k"
    },
    "anime": {
        "style": "anime",
        "mood": "bright-cheerful",
        "color": "vibrant",
        "composition": "medium-shot",
        "quality": "high-quality"
    },
    "abstract": {
        "style": "digital-art",
        "mood": "dreamy-ethereal",
        "color": "vibrant",
        "composition": "close-up",
        "quality": "masterpiece"
    }
}

def generate_prompt(basic_idea, style, mood, color_palette, composition, time_of_day, quality, 
                   additional_details, exclude_elements, artist_style):
    """프롬프트 생성 함수"""
    if not basic_idea.strip():
        return "❌ 기본 아이디어를 입력해주세요!", "", ""
    
    prompt_parts = [basic_idea.strip()]
    
    # 각 옵션별 프롬프트 추가
    if style and style in STYLES:
        prompt_parts.append(STYLES[style])
    
    if mood and mood in MOODS:
        prompt_parts.append(MOODS[mood])
        
    if color_palette and color_palette in COLORS:
        prompt_parts.append(COLORS[color_palette])
        
    if composition and composition in COMPOSITIONS:
        prompt_parts.append(COMPOSITIONS[composition])
        
    if time_of_day and time_of_day in TIME_OF_DAY:
        prompt_parts.append(TIME_OF_DAY[time_of_day])
        
    if quality and quality in QUALITY:
        prompt_parts.append(QUALITY[quality])
        
    if artist_style and artist_style in ARTIST_STYLES:
        prompt_parts.append(ARTIST_STYLES[artist_style])
    
    if additional_details.strip():
        prompt_parts.append(additional_details.strip())
    
    # 프롬프트 조합
    final_prompt = ", ".join(prompt_parts)
    
    # 제외할 요소 추가
    if exclude_elements.strip():
        final_prompt += f"\n\nNegative prompt: {exclude_elements.strip()}"
    
    # 통계 계산
    word_count = len(final_prompt.split())
    char_count = len(final_prompt)
    
    if word_count < 10:
        complexity = "간단"
    elif word_count < 25:
        complexity = "보통"
    else:
        complexity = "복잡"
    
    stats = f"📊 통계: {word_count}단어, {char_count}글자, {complexity} 복잡도"
    
    return final_prompt, stats, "✅ 프롬프트가 생성되었습니다!"

def apply_template(template_name):
    """템플릿 적용 함수"""
    if template_name not in TEMPLATES:
        return [""] * 8 + ["템플릿을 선택해주세요"]
    
    template = TEMPLATES[template_name]
    
    return (
        template.get("style", ""),
        template.get("mood", ""),
        template.get("color", ""),
        template.get("composition", ""),
        template.get("time", ""),
        template.get("quality", ""),
        template.get("artist", ""),
        f"✅ {template_name.title()} 템플릿이 적용되었습니다!"
    )

def random_generate():
    """랜덤 생성 함수"""
    random_ideas = [
        "majestic dragon flying over a castle",
        "cyberpunk city at night with neon lights",
        "peaceful forest with sunlight filtering through trees",
        "futuristic spaceship in deep space",
        "beautiful woman with flowing hair in the wind",
        "ancient temple covered in vines",
        "magical wizard casting a spell",
        "steampunk mechanical robot",
        "underwater city with coral reefs",
        "mountain landscape at sunset"
    ]
    
    idea = random.choice(random_ideas)
    style = random.choice(list(STYLES.keys()))
    mood = random.choice(list(MOODS.keys()))
    color = random.choice(list(COLORS.keys()))
    composition = random.choice(list(COMPOSITIONS.keys()))
    time = random.choice(list(TIME_OF_DAY.keys()))
    quality = random.choice(list(QUALITY.keys()))
    
    return idea, style, mood, color, composition, time, quality, "🎲 랜덤 옵션이 생성되었습니다!"

def clear_all():
    """초기화 함수"""
    return [""] * 10 + ["🧹 모든 입력이 초기화되었습니다!"]

# Gradio 인터페이스 구성
with gr.Blocks(
    title="Image Prompt Creator - AI 이미지 프롬프트 생성기",
    theme=gr.themes.Soft(
        primary_hue="indigo",
        secondary_hue="purple",
        neutral_hue="slate"
    ),
    css="""
    .gradio-container {
        font-family: 'Inter', sans-serif !important;
    }
    .main-header {
        text-align: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
    }
    .subtitle {
        text-align: center;
        color: #64748b;
        font-size: 1.125rem;
        margin-bottom: 2rem;
    }
    """
) as app:
    
    gr.HTML("""
    <div class="main-header">🎨 Image Prompt Creator</div>
    <div class="subtitle">창의적이고 구체적인 AI 이미지 생성 프롬프트를 자동으로 만들어보세요</div>
    """)
    
    with gr.Row():
        with gr.Column(scale=2):
            gr.Markdown("### 📝 기본 설정")
            
            # 기본 아이디어 입력
            basic_idea = gr.Textbox(
                label="기본 아이디어 *",
                placeholder="예: 고양이, 판타지 성, 우주 정거장...",
                lines=3,
                max_lines=5
            )
            
            with gr.Row():
                with gr.Column():
                    style = gr.Dropdown(
                        label="이미지 스타일",
                        choices=[("선택하세요", "")] + [(v.split(',')[0].title(), k) for k, v in STYLES.items()],
                        value=""
                    )
                    
                    mood = gr.Dropdown(
                        label="분위기/무드",
                        choices=[("선택하세요", "")] + [(v.split(',')[0].title(), k) for k, v in MOODS.items()],
                        value=""
                    )
                    
                    color_palette = gr.Dropdown(
                        label="색상 팔레트",
                        choices=[("선택하세요", "")] + [(v.split(',')[0].title(), k) for k, v in COLORS.items()],
                        value=""
                    )
                
                with gr.Column():
                    composition = gr.Dropdown(
                        label="구도/시점",
                        choices=[("선택하세요", "")] + [(v.split(',')[0].title(), k) for k, v in COMPOSITIONS.items()],
                        value=""
                    )
                    
                    time_of_day = gr.Dropdown(
                        label="시간대",
                        choices=[("선택하세요", "")] + [(v.split(',')[0].title(), k) for k, v in TIME_OF_DAY.items()],
                        value=""
                    )
                    
                    quality = gr.Dropdown(
                        label="품질 설정",
                        choices=[("선택하세요", "")] + [(v.split(',')[0].title(), k) for k, v in QUALITY.items()],
                        value=""
                    )
            
            # 고급 설정
            with gr.Accordion("🔧 고급 설정", open=False):
                additional_details = gr.Textbox(
                    label="추가 디테일",
                    placeholder="예: 금색 테두리, 빛나는 효과, 꽃잎이 흩날리는...",
                    lines=2
                )
                
                exclude_elements = gr.Textbox(
                    label="제외할 요소",
                    placeholder="예: 사람, 텍스트, 블러 효과..."
                )
                
                artist_style = gr.Dropdown(
                    label="아티스트 스타일",
                    choices=[("선택하세요", "")] + [(v.split(',')[0].title(), k) for k, v in ARTIST_STYLES.items()],
                    value=""
                )
            
            # 액션 버튼들
            with gr.Row():
                generate_btn = gr.Button("✨ 프롬프트 생성하기", variant="primary", size="lg")
                random_btn = gr.Button("🎲 랜덤 생성", variant="secondary")
                clear_btn = gr.Button("🧹 초기화", variant="stop")
        
        with gr.Column(scale=2):
            gr.Markdown("### 📋 생성된 프롬프트")
            
            # 결과 출력
            output_prompt = gr.Textbox(
                label="생성된 프롬프트",
                placeholder="프롬프트가 여기에 표시됩니다...",
                lines=8,
                max_lines=15,
                show_copy_button=True
            )
            
            stats_output = gr.Textbox(
                label="통계",
                placeholder="통계 정보가 여기에 표시됩니다...",
                lines=1,
                interactive=False
            )
            
            status_output = gr.Textbox(
                label="상태",
                placeholder="상태 메시지가 여기에 표시됩니다...",
                lines=1,
                interactive=False
            )
    
    # 템플릿 섹션
    gr.Markdown("### 🎯 프리셋 템플릿")
    
    with gr.Row():
        template_btns = []
        for template_name, template_desc in [
            ("portrait", "👤 인물 사진"),
            ("landscape", "🏔️ 풍경 사진"),
            ("fantasy", "🧙‍♂️ 판타지"),
            ("scifi", "🚀 공상과학"),
            ("anime", "🎌 애니메이션"),
            ("abstract", "🎨 추상 미술")
        ]:
            btn = gr.Button(template_desc, size="sm")
            template_btns.append((btn, template_name))
    
    # 사용법 안내
    with gr.Accordion("📚 사용법 가이드", open=False):
        gr.Markdown("""
        ## 기본 사용법
        1. **기본 아이디어**에 원하는 이미지의 핵심 요소를 입력하세요
        2. 각 드롭다운에서 원하는 옵션들을 선택하세요
        3. **'✨ 프롬프트 생성하기'** 버튼을 클릭하세요
        4. 생성된 프롬프트를 복사하여 AI 이미지 생성기에 사용하세요
        
        ## 💡 팁
        - 구체적이고 명확한 설명이 더 좋은 결과를 만듭니다
        - 프리셋 템플릿을 활용하면 빠르게 시작할 수 있습니다
        - 고급 설정에서 더 세밀한 조정이 가능합니다
        - 제외할 요소를 명시하면 원하지 않는 결과를 피할 수 있습니다
        
        ## 🎨 추천 AI 이미지 생성기
        - **DALL-E 3** (ChatGPT Plus)
        - **Midjourney** (Discord)
        - **Stable Diffusion** (다양한 플랫폼)
        - **Leonardo.ai**
        - **Firefly** (Adobe)
        """)
    
    # 이벤트 핸들러 설정
    generate_btn.click(
        fn=generate_prompt,
        inputs=[basic_idea, style, mood, color_palette, composition, time_of_day, quality, 
                additional_details, exclude_elements, artist_style],
        outputs=[output_prompt, stats_output, status_output]
    )
    
    random_btn.click(
        fn=random_generate,
        outputs=[basic_idea, style, mood, color_palette, composition, time_of_day, quality, status_output]
    )
    
    clear_btn.click(
        fn=clear_all,
        outputs=[basic_idea, style, mood, color_palette, composition, time_of_day, quality, 
                additional_details, exclude_elements, artist_style, status_output]
    )
    
    # 템플릿 버튼 이벤트 설정
    for btn, template_name in template_btns:
        btn.click(
            fn=lambda t=template_name: apply_template(t),
            outputs=[style, mood, color_palette, composition, time_of_day, quality, artist_style, status_output]
        )

# 앱 실행
if __name__ == "__main__":
    app.launch(
        share=True,
        server_name="0.0.0.0",
        server_port=7860,
        show_error=True
    )