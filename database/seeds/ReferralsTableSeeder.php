<?php

use App\Domain\Referral\Referral;
use Illuminate\Database\Seeder;
use App\User;

class ReferralsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $now = \Carbon\Carbon::now();
        $faker = \Faker\Factory::create();

        $referrals = [];
        $users = User::all()->keyBy('id');
        for ($i = 30; $i <= 100; $i += $faker->numberBetween(1, 8)) {
            $userId = $faker->numberBetween(1, 20);
            $referrals[] = [
                'user_id' => $userId,
                'referral_id' => $i,
                'email' => $users[$i]['email'],
                'referral_code' => $users[$userId]['referral_code'],
                'registered_at' => $users[$i]['created_at'],
                'first_buy_at' => ($faker->numberBetween(1, 3) == 2) ? $now->copy()->addDay() : null,
                'created_at' => $users[$i]['created_at'],
                'updated_at' => $users[$i]['created_at'],
            ];
        }
        Referral::insert($referrals);
    }
}
