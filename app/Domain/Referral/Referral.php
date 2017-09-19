<?php

namespace App\Domain\Referral;

use App\User;
use Illuminate\Database\Eloquent\Model;

class Referral extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class, 'referral_id', 'id');
    }

}
