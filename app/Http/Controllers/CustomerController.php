<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = Customer::withCount(['penjualanBaglogs', 'penjualanJamurs']);

        if ($request->filled('search')) {
            $query->where('nama', 'like', '%' . $request->search . '%');
        }

        $customers = $query->orderBy('nama', 'asc')->paginate(15)->withQueryString();

        // Add total transactions count
        $customers->getCollection()->transform(function ($customer) {
            $customer->total_transaksi = $customer->penjualan_baglogs_count + $customer->penjualan_jamurs_count;
            return $customer;
        });

        return Inertia::render('Customer/Index', [
            'customers' => $customers,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Customer/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'no_hp' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
        ]);

        Customer::create($validated);

        return redirect('/customer')->with('success', 'Customer berhasil ditambahkan');
    }

    public function edit(Customer $customer)
    {
        return Inertia::render('Customer/Edit', [
            'customer' => $customer,
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'no_hp' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
        ]);

        $customer->update($validated);

        return redirect('/customer')->with('success', 'Customer berhasil diupdate');
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();

        return redirect('/customer')->with('success', 'Customer berhasil dihapus');
    }
}
