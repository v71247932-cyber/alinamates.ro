<?php
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$question = $input['question'] ?? null;

if (!$question) {
    http_response_code(400);
    echo json_encode(['error' => 'Question is required']);
    exit;
}

$questionsDir = __DIR__ . '/txt';
if (!is_dir($questionsDir)) {
    mkdir($questionsDir, 0777, true);
}

$timestamp = round(microtime(true) * 1000);
$fileName = $timestamp . '.txt';
$filePath = $questionsDir . '/' . $fileName;

if (file_put_contents($filePath, $question)) {
    // Determine protocol and host dynamically
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
    $host = $_SERVER['HTTP_HOST'];
    // Build the path to raspunde.php relative to this script
    $path = dirname($_SERVER['SCRIPT_NAME']); 
    // Ensure path has correct slashes and no trailing slash
    $path = rtrim(str_replace('\\', '/', $path), '/');
    
    $replyUrl = "{$protocol}://{$host}{$path}/raspunde.php?id={$timestamp}&key=alina_mates_bridge_2025_secure";

    // Discord Notification
    $webhookUrl = 'https://discord.com/api/webhooks/1454099935594024962/xu6mrgw8mHVrFJpQmdyZ4hgxnTf1t_HMEd2EMix9Gfnbm-QxbT0B6bg8dS4iAPLfqB6F';
    $message = "❓ **Întrebare nouă pe forum** (Anonim)\n\n" . $question . "\n\n---\n[👉 **Răspunde aici**]({$replyUrl})";
    
    $data = ['content' => $message];
    $options = [
        'http' => [
            'header'  => "Content-type: application/json\r\n",
            'method'  => 'POST',
            'content' => json_encode($data),
        ],
    ];
    $context  = stream_context_create($options);
    @file_get_contents($webhookUrl, false, $context);

    echo json_encode(['success' => true, 'timestamp' => $timestamp]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save question']);
}
?>
