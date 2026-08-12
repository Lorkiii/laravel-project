<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            DB::statement(
                'ALTER TABLE stock_movements '
                .'DROP CONSTRAINT IF EXISTS stock_movements_type_check',
            );
        } else {
            Schema::table('stock_movements', function (Blueprint $table) {
                $table->string('type', 32)->change();
            });
        }

        Schema::table('stock_movements', function (Blueprint $table) {
            $table->string('reason', 32)->nullable()->after('type');
            $table->string('reference')->nullable()->after('reason');
            $table->index(['type', 'user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        DB::table('stock_movements')
            ->where('type', 'stock_out')
            ->update(['type' => 'out']);

        Schema::table('stock_movements', function (Blueprint $table) {
            $table->dropIndex(['type', 'user_id', 'created_at']);
            $table->dropColumn(['reason', 'reference']);
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement(
                'ALTER TABLE stock_movements '
                ."ADD CONSTRAINT stock_movements_type_check CHECK (type IN ('in', 'out'))",
            );
        } else {
            Schema::table('stock_movements', function (Blueprint $table) {
                $table->enum('type', ['in', 'out'])->change();
            });
        }
    }
};
