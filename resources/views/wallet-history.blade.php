@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-sm-12">
            <div class="select-currency">
                <h4>
                    <a href="{{ route('get:wallet:wallet_id', ['wallet_id' => $walletId]) }}" class="font-source-code">{{ $walletId }}</a>

                    <div class="pull-right">
                        @if ($user && $user->id != 1 && !$user->is_admin)
                            Wallet balance: {{ $totalBalance }}
                        @endif
                    </div>
                </h4>

                <hr>

            </div>

                <div class="pb table-responsive">
                    <table class="table data-history table-responsive" id="wallet-history">
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
@endsection

@section('script')
    <link rel="stylesheet" href="//cdn.datatables.net/1.10.7/css/jquery.dataTables.min.css">
    <script src="//cdn.datatables.net/1.10.7/js/jquery.dataTables.min.js"></script>
    <script>
        $(function () {
            $('#wallet-history').DataTable({
                processing: true,
                serverSide: true,
                searching: false,
                info:false,
                ajax: '{{ route('get:wallet:data-table', ['wallet_id' => $walletId]) }}',
                columns: [
                    {"data":"created_at", "name":"created_at"},
                    {"data":"transaction_hash", "name":"transaction_hash", "orderable":false, "searchable":false, "class":"font-source-code"},
                    {"data":"amount", "name":"amount"}
                ],
                "order": [
                    [0, 'asc']
                ]
            });
            var table = $('#wallet-history').DataTable();

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
