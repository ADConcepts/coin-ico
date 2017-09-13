<?php

use App\User;
use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $password = bcrypt('123456');
        $now = \Carbon\Carbon::now()->toDateTimeString();
        $faker = \Faker\Factory::create();

        $users = [];

        for ($i = 1; $i <= 200; $i += 1) {
            $users[] = [
                'name' => "user$i",
                'email' => "user$i@mail.com",
                'password' => $password,
                'wallet_id' => str_random(34),
                'is_admin' => $i == 1,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        User::insert($users);
    }
}
