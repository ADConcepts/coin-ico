<?php

namespace App\Mail;

use App\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ReferFriend extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * The user instance.
     *
     * @var user
     */
    public $user;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $url = route('get:referral:code',['code' => $this->user->referral_code]);
        return $this->markdown('email.refer',['url' => $url]);
    }
}
