@extends('admin.layouts.admin')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-sm-12">
            <div class="select-currency">
                <h1> Users </h1>
                <hr />
            </div>

            <div class="pb table-responsive">
                <table class="table data-history table-responsive" id="users">
                    <thead>
                        <tr class="tabel-heading">
                            <th>Name</th>
                            <th>Email</th>
                            <th>Wallet id</th>
                            <th>Created at</th>
                        </tr>
                    </thead>
                </table>
            </div>

        </div>
    </div>
</div>
@endsection

@section('script')
    <link rel="stylesheet" href="//cdn.datatables.net/1.10.7/css/jquery.dataTables.min.css">
    <script src="//cdn.datatables.net/1.10.7/js/jquery.dataTables.min.js"></script>
    <script>
        $(function () {
            $('#users').DataTable({
                processing: true,
                serverSide: true,
                searching: false,
                info:false,
                ajax: '{{ route('get:users:json') }}',
                columns: [
                    {"data":"name", "name":"name"},
                    {"data":"email", "name":"email"},
                    {"data":"wallet_id", "name":"wallet_id", "class":"font-source-code"},
                    {"data":"created_at", "name":"created_at"}
                ],
                "order": [
                    [3, 'desc']
                ]
            });
            var table = $('#users').DataTable();

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
