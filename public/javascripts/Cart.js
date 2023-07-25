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
}