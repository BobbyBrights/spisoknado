var MAS_INTERVAL_ONI = {};

function resizeRightMenu(){
 /* window.clearInterval(MAS_INTERVAL_ONI.resizeRightMenuInterval);
  MAS_INTERVAL_ONI.resizeRightMenuInterval = window.setInterval(function(){
    if($(".oni-right-menu").height()>0 && $(".oni-right-menu-puncts").height()>0){
      //var top = Math.max(78,(($(".oni-right-menu").height()-78-$(".oni-right-menu-puncts").height())/2));
      //$(".oni-right-menu-puncts").css('margin-top',top+'px');
      if(Math.max($(".oni-main-content").height(),$(".oni-list-content").height())>$(window).height()-78){
        $(".oni-right-menu").height(Math.max($(".oni-main-content").height(),$(".oni-list-content").height()))
      }else{
        $(".oni-right-menu").height($(window).height()-78)
      }

      $('.oni-right-menu-punct').each(function(){
        var detail = $(this).find("#oni-right-menu-punct-detail");
        $(this).mouseover(function(){
          $(detail).show();
        }).mouseout(function(){
          $(detail).hide();
        })
      });

      $(".oni-footer-line").width($(window).width());

      window.clearInterval(MAS_INTERVAL_ONI.resizeRightMenuInterval);
    }
  },15);*/
}



function resize(){
  resizeRightMenu();
}

$(document).ready(function(){
  resize();
  $(window).resize(function(){
    resize();
  });
  $(document).resize(function(){
    resize();
  });
});
