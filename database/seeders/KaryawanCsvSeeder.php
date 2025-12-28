<?php

namespace Database\Seeders;

use App\Models\Karyawan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class KaryawanCsvSeeder extends Seeder
{
    /**
     * Parse currency string like "Rp 180.000" to integer 180000
     */
    private function parseRupiah(string $value): int
    {
        // Remove "Rp ", spaces, and dots, then convert to integer
        $cleaned = str_replace(['Rp', ' ', '.'], '', $value);
        return (int) $cleaned;
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $csvPath = base_path('UPAH 25.xlsx - Sheet1.csv');

        if (!File::exists($csvPath)) {
            $this->command->error("CSV file not found at: {$csvPath}");
            return;
        }

        $handle = fopen($csvPath, 'r');
        if (!$handle) {
            $this->command->error("Cannot open CSV file");
            return;
        }

        $employees = [];
        $isReadingEmployees = false;
        $headerFound = false;

        while (($row = fgetcsv($handle)) !== false) {
            // Skip empty rows
            if (empty($row[0]) || trim($row[0]) === '') {
                continue;
            }

            // Check for header row to start reading employees
            if (trim($row[0]) === 'NO' && trim($row[1]) === 'NAMA KARYAWAN') {
                $headerFound = true;
                $isReadingEmployees = true;
                continue;
            }

            // Stop when we hit "Total" or next month section
            if ($isReadingEmployees && (
                stripos($row[0], 'Total') !== false ||
                stripos($row[0], 'GRAND TOTAL') !== false ||
                stripos($row[0], 'UPAH FEBRUARI') !== false ||
                stripos($row[0], 'UPAH MARET') !== false
            )) {
                // We've finished reading January data, stop here
                // (all employees should be the same across months)
                break;
            }

            // Read employee data
            if ($isReadingEmployees && is_numeric(trim($row[0]))) {
                $nama = trim($row[1] ?? '');
                $bagian = trim($row[3] ?? '');
                $upahHarian = trim($row[4] ?? '');

                // Skip rows without valid data
                if (empty($nama) || empty($bagian) || empty($upahHarian)) {
                    continue;
                }

                // Skip FOGING row (not a regular employee)
                if (stripos($bagian, 'FOGING') !== false) {
                    continue;
                }

                // Parse the daily wage
                $nominalGaji = $this->parseRupiah($upahHarian);

                // Only add if not already exists (by name + bagian)
                $key = strtoupper($nama . '_' . $bagian);
                if (!isset($employees[$key]) && $nominalGaji > 0) {
                    $employees[$key] = [
                        'nama' => $nama,
                        'bagian' => $bagian,
                        'nominal_gaji' => $nominalGaji,
                    ];
                }
            }
        }

        fclose($handle);

        if (empty($employees)) {
            $this->command->error("No employees found in CSV file");
            return;
        }

        $this->command->info("Found " . count($employees) . " employees to import");

        $imported = 0;
        $skipped = 0;

        foreach ($employees as $employee) {
            // Check if employee already exists
            $existing = Karyawan::where('nama', $employee['nama'])
                ->where('bagian', $employee['bagian'])
                ->first();

            if ($existing) {
                // Update existing employee with new data if needed
                $existing->update([
                    'nominal_gaji' => $employee['nominal_gaji'],
                    'tipe_gaji' => 'mingguan',
                ]);
                $skipped++;
                $this->command->line("Updated: {$employee['nama']} ({$employee['bagian']}) - Rp " . number_format($employee['nominal_gaji'], 0, ',', '.'));
            } else {
                // Create new employee
                Karyawan::create([
                    'nama' => $employee['nama'],
                    'bagian' => $employee['bagian'],
                    'tanggal_masuk' => now(),
                    'tipe_gaji' => 'mingguan',
                    'nominal_gaji' => $employee['nominal_gaji'],
                    'status' => 'aktif',
                ]);
                $imported++;
                $this->command->line("Imported: {$employee['nama']} ({$employee['bagian']}) - Rp " . number_format($employee['nominal_gaji'], 0, ',', '.'));
            }
        }

        $this->command->info("Import complete!");
        $this->command->info("New employees imported: {$imported}");
        $this->command->info("Existing employees updated: {$skipped}");
    }
}
