<?php

namespace App\Domain\Payment;

use App\Domain\Address\Address;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    public function address()
    {
        return $this->belongsTo(Address::class);
    }
}
