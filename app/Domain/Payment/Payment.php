<?php

namespace App\Domain\Payment;

use App\Domain\Address\Address;
use App\Domain\Transaction\Transaction;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function transaction()
    {
        return $this->hasOne(Transaction::class);
    }
}
