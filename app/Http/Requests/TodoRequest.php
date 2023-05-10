<?php

namespace App\Http\Requests;

use App\Models\Todo;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TodoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required',
            'status' => ['required', Rule::in(Todo::STATUS_LIST)],
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date',
            'is_timer_started' => 'nullable|boolean',
            'working_minutes' => 'nullable|integer',
            'estimated_minutes' => 'nullable|integer',
        ];
    }
}
