$('#qty_loading').hide();
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
            alert(`Product Add To Cart  for ${response.user}`)
        }

    })
    $.ajax({

        url: "/getTotalProduct",
        type: 'get'
    }).done((result) => {

        $('#qty').html(result.totalQty);
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

// var availableItems = [
//         "Realme-C33-4GB-64GB-Night-Sea-1",
//         "Realme-C33-4GB-64GB-Sandy-Gold-1",
//         "Realme-C55-8GB-256GB-Sunshower-1",
//         "Oppo-Reno-8T-8GB-256GB-Sunset-Orange-1",
//         "Oppo-Reno-8T-8GB-256GB-Sunset-Orange-2",
//         "Oppo-Reno-8T-8GB-256GB-Sunset-Orange-3",
//         "Samsung-Galaxy-A23-6GB-128GB-1",
//         "Samsung-Galaxy-A53-5G-6GB-128GB-Awesome-Blue-1",
//         "Sport Fields & Halls Contracting",
//         "Audio Records Trading", "Realme", "Apple"
// // ];
$("#search").autocomplete({
    source: availableItems
});
