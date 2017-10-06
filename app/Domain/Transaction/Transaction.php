<?php

namespace App\Domain\Transaction;

use App\Domain\Payment\Payment;
use App\Domain\Referral\Referral;
use App\User;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }

    public function referral()
    {
        return $this->belongsTo(Referral::class)->with('user');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
