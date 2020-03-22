'use strict'

const productStyle = `
    <style>
    .product_box {
        width              : 200px;
        height             : 250px;
        margin             : 5px 10px;
        border             : 1px solid #000;
        box-shadow         : 3px 3px 10px rgb(23, 79, 124);
        background-size    : cover;
        background-repeat  : no-repeat;
        background-color   : #ccc;
        background-position: center;
        position           : relative;
    }
    
    .name_h2 {
        text-align : center;
        color      : #fff;
        text-shadow: 2px 2px 3px #000;
    }
    
    .name_h2>h2 {
        margin: 5px 0 0 0;
    }
    
    .price_bottom {
        width     : 100%;
        position  : absolute;
        bottom    : 5px;
        text-align: center;
    }
    
    .price_bottom span {
        font-size  : 24px;
        color      : #fff;
        text-shadow: 2px 2px 3px #000;
    }
    
    .add_product,
    .remove_product {
        width : 30px;
        height: 30px;
        margin: 0 5px 0 5px;
    }
    </style>
`;

//данные 
const allData = {
    dataProduct: [],
    product: '',
    headBasket: '',
    countPrice: 0,
    countQuantity: 0
};

let basket = []; //корзина


// const productAll = product + productStyle;
// const eShop = document.querySelector('.e_shop');
// eShop.innerHTML = productAll;

class View {
    constructor() {
        this.productStyle = productStyle
        this.product = allData.product;
    }

    //выводит на экран за ранее подготовленную верстку товаров и стили к ней
    showOnScreen(prod, style) {
        const prodAll = prod + style;
        const eShop = document.querySelector('.e_shop_js');
        eShop.innerHTML = prodAll;
        control.init();
    }

    //выводит корзину на экран при выборе товара
    showOnHeader() {
        const header = document.querySelector('.head_js');
        header.innerHTML = allData.headBasket;
    }

    //формирует верстку корзины в теге header
    joinBasket() {
        let dataBasket = `
            <div>
                <h2>Ваши покупки</h2>
                <div>Количество товара: ${allData.countQuantity} шт.</div>
                <div>Выбранно на сумму: ${allData.countPrice} руб.</div>
                <button>Посмотреть покупки</button>
            </div>
        `;
        allData.headBasket = dataBasket;
        this.showOnHeader();
    }


    //формирует верстку товаров в теге main
    joinProduct(data) {
        for (let i = 0; i < data.length; i++) {
            allData.product = allData.product + `
            <div class="product_box" style="background-image: url(${data[i].urlImage});">
                <div class="name_h2">
                    <h2> ${data[i].name} </h2>    
                </div>
                <div class="price_bottom">
                    <button class="add_product" data-id=${data[i].id}>+</button>
                    <span>${data[i].price}</span>        
                    <button class="remove_product" data-id=${data[i].id}>-</button>
                </div>
            </div>
            `;
        }

        this.showOnScreen(allData.product, this.productStyle); //вывод на экран

    }

}

class Control {
    constructor() {

    }

    getClickAdd() {
        let btnAdd = document.querySelectorAll('.price_bottom');
        btnAdd.forEach(function (btn) {
            btn.addEventListener('click', function (event) {
                let whatBtn = event.srcElement.dataset.id;//определение id продукта
                let btnClick = event.target.className;// определение нажатой кнопки

                control.putBacket(whatBtn, btnClick);
            });
        });
    }

    //меняем количество выбранног, удаленного товара из корзины
    putBacket(id, btn) {
        id = +id;
        if (btn === 'add_product') {
            this.addBasket(id);
        } else if (btn === 'remove_product') {
            this.removeBasket(id);
        }
        console.log(basket);
        this.countProduct();

    }

    //уменьшаем количество выбранного продукта
    removeBasket(id) {
        if (basket[id].quantity > 0) {
            --basket[id].quantity;
        }
    }

    // увеличиваем количество выбранного продукта
    addBasket(id) {
        ++basket[id].quantity;
    }

    //создаем пустую корзину
    createBasket() {
        for (let i = 0; i < model.data.length; i++) {

            let dataBasket = { id: i, name: model.data[i].name, urlImage: model.data[i].urlImage, price: model.data[i].price, quantity: 0 };

            basket[i] = dataBasket;
        }
    }

    //подсчет количества выбранного товара и стоимости для корзины
    countProduct() {
        allData.countQuantity = 0;
        allData.countPrice = 0;
        for (let i = 0; i < basket.length; i++) {
            allData.countQuantity = allData.countQuantity + basket[i].quantity;
            allData.countPrice = allData.countPrice + basket[i].quantity * basket[i].price;
        }
        view.joinBasket();
    }

    init() {
        this.createBasket();
        this.getClickAdd();
    }
}

class Model {
    constructor() {
        this.data = [];
    }

    //запрос данных из JSON
    async _requestProduct() {
        const urlServer = "../server/eshop.json";

        let response = await fetch(urlServer);
        let jsonData = await response.json();

        this.data = jsonData;
        allData.dataProduct = this.data;
        console.log(this.data);

        view.joinProduct(this.data);


    }

    init() {
        this._requestProduct();
    }
}

const model = new Model();
const view = new View();
const control = new Control();

model.init();
control.init();

