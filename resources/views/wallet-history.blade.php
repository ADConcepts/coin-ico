@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <div class="panel panel-default">
                <div class="panel-heading">
                    Wallet history
                    <div class="pull-right">
                        Wallet balance: {{ $totalBalance }}
                    </div>
                </div>

                <div class="panel-body">
                    <table class="table table-bordered" id="wallet-history">
                        <thead>
                            <tr>
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
