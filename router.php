<?php
// If the request is for an existing file or directory, serve it as-is
if (php_sapi_name() === 'cli-server') {
    $url  = parse_url($_SERVER['REQUEST_URI']);
    $file = __DIR__ . $url['path'];
    if (is_file($file)) {
        return false;
    }
}
// Otherwise, serve index.html
readfile(__DIR__ . '/index.html'); 