/* ===================================
    About
====================================== */

// const { serializeUser } = require("passport");

/*---------------------------------------------------------------------
    Theme Name: Woman Store
    Theme URI:
    Author: Themes Industry
    Author URI:
    Description: One Page , Multi Parallax Template
    Tags: one page, multi page, multipurpose, parallax, creative, html5

 ----------------------------------------------------------------------*/
$('#my-editIcon').click(function () {
    $('#my-file').click();
});
function changeQuantity(value, productID, index) {
    $.getJSON('/api/change-quantity', {productID, value}, (data) => {
        console.log('data: ',data);
        $('#total' + index).html(data.sumPrice + ' VNĐ');
        $('#subTotal').html(data.subTotal + ' VNĐ');
        $('#sutTotal1').html(data.subTotal + ' VNĐ');
    })
}
function deleteCarItem(id) {
    alert(id);
    $.getJSON('/api/delete-cart-item', {id}, (cart) => {
        var template = Handlebars.compile($('#table-shopcart-template').html());
        console.log(cart);
        var newHTML = template({
            listItem: cart.products
        })
        $('#table-shopcart').html(newHTML);
        $('#subTotal').html(cart.total + ' VNĐ');
        $('#sutTotal1').html(cart.total + ' VNĐ');
    })
    return false;
}
function checkout() {
    const fullAddress = document.getElementById('value-full-address').innerHTML;
    if (fullAddress == "") {
        alert('Please chose your address to ship!')
        return false;
    }
    post('pay-shop-cart', { fullAddress: fullAddress });
}
function checkAddress() {
    const province = document.getElementById('provinces').value;
    const district = document.getElementById('districts').value;
    const ward = document.getElementById('wards').value;
    const address = document.getElementById('address').value;
    if (province == "" || district == "" || ward == "" || address == "") {
        alert('Please enter you address!')
        return false;
    }
    document.getElementById('full-address').hidden = false;
    document.getElementById('value-full-address').innerHTML = address + ', ' + ward + ', ' + district + ', ' + province;
}
function addComment() {
    const productID = $('#idOfBook').val();
    const rating = $('#rating').val();
    const content = $('#content').val();
    const name = $('#username').val();
    $.getJSON('/api/add-comment', {productID, rating, content, name}, (comments) => {
        
        var template = Handlebars.compile($('#new-comments-template').html());
        var commentsHTML = template({
            comments: comments.docs,
            page: comments.page,
            nextPage: comments.nextPage,
            prevPage: comments.prevPage,
            hasNextPage: comments.hasNextPage,
            hasPrevPage: comments.hasPrevPage
        })
        $('#list-comment').html(commentsHTML);
    })
    return false;
}
function pagingComment(page) {
    const id = document.getElementById('idOfBook').value;
    $.getJSON('/api/product-detail', { page, id }, (comments) => {
        var template = Handlebars.compile($('#new-comments-template').html());
        console.log(template);
        var commentsHTML = template({
            comments: comments.docs,
            page: comments.page,
            nextPage: comments.nextPage,
            prevPage: comments.prevPage,
            hasNextPage: comments.hasNextPage,
            hasPrevPage: comments.hasPrevPage
        })
        console.log(commentsHTML);
        $('#list-comment').html(commentsHTML);
    })
}
function addNewItem(productID) {
    const quantity = document.getElementById('quantity').value
    $.getJSON('/api/add-to-cart', { id: productID, qty: quantity }, (cart) => {
        var template = Handlebars.compile($('#item-side-menu-template').html());
        var itemSideMenu = template({
            listItem: cart.products, total: cart.total
        })
        $('#item-side-menu').html(itemSideMenu);
        $('#count-item-cart').text(cart.quantity.toString());
    })

}

function addOneItem(productID) {
    $.getJSON('/api/add-to-cart', { id: productID, qty: 1 }, (cart) => {
        // console.log(cart)
        var template = Handlebars.compile($('#item-side-menu-template').html());
        var itemSideMenu = template({
            listItem: cart.products, total: cart.total
        });
        $('#item-side-menu').html(itemSideMenu);
        $('#count-item-cart').text(cart.quantity.toString())
    })
}


