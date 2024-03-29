<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePaymentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('address_id')->nullable();
            $table->unsignedInteger('exchange_rate_id')->nullable();
            $table->string('notification_id')->nullable();
            $table->decimal('amount', 25, 10)->nullable();
            $table->enum('currency', ['bitcoin', 'litecoin', 'ethereum']);
            $table->string('currency_transaction_id')->nullable();
            $table->decimal('exchange_rate', 25, 10)->nullable();
            $table->timestamps();

            $table->foreign('address_id')->references('id')->on('addresses')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('payments');
    }
}
