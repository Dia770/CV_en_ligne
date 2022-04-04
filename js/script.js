$(function(){
    $(".navbar a, footer a").on("click", function(event){
        event.preventDefault();
        var hash = this.hash;
        
        $("body,html").animate({scrollTop: $(hash).offset().top}, 500, function(){window.location.hash = hash;})
        
    });
    $("nav ul #anSK").on("click", function(){
//        $("#nav1").css("width","0%");  
        $("#nav1").animate({width:"90%"},900);
//        $("#nav2").css("width","0%");  
        $("#nav2").animate({width:"77%"},900);
//        $("#nav3").css("width","0%");  
        $("#nav3").animate({width:"80%"},900);
//        $("#nav4").css("width","0%");  
        $("#nav4").animate({width:"67%"},900);
//        $("#nav5").css("width","0%");  
        $("#nav5").animate({width:"73%"},900);
//        $("#nav6").css("width","0%");  
        $("#nav6").animate({width:"60%"},900);
    });
})
