<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function index(Request $request)
    {
        $query = Supplier::withCount('pembelians');

        if ($request->filled('search')) {
            $query->where('nama', 'like', '%' . $request->search . '%');
        }

        $suppliers = $query->orderBy('nama', 'asc')->paginate(15)->withQueryString();

        return Inertia::render('Supplier/Index', [
            'suppliers' => $suppliers,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Supplier/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'no_hp' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
        ]);

        Supplier::create($validated);

        return redirect('/supplier')->with('success', 'Supplier berhasil ditambahkan');
    }

    public function edit(Supplier $supplier)
    {
        return Inertia::render('Supplier/Edit', [
            'supplier' => $supplier,
        ]);
    }

    public function update(Request $request, Supplier $supplier)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'no_hp' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
        ]);

        $supplier->update($validated);

        return redirect('/supplier')->with('success', 'Supplier berhasil diupdate');
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();

        return redirect('/supplier')->with('success', 'Supplier berhasil dihapus');
    }
}
