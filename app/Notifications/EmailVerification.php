<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class EmailVerification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $user;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($user)
    {
        $this->user = $user;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $bottomText = 'You receive this mail because you or someone else used your email address to register an account on www.cryptedunited.com If you didn\'t create the account, you can ignore this email';
        return (new MailMessage)
            ->subject('Verify your email')
            ->greeting('Hello '.$this->user->name.'!')
            ->line('Click the below link to verify your email.')
            ->action('Verify', url(route('get:user:confirm:email', ['token' => $this->user->email_token], false)))
            ->line('Welcome to CryptedUnited!')
            ->view('vendor.notifications.email', compact('bottomText'));

    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [

        ];
    }
}
