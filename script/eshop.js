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

const styleDop = `
    <style>
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
    blockBasket: '', //верстка блока корзины
    dopProduct: [],//дополнительные товары все
    basketDop: [],//корзина дополнительного товара    
    dopBlock: '',//верстка доп товара
    order: ''//верстка окончательного заказа
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
                <button class="btn_buy" onclick="control.clickBtnBuy();" >Оформить заказ</button>
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
        allData.blockBasket = allData.blockBasket + ` <button class="btn_buy" onclick="control.clickBtnBuy();">Оформить заказ</button> `
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

    //формирование предожения по доп товару
    runViewDopProduct() {
        allData.dopBlock = '';
        for (let i = 0; i < allData.dopProduct.length; i++) {
            this.joinPlaceOrder(allData.dopProduct[i].idDop, allData.dopProduct[i].dopName, allData.dopProduct[i].dopPrice);
        }
        allData.dopBlock = `
            <div class="block_dop">
            <h3>Предлагаем сопутствующие товары:</h3>
                <ul>
                    ${allData.dopBlock}
                </ul>
                <button onclick="control.placingOrder();">Продолжить</button>
            </div>
        `;
        this.showOnScreen(allData.dopBlock, styleDop);
        control.getClickDop();
    }

    //верстка доп товара, верстка <li>
    joinPlaceOrder(id, name, price) {
        allData.dopBlock = allData.dopBlock + `
            <li class="checkbox dop_btn">
                <input type="checkbox" class="check_${id}" id="${id}" value="${name}">
                    <label for="${id}">${name},  цена: 
                        <span class="price_dop_${id}">${price}</span> руб. 
                    </label>
                        <span id="btn_count_${id}"></span> 
            </li>
        `;
    }

    //добавляем кнопки в доп продукт при выборе
    joinAddDopButton(id) {
        let quantity = allData.basketDop[id].dopQuantity;
        const blockButton = `
            <button class="add_dop" data-id="${id}">+</button>
                <span id="dop_quantity_${id}">${quantity} </span> шт.
            <button class="remove_dop" data-id="${id}">-</button>
        `;

        let block = document.getElementById(`btn_count_${id}`);
        block.innerHTML = blockButton;
    }

    //удаляем кнопки из доп продукта при отказе.
    joinRemoveDopButton(id) {
        const blockNull = `<span>  </span>`;
        let block = document.getElementById(`btn_count_${id}`);
        console.log(`btn_count_${id}`);
        block.innerHTML = blockNull;
    }

    //меняем количество выбранного продукта в верстке
    replaceDopQuantity(id) {
        let dopQuantity = document.getElementById(`dop_quantity_${id}`);
        dopQuantity.innerHTML = allData.basketDop[id].dopQuantity;
    }

    //верстка окончательного заказа
    joinPlacingOrder() {
        allData.order = '';
        for (let i = 0; i < allData.basket.length; i++) {
            if (allData.basket[i].quantity > 0) {
                allData.order = allData.order + `<li><span>${allData.basket[i].name + ' (' + allData.basket[i].quantity + 'шт.), на сумму: ' + allData.basket[i].quantity * allData.basket[i].price + 'руб.'}</span></li>`;
            }
        }
        for (let i = 0; i < allData.basketDop.length; i++) {
            if (allData.basketDop[i].dopQuantity > 0) {
                allData.order = allData.order + `<li><span>${allData.basketDop[i].dopName + ' (' + allData.basketDop[i].dopQuantity + 'шт.), на сумму: ' + allData.basketDop[i].dopQuantity * allData.basketDop[i].dopPrice + 'руб.'}</span></li>`;
            }
        }
        allData.order = `<div>
                        <h1>Ваш заказ:</h1>
                        <ul>
                            ${allData.order}
                        </ul>
                        <span>ИТОГО на сумму: ${allData.countPrice} руб.</span>
                        <div>
                            <button>Доставка</button>
                            <button>Самовывоз</button>
                            <button>Оплатить сейчас</button>
                            <button>Оплатить при получении</button>
                        </div>
                    </div>`;
        const styleOrder = '<style></style>';

        this.showOnScreen(allData.order, styleOrder);//выводим в блок на экран
    }


}

class Control {
    constructor() {

    }
    // Оформляем весь заказ с допами в том числе
    placingOrder() {
        for (let i = 0; i < allData.basket.length; i++) {
            if (allData.basket[i].quantity > 0) {
                console.log(allData.basket[i].name + ' = ' + allData.basket[i].quantity + 'шт. на сумму: ' + allData.basket[i].quantity * allData.basket[i].price);
            }
        }
        for (let i = 0; i < allData.basketDop.length; i++) {
            if (allData.basketDop[i].dopQuantity > 0) {
                console.log(allData.basketDop[i].dopName + ' = ' + allData.basketDop[i].dopQuantity + 'шт. на сумму: ' + allData.basketDop[i].dopQuantity * allData.basketDop[i].dopPrice);
            }
        }
        view.joinPlacingOrder();
    }

    // отслеживает нажатие кнопок и чекбоксов в блоке - Доп товара, услуг
    getClickDop() {
        let btnDop = document.querySelectorAll('.dop_btn');
        btnDop.forEach(function (btn) {
            btn.addEventListener('click', function (event) {
                let btnId = event.srcElement.dataset.id; // idDop
                let idInput = event.target.id; // id тега input
                let btnClass = event.target.className; //Класс btnDop, cheked
                let btnChek = event.target.checked; // checked - true / false

                //добавляем кнопки при чеке
                if (btnChek) {
                    allData.basketDop[idInput].dopQuantity = 0;
                    allData.basketDop[idInput].checkedDop = true;
                    view.joinAddDopButton(idInput);
                }
                //убираем кнопки при чеке
                if (btnChek === false) {
                    view.joinRemoveDopButton(idInput);
                }

                if (btnClass === 'add_dop') control.addDopBasket(btnId);//функция добавляет количество покупок
                if (btnClass === 'remove_dop') control.removeDopBasket(btnId);//функция уменьшает количество покупок               
            })
        })
    }

    //добавляем одну шт доп товара
    addDopBasket(id) {
        ++allData.basketDop[id].dopQuantity;
        view.replaceDopQuantity(id);
        console.log(allData.basketDop[id].dopName + " = " + allData.basketDop[id].dopQuantity);
        control.countAddDopProduct(id); //добавляем стоимость и количество
    }

    //убираем одну шт доп товара
    removeDopBasket(id) {
        if (allData.basketDop[id].dopQuantity > 0) {
            --allData.basketDop[id].dopQuantity;
            control.countRemoveDopProduct(id);//вычитаем стоимость и количество
        }
        view.replaceDopQuantity(id);
        console.log(allData.basketDop[id].dopName + " = " + allData.basketDop[id].dopQuantity);
    }

    //создаем корзину доп товара
    burnDopBasket() {
        if (allData.basketDop.length !== 0) return;
        for (let i = 0; i < allData.dopProduct.length; i++) {
            let modulBlock = { idDop: allData.dopProduct[i].idDop, dopName: allData.dopProduct[i].dopName, dopPrice: allData.dopProduct[i].dopPrice, dopQuantity: 0, checkedDop: false };
            allData.basketDop[i] = modulBlock;
        }
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

    //click Оформить заказ
    clickBtnBuy() {
        this.burnDopBasket(); // создаем корзину доп товара
        view.runViewDopProduct();//верстка блока доп товара
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
    //добавляем ДОП товар в общий счетчик (количество, сумма) корзины
    countAddDopProduct(id) {
        allData.countQuantity = allData.countQuantity + 1;
        allData.countPrice = allData.countPrice + allData.basketDop[id].dopPrice;
        view.joinBasket();//верстка
    }
    //убираем ДОП товар в общий счетчик (количество, сумма) корзины
    countRemoveDopProduct(id) {
        allData.countQuantity = allData.countQuantity - 1;
        allData.countPrice = allData.countPrice - allData.basketDop[id].dopPrice;
        view.joinBasket();//верстка
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
        this.dataDop = [];
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

    async _requestDop() {
        const urlServerDop = '../server/dop.json';

        let response = await fetch(urlServerDop);
        let jsonDop = await response.json();

        this.dataDop = jsonDop;
        allData.dopProduct = this.dataDop;
    }

    init() {
        this._requestProduct();
        this._requestDop();
    }
}

const model = new Model();
const view = new View();
const control = new Control();

model.init();
control.init();
