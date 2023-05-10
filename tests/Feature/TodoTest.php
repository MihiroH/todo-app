<?php

namespace Tests\Feature;

use App\Models\Todo;
use Carbon\Carbon;
use Tests\TestCase;

class TodoTest extends TestCase
{
    public function testIndex(): void
    {
        $todos = Todo::factory(3)->create();

        $response = $this->get(route('todos.index'));

        $response
            ->assertStatus(200)
            ->assertJson($todos->toArray());
    }

    public function testStore(): void
    {
        $todo = Todo::factory()->make();

        $response = $this->post(route('todos.store'), $todo->toArray());

        $response
            ->assertStatus(200)
            ->assertJson($todo->toArray());
    }

    public function testUpdate(): void
    {
        $todo = Todo::factory()->create();

        $response = $this->put(route('todos.update', ['todo' => $todo->id]), $todo->toArray());

        $response
            ->assertStatus(200)
            ->assertJson($todo->toArray());
    }

    public function testDestory(): void
    {
        $todo = Todo::factory()->create();

        $response = $this->delete(route('todos.destroy', ['todo' => $todo->id]));

        $response->assertStatus(200);
        $this->assertDatabaseMissing($todo->getTable(), ['id' => $todo->id]);
    }
}
