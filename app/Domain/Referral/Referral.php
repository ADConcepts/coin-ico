<?php

namespace App\Domain\Referral;

use App\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Referral extends Model
{
    use Notifiable;

    public function user()
    {
        return $this->belongsTo(User::class, 'referral_id', 'id');
    }

}
