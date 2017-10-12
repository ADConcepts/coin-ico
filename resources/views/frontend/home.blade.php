@extends('layouts.site')

@section('content')

   <div class="slider">

       <div class="">
           <div id="myCarousel" class="carousel slide" data-ride="carousel">

               <div class="container">

                   <div class="time">
                   <span class="stamp">

                       <div class="clock">
                           <span class="ico-top">ICO Start in</span> <span class="getting-started"></span>
                       </div>

                      <div>
                       <ul class="social">
                        <li><a href="#"><i class="fa fa-reddit-alien" aria-hidden="true"></i></a></li>
                        <li><a href="#"><i class="fa fa-facebook" aria-hidden="true"></i></a> </li>
                        <li><a href="#"><i class="fa fa-youtube" aria-hidden="true"></i></a> </li>
                        <li><a href="#"><i class="fa fa-envelope" aria-hidden="true"></i></a> </li>

                    </ul>
                     </div>

                   </span>

                   </div>


               </div>

               <!-- Wrapper for slides -->
               <div class="carousel-inner slide-inner">

                   <div class="item active">
                       <img src="/images/slide.jpg" alt="Los Angeles">
                       <div class="carousel-caption slide-caption">

                           <div class="slide-part clearfix">
                           <div class="slide-crypted">
                                <h1>Crypted United</h1>
                               <p>Shape of future,<br> Own the company, <br> Be the chnage</p>
                             </div>

                           <div class="big-ico">

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
                           <a href="#" class="btn primary">CREATE ACCOUNT</a>
                           </div>


                       </div>
                   </div>



               </div>

           </div>
       </div>



   </div>

    <div class="container">

        <div class="title-1">
        <h2>The future will be Crypted and United beyond <br> borders and nationalities.</h2>
        </div>
    </div>

@endsection