function selectProvince() {
    const province = document.getElementById('provinces').value
    $.getJSON('/api/province', { province }, (districts) => {
        var template = Handlebars.compile($('#districts-template').html());
        var newHTML = template({
            districts
        })
        $('#districts').html(newHTML);
    })
}

function selectDistrict() {
    const province = document.getElementById('provinces').value;
    const district = document.getElementById('districts').value;
    $.getJSON('/api/district', { province, district }, (wards) => {
        var template = Handlebars.compile($('#wards-template').html());
        var newHTML = template({
            wards
        })
        $('#wards').html(newHTML);
    })
}
let maxPrice = false;
let minPrice = false;
let nameBook = false;
let currentPage = false;
let styleSort = false;
let categoryID = false;
function filterListingPage() {
    let obj = {};
    if (maxPrice) {
        obj.maxPrice = maxPrice;
    }
    if (minPrice) {
        obj.minPrice = minPrice;
    }
    if (nameBook) {
        obj.search = nameBook;
    }
    if (currentPage) {
        obj.page = currentPage;
    }
    if (styleSort) {
        obj.sort = styleSort;
    }
    if (categoryID) {
        obj.categoryID = categoryID;
    }
    console.log(obj);
    $.getJSON('/api/product-listing', obj, (data) => {
        var template = Handlebars.compile($('#list-book').html());
        var booksHTML = template({
            books: data.docs,
            page: data.page,
            nextPage: data.nextPage,
            prevPage: data.prevPage,
            hasNextPage: data.hasNextPage,
            hasPrevPage: data.hasPrevPage
        });
        $('#books').html(booksHTML);
        $('.product-listing-carousel').owlCarousel({
            loop: true,
            margin: 10,
            nav: true,
            dots: false,
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 1
                },
                1000: {
                    items: 1
                }
            }
        });
        $(".owl-prev").html('<div class="navigation-link-prev"><a class="prev-btn"><i class="lni-chevron-left"></i> </a></div>');
        $(".owl-next").html('<div class="navigation-link-next"><a class="next-btn"><i class="lni-chevron-right"></i> </a></div>');
    });
    return obj;
}
function searchBook(value) {
    const name = document.getElementById('nameBook').value;
    nameBook = name;
    currentPage = false;
    filterListingPage();
    return false;
}
function filterPrice() {
    const strMaxPrice = document.getElementById('max-p').innerHTML;
    const strMinPRice = document.getElementById('min-p').innerHTML;
    maxPrice = Number(strMaxPrice.split('VNĐ')[0]);
    minPrice = Number(strMinPRice.split('VNĐ')[0]);
    // alert('max price: ' + maxPrice + 'min price: ' + minPrice);
    const isDefault = document.getElementById('default-sort').checked;
    const isIncrease = document.getElementById('increase-sort').checked;
    const isDecrease = document.getElementById('decrease-sort').checked;
    currentPage = false;
    if (isDefault) {
    }
    else if (isIncrease) {
        styleSort = 1;
    }
    else if (isDecrease) {
        styleSort = -1;
    }
    else {

    }
    filterListingPage();
}

function paging(page) {
    currentPage = page;
    filterListingPage();
}
function filterCategory(id) {
    categoryID = id;
    filterListingPage();
}
function checkComment() {
    if (document.getElementById("rating").value == "") {
        document.getElementById("noneRate").hidden = false;
        return false;
    }
    else {
        return true;
    }
}
function clickOneStar() {
    document.getElementById("one-star").className = "lni-star-filled";
    document.getElementById("two-star").className = "lni-star";
    document.getElementById("three-star").className = "lni-star";
    document.getElementById("four-star").className = "lni-star";
    document.getElementById("five-star").className = "lni-star";
    document.getElementById("rating").value = 1;

}

