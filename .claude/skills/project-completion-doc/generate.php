<?php
// Project Completion Doc - dompdf wrapper
// Usage: php generate.php <input.html> <output.pdf>

if ($argc < 3) {
    fwrite(STDERR, "Usage: php generate.php <input.html> <output.pdf>\n");
    exit(1);
}

$inputPath = $argv[1];
$outputPath = $argv[2];

if (!file_exists($inputPath)) {
    fwrite(STDERR, "Input HTML not found: $inputPath\n");
    exit(1);
}

require_once 'C:/xampp/htdocs/Rielcode/vendor/autoload.php';

use Dompdf\Dompdf;
use Dompdf\Options;

$opts = new Options();
$opts->set('isRemoteEnabled', true);
$opts->set('isHtml5ParserEnabled', true);
$opts->set('chroot', ['C:/xampp/htdocs/', dirname($inputPath)]);
$opts->set('defaultFont', 'DejaVu Sans');

$dompdf = new Dompdf($opts);
$dompdf->loadHtml(file_get_contents($inputPath), 'UTF-8');
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();

$outputDir = dirname($outputPath);
if (!is_dir($outputDir)) {
    mkdir($outputDir, 0777, true);
}

file_put_contents($outputPath, $dompdf->output());
echo "PDF written: $outputPath\n";
