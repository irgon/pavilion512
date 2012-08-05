(function($) {

    var sliderImg = $('#slider > .images img'),
        slider = $('#slider > .images'),
        currentImg = sliderImg.filter(':first'),
        middle = parseInt($('#slider').width() / 2) + 168,
        prevB = $('#slider .prev'),
        nextB = $('#slider .next'),
        animation = 'next';

    var positionForImage = function(img) {
        return parseInt(slider.css('marginLeft')) - img.offset().left + middle - img.width();
    };

    var showInfo = function(e) {
        var i,
            imgData = $(this).data(),
            preview = $('#preview');

        if(!preview.size()) { return; }
        e.preventDefault();
        for(i in imgData) {
            if(imgData.hasOwnProperty(i)) {
                preview.find('.' + i).text((i == 'index' ? '0' : '') + imgData[i]);
            }
        }
        preview.find('img').attr('src', ($(this).attr('src')));
        preview.fadeIn();
        slider.stop();
    };

    var regroupImages = function(next) {
        var last_good_index = -1, images_to_move, width_sum = 0, winwidth = $('#slider').width();
        slider.find('img').each(function(i) {
            if(!next && last_good_index > -1) {
                return;
            }
            if((next && $(this).offset().left < -1000) || (!next && $(this).offset().left > winwidth + 1000)) {
                last_good_index = i;
            }
        });
        images_to_move = slider.find('img:' + (next ? 'l' : 'g') + 't(' + last_good_index + ')');
        images_to_move.each(function() {
            width_sum += $(this).width();
        });
        slider.css('marginLeft', (parseInt(slider.css('marginLeft')) + ((next ? 1 : -1) * width_sum)).toString() + 'px');
        slider[next ? 'append' : 'prepend'](images_to_move);
    }

    var animateNext = function() {
        animation = 'next';
        slider.stop().animate({'marginLeft':'-=1000'}, 10000, 'linear', function() {
            regroupImages(true);
            animateNext();
        });
    };

    var animatePrev = function() {
        animation = 'prev';
        slider.stop().animate({'marginLeft': '+=1000'}, 10000, 'linear', function() {
            regroupImages(false);
            animatePrev();
        });
    };

    var findPhotoForX = function(x) {
        var res = $();
        slider.find('img').each(function(i) {
            if($(this).offset().left < x) {
                res = $(this);
            }
        });
        return res;
    };

    prevB.mouseover(function(e) {
        animatePrev();
    }).click(function(e) {
        e.preventDefault();
        findPhotoForX(e.pageX).click();
    });

    nextB.mouseover(function(e) {
        animateNext();
    }).click(function(e) {
        e.preventDefault();
        findPhotoForX(e.pageX).click();
    });

    $('#preview .close').click(function(e) {
        e.preventDefault();
        $('#preview').fadeOut(function() {
            if(animation == 'next') { animateNext(); } else { animatePrev(); }
        });
    });

    $(document).ready(function() {
        if(slider.size()) {
            slider.append(sliderImg.clone()).prepend(sliderImg.clone());
            slider.css('marginLeft', positionForImage(currentImg));
            slider.find('img').click(showInfo);
            animateNext();
        }
        $('#top h2 > span').hide();
        setInterval(function() {
            $('#top h2 > :visible').fadeOut();
            $('#top h2 > :not(:visible)').fadeIn();
        }, 4000);
    });
}(jQuery));