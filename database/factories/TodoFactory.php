<?php

namespace Database\Factories;

use App\Models\Todo;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Todo>
 */
class TodoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->realText(),
            'status' => fake()->randomElement(Todo::STATUS_LIST),
            'start_date' => now()->format('Y-m-d H:i:s'),
            'due_date' => now()->format('Y-m-d H:i:s'),
            'is_timer_started' => fake()->boolean(),
            'working_minutes' => fake()->numberBetween(0, 100),
            'estimated_minutes' => fake()->numberBetween(0, 100),
        ];
    }
}
