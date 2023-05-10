<?php

namespace App\Http\Controllers;

use App\Http\Requests\TodoRequest;
use App\Models\Todo;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Todo::where('user_ip', request()->ip())->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TodoRequest $request)
    {
        $todo = Todo::create([
            'title' => $request->title,
            'status' => $request->status,
            'start_date' => $request->start_date,
            'due_date' => $request->due_date,
            'is_timer_started' => $request->is_timer_started,
            'working_minutes' => $request->working_minutes,
            'estimated_minutes' => $request->estimated_minutes,
            'user_ip' => $request->ip(),
        ]);

        return response()->json($todo);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TodoRequest $request, Todo $todo)
    {
        $todo->title = $request->title;
        $todo->status = $request->status;
        $todo->start_date = $request->start_date;
        $todo->due_date = $request->due_date;
        $todo->is_timer_started = $request->is_timer_started;
        $todo->working_minutes = $request->working_minutes;
        $todo->estimated_minutes = $request->estimated_minutes;
        $todo->update();

        return response()->json($todo);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Todo $todo)
    {
        $result = $todo->delete();
        return $result;
    }
}
