<?php

namespace App\Http\Controllers;


use App\User;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;

class AdminController extends Controller
{
    public function getDashboard(Request $request)
    {
        $pageTitle = 'Dashboard';
        return view('admin.dashboard', compact('pageTitle'));
    }

    public function getUserList(Request $request)
    {
        $pageTitle = 'Users';
        return view('admin.users', compact('pageTitle'));
    }

    public function getUserJson(Request $request)
    {
        $users = User::all();

        return Datatables::of($users)
            ->addColumn('wallet_id', function ($user) {
                return '<a href="'.route("get:wallet:wallet_id", ["wallet_id" => $user->wallet_id]).'" target="_blank">'.$user->wallet_id.'</a>';
            })
            ->rawColumns(['wallet_id'])
            ->make(true);
    }
}
