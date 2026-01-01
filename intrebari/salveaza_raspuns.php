<?php
header('Content-Type: application/json');

// --- CONFIGURATION ---
// Change this to a strong secret key!
define('SECRET_KEY', 'alina_mates_bridge_2025_secure');
// ---------------------

// Get POST data (JSON)
$input = json_decode(file_get_contents('php://input'), true);

$id = $input['id'] ?? null; // The timestamp (e.g., 1700000000)
$answer = $input['answer'] ?? null;
$key = $input['key'] ?? null;

// Normalization removed to support both seconds and milliseconds directly.

// 1. Validate input
if (!$id || !$answer || !$key) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing ID, Answer, or Key']);
    exit;
}

// 2. Validate Secret Key
if ($key !== SECRET_KEY) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// 3. Ensure ID is safe (numbers only)
if (!preg_match('/^\d+$/', $id)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid ID format']);
    exit;
}

$questionsDir = __DIR__ . '/txt';
$questionFile = $questionsDir . '/' . $id . '.txt';
$answerFile = $questionsDir . '/r_' . $id . '.txt';

// 4. Verify the question exists
if (!file_exists($questionFile)) {
    http_response_code(404);
    echo json_encode(['error' => 'Question not found']);
    exit;
}

// 5. Save the answer
if (file_put_contents($answerFile, $answer)) {
    echo json_encode(['success' => true, 'message' => 'Answer saved successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to write answer file']);
}
?>
