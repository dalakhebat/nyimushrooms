<?php

namespace App\Http\Controllers;

use App\Models\PengaturanGaji;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PengaturanGajiController extends Controller
{
    public function index()
    {
        $pengaturan = PengaturanGaji::all()->groupBy('tipe_gaji');

        return Inertia::render('PengaturanGaji/Index', [
            'pengaturan' => $pengaturan,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'pengaturan' => 'required|array',
            'pengaturan.*.id' => 'required|exists:pengaturan_gajis,id',
            'pengaturan.*.persentase_potongan' => 'required|numeric|min:0|max:100',
            'pengaturan.*.keterangan' => 'nullable|string|max:255',
        ]);

        foreach ($validated['pengaturan'] as $item) {
            PengaturanGaji::where('id', $item['id'])->update([
                'persentase_potongan' => $item['persentase_potongan'],
                'keterangan' => $item['keterangan'] ?? null,
            ]);
        }

        return redirect()->back()->with('success', 'Pengaturan gaji berhasil diperbarui');
    }
}
