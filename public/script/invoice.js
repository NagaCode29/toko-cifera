const orderDate = document.getElementById('order-date');

orderDate.innerText = 'Tanggal: ' + moment(orderDate.innerText).format('DD/MM/YYYY HH:mm:ss');

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

const totalPaid = document.getElementById('totalPaid');
totalPaid.innerText = 'Dibayar: '+ convertToRp(totalPaid.textContent);

document.getElementById('download-btn').addEventListener('click', function() {
    html2canvas(document.getElementById('invoice')).then(function(canvas) {
        const imageData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imageData;
        link.download = 'invoice.png';
        link.click();
    });
});

