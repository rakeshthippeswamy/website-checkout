$(document).ready(function(){
    var prducts,totalProds = $('.prodContent').length;
    $.get("includes/data/cart.json",function(data,status){
        prducts = data;
        $('.mobQty').text($('.prodContent').length + " ITEMS");
        assignData(prducts);
    })
     
    
    var assignData = function(prducts){
        console.log(prducts[0].productsInCart[0]);
        for(var i=0;i<totalProds;i++){
            $(".item-heading")[i].innerHTML = prducts[0].productsInCart[i].p_variation +" "+ prducts[0].productsInCart[i].p_name;
            $(".item-mob-heading")[i].innerHTML = prducts[0].productsInCart[i].p_variation +" "+ prducts[0].productsInCart[i].p_name;
            $(".item-style")[i].innerHTML ="Style : "+prducts[0].productsInCart[i].p_style;
            $(".item-mob-style")[i].innerHTML ="Style : "+prducts[0].productsInCart[i].p_style;
            $(".item-colour")[i].innerHTML ="Colour : "+prducts[0].productsInCart[i].p_selected_color.name;
            $(".item-mob-colour")[i].innerHTML ="Colour : "+prducts[0].productsInCart[i].p_selected_color.name;
            $(".item-size")[i].innerHTML = prducts[0].productsInCart[i].p_selected_size.code;
            $(".item-mob-size")[i].innerHTML ="Size : " + prducts[0].productsInCart[i].p_selected_size.code;
            var quantity = parseInt($('.item-qty input')[i].value);
            $(".item-total")[i].innerHTML  = prducts[0].productsInCart[i].p_price * quantity;
            $(".item-mob-total")[i].innerHTML  = prducts[0].productsInCart[i].p_price * quantity;
            get_SetSubTotal();
        }
        
    }
    
    $('.remove-item').click(function(){
        var dataIndex;
        if($(this).closest('section[data-mob]').attr('data-mob')!==undefined){
            dataIndex = $(this).closest('section[data-mob]').attr('data-mob');
        }else{
            dataIndex = $(this).closest('section[data-index]').attr('data-index');
        }
        $('section.prodContent[data-index='+dataIndex+']').remove();
        $('section.prodContentMOb[data-mob='+dataIndex+']').remove();
        var subTotal = get_SetSubTotal();
        estimatedTotal(subTotal);
        $('.mobQty').text($('.prodContent').length + " ITEMS");
        $('.mobQty').text($('.prodContentMOb').length + " ITEMS");
    })
    
    
    function itemPriceTotal(currItem,itemIndex){
           var quantity = parseInt(currItem.val());
           var price = parseInt(prducts[0].productsInCart[itemIndex].p_price); 
            return quantity*price;
        }
    
    function estimatedTotal(subTotal){
        var totalMoneyToPay=0;
        var discount = parseFloat(parseFloat($('.discountVal').text()).toFixed(2));
        $('.totalBill').text((subTotal - discount))
    }
    function get_SetSubTotal(){
        var selector = $('section[data-mob]');
        var total = 0;
        
        $.each(selector,function(index,item){
            total+= parseFloat($(item).find('.item-mob-total').text());
        });
        //return total;
        $('.subTotalValue,.subTotalMobValue').text(total);
      return total;
    }
    function setPopUpData(selector,dataIndex,type){
        var price,imageSrc,sizeOptions,colorOptions;
        $('#myModal').attr('data-modal-index',dataIndex);
        $('#myModal').attr('data-device-type',type);
        if(type=="mob"){
             price = $(selector).find('.item-mob-total').text();
            
        }else{
             price = $(selector).find('.item-total').text();
        }
        imageSrc = $(selector).find('img').attr('src');
        sizeOptions = prducts[0].productsInCart[dataIndex].p_available_options.sizes;
        colorOptions = prducts[0].productsInCart[dataIndex].p_available_options.colors;
        $('.popup-size').children().remove();
        
        for(var i=0;i<sizeOptions.length;i++){
            $('.popup-size').append('<option>'+sizeOptions[i].code+'</option>');
        }
        $('a[class^="color"]').removeClass('active');
        for(var i=0;i<colorOptions.length;i++){
            $('.color'+(i+1)).attr("name",colorOptions[i].name);
            $('.color'+(i+1)).css("background-color",colorOptions[i].hexcode);
            $('.color'+(1)).addClass('active');
        };
        
        $('.popup-price').text(price);
        $('.popup-image').attr('src',imageSrc);
    }
    
    function updateAll(_this){
        var dataIndex,totalText,priceTotal;
        
        if($(_this).closest('section[data-mob]').attr('data-mob')!==undefined){
            dataIndex = $(_this).closest('section[data-mob]').attr('data-mob');
            $('section.prodContent[data-index='+dataIndex+']').find('.item-qty input').val($(_this).val());
            var indexVal = $(_this).closest('section[data-mob]').attr('data-mob');
            priceTotal = itemPriceTotal($(_this),indexVal);
        }else{
            dataIndex = $(_this).closest('section[data-index]').attr('data-index');
            $('section.prodContentMOb[data-mob='+dataIndex+']').find('.prodQuantity input').val($(_this).val());
            var indexVal = $(_this).closest('section[data-index]').attr('data-index');
            priceTotal = itemPriceTotal($(_this),indexVal);
        }
        $('section.prodContent[data-index='+dataIndex+']').find('.item-total').text(priceTotal);
        $('section.prodContentMOb[data-mob='+dataIndex+']').find('.item-mob-total').text(priceTotal);
        
        var subTotal = get_SetSubTotal();
        estimatedTotal(subTotal);
    }
    
    $('a[class^="color"]').on('click',function(){
        $('a[class^="color"]').removeClass('active');
        $(this).addClass('active');
    });
    
    $('.editButton').click(function(){
        var selector,_this;
        var dataIndex = $('#myModal').attr('data-modal-index');
        //if($('div[data-device-type]').attr('data-device-type') === "mob"){
            selectorMob = $('section.prodContentMOb[data-mob='+dataIndex+']');
       // }else{
            selectorDesk = $('section.prodContent[data-index='+dataIndex+']')
       // }
        if($('a.active')!== "undefined"){
            $(selectorMob).find(".item-mob-colour").text("Colour : "+$('a.active').attr("name"));
            $(selectorDesk).find(".item-colour").text("Colour : "+$('a.active').attr("name"));
        }
        $(selectorMob).find(".item-mob-size").text("Size : "+$('.popup-size option:selected').text().trim());
        
        
        $(selectorDesk).find(".item-size").text($('.popup-size option:selected').text().trim());
        
        if($('div[data-device-type]').attr('data-device-type') === "mob"){
            $(selectorMob).find(".prodQuantity input").val(parseInt(parseInt($('.Quant option:selected').text().split(':')[1].trim())));
            _this = $(selectorMob).find(".prodQuantity input");            
        }else{
            $(selectorDesk).find(".item-qty input").val(parseInt(parseInt($('.Quant option:selected').text().split(':')[1].trim())));
            _this = $(selectorDesk).find(".item-qty input");
        }
        updateAll($(_this));
        $('.close').trigger('click');
        //$(selectorDesk).find(".item-colour").text("Colour : "+$('a.active').attr("name"));
    })
    
    
    $('.item-qty input,.prodQuantity input').change(function(){
        
        updateAll($(this));
        
    })
    
    $('.openPopUp').on('click',function(){
        if($(this).closest('section[data-mob]').attr('data-mob')!==undefined){
            dataIndex = $(this).closest('section[data-mob]').attr('data-mob');
            setPopUpData($(this).closest('section[data-mob]'),dataIndex,"mob");
        }else{
            dataIndex = $(this).closest('section[data-index]').attr('data-index');
            setPopUpData($(this).closest('section[data-index]'),dataIndex,"desk");
        }
        
    });
    
  
})
