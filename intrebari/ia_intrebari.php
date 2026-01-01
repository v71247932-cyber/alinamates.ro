<?php
header('Content-Type: application/json');

$questionsDir = __DIR__ . '/txt';
$questions = [];

if (is_dir($questionsDir)) {
    $files = scandir($questionsDir);
    
    foreach ($files as $file) {
        if (preg_match('/^(\d+)\.txt$/', $file, $matches)) {
            $timestamp = $matches[1];
            $qContent = file_get_contents($questionsDir . '/' . $file);
            
            $rFile = 'r_' . $timestamp . '.txt';
            $answer = null;
            if (file_exists($questionsDir . '/' . $rFile)) {
                $answer = file_get_contents($questionsDir . '/' . $rFile);
            }
            
            $questions[] = [
                'timestamp' => (int)$timestamp * 1000, // Convert to JS timestamp if needed, or keep as is
                'question' => $qContent,
                'answer' => $answer
            ];
        }
    }
}

// Sort newest first
usort($questions, function($a, $b) {
    return $b['timestamp'] - $a['timestamp'];
});

echo json_encode($questions);
?>