function clickTwoStar() {
    document.getElementById("one-star").className = "lni-star-filled";
    document.getElementById("two-star").className = "lni-star-filled";
    document.getElementById("three-star").className = "lni-star";
    document.getElementById("four-star").className = "lni-star";
    document.getElementById("five-star").className = "lni-star";
    document.getElementById("rating").value = 2;
}

function clickThreeStar() {
    document.getElementById("one-star").className = "lni-star-filled";
    document.getElementById("two-star").className = "lni-star-filled";
    document.getElementById("three-star").className = "lni-star-filled";
    document.getElementById("four-star").className = "lni-star";
    document.getElementById("five-star").className = "lni-star";
    document.getElementById("rating").value = 3;
}

function clickFourStar() {
    document.getElementById("one-star").className = "lni-star-filled";
    document.getElementById("two-star").className = "lni-star-filled";
    document.getElementById("three-star").className = "lni-star-filled";
    document.getElementById("four-star").className = "lni-star-filled";
    document.getElementById("five-star").className = "lni-star";
    document.getElementById("rating").value = 4;
}

function clickFiveStar() {
    document.getElementById("one-star").className = "lni-star-filled";
    document.getElementById("two-star").className = "lni-star-filled";
    document.getElementById("three-star").className = "lni-star-filled";
    document.getElementById("four-star").className = "lni-star-filled";
    document.getElementById("five-star").className = "lni-star-filled";
    document.getElementById("rating").value = 5;
}

function post(path, params, method = 'post') {

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    const form = document.createElement('form');
    form.method = method;
    form.action = path;

    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            const hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = key;
            hiddenField.value = params[key];
            form.appendChild(hiddenField);
        }
    }
    document.body.appendChild(form);
    form.submit();
}

function insertParam(key, value) {
    key = encodeURIComponent(key);
    value = encodeURIComponent(value);

    // kvp looks like ['key1=value1', 'key2=value2', ...]
    var kvp = document.location.search.substr(1).split('&');
    let i = 0;

    for (; i < kvp.length; i++) {
        if (kvp[i].startsWith(key + '=')) {
            let pair = kvp[i].split('=');
            pair[1] = value;
            kvp[i] = pair.join('=');
            break;
        }
    }

    if (i >= kvp.length) {
        kvp[kvp.length] = [key, value].join('=');
    }
    // can return this or...
    let params = kvp.join('&');

    // reload page with new params
    document.location.search = params;
}

var loadFile = function (event) {
    // alert('hihi');
    var output = document.getElementById('myImg');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
        URL.revokeObjectURL(output.src) // free memory
    }
    $('#myModal').modal('show');
};
//PAGE LOADER
$(window).on("load", function () {

    "use strict";
    $(".loader").fadeOut(800);

    $('.side-menu').removeClass('hidden');



    /*===================================
            Cube Portfolio OWL CAROUSEL
    ======================================*/

    $('#js-grid-blog-posts').cubeportfolio({
        filters: '#js-filters-blog-posts',
        search: '#js-search-blog-posts',
        defaultFilter: '*',
        animationType: '3dflip',
        gapHorizontal: 70,
        gapVertical: 30,
        gridAdjustment: 'responsive',
        mediaQueries: [{
            width: 1500,
            cols: 3,
        }, {
            width: 1100,
            cols: 3,
        }, {
            width: 800,
            cols: 3,
        }, {
            width: 481,
            cols: 2,
            options: {}
        }, {
            width: 320,
            cols: 1,
            options: {}
        }],
        caption: 'none',
        displayType: 'fadeIn',
        displayTypeSpeed: 400,
    });

    /*===================================
        sync-portfolio- and Owl Carousel
======================================*/

    $('.sync-portfolio-carousel').owlCarousel({
        loop: true,
        margin: 0,
        dots: false,
        nav: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    });

    $(".owl-prev").html('<div class="navigation-link-prev"><a class="prev-btn"><i class="lni-chevron-left"></i> </a></div>');
    $(".owl-next").html('<div class="navigation-link-next"><a class="next-btn"><i class="lni-chevron-right"></i> </a></div>');

    // $('.navigation-links a.prev-btn').click(function() {
    //     var owl = $('.sync-portfolio-carousel');
    //     owl.owlCarousel();
    //     owl.trigger('next.owl.carousel');
    // });
    // $('.navigation-links a.next-btn').click(function() {
    //     var owl = $('.sync-portfolio-carousel');
    //     owl.owlCarousel();
    //     owl.trigger('prev.owl.carousel', [300]);
    // });




});

