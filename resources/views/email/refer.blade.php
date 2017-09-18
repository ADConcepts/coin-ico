@component('mail::message')
    # Hello!

    Your friend refer you to join {{ config('app.name') }}!
    Click the below link to register.

    @component('mail::button', ['url' => $url])
        Register
    @endcomponent

    Thanks,<br>
    {{ config('app.name') }}
@endcomponent