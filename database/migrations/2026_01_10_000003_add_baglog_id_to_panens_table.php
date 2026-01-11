<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('panens', function (Blueprint $table) {
            $table->foreignId('baglog_id')->nullable()->after('kumbung_id')->constrained()->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('panens', function (Blueprint $table) {
            $table->dropForeign(['baglog_id']);
            $table->dropColumn('baglog_id');
        });
    }
};
