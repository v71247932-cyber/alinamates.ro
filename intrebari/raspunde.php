<?php
// --- CONFIGURATION ---
define('SECRET_KEY', 'alina_mates_bridge_2025_secure');
// ---------------------

$id = $_GET['id'] ?? null;
$key = $_GET['key'] ?? null;

// Normalization removed to support both seconds and milliseconds directly.
// The ID passed in the URL should match the filename on disk.

// Basic validation
if (!$id || $key !== SECRET_KEY) {
    die("Acces neautorizat sau ID lipsă.");
}

// Get question content if it exists
$questionsDir = __DIR__ . '/txt';
$questionFile = $questionsDir . '/' . $id . '.txt';
$questionText = file_exists($questionFile) ? file_get_contents($questionFile) : "Întrebarea nu a fost găsită.";
?>
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Răspunde la Întrebare - Alina Mateș</title>
    <style>
        body { font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; line-height: 1.6; background: #f4f7f6; }
        .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { font-size: 1.2rem; color: #205c6b; margin-top: 0; }
        .question-box { background: #eef2f3; padding: 15px; border-left: 4px solid #205c6b; margin-bottom: 20px; font-style: italic; }
        textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 1rem; margin-bottom: 20px; }
        button { background: #444c27; color: white; border: none; padding: 12px 20px; border-radius: 4px; cursor: pointer; font-size: 1rem; width: 100%; transition: opacity 0.2s; }
        button:hover { opacity: 0.9; }
        .feedback { margin-top: 15px; text-align: center; font-weight: bold; }
        .success { color: #2e7d32; }
        .error { color: #d32f2f; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Răspunde la Întrebare</h1>
        <div class="question-box"><?php echo nl2br(htmlspecialchars($questionText)); ?></div>
        
        <form id="replyForm">
            <input type="hidden" id="id" value="<?php echo htmlspecialchars($id); ?>">
            <input type="hidden" id="key" value="<?php echo htmlspecialchars($key); ?>">
            <textarea id="answer" rows="6" placeholder="Scrie aici răspunsul tău..." required></textarea>
            <button type="submit" id="submitBtn">Salvează Răspunsul</button>
        </form>
        <div id="feedback" class="feedback"></div>
    </div>

    <script>
        document.getElementById('replyForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('submitBtn');
            const feedback = document.getElementById('feedback');
            
            btn.disabled = true;
            btn.textContent = 'Se salvează...';
            feedback.textContent = '';

            const data = {
                id: document.getElementById('id').value,
                key: document.getElementById('key').value,
                answer: document.getElementById('answer').value
            };

            try {
                const response = await fetch('salveaza_raspuns.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                if (result.success) {
                    feedback.className = 'feedback success';
                    feedback.textContent = 'Răspunsul a fost salvat cu succes!';
                    document.getElementById('answer').value = '';
                } else {
                    throw new Error(result.error || 'Eroare necunoscută');
                }
            } catch (error) {
                feedback.className = 'feedback error';
                feedback.textContent = 'Eroare: ' + error.message;
            } finally {
                btn.disabled = false;
                btn.textContent = 'Salvează Răspunsul';
            }
        });
    </script>
</body>
</html>
