<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->unsignedInteger('residence_country_id')->unsigned()->nullable();
            $table->unsignedInteger('birth_country_id')->unsigned()->nullable();
            $table->string('wallet_id')->unique();
            $table->string('referral_code')->unique();
            $table->boolean('is_admin')->default(false);
            $table->string('email_token')->nullable();
            $table->boolean('email_verified')->default(0);
            $table->timestamp('verified_email_at')->nullable();
            $table->rememberToken();
            $table->timestamps();

            //$table->foreign('residence_country_id')->references('id')->on('countries')->onDelete('cascade');
            //$table->foreign('birth_country_id')->references('id')->on('countries')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
