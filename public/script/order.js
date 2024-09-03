function addRow(){
    const row = prompt("Masukan jumlah baris",1);
    document.location.href = '/orders/add-order?row='+row;
}


const dateAll = document.querySelectorAll('.date')

dateAll.forEach(date => {
    const created_at = date.innerText
    date.innerText = moment(created_at).format('DD/MM/YYYY HH:mm:ss')
});

function convertToRp(value){
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(value);
}


const total = document.querySelectorAll('.total');
const totalPaid = document.querySelectorAll('.total_paid');

total.forEach(function (element){
    element.innerText = convertToRp(element.textContent);
});

totalPaid.forEach(function (element){
    element.innerText = convertToRp(element.textContent);
});

const totalOrder = document.getElementById('totalOrder');
const totalPaidId = document.getElementById('totalPaid');

totalOrder.innerText =  convertToRp(totalOrder.textContent);
totalPaidId.innerText =  convertToRp(totalPaidId.textContent);

const dataOrders = document.getElementById('data-orders');
const keyword = document.getElementById('keyword');

keyword.addEventListener('keyup',async function (){
    try {
        const response = await fetch('/orders/search/query?keyword='+ this.value);
        const data = await response.json();

        let html = '';
        let no = 0;

        data.forEach(order => {
            no += 1;
            no += 1;
            const tdNo = `<td scope="row">${no}</td>`
            const tdCreatedAt = `<td>${moment(order.created_at).format('DD/MM/YYYY HH:mm:ss')}</td>`
            const tdCustomerName = `<td>${order.customer_name}</td>`
            const tdTotal = `<td>${convertToRp(order.total)}</td>`
            const tdTotalPaid = `<td>${convertToRp(order.total_paid)}</td>`

            const tdAction = `<td><a class="btn btn-info btn-sm mx-1" href="/orders/detail/${order.id}">Detail</a><button class="btn btn-outline-success btn-sm mx-1 mt-1" type="button" data-bs-toggle="modal" data-bs-target="#modalUpdateOrder${order.id}">update</button><button class="btn btn-outline-danger btn-sm mx-1" type="button" data-bs-toggle="modal" data-bs-target="#modal${order.id}">Delete</button><!--Modal update--><div class="modal fade text-dark" id="modalUpdateOrder${order.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h1 class="modal-title fs-5" id="exampleModalLabel">Update Order</h1><button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body"><form action="/orders/update-order/${order.id}" method="post"><div class="mb-2"><label class="form-label" for="total_paid">Paid</label><input class="form-control" type="number" id="total_paid" name="total_paid" value="${order.total_paid}"></div><button class="btn btn-success form-control mt-2" type="submit">Update</button></form></div></div></div></div><!-- Modal Delete--><div class="modal fade" id="modal${order.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h1 class="modal-title fs-5" id="exampleModalLabel">Confirmation</h1><button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body"><h3>Sure??</h3></div><div class="modal-footer"><button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Close</button><a class="btn btn-outline-danger" href="/orders/delete-order/${order.id}">delete</a></div></div></div></div></td>`;


            html += `<tr>${tdNo}${tdCreatedAt}${tdCustomerName}${tdTotal}${tdTotalPaid}${tdAction}</tr>`;
        })

        dataOrders.innerHTML = html;
    }catch (e){
        console.error('Error');
        // alert('Terjadi error');
    }
})