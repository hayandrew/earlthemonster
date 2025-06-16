<?php
header('Content-Type: application/json');

// Enable error logging
error_log("=== New Form Submission at " . date('Y-m-d H:i:s') . " UTC ===");
error_log("Request Method: " . $_SERVER['REQUEST_METHOD']);
error_log("Remote Address: " . $_SERVER['REMOTE_ADDR']);
error_log("Referer: " . $_SERVER['HTTP_REFERER']);
error_log("POST Data: " . print_r($_POST, true));

// Get form data
$name = isset($_POST['name']) ? $_POST['name'] : '';
$email = isset($_POST['email']) ? $_POST['email'] : '';
$message = isset($_POST['message']) ? $_POST['message'] : '';

// Load reCAPTCHA config
$config_path = __DIR__ . '/config/recaptcha.php';
error_log("Looking for config file at: " . $config_path);
error_log("Config file exists: " . (file_exists($config_path) ? 'Yes' : 'No'));

if (!file_exists($config_path)) {
    error_log("Error: reCAPTCHA config file not found");
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server configuration error']);
    exit;
}

$config = include $config_path;
error_log("Loaded reCAPTCHA config: " . print_r($config, true));

// Log form data (with email partially masked)
$masked_email = substr($email, 0, 3) . '***@' . substr(strrchr($email, '@'), 1);
error_log("Form Data Received:");
error_log("Name: " . substr($name, 0, 1) . str_repeat('*', strlen($name) - 1));
error_log("Email: " . $masked_email);
error_log("Message Length: " . strlen($message) . " characters");

// Determine environment
$referer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '';
$is_development = strpos($referer, 'localhost') !== false || strpos($referer, '127.0.0.1') !== false;
$env = $is_development ? 'development' : 'production';

error_log("Environment Detection:");
error_log("Referer: " . $referer);
error_log("Is Development: " . ($is_development ? 'Yes' : 'No'));

// Get reCAPTCHA response
$recaptcha_response = isset($_POST['g-recaptcha-response']) ? $_POST['g-recaptcha-response'] : '';
$recaptcha_secret = $config[$env]['secret_key'];

error_log("Using reCAPTCHA Secret Key: " . substr($recaptcha_secret, 0, 8) . "...");
error_log("reCAPTCHA Response Length: " . strlen($recaptcha_response) . " characters");

// Verify reCAPTCHA
$recaptcha_url = "https://www.google.com/recaptcha/api/siteverify";
$recaptcha_data = array(
    'secret' => $recaptcha_secret,
    'response' => $recaptcha_response
);

// Initialize cURL session
$ch = curl_init($recaptcha_url);

// Set cURL options
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($recaptcha_data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

// Execute cURL request
$recaptcha_result = curl_exec($ch);

// Check for cURL errors
if (curl_errno($ch)) {
    error_log("cURL Error during reCAPTCHA verification: " . curl_error($ch));
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error verifying reCAPTCHA']);
    exit;
}

// Close cURL session
curl_close($ch);

// Decode the response
$recaptcha_result = json_decode($recaptcha_result, true);

if (!$recaptcha_result['success']) {
    error_log("reCAPTCHA verification failed: " . print_r($recaptcha_result['error-codes'], true));
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'reCAPTCHA verification failed']);
    exit;
}

// Process the form submission
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

$mail = new PHPMailer(true);

try {
    error_log("Setting up PHPMailer...");
    
    // Server settings
    $mail->isSMTP();
    $mail->Host = 'localhost';
    $mail->SMTPAuth = false;  // No authentication required
    $mail->SMTPSecure = '';   // No SSL/TLS
    $mail->Port = 25;         // Standard SMTP port
    
    // Remove SSL options since we're not using encryption
    $mail->SMTPOptions = array();
    
    // Set timeout values
    $mail->Timeout = 60;
    $mail->SMTPKeepAlive = true;
    
    // Debug settings
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;
    $mail->Debugoutput = function($str, $level) {
        error_log("SMTP Debug: $str");
    };
    
    // Recipients
    $mail->setFrom('info@earlthemonster.com', 'Earl the Monster Contact Form');
    $mail->addAddress('info@earlthemonster.com');
    $mail->addReplyTo($email, $name);

    // Content
    $mail->isHTML(true);
    $mail->Subject = "New Contact Form Submission from " . $name;
    $mail->Body = "
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> {$name}</p>
        <p><strong>Email:</strong> {$email}</p>
        <p><strong>Message:</strong></p>
        <p>" . nl2br(htmlspecialchars($message)) . "</p>
    ";
    $mail->AltBody = "Name: {$name}\nEmail: {$email}\n\nMessage:\n{$message}";

    error_log("Attempting to send email via SMTP...");
    $mail->send();
    error_log("Email sent successfully via SMTP");
    
    echo json_encode(['success' => true, 'message' => 'Thank you for your message! We will get back to you soon.']);
} catch (Exception $e) {
    error_log("Failed to send email via SMTP. Error: " . $mail->ErrorInfo);
    error_log("Exception details: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send message. Please try again later.']);
} 