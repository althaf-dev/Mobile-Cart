$('#qty_loading').hide();
function addToCart(id, user) {

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
        else{
            $('#qty_loading').show();
        }

    })

}