<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\MassPrunable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditEvent extends Model
{
    use MassPrunable;

    public const ACTION_CREATED = 'created';

    public const ACTION_UPDATED = 'updated';

    public const SUBJECT_PRODUCT = 'product';

    public const SUBJECT_CATEGORY = 'category';

    public const SUBJECT_USER = 'user';

    public const ACTIONS = [
        self::ACTION_CREATED,
        self::ACTION_UPDATED,
    ];

    public const SUBJECT_TYPES = [
        self::SUBJECT_PRODUCT,
        self::SUBJECT_CATEGORY,
        self::SUBJECT_USER,
    ];

    public const PERIODS = [30, 60, 90];

    public const RETENTION_DAYS = 90;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'actor_id',
        'actor_name',
        'actor_role',
        'action',
        'subject_type',
        'subject_id',
        'subject_label',
        'changes',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'changes' => 'array',
        ];
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    public function prunable(): Builder
    {
        return static::query()
            ->where('created_at', '<', now()->subDays(self::RETENTION_DAYS));
    }

    /**
     * @param  array<string, mixed>|null  $changes
     */
    public static function record(
        User $actor,
        string $action,
        string $subjectType,
        Model $subject,
        string $subjectLabel,
        ?array $changes = null,
    ): self {
        return static::query()->create([
            'actor_id' => $actor->id,
            'actor_name' => trim("{$actor->first_name} {$actor->last_name}"),
            'actor_role' => $actor->getRoleNames()->first(),
            'action' => $action,
            'subject_type' => $subjectType,
            'subject_id' => $subject->getKey(),
            'subject_label' => $subjectLabel,
            'changes' => $changes,
        ]);
    }

    /**
     * @param  list<string>  $except
     * @return array<string, array{old: mixed, new: mixed}>|null
     */
    public static function changesFor(Model $model, array $except = []): ?array
    {
        $ignored = [
            ...$except,
            'created_at',
            'updated_at',
            'created_by',
            'password',
            'remember_token',
        ];

        $dirty = collect($model->getDirty())->except($ignored);

        if ($dirty->isEmpty()) {
            return null;
        }

        return $dirty
            ->mapWithKeys(fn (mixed $value, string $attribute): array => [
                $attribute => [
                    'old' => $model->getOriginal($attribute),
                    'new' => $value,
                ],
            ])
            ->all();
    }

    public function changesSummary(): string
    {
        if ($this->changes === null || $this->changes === []) {
            return '—';
        }

        return collect($this->changes)
            ->map(function (mixed $change, string $attribute): string {
                $old = is_array($change) ? ($change['old'] ?? null) : null;
                $new = is_array($change) ? ($change['new'] ?? null) : $change;

                return sprintf(
                    '%s: %s → %s',
                    str_replace('_', ' ', $attribute),
                    self::stringify($old),
                    self::stringify($new),
                );
            })
            ->implode('; ');
    }

    public static function stringify(mixed $value): string
    {
        if ($value === null) {
            return '—';
        }

        if (is_bool($value)) {
            return $value ? 'Yes' : 'No';
        }

        if (is_array($value) || is_object($value)) {
            return json_encode($value) ?: '—';
        }

        return (string) $value;
    }
}
