@echo off
REM Netlify Build Script for Windows
REM Replaces API URL placeholder in index.html with environment variable

REM Check if VITE_API_BASE_URL is set
if defined VITE_API_BASE_URL (
    echo Setting API URL to: %VITE_API_BASE_URL%
    REM Replace placeholder in index.html using PowerShell
    powershell -Command "(Get-Content index.html) -replace 'REPLACE_WITH_RENDER_URL', '%VITE_API_BASE_URL%' | Set-Content index.html"
    echo API URL updated in index.html
) else (
    echo WARNING: VITE_API_BASE_URL not set, using default localhost
)

echo Build complete

