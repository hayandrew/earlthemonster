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
$to = "info@earlthemonster.com";
$subject = "New Contact Form Submission from " . $name;
$headers = "From: " . $email . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$email_message = "Name: " . $name . "\n";
$email_message .= "Email: " . $email . "\n\n";
$email_message .= "Message:\n" . $message;

if (mail($to, $subject, $email_message, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Thank you for your message! We will get back to you soon.']);
} else {
    error_log("Failed to send email");
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send message. Please try again later.']);
} 