function addRow(){
    alert('Hello Wolrd');
}

const productsQuantity = document.querySelectorAll('.quantity');
const productsPrice = document.querySelectorAll('.price');
const total = document.getElementById('total');


// In your Javascript (external .js resource or <script> tag)
$(document).ready(function() {
    $(`.js-example-basic-single`).select2();
});