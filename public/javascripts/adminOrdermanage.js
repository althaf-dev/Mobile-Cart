function shippingUpdate(proId ,event){

    let orderId = $('#orderId').html();
    let data ={proId,orderId,Ss:event.target.value}
    console.log(orderId);
    $.ajax({
        url:'/admin/update-order-products',
        type:"post",
        data:data

    })
}

