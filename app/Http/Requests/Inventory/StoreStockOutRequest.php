<?php

namespace App\Http\Requests\Inventory;

use App\Models\StockMovement;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStockOutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('inventory.stock_out') ?? false;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'reason' => ['required', 'string', Rule::in(StockMovement::STOCK_OUT_REASONS)],
            'reference' => [
                'nullable',
                'string',
                'max:255',
                Rule::requiredIf(
                    fn () => $this->input('reason') === StockMovement::REASON_INTERNAL_REQUEST,
                ),
            ],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'reference.required' => 'A recipient or reference is required for an internal request.',
        ];
    }
}
