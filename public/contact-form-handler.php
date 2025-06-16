<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Enable error logging
error_reporting(E_ALL);
ini_set('display_errors', 0); // Disable display errors in production
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');

// Load reCAPTCHA configuration
$configPath = __DIR__ . '/../config/recaptcha.php';
if (!file_exists($configPath)) {
    error_log("Error: reCAPTCHA config file not found at: " . $configPath);
    http_response_code(500);
    echo json_encode(['error' => 'Server configuration error: reCAPTCHA config not found']);
    exit;
}

$recaptchaConfig = require $configPath;

// Log request details
error_log("=== New Form Submission ===");
error_log("Request Method: " . $_SERVER['REQUEST_METHOD']);
error_log("Request Time: " . date('Y-m-d H:i:s'));
error_log("Remote Address: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown'));
error_log("Referer: " . ($_SERVER['HTTP_REFERER'] ?? 'No referer'));

// Get form data
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$message = $_POST['message'] ?? '';
$recaptchaResponse = $_POST['g-recaptcha-response'] ?? '';

// Log form data (excluding sensitive information)
error_log("Form Data Received:");
error_log("Name: " . substr($name, 0, 1) . str_repeat('*', strlen($name) - 1));
error_log("Email: " . substr($email, 0, 3) . '***@' . substr(strrchr($email, '@'), 1));
error_log("Message Length: " . strlen($message) . " characters");
error_log("reCAPTCHA Response Length: " . strlen($recaptchaResponse) . " characters");

// Determine environment
$referer = $_SERVER['HTTP_REFERER'] ?? '';
$isDevelopment = strpos($referer, 'localhost:3000') !== false || strpos($referer, 'localhost:8000') !== false;
error_log("Environment Detection:");
error_log("Referer: " . $referer);
error_log("Is Development: " . ($isDevelopment ? 'Yes' : 'No'));

// Use appropriate keys based on environment
$environment = $isDevelopment ? 'development' : 'production';
$recaptchaSecret = $recaptchaConfig[$environment]['secret_key'] ?? null;

if (!$recaptchaSecret) {
    error_log("Error: reCAPTCHA secret key not found for environment: " . $environment);
    http_response_code(500);
    echo json_encode(['error' => 'Server configuration error: reCAPTCHA secret key not found']);
    exit;
}

error_log("Using reCAPTCHA Secret Key: " . substr($recaptchaSecret, 0, 8) . '...');

// Verify reCAPTCHA
$verifyUrl = "https://www.google.com/recaptcha/api/siteverify?secret={$recaptchaSecret}&response={$recaptchaResponse}";
error_log("reCAPTCHA Verification URL: " . $verifyUrl);

try {
    $recaptchaVerify = file_get_contents($verifyUrl);
    if ($recaptchaVerify === false) {
        throw new Exception('Failed to get reCAPTCHA verification response');
    }
    $recaptchaData = json_decode($recaptchaVerify);
    
    // Log verification result
    error_log("reCAPTCHA Verification Result: " . print_r($recaptchaData, true));
    
    if (!$recaptchaData->success) {
        error_log("reCAPTCHA Verification Failed: " . implode(', ', $recaptchaData->{'error-codes'} ?? []));
        http_response_code(400);
        echo json_encode([
            'error' => 'reCAPTCHA verification failed',
            'details' => $recaptchaData,
            'environment' => $environment
        ]);
        exit;
    }
} catch (Exception $e) {
    error_log("Error during reCAPTCHA verification: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'error' => 'Error during reCAPTCHA verification',
        'message' => $e->getMessage(),
        'environment' => $environment
    ]);
    exit;
}

// Validate form data
if (empty($name) || empty($email) || empty($message)) {
    error_log("Validation Error: Missing required fields");
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    error_log("Validation Error: Invalid email format - " . $email);
    http_response_code(400);
    echo json_encode(['error' => 'Please enter a valid email address']);
    exit;
}

// Prepare email
$to = 'info@earlthemonster.com';
$subject = 'New Contact Form Submission';
$headers = "From: {$email}\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$emailBody = "Name: {$name}\n";
$emailBody .= "Email: {$email}\n\n";
$emailBody .= "Message:\n{$message}";

// Send email
try {
    if (mail($to, $subject, $emailBody, $headers)) {
        error_log("Email sent successfully");
        echo json_encode([
            'success' => true,
            'environment' => $environment
        ]);
    } else {
        throw new Exception('mail() function returned false');
    }
} catch (Exception $e) {
    error_log("Failed to send email: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to send email',
        'message' => $e->getMessage(),
        'environment' => $environment
    ]);
}
?> 