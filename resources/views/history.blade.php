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
                    {"data":"transaction_hash", "name":"transaction_hash", "orderable":false, "searchable":false, "class":"font-source-code"},
                    {"data":"amount", "name":"amount", "class":"text-right"}
                ],
                "order": [
                    [0, 'asc']
                ]
            });
            var table = $('#history').DataTable();

            table.on( 'draw', function () {
                $(table.table().container())
                    .find('.dataTables_paginate')
                    .css( 'display', table.page.info().pages <= 2 ?
                        'none' :
                        'block'
                    )
            });
        });
    </script>
@endsection