jQuery(function ($) {
    "use strict";

    //let $window = $(window);
    // alert($window);

    /*------ STICKY MENU FIXED ------*/

    $(window).scroll(function () {

        if ($(document).scrollTop() > 240) {

            $('.fixed-header1').removeClass('position-relative');
            $('.header-area').addClass('fixednavbar');

        } else {
            $('.fixed-header1').addClass('position-relative');
            $('.header-area').removeClass('fixednavbar');
        }
    });

    /*------ End STICKY MENU FIXED ------*/


    /*------ DETECT SCREEN JS ------*/

    /*
     * Side menu collapse opener
     * */
    $(".collapsePagesSideMenu").on('click', function () {
        $(this).children().toggleClass("rotate-180");
    });

    $(".user-data").on('click', function () {
        // alert("yes");
        $(".user-data .dropdown-m").css({ display: 'block' });
    });
    $(".slider").on('click', function () {
        // alert("yes");
        $(".user-data .dropdown-m").css({ display: 'none' });
    });


    //Drop Down For register And cart menu
    $(document).click(function (event) {
        //if you click on anything except the modal itself or the "open modal" link, close the modal
        if (!$(event.target).closest(".mini-menu-card .shopping-cart").length) {
            $("body").find(".mini-menu-card .shopping-cart").removeClass("show");
        }
    });
    $(document).click(function (event) {
        //if you click on anything except the modal itself or the "open modal" link, close the modal
        if (!$(event.target).closest("#mini-menu .user-utiliity").length) {
            $("body").find("#mini-menu .user-utiliity").removeClass("show");
        }
    });


    /*===================================
      //Mega Menu OWL Carousel
    ======================================*/

    $('.featured-megamenu-carousel').owlCarousel({
        loop: true,
        margin: 10,
        nav: false,
        dots: false,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    });


    // Custom Mega Menu OWL
    $('.ini-customNextBtn').click(function () {
        var owl = $('.featured-megamenu-carousel');
        owl.owlCarousel();
        owl.trigger('next.owl.carousel');
    });
    $('.ini-customPrevBtn').click(function () {
        var owl = $('.featured-megamenu-carousel');
        owl.owlCarousel();
        owl.trigger('prev.owl.carousel', [300]);
    });


    /* ===================================
       Product Listing Owl Changes Images
    ====================================== */

    $('.product-listing-carousel').owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        dots: false,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    });


    /*===================================
         LATEST ARRIVALS OWL CAROUSEL
    ======================================*/
    $('.lastest_featured_products').owlCarousel({
        loop: true,
        margin: 10,
        nav: false,
        dots: true,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1
            },

            600: {
                items: 2
            },
            1000: {
                items: 5
            }
        }
    });


    /*===================================
        SEARCH BOX MEDIA ITEAMS
    ======================================*/
    $('.search-box-meida-items').owlCarousel({
        loop: true,
        margin: 0,
        nav: false,
        dots: false,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1
            },

            600: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    });


    /*===================================
              //Sticky Filter Nav
    ======================================*/
    var sidebar = $('#product-filter-nav');
    if (sidebar.length) {
        Stickyfill.add(sidebar);
    }


    /*===================================
              Price Range
    ======================================*/

    if ($("#slider-range").length) {
        var marginSlider = document.getElementById('slider-range');

        noUiSlider.create(marginSlider, {
            start: [1, 100000],
            margin: 30,
            step: 1,
            connect: true,
            range: {
                'min': 1,
                'max': 1000000
            },

        });

        var marginMin = document.getElementById('min-p'),
            marginMax = document.getElementById('max-p');

        marginSlider.noUiSlider.on('update', function (values, handle) {
            if (handle) {
                var str = values[handle]
                var res = str.split(".");
                marginMax.innerHTML = res[0] + "VNĐ";
            } else {
                var str = values[handle]
                var res = str.split(".");
                marginMin.innerHTML = res[0] + "VNĐ" + " - ";
            }
        });
    }


    /* ===================================
         Search Side Menu
     ====================================== */


    $("#add_search_box").click(function () {
        $(".search-box-overlay").addClass("fixed-box");
    });

    $("#close-window").click(function () {
        $(".search-box-overlay").addClass("remove-fixed-box");
        setTimeout(function () {
            $(".search-box-overlay").removeClass("fixed-box");
            $(".search-box-overlay").removeClass("remove-fixed-box");
        }, 800);


    });


    $("#add_cart_box").click(function () {
        $(".cart-box-overlay").addClass("fixed-box");
    });

    $("#close-window1").click(function () {
        $(".cart-box-overlay").addClass("remove-fixed-box");
        setTimeout(function () {
            $(".cart-box-overlay").removeClass("fixed-box");
            $(".cart-box-overlay").removeClass("remove-fixed-box");
        }, 800);


    });



    $('[data-fancybox]').fancybox({
        'transitionIn': 'elastic',
        'transitionOut': 'elastic',
        'speedIn': 600,
        'speedOut': 200,
        buttons: [
            'slideShow',
            'fullScreen',
            'thumbs',
            'share',
            // 'download',
            'zoom',
            'close'
        ],
    });


    /*Menu Onclick*/
    let sideMenuToggle = $("#sidemenu_toggle");
    let sideMenu = $(".side-menu");
    if (sideMenuToggle.length) {
        sideMenuToggle.on("click", function () {
            $("body").addClass("overflow-hidden");
            sideMenu.addClass("side-menu-active");
            $(function () {
                setTimeout(function () {
                    $("#close_side_menu").fadeIn(300);
                }, 300);
            });
        });
        $("#close_side_menu , #btn_sideNavClose , .side-nav .nav-link.pagescroll").on("click", function () {
            $("body").removeClass("overflow-hidden");
            sideMenu.removeClass("side-menu-active");
            $("#close_side_menu").fadeOut(200);
            $(() => {
                setTimeout(() => {
                    $('.sideNavPages').removeClass('show');
                    $('.fas').removeClass('rotate-180');
                }, 400);
            });
        });
        $(document).keyup(e => {
            if (e.keyCode === 27) { // escape key maps to keycode `27`
                if (sideMenu.hasClass("side-menu-active")) {
                    $("body").removeClass("overflow-hidden");
                    sideMenu.removeClass("side-menu-active");
                    $("#close_side_menu").fadeOut(200);
                    $tooltip.tooltipster('close');
                    $(() => {
                        setTimeout(() => {
                            $('.sideNavPages').removeClass('show');
                            $('.fas').removeClass('rotate-180');
                        }, 400);
                    });
                }
            }
        });
    }



    /* =====================================
          Parallax
       ====================================== */

    if ($(window).width() < 780) {
        $('.parallax').addClass("parallax-disable");
    } else {
        $('.parallax').removeClass("parallax-disable");

        // parallax
        $(".parallax").parallaxie({
            speed: 0.6,
            offset: 0,
        });
    }



    /* ===================================
        Stop Parallax Banner Index Page
    ======================================*/
    if ($(window).width() < 780) {
        $('.parallax-slide').addClass('paralax-data');
    } else {
        $('.parallax-slide').removeClass('paralax-data');
        $('.parallax-slide').parallaxie({
            speed: 0.6,
            offset: -200,
        });
    }



    /*===================================
              Swiper Sync Slider
    ======================================*/
    if ($("#gallery").length) {
        var galleryTop = new Swiper('#gallery', {
            effect: 'fade',
            direction: 'vertical',
            spaceBetween: 10,
            slidesPerView: 1,
            slidesPerGroup: 1,
            loop: true,
            initialSlide: 0,
            centeredSlides: true,
            loopAdditionalSlides: 5,
            touchRatio: 0.2,

        });

        var galleryThumbs = new Swiper('#thumbs', {
            direction: 'vertical',
            spaceBetween: 10,
            slidesPerView: 3,
            slidesPerGroup: 1,
            loop: true,
            initialSlide: 0,
            centeredSlides: true,
            loopAdditionalSlides: 3,
            touchRatio: 0.2,
            slideToClickedSlide: true
        });

        galleryTop.controller.control = galleryThumbs;
        galleryThumbs.controller.control = galleryTop;
    }


    /*===================================
              Input Number Counter
    ======================================*/


    $('.count').prop('disabled', true);
    $(document).on('click', '.plus', function () {
        $('.count').val(parseInt($('.count').val()) + 1);

    });
    $(document).on('click', '.minus', function () {
        $('.count').val(parseInt($('.count').val()) - 1);
        if ($('.count').val() == 0) {
            $('.count').val(1);

        }
    });

    /* ===================================
              Wow Effects
    ======================================*/
    var wow = new WOW(
        {
            boxClass: 'wow',      // default
            animateClass: 'animated', // default
            offset: 0,          // default
            mobile: false,       // default
            live: true        // default
        }
    );
    wow.init();




    /* ===================================
         //Scroll and Arrow Appear
    ======================================*/

    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 300)
            $('.scroll-top-arrow').fadeIn('slow');
        else
            $('.scroll-top-arrow').fadeOut('3000');
    });

    //Click event to scroll to top
    $(document).on('click', '.scroll-top-arrow', function () {
        $('html, body').animate({ scrollTop: 0 }, 800);
        return false;
    });


    /* ===================================
              REV SLIDER
    ======================================*/
    if ($(".slider").length) {

        $("#rev_slider_1_1").show().revolution({
            sliderType: "standard",
            jsFileLocation: "//localhost/reveditor/revslider/public/assets/js/",
            sliderLayout: "fullscreen",
            dottedOverlay: "none",
            delay: 9000,
            navigation: {
                keyboardNavigation: "off",
                keyboard_direction: "horizontal",
                mouseScrollNavigation: "off",
                mouseScrollReverse: "default",
                onHoverStop: "off",
                arrows: {
                    style: "gyges",
                    enable: true,
                    hide_onmobile: true,
                    hide_under: 767,
                    hide_onleave: false,
                    tmp: '',
                    left: {
                        h_align: "left",
                        v_align: "center",
                        h_offset: 20,
                        v_offset: 0
                    },
                    right: {
                        h_align: "right",
                        v_align: "center",
                        h_offset: 20,
                        v_offset: 0
                    }
                }
            },
            responsiveLevels: [1240, 1024, 778, 480],
            visibilityLevels: [1240, 1024, 778, 480],
            gridwidth: [1140, 1024, 778, 480],
            gridheight: [700, 768, 960, 420],
            lazyType: "none",
            parallax: {
                type: "mouse",
                origo: "enterpoint",
                speed: 400,
                speedbg: 0,
                speedls: 0,
                levels: [2, 3, 5, 10, 25, 30, 35, 40, 45, 46, 47, 48, 49, 50, 51, 55],
                disable_onmobile: "on"
            },
            shadow: 0,
            spinner: "spinner2",
            stopLoop: "off",
            stopAfterLoops: -1,
            stopAtSlide: -1,
            shuffle: "off",
            autoHeight: "off",
            fullScreenAutoWidth: "off",
            fullScreenAlignForce: "off",
            fullScreenOffsetContainer: "",
            fullScreenOffset: "",
            disableProgressBar: "on",
            hideThumbsOnMobile: "off",
            hideSliderAtLimit: 0,
            hideCaptionAtLimit: 0,
            hideAllCaptionAtLilmit: 0,
            debugMode: false,
            fallbacks: {
                simplifyAll: "off",
                nextSlideOnWindowFocus: "off",
                disableFocusListener: false,
            }
        });
    }




});