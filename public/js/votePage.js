//Vote page animations
$(document).ready(function(){
                
    $("#categoryAnime").css('opacity', 0); 
    $("#categoryAnime").waypoint(function() {
            console.log("In"); 
            //$('#categoryAnime').addClass('animated bounce');        // animation code
            $('#categoryAnime').addClass('animated fadeInLeft');
        }, { offset: '26%'});


    $("#categoryAnime").waypoint(function() {
            console.log("Out"); 
            //$('#categoryAnime').addClass('animated bounce');        // animation code
            $('#categoryAnime').removeClass('animated fadeInLeft')
                .addClass('animated bounceOutLeft');
        }, { offset: '50%'});

    });

    $('.btn').hover(
        function(){
        console.log("On hover");
            $('.btn').addClass('animated bounce'); 
        }, function(){
            $('.btn').removeClass('animated bounce')
        }
    )
