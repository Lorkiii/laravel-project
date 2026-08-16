<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Audit Trail — Last {{ $period }} Days</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            color: #0f172a;
        }
        h1 {
            font-size: 18px;
            margin: 0 0 4px;
        }
        .meta {
            color: #475569;
            margin-bottom: 16px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #cbd5e1;
            padding: 6px 8px;
            text-align: left;
            vertical-align: top;
        }
        th {
            background: #f1f5f9;
            font-weight: 700;
        }
        .empty {
            text-align: center;
            color: #64748b;
            padding: 24px 0;
        }
    </style>
</head>
<body>
    <h1>Audit Trail</h1>
    <p class="meta">
        Last {{ $period }} days
        · Generated {{ $generatedAt }}
        · By {{ $generatedBy }}
        · Records older than 90 days are removed from the live trail
    </p>

    @if ($events->isEmpty())
        <p class="empty">No audit events in this period.</p>
    @else
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>User</th>
                    <th>Role</th>
                    <th>Action</th>
                    <th>Type</th>
                    <th>Record</th>
                    <th>Changes</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($events as $event)
                    <tr>
                        <td>{{ $event['created_at'] }}</td>
                        <td>{{ $event['actor_name'] }}</td>
                        <td>{{ $event['actor_role'] ?: '—' }}</td>
                        <td>{{ ucfirst($event['action']) }}</td>
                        <td>{{ ucfirst($event['subject_type']) }}</td>
                        <td>{{ $event['subject_label'] }}</td>
                        <td>{{ $event['changes_summary'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif
</body>
</html>
