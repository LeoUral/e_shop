'use strict'

const urlProduct = '../image/image.jpg';
const price = 1575;
const name = 'Лис';

const product = `
    <div class="product_box" style="background-image: url(${urlProduct});">
        <div class="name_h2">
            <h2> ${name} </h2>    
        </div>
        <div class="price_bottom">
            <button class="add_product">+</button>
            <span>${price}</span>        
            <button class="remove_product">-</button>
        </div>
    </div>
    `;

const productStyle = `
    <style>
    .product_box {
        width              : 200px;
        height             : 250px;
        border             : 1px solid #000;        
        background-size    : cover;
        background-repeat  : no-repeat;
        background-color   : #ccc;
        background-position: center;
        position           : relative;
    }
    
    .name_h2 {
        text-align: center;
    }
    
    .name_h2>h2 {
        margin: 5px 0 0 0;
    }
    
    .price_bottom {
        position: absolute;
        bottom  : 5px;
        left    : 35px;
    }
    
    .price_bottom span {
        font-size  : 24px;
        text-shadow: 3px 3px 3px#fff;
    }
    
    .add_product,
    .remove_product {
        width : 30px;
        height: 30px;
        margin: 0 5px 0 5px;
    }
    </style>
`;

const productAll = product + productStyle;
const eShop = document.querySelector('.e_shop');
eShop.innerHTML = productAll;