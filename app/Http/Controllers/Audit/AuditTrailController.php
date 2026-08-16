<?php

namespace App\Http\Controllers\Audit;

use App\Http\Controllers\Controller;
use App\Models\AuditEvent;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class AuditTrailController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $this->filtersFrom($request);

        return Inertia::render('AuditTrail/Index', [
            'events' => $this->eventsQuery($filters)
                ->get()
                ->map(fn (AuditEvent $event) => $this->eventPayload($event)),
            'filters' => [
                'period' => $filters['period'],
                'subject_type' => $filters['subject_type'] ?? 'all',
                'action' => $filters['action'] ?? 'all',
                'actor_id' => $filters['actor_id'] ? (string) $filters['actor_id'] : 'all',
            ],
            'actors' => $this->actorOptions(),
            'canExport' => $request->user()->can('audit.export'),
        ]);
    }

    public function export(Request $request): SymfonyResponse
    {
        $filters = $this->filtersFrom($request);
        $events = $this->eventsQuery($filters)
            ->get()
            ->map(fn (AuditEvent $event) => $this->eventPayload($event));

        $pdf = Pdf::loadView('audit-trail.pdf', [
            'events' => $events,
            'period' => $filters['period'],
            'generatedAt' => now()->format('M j, Y g:i A'),
            'generatedBy' => trim(
                "{$request->user()->first_name} {$request->user()->last_name}",
            ),
        ])->setPaper('a4', 'landscape');

        return $pdf->download("audit-trail-last-{$filters['period']}-days.pdf");
    }

    /**
     * @return array{period: int, subject_type: string|null, action: string|null, actor_id: int|null}
     */
    private function filtersFrom(Request $request): array
    {
        $period = $request->integer('period');

        if (! in_array($period, AuditEvent::PERIODS, true)) {
            $period = AuditEvent::RETENTION_DAYS;
        }

        $subjectType = $request->query('subject_type');
        if (! in_array($subjectType, AuditEvent::SUBJECT_TYPES, true)) {
            $subjectType = null;
        }

        $action = $request->query('action');
        if (! in_array($action, AuditEvent::ACTIONS, true)) {
            $action = null;
        }

        $actorId = $request->integer('actor_id') ?: null;

        return [
            'period' => $period,
            'subject_type' => $subjectType,
            'action' => $action,
            'actor_id' => $actorId,
        ];
    }

    /**
     * @param  array{period: int, subject_type: string|null, action: string|null, actor_id: int|null}  $filters
     */
    private function eventsQuery(array $filters)
    {
        return AuditEvent::query()
            ->where('created_at', '>=', now()->subDays($filters['period']))
            ->when(
                $filters['subject_type'],
                fn ($query, string $subjectType) => $query->where('subject_type', $subjectType),
            )
            ->when(
                $filters['action'],
                fn ($query, string $action) => $query->where('action', $action),
            )
            ->when(
                $filters['actor_id'],
                fn ($query, int $actorId) => $query->where('actor_id', $actorId),
            )
            ->latest()
            ->orderByDesc('id');
    }

    /**
     * @return list<array{id: int, name: string}>
     */
    private function actorOptions(): array
    {
        return AuditEvent::query()
            ->where('created_at', '>=', now()->subDays(AuditEvent::RETENTION_DAYS))
            ->whereNotNull('actor_id')
            ->orderBy('actor_name')
            ->get(['actor_id', 'actor_name'])
            ->unique('actor_id')
            ->values()
            ->map(fn (AuditEvent $event) => [
                'id' => (int) $event->actor_id,
                'name' => $event->actor_name,
            ])
            ->all();
    }

    /**
     * @return array{
     *     id: int,
     *     created_at: string,
     *     actor_name: string,
     *     actor_role: string|null,
     *     action: string,
     *     subject_type: string,
     *     subject_label: string,
     *     changes_summary: string
     * }
     */
    private function eventPayload(AuditEvent $event): array
    {
        return [
            'id' => $event->id,
            'created_at' => $event->created_at->format('M j, Y g:i A'),
            'actor_name' => $event->actor_name,
            'actor_role' => $event->actor_role,
            'action' => $event->action,
            'subject_type' => $event->subject_type,
            'subject_label' => $event->subject_label,
            'changes_summary' => $event->changesSummary(),
        ];
    }
}
