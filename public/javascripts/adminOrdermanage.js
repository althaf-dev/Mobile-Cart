function shippingUpdate(proId ,event){
    event.preventDefault();
    let orderId = $('#orderId').html();
    
    let status =$(`#${proId}`).serialize();
    let data = {status,orderId,proId};
    console.log(proId);
    $.ajax({
        url:'/admin/update-order-products',
        type:"post",
        data:data

    }).done((res)=>{
        alert("done");
    })
}

