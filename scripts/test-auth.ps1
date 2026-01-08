param(
    [string]$ApiUrl = "http://localhost:3000/api/auth",
    [string]$ApiUrlTest = "http://localhost:3000/api"
)

function Test-Api {
    param(
        [string]$TestName,
        [string]$Url,
        [string]$Method = "POST",
        [object]$Body = $null,
        [hashtable]$Headers = @{"Content-Type" = "application/json"}
    )

    Write-Host "`n[TEST] $TestName" -ForegroundColor Cyan
    Write-Host "URL: $Url" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri     = $Url
            Method  = $Method
            Headers = $Headers
        }

        if ($Body) {
            $jsonBody = $Body | ConvertTo-Json
            Write-Host "Body: $jsonBody" -ForegroundColor Gray
            $params["Body"] = $jsonBody
        }

        $response = Invoke-WebRequest @params -PassThru
        
        Write-Host "✓ Status: $($response.StatusCode)" -ForegroundColor Green
        $responseObj = $response.Content | ConvertFrom-Json
        Write-Host "Response:" -ForegroundColor Green
        Write-Host ($responseObj | ConvertTo-Json -Depth 10) -ForegroundColor Green
        
        return $responseObj
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "✗ Status: $statusCode" -ForegroundColor Red
        
        try {
            $errorResponse = $_.Exception.Response.Content.ToString() | ConvertFrom-Json
            Write-Host "Error:" -ForegroundColor Red
            Write-Host ($errorResponse | ConvertTo-Json -Depth 10) -ForegroundColor Red
        }
        catch {
            Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        }
        
        return $null
    }
}

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "VOLTRA Auth API Test Suite" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow

# Test 1: Health Check
Test-Api -TestName "Health Check" -Url "$ApiUrlTest/health" -Method "GET" | Out-Null

# Test 2: Register
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$email = "testuser${timestamp}@example.com"
$username = "testuser${timestamp}"

$registerBody = @{
    email           = $email
    username        = $username
    password        = "Password123!"
    confirmPassword = "Password123!"
    fullName        = "Test User"
    jobTitle        = "Developer"
    division        = "Engineering"
    bio             = "Test bio"
    company         = "Test Company"
}

$registerResp = Test-Api -TestName "Register User" -Url "$ApiUrl/register" -Body $registerBody

if (-not $registerResp -or -not $registerResp.data.token) {
    Write-Host "`n[ERROR] Registration failed, stopping tests" -ForegroundColor Red
    exit 1
}

$token = $registerResp.data.token
Write-Host "`n✓ Token obtained: $($token.Substring(0, 20))..." -ForegroundColor Green

# Test 3: Login
$loginBody = @{
    email    = $email
    password = "Password123!"
}

$loginResp = Test-Api -TestName "Login User" -Url "$ApiUrl/login" -Body $loginBody

if (-not $loginResp -or -not $loginResp.data.token) {
    Write-Host "`n[ERROR] Login failed, stopping tests" -ForegroundColor Red
    exit 1
}

# Test 4: Get Profile (with token)
$authHeaders = @{
    "Authorization" = "Bearer $token"
    "Content-Type"  = "application/json"
}

Test-Api -TestName "Get Profile (via /me)" -Url "$ApiUrl/me" -Method "GET" -Headers $authHeaders | Out-Null

# Test 5: Update Profile
$updateBody = @{
    fullName = "Updated Test User"
    jobTitle = "Senior Developer"
    division = "Cloud Engineering"
    bio      = "Updated bio"
    company  = "Updated Company"
}

Test-Api -TestName "Update Profile" -Url "$ApiUrl/profile" -Method "PUT" -Body $updateBody -Headers $authHeaders | Out-Null

# Test 6: Register with mismatched passwords
$badRegisterBody = @{
    email           = "test2${timestamp}@example.com"
    username        = "test2${timestamp}"
    password        = "Password123!"
    confirmPassword = "Password456!"
    fullName        = "Test User 2"
}

Test-Api -TestName "Register with Mismatched Passwords (expect error)" -Url "$ApiUrl/register" -Body $badRegisterBody | Out-Null

# Test 7: Login with wrong password
$badLoginBody = @{
    email    = $email
    password = "WrongPassword123!"
}

Test-Api -TestName "Login with Wrong Password (expect error)" -Url "$ApiUrl/login" -Body $badLoginBody | Out-Null

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "Tests Complete!" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
