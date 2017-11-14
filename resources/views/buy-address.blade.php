@extends('layouts.app')
@section('content')
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <div class="select-currency">
                    <h1>Your Address detail</h1>
                    <hr/>

                    <div class="row">

                        <div class="col-sm-9">
                            <div class="pb">
                                <div class="current-detail">
                                    <strong class="currency">Currency:</strong>
                                    <span>{{ ucfirst($currency) }} </span>
                                </div>

                                <div class="current-detail">
                                    <strong class="currency">Address:</strong>
                                    <span>{{ $address->address }} </span>
                                </div>

                                <div class="current-detail">
                                    <strong class="currency">Expected coins: </strong>
                                    <span>1 {{ ucfirst($currency) }} => ${{ round($exchangeRate->dollar) }}</span>
                                    <br />

                                    <strong class="currency">&nbsp;</strong>
                                    <span>1 coin => ${{ config('app.exchangeRate.' . $currency) }}</span>
                                    <br />

                                    <strong class="currency">&nbsp;</strong>
                                    <span>1 {{ ucfirst($currency) }} => {{ round($exchangeRate->amount, 2) }} coins</span>
                                    <br />

                                </div>
                            </div>
                        </div>

                        <div class="col-sm-3">
                            <div class="barcoad">
                                <img src="{{ $imageData }}" class="img-responsive"/>
                            </div>
                        </div>

                    </div>

                    <hr/>

                    <div class="row">

                        <div class="col-sm-6">
                            <div class="pb">
                                <div class="current-detail">
                                    <strong class="currency">Coins to send:</strong>
                                    <span><input type="text" name="coins" id="coins" /></span>
                                    <button class="btn btn-primary pull-right" id="calculate">Calculate</button>
                                </div>
                                <div class="current-detail pull-right">

                                </div>
                            </div>
                        </div>

                        <div class="col-sm-5 col-sm-offset-1">
                            <div class="pb hidden" id="result">
                                <div class="current-detail">
                                    <strong class="currency">Expected coins: </strong>
                                    <span id="expected_coins"></span>
                                </div>

                                <div class="current-detail">
                                    <strong class="currency">Bonus: </strong>
                                    <span id="bonus_coins"></span>
                                </div>

                                <div class="current-detail">
                                    <strong class="currency">Total: </strong>
                                    <span id="total"></span>
                                </div>
                            </div>
                            <div class="pb hidden" id="error">
                                <div class="current-detail">
                                    <strong class="currency">Error: </strong>
                                    <span id="total">Please enter valid input!</span>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    </div>
@endsection

@section('script')
    <script>
        var exchangeRate = "{{ $exchangeRate->amount }}";
        var bonus = "{{ $bonus }}";
        $(document).on('click', '#calculate', function(){
            _coins = $('#coins');
            if (_coins.val() && $.isNumeric(_coins.val())) {
                $('#error').addClass('hidden');
                $('#result').removeClass('hidden');
                var expected_coins = exchangeRate * _coins.val();
                var bonus_coins = (expected_coins * bonus) / 100;
                var total = expected_coins + bonus_coins;

                $('#expected_coins').text(expected_coins + ' coins');
                $('#bonus_coins').text( bonus_coins + ' coins');
                $('#total').text(total + ' coins');
            } else {
                $('#error').removeClass('hidden');
                $('#result').addClass('hidden');
            }
        });
    </script>
@endsection
