$('#qty_loading').hide();
let qty= 0;
function addToCart(id, user,cart) {

    console.log("added to cart");
    console.log(id, user);
    $.ajax({

        url: "/addProductsToCart",
        type: 'post',
        data: { 'id': id }
    }).done((response) => {

        if (!response.user) {
            location.replace('/login');

        }
        else if (response.status) {
            $('#qty').html("Product added to cart");
            setTimeout(()=>{
                $('#qty').html(qty);
            },1500);
        }

    })
    $.ajax({

        url: "/getTotalProduct",
        type: 'get'
    }).done((result) => {
        qty = result.totalQty
        // $('#qty').html(result.totalQty);
        if(cart){
            location.replace("/cart")
        }
    })
    
}

function quantityUpdate(id, value, event) {

    $('#qty_loading').show();
    $.ajax({
        url: "/cartQuantityUpdate",
        type: 'post',
        data: { 'id': id, 'value': value }
    }).done((response) => {
        if (response.status) {
            let total, qty;
            $('#qty_loading').hide();
            response.cart.forEach(element => {
                if (element.products.item_id == id) {
                    total = element.total;
                    qty = element.products.qty;
                }
            });
            $(event.target.parentElement.children[1]).html(qty);
            $('#' + id).html(total);
            $('#cart_subtotal').html(response.Total);
            $('#cart_total').html(response.Total);

        }
        else {
            $('#qty_loading').show();
        }

    })


}
$("#loader").hide();
$("#message").hide();
function placeOrder(e) {
    console.log(e.target[0].value);
    e.preventDefault();
    $("#checkout-section").hide();
    $("#loader").show();
    $.ajax({

        url: "/placeorder",
        type: "post",
        data: $("#checkout-form").serialize()
    }).done((response) => {

        console.log(response);
        if (response.status) {
            setTimeout(() => {
                $("#loader").hide();
                $("#message").show();
            }, 3000);
        }

    })

}
let availableItems = [];
$("#search").on('click', () => {
    availableItems.length = 0;
    $.ajax({

        url: "Admin/productslist",
        type: "get"
    }).done((response) => {

        console.log(response.products);
        response.products.forEach(el => {

            availableItems.push(el.product_name);
        })

    })
})

$("#search").autocomplete({
    source: availableItems
});

