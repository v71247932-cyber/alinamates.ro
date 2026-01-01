<?php
$queryId = $_GET['id'] ?? '1766764707000'; // Default to a known existing ID (in ms)
$targetId = $queryId;

echo "Original ID: " . $queryId . "\n";
echo "Strlen: " . strlen($queryId) . "\n";

if (strlen($queryId) > 10) {
    echo "Logic: > 10 chars. attempting normalize.\n";
    $floored = floor($queryId / 1000);
    echo "Floored: " . $floored . "\n";
    
    $substr = substr($queryId, 0, 10);
    echo "Substr: " . $substr . "\n";
    
    // Choose which one to test
    $targetId = $substr; 
} else {
    echo "Logic: <= 10 chars. No change.\n";
}

$path = __DIR__ . '/txt/' . $targetId . '.txt';
echo "Checking path: " . $path . "\n";

if (file_exists($path)) {
    echo "SUCCESS: File exists.\n";
    echo "Content: " . file_get_contents($path) . "\n";
} else {
    echo "FAILURE: File does not exist.\n";
}
?>
