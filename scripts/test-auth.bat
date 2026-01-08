@echo off
setlocal enabledelayedexpansion

REM Test Auth API
setlocal
set API_URL=http://localhost:3000/api/auth
set /A TIMESTAMP=%RANDOM%

echo.
echo ===============================================
echo Testing VOLTRA Auth API
echo ===============================================
echo.

REM Test 1: Register
echo [1] Testing REGISTER endpoint...
set EMAIL=testuser_%TIMESTAMP%@example.com
set USERNAME=testuser_%TIMESTAMP%

for /f "tokens=*" %%A in ('powershell -NoProfile -Command "& { Add-Type -AssemblyName System.Web; [System.Web.HttpUtility]::UrlEncode('%EMAIL%') }"') do set ENCODED_EMAIL=%%A

powershell -NoProfile -Command "& { $body = @{ email='%EMAIL%'; username='%USERNAME%'; password='Password123!'; confirmPassword='Password123!'; fullName='Test User' } | ConvertTo-Json; $response = Invoke-WebRequest -Uri '%API_URL%/register' -Method Post -Headers @{'Content-Type'='application/json'} -Body $body -PassThru; Write-Host 'Status:' $response.StatusCode; Write-Host 'Response:' ($response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10) }"

echo.

REM Test 2: Login
echo [2] Testing LOGIN endpoint...
powershell -NoProfile -Command "& { $body = @{ email='%EMAIL%'; password='Password123!' } | ConvertTo-Json; $response = Invoke-WebRequest -Uri '%API_URL%/login' -Method Post -Headers @{'Content-Type'='application/json'} -Body $body -PassThru; Write-Host 'Status:' $response.StatusCode; Write-Host 'Response:' ($response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10) }"

echo.
echo ===============================================
echo Tests complete
echo ===============================================
