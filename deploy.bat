@echo off
echo GitHub 저장소에 푸시 중...
cd "C:\Users\David\port\Image Prompt Creator"
git remote set-url origin https://github.com/farandaway89/image-prompt-creator.git
git push -u origin main
echo.
echo 배포 완료!
echo GitHub Pages 활성화:
echo 1. https://github.com/farandaway89/image-prompt-creator/settings/pages 접속
echo 2. Source: Deploy from a branch 선택
echo 3. Branch: main 선택
echo 4. Save 클릭
echo.
echo 배포된 사이트: https://farandaway89.github.io/image-prompt-creator/
pause