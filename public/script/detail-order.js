function convertToRp(value){
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(value);
}

const price = document.querySelectorAll('.price');
const subtotal = document.querySelectorAll('.subtotal');


price.forEach(function (p){
    p.textContent = convertToRp(p.textContent)
})
let total = 0;

subtotal.forEach(function (st){
    total += Number(st.textContent);
    st.textContent = convertToRp(st.textContent);
});

document.getElementById('total').textContent = 'Total: '+ convertToRp(total);

moment.locale('id');

const order_date = document.getElementById('order-date');
order_date.innerText = 'Order date: '+ moment(order_date.innerText).format('LLLL')



const totalPaid = document.getElementById('totalPaid');
totalPaid.innerText = 'Total paid: '+ convertToRp(totalPaid.textContent);