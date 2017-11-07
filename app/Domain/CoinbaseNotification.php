<?php

namespace App\Domain;

use Illuminate\Database\Eloquent\Model;

class CoinbaseNotification extends Model
{

    protected $casts = [
        'notification' => 'array',
    ];
}
