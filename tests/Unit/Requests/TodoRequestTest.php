<?php

namespace Tests\Unit\Requests;

use App\Http\Requests\TodoRequest;
use App\Models\Todo;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class TodoRequestTest extends TestCase
{
    /**
     * バリデーションテスト
     *
     * @param 値
     * @param 期待値
     *
     * @dataProvider todoData
     */
    public function testValidation(array $data, bool $expect): void
    {
        $request  = new TodoRequest();
        $rules    = $request->rules();

        $validator = Validator::make($data, $rules);
        $result    = $validator->passes();

        $this->assertEquals($expect, $result);
    }

    /**
     * データプロバイダ
     *
     * @return データプロバイダ
     *
     * @dataProvider todoData
     */
    public function todoData(): array
    {
        $todo = Todo::factory()->make()->toArray();

        return [
            'expect' => [$todo, true],
            'titleが空' => [[...$todo, 'title' => ''], false],
            'statusが空' => [[...$todo, 'status' => ''], false],
            'statusが不正' => [[...$todo, 'status' => 'invalid'], false],
            'start_dateがnull' => [[...$todo, 'start_date' => null], true],
            'start_dateが不正' => [[ ...$todo, 'start_date' => '2021'], false],
            'due_dateがnull' => [[...$todo, 'due_date' => null], true],
            'due_dateが不正' => [[...$todo, 'due_date' => '2021'], false],
            'is_timer_startedがnull' => [[...$todo, 'is_timer_started' => null], true],
            'is_timer_startedが不正' => [[...$todo, 'is_timer_started' => 'invalid'], false],
            'working_minutesがnull' => [[...$todo, 'working_minutes' => null], true],
            'working_minutesが不正' => [[...$todo, 'working_minutes' => 'invalid'], false],
            'estimated_minutesがnull' => [[...$todo, 'estimated_minutes' => null], true],
            'estimated_minutesが不正' => [[...$todo, 'estimated_minutes' => 'invalid'], false],
        ];
    }
}
