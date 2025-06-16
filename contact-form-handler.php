<?php

// Verify reCAPTCHA
$recaptcha_response = $_POST['g-recaptcha-response'] ?? '';
$recaptcha_secret = $config[$env]['secret_key'];
$recaptcha_verify_url = "https://www.google.com/recaptcha/api/siteverify?secret={$recaptcha_secret}&response={$recaptcha_response}";

error_log("reCAPTCHA Verification URL: " . $recaptcha_verify_url);

// Use cURL instead of file_get_contents
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $recaptcha_verify_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$recaptcha_result = curl_exec($ch);
$curl_error = curl_error($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($curl_error) {
    error_log("cURL Error during reCAPTCHA verification: " . $curl_error);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error verifying reCAPTCHA']);
    exit;
}

if ($http_code !== 200) {
    error_log("HTTP Error during reCAPTCHA verification. Status code: " . $http_code);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error verifying reCAPTCHA']);
    exit;
}

$recaptcha_data = json_decode($recaptcha_result, true);

if (!$recaptcha_data['success']) {
    error_log("reCAPTCHA verification failed: " . print_r($recaptcha_data['error-codes'] ?? [], true));
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'reCAPTCHA verification failed']);
    exit;
} 