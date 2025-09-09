# Image Prompt Creator 🎨

AI 이미지 생성을 위한 창의적이고 구체적인 프롬프트를 자동으로 생성하는 Gradio 기반 웹 애플리케이션입니다.

## 🌟 주요 기능

- **직관적인 인터페이스**: 단계별로 옵션을 선택하여 프롬프트 생성
- **다양한 스타일**: 포토리얼리스틱, 애니메이션, 디지털 아트 등 10가지 스타일
- **세밀한 설정**: 분위기, 색상, 구도, 시간대, 품질 등 세부 옵션
- **프리셋 템플릿**: 인물, 풍경, 판타지 등 6가지 템플릿
- **고급 옵션**: 아티스트 스타일, 추가 디테일, 제외할 요소 설정
- **랜덤 생성**: 창의적 영감을 위한 무작위 프롬프트 생성
- **실시간 통계**: 단어 수, 문자 수, 복잡도 표시

## 🚀 실행 방법

### 로컬 실행
```bash
pip install gradio
python app.py
```

### Hugging Face Spaces에 배포
1. Hugging Face에 새 Space 생성
2. `app.py`와 `requirements.txt` 파일 업로드
3. 자동으로 배포됨

## 📝 사용법

1. **기본 아이디어** 입력 (필수)
2. 원하는 **스타일과 옵션** 선택
3. **"프롬프트 생성하기"** 클릭
4. 생성된 프롬프트를 **복사**하여 AI 이미지 생성기에 사용

## 🎯 지원 AI 이미지 생성기

- DALL-E 3 (ChatGPT Plus)
- Midjourney
- Stable Diffusion
- Leonardo.ai
- Adobe Firefly

## 💡 팁

- 구체적이고 명확한 설명이 더 좋은 결과를 만듭니다
- 프리셋 템플릿으로 빠르게 시작하세요
- 고급 설정으로 더 세밀한 조정이 가능합니다
- 제외할 요소를 명시하면 원하지 않는 결과를 피할 수 있습니다

## 🛠️ 기술 스택

- **Framework**: Gradio 4.0+
- **Language**: Python 3.7+
- **Interface**: Web-based GUI
- **Deployment**: Hugging Face Spaces Ready