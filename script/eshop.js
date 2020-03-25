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
        box-sizing         : border-box;
    }
    
    .name_h2 {
        text-align : center;
        color      : #fff;
        text-shadow: 2px 2px 3px #000;
        box-sizing : border-box;
    }
    
    .name_h2>h2 {
        margin: 5px 0 0 0;
    }
    
    .price_botton {
        width     : 100%;
        position  : absolute;
        bottom    : 5px;
        text-align: center;
    }
    
    .price_botton span {
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

const styleBasket = `
    <style>
    .block_basket {
        width     : 100%;
        margin    : 5px 0 0 0;
        display   : flex;
        border    : 1px solid #000;
        box-sizing: border-box;
    }
    
    .basket_img {
        image-rendering    : auto;
        width              : 250px;
        height             : 300px;
        background-size    : cover;
        background-repeat  : no-repeat;
        background-color   : #ccc;
        background-position: center;
        box-sizing         : border-box;
    }
    
    .content_basket {
        width     : 80%;
        padding   : 20px;
        box-sizing: border-box;
    }
    </style>
`;

//данные 
const allData = {
    dataProduct: [], //массив продукта
    basket: [], //корзина
    product: '', // верстка продукта
    headBasket: '', //верстка корзиные в header
    countPrice: 0, // сумма покупки
    countQuantity: 0, //количество выбранного товара
    blockBasket: '' //верстка блока корзины
};




// const productAll = product + productStyle;
// const eShop = document.querySelector('.e_shop');
// eShop.innerHTML = productAll;

class View {
    constructor() {
        this.productStyle = productStyle
        this.product = allData.product;
        this.styleBasket = styleBasket;
    }

    //выводит на экран заранее подготовленную верстку товаров и стили к ней
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
                <button class="btn_basket">Посмотреть покупки</button>
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
                <div class="price_botton">
                    <button class="add_product" data-id=${data[i].id}>+</button>
                    <span>${data[i].price}</span>        
                    <button class="remove_product" data-id=${data[i].id}>-</button>
                </div>
            </div>
            `;
        }
        this.showOnScreen(allData.product, this.productStyle); //вывод на экран
    }

    //формируем верстку блока корзины
    runViewBasket() {
        allData.blockBasket = '';//сбрасываем старую верстку
        for (let i = 0; i < allData.basket.length; i++) {
            if (allData.basket[i].quantity > 0) {
                this.joinBlockBasket(allData.basket, i);//верстка выбранных товаров
            }
        }
        this.showOnScreen(allData.blockBasket, this.styleBasket);//вывод на экран       
        control.getClickAdd('.basket_botton');
    }

    //верстка корзины, добавляем продукт
    joinBlockBasket(data, i) {
        allData.blockBasket = allData.blockBasket + `
        <div class="block_basket">
            <div class="basket_img" style="background-image: url(${data[i].urlImage});">                
            </div>    
            <div class="content_basket">
                <h1> ${data[i].name} </h1>
                <div class="basket_botton">
                    <button class="add_product" data-id=${data[i].id}>+</button>
                    <span>${data[i].price}</span>        
                    <button class="remove_product" data-id=${data[i].id}>-</button>
                </div>
                <div class="quantity_basket" id="${data[i].id}" data-quantity=${data[i].id}>
                    Количество: ${data[i].quantity}
                </div>
            </div>
        </div>
        `;
    }

    //переписывает количество товара при вызове блока корзины
    joinBlockQuantity(id) {
        let quantity = document.getElementById(`${id}`);
        quantity.innerHTML = `Количество: ` + allData.basket[id].quantity;
    }


}

class Control {
    constructor() {

    }

    //смотрим нажатие кнопок + / -
    getClickAdd(classButton) {
        let btnAdd = document.querySelectorAll(classButton);//обертка в которой находятся кнопки + / -
        btnAdd.forEach(function (btn) {
            btn.addEventListener('click', function (event) {
                let whatBtn = event.srcElement.dataset.id;//определение id продукта
                let btnClick = event.target.className;// определение нажатой кнопки

                control.putBacket(whatBtn, btnClick);
                if (classButton === '.basket_botton') view.joinBlockQuantity(whatBtn);// только в блоке корзины
            });
        });
    }

    //нажатие просмотра покупок, выбор корзины
    getClickBasket() {
        let btnBascket = document.querySelector('.btn_basket');
        btnBascket.addEventListener('click', () => {
            view.runViewBasket()//рендерим блок корзины вместо блока товаров
        })
    }

    //меняем количество выбранного, удаленного товара из корзины
    putBacket(id, btn) {
        id = +id;
        if (btn === 'add_product') {
            this.addBasket(id);
        } else if (btn === 'remove_product') {
            this.removeBasket(id);
        }
        console.log(allData.basket);
        this.countProduct();
        this.getClickBasket();

    }

    //уменьшаем количество выбранного продукта
    removeBasket(id) {
        if (allData.basket[id].quantity > 0) {
            --allData.basket[id].quantity;
        }
    }

    // увеличиваем количество выбранного продукта
    addBasket(id) {
        ++allData.basket[id].quantity;
    }

    //создаем пустую корзину
    createBasket() {
        if (allData.basket.length !== 0) {
            return;
        }
        for (let i = 0; i < model.data.length; i++) {
            let dataBasket = { id: i, name: model.data[i].name, urlImage: model.data[i].urlImage, price: model.data[i].price, quantity: 0 };
            allData.basket[i] = dataBasket;
        }
    }

    //подсчет количества выбранного товара и стоимости для корзины
    countProduct() {
        allData.countQuantity = 0;
        allData.countPrice = 0;
        for (let i = 0; i < allData.basket.length; i++) {
            allData.countQuantity = allData.countQuantity + allData.basket[i].quantity;//количество
            allData.countPrice = allData.countPrice + allData.basket[i].quantity * allData.basket[i].price;//стоимость итого
        }

        view.joinBasket();//верстка
    }

    init() {
        this.createBasket();
        this.getClickAdd('.price_botton');
    }
}

class Model {
    constructor() {
        this.data = [];
    }

    //запрос данных из JSON файла
    async _requestProduct() {
        const urlServer = "../server/eshop.json";

        let response = await fetch(urlServer);
        let jsonData = await response.json();

        this.data = jsonData;
        allData.dataProduct = this.data;
        console.log(this.data);

        view.joinProduct(this.data);//верстка


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

