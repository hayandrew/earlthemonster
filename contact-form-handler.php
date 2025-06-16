<?php
header('Content-Type: application/json');

// Get form data
$name = isset($_POST['name']) ? $_POST['name'] : '';
$email = isset($_POST['email']) ? $_POST['email'] : '';
$message = isset($_POST['message']) ? $_POST['message'] : '';

// Load reCAPTCHA config
$config_path = __DIR__ . '/config/recaptcha.php';
if (!file_exists($config_path)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server configuration error']);
    exit;
}

$config = include $config_path;

// Log form submission
error_log("\n=== Form Submission Details ===");
error_log("Time: " . date('Y-m-d H:i:s') . " UTC");
error_log("From: " . $name . " <" . $email . ">");
error_log("Message: " . $message);
error_log("=== End Form Details ===\n");

// Determine environment
$referer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '';
$is_development = strpos($referer, 'localhost') !== false || strpos($referer, '127.0.0.1') !== false;
$env = $is_development ? 'development' : 'production';

// Get reCAPTCHA response
$recaptcha_response = isset($_POST['g-recaptcha-response']) ? $_POST['g-recaptcha-response'] : '';
$recaptcha_secret = $config[$env]['secret_key'];

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
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error verifying reCAPTCHA']);
    exit;
}

// Close cURL session
curl_close($ch);

// Decode the response
$recaptcha_result = json_decode($recaptcha_result, true);

if (!$recaptcha_result['success']) {
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
    
    // Recipients
    $mail->setFrom('info@earlthemonster.com', 'Earl the Monster Contact Form');
    $mail->addAddress('andy@andyhay.com');  // Only sending to the working email
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
        <p><small>This email was sent from the contact form on earlthemonster.com</small></p>
    ";
    $mail->AltBody = "Name: {$name}\nEmail: {$email}\n\nMessage:\n{$message}\n\nThis email was sent from the contact form on earlthemonster.com";
    
    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Thank you for your message! We will get back to you soon.']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send message. Please try again later.']);
} 