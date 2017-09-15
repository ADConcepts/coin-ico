<h1>Hello!</h1>

<p>Refer a friend</p>
<a href="{{ route('get:referral:code',['code' => $user->referral_code]) }}" target="_blank">click here</a>
Regards,<br/>
{{ config('app.name') }}