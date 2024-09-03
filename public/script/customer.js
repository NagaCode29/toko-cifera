const dateAll = document.querySelectorAll('.date')

dateAll.forEach(date => {
    const created_at = date.innerText
    date.innerText = moment(created_at).format('DD/MM/YYYY')
});

const dataCustomers = document.getElementById('data-customers');
const keyword = document.getElementById('keyword');

keyword.addEventListener('keyup',async function (){
    try {
        const response = await fetch('/customers/search/query?keyword='+ this.value);
        const data = await response.json();

        let html = '';
        let no = 0;
        data.forEach(customer => {
            no += 1;
            const tdNo = `<td scope="row">${no}</td>`
            const tdCreatedAt = `<td>${moment(customer.created_at).format('DD/MM/YYYY')}</td>`
            const tdCustomerId = `<td>${customer.id}</td>`
            const tdName = `<td>${customer.name}</td>`
            const tdPhone = `<td>${customer.phone}</td>`


            const tdAction = `<td><a class="btn btn-info btn-sm mx-1" href="/customers/orders-detail/${customer.id}">Detail</a><button class="btn btn-outline-success btn-sm mx-1" type="button" data-bs-toggle="modal" data-bs-target="#modalUpdateCustomer${customer.id}">update</button><button class="btn btn-outline-danger btn-sm mx-1" type="button" data-bs-toggle="modal" data-bs-target="#modal${customer.id}">Delete</button><!-- Modal Delete--><div class="modal fade" id="modal${customer.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h1 class="modal-title fs-5" id="exampleModalLabel">Confirmation</h1><button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body"><h3>Sure??</h3></div><div class="modal-footer"><button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Close</button><a class="btn btn-outline-danger" href="/customers/delete-customer/${customer.id}">delete</a></div></div></div></div><!-- Modal update--><div class="modal fade text-dark" id="modalUpdateCustomer${customer.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h1 class="modal-title fs-5" id="exampleModalLabel">Update Customer</h1><button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body"><form action="/customers/update-customer/${customer.id}" method="post"><div class="mb-2"><label class="form-label" for="name">Name</label><input class="form-control" type="text" id="name" name="name" value="${customer.name}"></div><div class="mb-2"><label class="form-label" for="phone">Phone</label><input class="form-control" type="text" id="phone" name="phone" value="${customer.phone}"></div><div class="mb-3"><label class="form-label" for="address">Address</label><input class="form-control" type="text" id="address" name="address" value="${customer.address}"></div><button class="btn btn-success form-control mt-2" type="submit">Update</button></form></div></div></div></div></td>`;


            html += `<tr>${tdNo}${tdCreatedAt}${tdCustomerId}${tdName}${tdPhone}${tdAction}</tr>`;
        });

        dataCustomers.innerHTML = html;
    }catch (e){
        alert('Terjadi error cuy');
    }
})