<?php
header('Content-Type: application/json');

$questionsDir = __DIR__ . '/txt';
if (!is_dir($questionsDir)) {
    mkdir($questionsDir, 0777, true);
}

$timestamp = time();
$qText = "Aceasta este o întrebare de test generată automat prin PHP.";
$aText = "Acesta este un răspuns de test generat automat prin PHP.";

file_put_contents($questionsDir . '/' . $timestamp . '.txt', $qText);
file_put_contents($questionsDir . '/r_' . $timestamp . '.txt', $aText);

echo json_encode(['success' => true, 'timestamp' => $timestamp]);
?>
