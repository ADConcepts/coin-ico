@extends('layouts.site')

@section('content')

    <div class="slider">

        <div id="myCarousel" class="carousel slide" data-ride="carousel">

            <div class="container">

                <div class="time">

                   <span class="stamp">

                        <div class="clock">
                            <span class="ico-top">ICO Starts in</span> <span class="getting-started"></span>
                        </div>

                        <div>
                            <ul class="social">
                                {{--<li><a href="#"><i class="fa fa-reddit-alien" aria-hidden="true"></i></a></li>
                                <li><a href="#"><i class="fa fa-facebook" aria-hidden="true"></i></a> </li>
                                <li><a href="#"><i class="fa fa-youtube" aria-hidden="true"></i></a> </li>
                                <li><a href="#"><i class="fa fa-envelope" aria-hidden="true"></i></a> </li>--}}
                                @guest
                                    <li><a href="{{ route('login') }}">Login</a> </li>
                                @else
                                    <li>
                                        <a href="{{ route('logout') }}"
                                            onclick="event.preventDefault();
                                            document.getElementById('logout-form').submit();">
                                            Logout
                                        </a>

                                        <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                                            {{ csrf_field() }}
                                        </form>
                                    </li>
                                @endguest
                            </ul>
                        </div>
                   </span>
                </div>
            </div>

            <!-- Wrapper for slides -->
            <div class="carousel-inner slide-inner">

                <div class="item active">
                    <img src="/images/slide.png" alt="Los Angeles">
                    <div class="carousel-caption slide-caption">

                        <div class="slide-part clearfix">
                            <div class="slide-crypted wow fadeInRightBig" data-wow-duration="1s" data-wow-delay="0.5s">
                                <h1>Crypted United</h1>
                                <p>Shape of future,<br> Own the company, <br> Be the chnage</p>
                            </div>

                            <div class="big-ico wow fadeInLeftBig" data-wow-duration="1s" data-wow-delay="0.5s">

                                <h1>ICO STARTS IN</h1>
                                <span class="getting-started big-time"></span>

                                <div>
                                    <span class="b-day">DAYS</span>
                                    <span class="b-day">HOURS</span>
                                    <span class="b-day">MINUTES</span>
                                </div>

                            </div>

                        </div>

                        <div class="btn-slide">
                            @guest
                                <a href="{{ route('register') }}" class="btn primary">CREATE ACCOUNT</a>
                            @else
                                <a href="{{ route('get:dashboard') }}" class="btn primary">DASHBOARD</a>
                            @endguest
                        </div>


                    </div>
                </div>

            </div>

        </div>

    </div>

    <div class="container">

        <div class="title-1">
            <h1 class="wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.5s">The future will be Crypted and United
                beyond <br class="hidden-xs"> borders and nationalities.</h1>

            <div class="part wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.5s">
                <h2>Shape the future</h2>
                <p>Every owner of shares/cpoins will be able to vote on decisions regarding the future path and
                    development of the organization.</p>
            </div>

            <div class="part wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.5s">
                <h2>Own the company</h2>
                <p>As shareholder of coins, you’ll receive dividends for your investment simply by holding on to your
                    shares/coins.</p>
            </div>

            <div class="part wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.5s">
                <h2>Be the change</h2>
                <p>Start proposals for new projects to develop and suggest changes or new features for existing
                    services.</p>
            </div>


        </div>
    </div>

    <div class="gradient-bg">

        <div class="container bg">

            <div class="thomas wow slideInLeft animated" data-wow-delay="0.5" data-wow-duration="2s">
                <img src="/images/thomas.png" alt="thomas" classs="img-responsive">
            </div>

            <div class="thomas-words wow slideInRight" data-wow-delay="0.5" data-wow-duration="2s">
                <h2>“ I believe that banking institutions are more dan&shy;gerous to our liberties than standing armies.
                    ”</h2>
                <p>Thomas Jefferson, 1802</p>
            </div>

        </div>

    </div>

    <div class="container">

        <div class="planned">
            <h1>Planned Project</h1>

            <div class="project-right">

                <div class="left-img wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.5s">
                    <img src="/images/pp1.png" align="project" class="img-responsive">
                </div>

                <div class="right-text wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.5s">

                    <h2>Cryptocurrency Exchange</h2>
                    <p>New and extended know features. Fee-less trading rewards for pre-ICO participants. Competitions,
                        Chain-Trades, Free Signals and more...</p>

                </div>

            </div>

            <div class="project-right alt">

                <div class="left-img wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.5s">
                    <img src="/images/pp2.png" align="project" class="img-responsive">
                </div>

                <div class="right-text wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.5s">

                    <h2>Digital MarketPlace</h2>
                    <p>For everything digital. Buy/sell Skills, Expertise and digital items. Pay and accept in your
                        preferred digital currency.</p>

                </div>


            </div>

            <div class="project-right">

                <div class="left-img wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.5s">
                    <img src="/images/pp3.png" align="project" class="img-responsive">
                </div>

                <div class="right-text wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.5s">

                    <h2>Feeless Instant Transactions</h2>
                    <p>Enhanced secure Off-Chain transactions. Registered users can send owned currency instantly
                        without paying fees, gas or mining reward.</p>

                </div>

            </div>

            <div class="project-right alt">


                <div class="left-img wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.5s">
                    <img src="/images/pp4.png" align="project" class="img-responsive">
                </div>


                <div class="right-text wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.5s">

                    <h2>Payment Gateway</h2>
                    <p>Ease of use trusted system online payment gateway for merchants to easily accept any of our
                        supported digital currencies.</p>

                </div>

            </div>

            <div class="project-right">

                <div class="left-img wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.5s">
                    <img src="/images/pp5.png" align="project" class="img-responsive">
                </div>

                <div class="right-text wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.5s">

                    <h2>Rewards-Platform</h2>
                    <p>Earn coins and/or FIAT by being active in the community, creating content, providing solutions,
                        developing use-cases and more...</p>

                </div>

            </div>

            <div class="project-right alt">

                <div class="left-img wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.5s">
                    <img src="/images/pp6.png" align="project" class="img-responsive">
                </div>

                <div class="right-text wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.5s">

                    <h2>Application Platform</h2>
                    <p>Develop new application for our platform and sell, rent or offer them for free having access to
                        all curremcies supported on our exchange.</p>

                </div>


            </div>

            <div class="project-right">

                <div class="left-img wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.5s">
                    <img src="/images/pp7.png" align="project" class="img-responsive">
                </div>

                <div class="right-text wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.5s">

                    <h2>Next-Generation Banking</h2>
                    <p>Seamless and feeless. Access to all your currencies in one place. Personalized settings for
                        maximum security.</p>

                </div>

            </div>

            <div class="project-right alt">

                <div class="left-img wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.5s">
                    <img src="/images/pp8.png" align="project" class="img-responsive">
                </div>

                <div class="right-text wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.5s">

                    <h2>Digital Identity / KYC Service</h2>
                    <p>Your data in one single place. Update your data only in one place to verify at participating
                        services without sharing crucial information</p>

                </div>


            </div>
        </div>

    </div>

    <div class="gradient-bg">

        <div class="container bg">

            <div class="">
                <div class="ford-words wow slideInLeft" data-wow-delay="0.5" data-wow-duration="2s">
                    <h2>“It is well enough that people of the nation do not under&shy;stand our banking and monetary
                        system, for if they did, I believe there would be a revolution before tomorrow morning.””</h2>
                    <p>Henry Ford, 1922</p>
                </div>

                <div class="ford wow slideInRight" data-wow-delay="0.5" data-wow-duration="2s">
                    <img src="/images/ford.png" alt="thomas" classs="img-responsive">
                </div>
            </div>
        </div>

    </div>

    <div class="timeline">

        <div class="featurette" id="about">
            <!------------------------code---------------start---------------->
            <div class="container">
                <div class="row">

                    <div class="time-title">

                        <h1>Roadmap</h1>

                    </div>
                    <div class="controls center">
                        <p class="time-prev">

                            <button class="btn prev"><i class="fa fa-angle-up"></i></button>

                        </p>


                        <div class="frame smart" id="smart">
                            <ul class="timeline-centered">

                                <li class="timeline-entry active">

                                    <div class="timeline-entry-inner">
                                        <time class="timeline-time" datetime="2014-01-10T03:45"><span>16 jan</span>
                                        </time>

                                        <div class="timeline-icon">
                                            <a href="#" class="entypo-feather"></a>
                                        </div>

                                        <div class="timeline-label">
                                            {{--<h2><a href="#">Mohtashim M.</a> <span>Founder & Managing Director</span></h2>--}}
                                            <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit,"Lorem ipsum
                                                dolor sit amet, consectetur adipiscing elit.</p>
                                        </div>
                                    </div>

                                </li>


                                <li class="timeline-entry left-aligned">

                                    <div class="timeline-entry-inner">
                                        <time class="timeline-time" datetime="2014-01-10T03:45"><span>1 feb</span>
                                        </time>

                                        <div class="timeline-icon bg-secondary">
                                            <i class="entypo-suitcase"></i>
                                        </div>

                                        <div class="timeline-label">
                                            {{--<h2><a href="#">Job Meeting</a></h2>--}}
                                            <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit,"Lorem ipsum
                                                dolor sit amet, consectetur adipiscing elit.</p>
                                        </div>
                                    </div>

                                </li>


                                <li class="timeline-entry">

                                    <div class="timeline-entry-inner">
                                        <time class="timeline-time" datetime="2014-01-09T13:22"><span>28 feb</span>
                                        </time>

                                        <div class="timeline-icon bg-info">
                                            <i class="entypo-location"></i>
                                        </div>

                                        <div class="timeline-label">
                                            <!--<h2><a href="#">Gopal K Verma </a> <span>checked in at</span> <a href="#">Tutorials Point</a></h2>-->

                                            <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit,"Lorem ipsum
                                                dolor sit amet, consectetur adipiscing elit.</p>


                                        </div>
                                    </div>

                                </li>


                                <li class="timeline-entry left-aligned">

                                    <div class="timeline-entry-inner">
                                        <time class="timeline-time" datetime="2014-01-10T03:45"><span>15 mar</span>
                                        </time>

                                        <div class="timeline-icon bg-warning">
                                            <i class="entypo-camera"></i>
                                        </div>

                                        <div class="timeline-label">
                                            {{--<h2><a href="#">Gopal K Verma </a> <span>changed his</span> <a href="#">Profile Picture</a></h2>--}}

                                            <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit,"Lorem ipsum
                                                dolor sit amet, consectetur adipiscing elit.</p>

                                        </div>
                                    </div>

                                </li>


                                <li class="timeline-entry begin">

                                    <div class="timeline-entry-inner">

                                        <div class="timeline-icon"
                                             style="-webkit-transform: rotate(-90deg); -moz-transform: rotate(-90deg);">
                                            <i class="entypo-flight"></i>
                                        </div>

                                    </div>

                                </li>

                            </ul>
                        </div>

                        <div class="controls center">
                            <p class="time-next">

                                <button class="btn next"><i class="fa fa-angle-down"></i></button>
                            </p>

                        </div>

                    </div>
                </div>
                <!----Code------end----------------------------------->
            </div>

        </div>

    </div>

    <div class="gradient-bg">

        <div class="container bg">

            <div class="bill wow slideInLeft" data-wow-delay="0.5" data-wow-duration="2s">
                <img src="/images/bill.png" alt="thomas" classs="img-responsive">
            </div>

            <div class="bill-words wow slideInRight" data-wow-delay="0.5" data-wow-duration="2s">
                <h2>“Banking is necessary, Banks are not!”</h2>
                <p>Bill Gates, 1994</p>
            </div>

        </div>

    </div>

    <div class="container">

        <div class="row">

            <div class="team-title">
                <h1>Team</h1>

                <div class="team-inner-title">
                    <div class="col-sm-4">

                        <div class="member wow fadeInUp" data-wow-delay="1" data-wow-duration="1s">

                            <img src="/images/team1.png" align="team" class="img-responsive"/>

                            <h3>John Doe</h3>
                            <small>Director</small>

                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                                laboris nisi ut aliquip ex ea commodo consequat.</p>

                        </div>

                    </div>

                    <div class="col-sm-4">

                        <div class="member wow fadeInUp" data-wow-delay="1" data-wow-duration="1s">

                            <img src="/images/team2.png" align="team" class="img-responsive"/>

                            <h3>Mark Anthoiny</h3>
                            <small>Manager</small>

                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                                laboris nisi ut aliquip ex ea commodo consequat.</p>

                        </div>

                    </div>

                    <div class="col-sm-4">

                        <div class="member wow fadeInUp" data-wow-delay="1" data-wow-duration="1s">

                            <img src="/images/team3.png" align="team" class="img-responsive"/>

                            <h3>Lisa Parker</h3>
                            <small>Head Of Department</small>

                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                                laboris nisi ut aliquip ex ea commodo consequat.</p>

                        </div>

                    </div>
                </div>

            </div>

        </div>

        <div class="developer">

            <h1>Development Stack</h1>

            <ul class="lang">
                <li class="wow zoomIn" data-wow-delay="0.5" data-wow-duration="1s"><a href="#"><img
                                src="/images/php.png" alt="img" class="img-responsive"></a></li>
                <li class="wow zoomIn" data-wow-delay="1" data-wow-duration="1.5s"><a href="#"><img src="/images/v.png"
                                                                                                    alt="img"
                                                                                                    class="img-responsive"></a>
                </li>
                <li class="wow zoomIn" data-wow-delay="2" data-wow-duration="2s"><a href="#"><img
                                src="/images/laravel.png" alt="img" class="img-responsive"></a></li>
                <li class="wow zoomIn" data-wow-delay="3" data-wow-duration="2.5s"><a href="#"><img
                                src="/images/mysql.png" alt="img" class="img-responsive"></a></li>
            </ul>

            <hr class="line">

            <ul class="coin-logo">

                <li class="wow zoomIn" data-wow-delay="0.5" data-wow-duration="1s"><a href="#"><img
                                src="/images/bitcoin.png" alt="img" class="img-responsive"></a></li>
                <li class="wow zoomIn" data-wow-delay="1" data-wow-duration="1.5s"><a href="#"><img
                                src="/images/cryptcoin.png" alt="img" class="img-responsive"></a></li>
                <li class="wow zoomIn" data-wow-delay="2" data-wow-duration="2s"><a href="#"><img
                                src="/images/coinnoon.png" alt="img" class="img-responsive"></a></li>
                <li class="wow zoomIn" data-wow-delay="3" data-wow-duration="2.5s"><a href="#"><img
                                src="/images/smatico.png" alt="img" class="img-responsive"></a></li>

            </ul>

            <hr class="line">

        </div>

    </div>

    <div class="container">

        <footer>

            <div class="row">

                <div class="footer">

                    <div class="col-sm-3 col-md-4 col-mid">

                        <div class="flogo">
                            <a href="{{ route('get:home') }}">
                                <img src="/images/red-logo.png" alt="#" class="img-responsive">
                            </a>

                            <p>© 2017 CyptedUnited.<br>
                                ALL RIGHTS RESERVED</p>

                        </div>

                    </div>

                    <div class="col-sm-3 col-md-3 col-mid">

                        <div class="customer">
                            <h4>Services</h4>

                            <ul>
                                <li>
                                    <a href="{{ route('get:dashboard') }}">Dashboard</a>
                                </li>
                                <li>
                                    <a href="{{ route('get:buy') }}">Buy</a>
                                </li>
                                <li>
                                    <a href="{{ route('get:refer') }}">Refer</a>
                                </li>
                            </ul>

                        </div>

                    </div>

                    <div class="col-sm-3 col-md-3 col-mid">

                        <div class="about">
                            <h4>Account</h4>

                            <ul>
                                @guest
                                    <li class="orange-bar"><a href="{{ route('login') }}">Login</a></li>
                                    <li><a href="{{ route('register') }}">Register</a></li>
                                @else
                                    <li><a href="{{ route('get:wallet:wallet_id', ['wallet_id' => Auth::user()->wallet_id]) }}">My wallet </a></li>
                                    <li>
                                        <a href="{{ route('logout') }}"
                                           onclick="event.preventDefault();
                                         document.getElementById('logout-form').submit();">
                                            Logout
                                        </a>

                                        <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                                            {{ csrf_field() }}
                                        </form>
                                    </li>
                                @endguest
                            </ul>
                        </div>
                    </div>

                    <div class="col-sm-3 col-md-2 col-mid">

                        <div class="social">
                            <h4>Connect</h4>

                            <ul>
                                <li><i class="fa fa-facebook"></i><a href="#">Facebook</a></li>
                                <li><i class="fa fa-google"></i><a href="#">Google</a></li>
                                <li><i class="fa fa-twitter"></i><a href="#">Twitter</a></li>
                                <li><i class="fa fa-youtube-play"></i><a href="#">Youtube</a></li>
                                <li><i class="fa fa-instagram"></i><a href="#">Instagram</a></li>
                            </ul>


                        </div>

                    </div>

                </div>

            </div>

        </footer>

    </div>

@endsection