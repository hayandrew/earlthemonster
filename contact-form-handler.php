<?php

// Verify reCAPTCHA
$recaptcha_response = $_POST['g-recaptcha-response'] ?? '';
$recaptcha_secret = $config[$env]['secret_key'];
$recaptcha_url = "https://www.google.com/recaptcha/api/siteverify";

error_log("reCAPTCHA Verification URL: " . $recaptcha_url);

// Use cURL instead of file_get_contents
$recaptcha_data = [
    'secret' => $recaptcha_secret,
    'response' => $recaptcha_response
];

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
    error_log("reCAPTCHA verification failed: " . print_r($recaptcha_result['error-codes'] ?? [], true));
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'reCAPTCHA verification failed']);
    exit;
} 