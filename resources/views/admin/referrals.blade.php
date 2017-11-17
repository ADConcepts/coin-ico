@extends('admin.layouts.admin')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-sm-12">
            <div class="select-currency">
                <h1> Referrals </h1>
                <hr />
            </div>

            <div class="pb table-responsive">
                <table class="table data-history table-responsive" id="referrals">
                    <thead>
                        <tr class="tabel-heading">
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Total referred</th>
                            <th>Referral credit</th>
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
            $('#referrals').DataTable({
                processing: true,
                serverSide: true,
                searching: false,
                info:false,
                ajax: '{{ route('get:referrals:json') }}',
                columns: [
                    {"data":"DT_Row_Index", "name":"DT_Row_Index"},
                    {"data":"name", "name":"name", "class":"text-right"},
                    {"data":"email", "name":"email", "class":"text-right"},
                    {"data":"total_referred", "name":"total_referred", "class":"text-right"},
                    {"data":"referral_credit", "name":"referral_credit", "class":"text-right", "default":0},
                ],
                "order": [
                    [0, 'asc']
                ]
            });
            var table = $('#referrals').DataTable();

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
