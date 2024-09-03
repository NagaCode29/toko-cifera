const dateAll = document.querySelectorAll('.date')

dateAll.forEach(date => {
    const created_at = date.innerText
    date.innerText = moment(created_at).format('DD/MM/YYYY')
});

const dataProducts = document.getElementById('data-products');

const keyword = document.getElementById('keyword');

keyword.addEventListener('keyup',async function (){
    try {
        const response = await fetch('/products/search/query?keyword='+ this.value);
        const data = await response.json();

        let html = '';
        let no = 0;

        data.forEach(product => {
            no += 1;
            const tdNo = `<td scope="row">${no}</td>`
            const tdCreatedAt = `<td>${moment(product.created_at).format('DD/MM/YYYY')}</td>`
            const tdProductId = `<td>${product.id}</td>`
            const tdName = `<td>${product.name}</td>`
            const tdStock = `<td>${product.stock}</td>`

            const tdAction = `<td><button class="btn btn-outline-success btn-sm mx-1" type="button" data-bs-toggle="modal" data-bs-target="#modalUpdateProduct${product.id}">update</button><button class="btn btn-outline-danger btn-sm mx-1" type="button" data-bs-toggle="modal" data-bs-target="#modal${product.id}">Delete</button><!-- Modal Delete--><div class="modal fade" id="modal${product.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h1 class="modal-title fs-5" id="exampleModalLabel">Confirmation</h1><button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body"><h3>Sure??</h3></div><div class="modal-footer"><button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Close</button><a class="btn btn-outline-danger" href="/products/delete-product/${product.id}">delete</a></div></div></div></div><!-- Modal update--><div class="modal fade text-dark" id="modalUpdateProduct${product.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h1 class="modal-title fs-5" id="exampleModalLabel">Update Product</h1><button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body"><form action="/products/update-product/${product.id}" method="post"><div class="mb-2"><label class="form-label" for="id">Code</label><input class="form-control" type="text" id="id" name="id" value="${product.id}"></div><div class="mb-2"><label class="form-label" for="name">Name</label><input class="form-control" type="text" id="name" name="name" value="${product.name}"></div><div class="mb-2"><label class="form-label" for="stock">Stock</label><input class="form-control" type="number" id="stock" name="stock" value="${product.stock}"></div><button class="btn btn-success form-control mt-2" type="submit">Update</button></form></div></div></div></div></td>`

            html += `<tr>${tdNo}${tdCreatedAt}${tdProductId}${tdName}${tdStock}${tdAction}</tr>`;
        })

        dataProducts.innerHTML = html;

        }catch (e){
        console.log(e.message);
        // alert('Terjadi error');
    }
})