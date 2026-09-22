@echo off
chcp 65001 >nul
echo.
echo ========================================================
echo   SINCRONIZANDO COM O GITHUB (AUTO PUSH)
echo ========================================================
echo.

git add .
git diff-index --quiet HEAD
if %errorlevel% neq 0 (
    git commit -m "update: sincronizacao automatica da plataforma"
) else (
    echo Nenhum arquivo novo para commitar. Enviando commits pendentes...
)

git push origin main
echo.
echo ========================================================
echo   [OK] PUSH CONCLUÍDO COM SUCESSO!
echo ========================================================
echo.
pause
