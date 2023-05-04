<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private $table = 't_todos';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create($this->table, function (Blueprint $table) {
            $table->id()->comment('ID');
            $table->text('title')->comment('タイトル');
            $table->string('status')->comment('ステータス');;
            $table->timestamp('start_date')->nullable()->comment('開始日');
            $table->timestamp('due_date')->nullable()->comment('期限日');
            $table->boolean('is_timer_started')->nullable()->comment('タイマー開始済み');
            $table->integer('working_minutes')->nullable()->comment('作業時間');
            $table->integer('estimated_minutes')->nullable()->comment('見積時間');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists($this->table);
    }
};
