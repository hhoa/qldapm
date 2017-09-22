'use strict';

angular.module('my-app.slider', [])
    .directive('slides', ()=>{
    return {
        link: (scope, elm, attrs)=>{
            elm.addClass('slider');
            scope.current = 0;
            scope.isAuto = true;

            scope.next = ()=>{
                elm.find('ul li:eq('+ scope.current +') .img').animate({opacity: 0}, {duration: 500, queue: false});
                if(scope.current + 1 >= scope.slides.length){
                    scope.current = 0;
                }else{
                    scope.current++;
                }
                elm.find('ul li:eq('+ scope.current +') .img').animate({opacity: 1}, {duration: 500, queue: false});
                scope.isAuto = false;
            };
            scope.prev = ()=>{
                elm.find('ul li:eq('+ scope.current +') .img').animate({opacity: 0}, {duration: 500, queue: false});
                if(scope.current  === 0){
                    scope.current = scope.slides.length - 1;
                }else{
                    scope.current--;
                }
                elm.find('ul li:eq('+ scope.current +') .img').animate({opacity: 1}, {duration: 500, queue: false});
                scope.isAuto = false;
            };

            scope.getSize = (url)=>{
                //TO DO
            };

            let auto = ()=>{
                let mylood = setInterval(()=>{
                    if(scope.isAuto){
                        elm.find('ul li:eq('+ scope.current +') .img').animate({opacity: 0}, {duration: 500, queue: false});
                        if(scope.current + 1 >= scope.slides.length){
                            scope.current = 0;
                        }else{
                            scope.current++;
                        }
                        elm.find('ul li:eq('+ scope.current +') .img').animate({opacity: 1}, {duration: 500, queue: false});
                    }else{
                        clearInterval(mylood);
                    }

                }, Number(attrs.delay));
            };
            auto();

            let refresh = ()=>{
                let count = 0;
                let myloop = setInterval(()=>{
                    count++;
                    if(count > 10 || elm.height() > 100){
                        //console.log(elm.height(), elm.find('.next').height());
                        elm.find('.next').css({top: (elm.height() - elm.find('.next').height())/2 });
                        elm.find('.prev').css({top: (elm.height() - elm.find('.prev').height())/2 });
                        clearInterval(myloop);
                    }
                }, 1000);

            };
            refresh();

        },
        scope: {
            slides: "="
        },
        restrict: "A",
        templateUrl: 'app/components/web-frontend/slider/slider.template.html'
    }
});