<?php

namespace Tests\Unit\Models;

use App\Models\Todo;
use Tests\TestCase;

class TodoTest extends TestCase
{
    public function testTodoModel()
    {
        $title = 'タイトル1';
        $todo = Todo::factory()->make();

        // 追加
        $todo->title = $title;
        $todo->save();

        $this->assertNotNull($todo);
        $this->assertEquals($todo->title, $title);

        // 更新
        $todo->title = 'タイトル2';
        $res = $todo->save();

        $this->assertTrue($res);

        // 取得
        $selectedTodo = Todo::where('id', $todo->id)->first();

        $this->assertEquals($todo->title, $selectedTodo->title);

        // 削除
        $todo->delete();
        $foundTodo = Todo::find($todo->id);
        $this->assertNull($foundTodo);
    }
}
