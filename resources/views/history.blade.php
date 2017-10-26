@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-sm-12">
            <div class="select-currency">
                <h1>Transaction history</h1>

                <hr>

                <div class="pb table-responsive">
                    <table class="table data-history table-responsive" id="history" width="100%">
                        <thead>
                        <tr class="tabel-heading">
                            <th>Date</th>
                            <th>Transaction#</th>
                            <th>Amount</th>
                            {{--<th>Description</th>--}}
                        </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
@section('script')
    <link rel="stylesheet" href="//cdn.datatables.net/1.10.7/css/jquery.dataTables.min.css">
    <script src="https://cdn.datatables.net/1.10.7/js/jquery.dataTables.min.js"></script>
    <link rel="stylesheet" href="https://cdn.datatables.net/responsive/2.2.0/css/responsive.dataTables.min.css">
    <script>
        $(function () {
            $('#history').DataTable({
                responsive: true,
                processing: true,
                serverSide: true,
                searching: false,
                info:false,
                ajax: '{{ route('get:history:data-table') }}',
                columns: [
                    {"data":"created_at", "name":"created_at"},
                    {"data":"transaction_hash", "name":"transaction_hash", "orderable":false, "searchable":false},
                    {"data":"amount", "name":"amount"}
                ],
                "order": [
                    [0, 'asc']
                ]
            });
        });
    </script>
@endsection
