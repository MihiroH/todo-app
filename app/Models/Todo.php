<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Todoのモデル
 *
 * @property int $id
 * @property string $user_ip
 * @property string $title
 * @property string $status
 * @property \Illuminate\Support\Carbon $start_date
 * @property \Illuminate\Support\Carbon $due_date
 * @property boolean $is_timer_started
 * @property int $working_minutes
 * @property int $estimated_minutes
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 *
 * @mixin \Eloquent
 */
class Todo extends Model
{
    use HasFactory;

    public $table = 't_todos';

    const STATUS_TO_DO = 'todo';

    const STATUS_DONE = 'done';

    const STATUS_LIST = [
        self::STATUS_TO_DO,
        self::STATUS_DONE,
    ];

    protected $fillable = [
        'user_ip',
        'title',
        'status',
        'start_date',
        'due_date',
        'is_timer_started',
        'working_minutes',
        'estimated_minutes',
    ];
}
