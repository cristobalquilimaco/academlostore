async function getMerchadise() {
    try {
      const store = await fetch("https://ecommercebackend.fundamentos-29.repl.co/");
      const res = await store.json();
      window.localStorage.setItem("articles", JSON.stringify(res));
      return res;
    } catch (error) {
      console.log(error);
    }
  }
  
  function printArticles(articles) {
    const articlesHTML = document.querySelector(".articles");
    let html = "";
  
    for (const article of articles) {
      const articleSoldOut = article.quantity ? `<i class='bx bx-plus' id="${article.id}"></i>` : "<span class='soldOut'>Sold out</span>";
  
      html += `
        <div class="article">
          <div class="articlePic">
            <img class="image-move" src="${article.image}" alt="sweter" />
          </div>
          <div class="articleInfo">
            <p>${article.name} / <span><b>Stock</b>: ${article.quantity}</span></p>
            <p>$${article.price}.00 ${articleSoldOut}</p>
          </div>
        </div>
      `;
    }
  
    articlesHTML.innerHTML = html;
  }
  
  function showBagMove() {
    const iconShoppingBags = document.querySelector(".bx-shopping-bag");
    const bagHTML = document.querySelector(".bag");
    iconShoppingBags.addEventListener("click", function() {
      bagHTML.classList.toggle("bagShow");
    });
  }
  
  function addToCartArticles(store) {
    const articlesHTML = document.querySelector(".articles");
    articlesHTML.addEventListener("click", function(addArticles) {
      if (addArticles.target.classList.contains("bx-plus")) {
        const id = Number(addArticles.target.id);
        const articleFind = store.articles.find(article => article.id === id);
        if (store.cart[articleFind.id]) {
          if (articleFind.quantity === store.cart[articleFind.id].amount) {
            return alert("We don't have more products");
          }
          store.cart[articleFind.id].amount++;
        } else {
          store.cart[articleFind.id] = { ...articleFind, amount: 1 };
        }
        window.localStorage.setItem("cart", JSON.stringify(store.cart));
        printArticlesInCard(store);
        prinTotalArticles(store);
        totalAmountBuyProduct(store);
      }
    });
  }
  
  function printArticlesInCard(store) {
    const cardArticles = document.querySelector(".bagArticles");
    let html = "";
    for (const article in store.cart) {
      const { quantity, price, name, image, id, amount } = store.cart[article];
      html += `
        <div class="cardArticles">
          <div class="articleImg">
            <img src="${image}" alt"sweter"/>
          </div>
          <div class="cardBuyBody">
            <h4>${name} | $${price}.00</h4>
            <p>Stock: ${quantity}</p>
            <p>${"Subtotal:"} ${price * amount}.00</p>
            <div class="cardArticlesBodyOp" id="${id}">
              <i class='bx bx-minus'></i>
              <span>${amount} unit</span>
              <i class='bx bx-plus-circle'></i>
              <i class='bx bx-trash'></i>
            </div>
          </div>
        </div>
      `;
    }
    cardArticles.innerHTML = html;
  }
  
  function handleArticlesIncart (store){
    const bagArticles = document.querySelector(".bagArticles")

    bagArticles.addEventListener("click", function(select) {
                if(select.target.classList.contains("bx-plus-circle")){
                    const id = Number(select.target.parentElement.id);

                    const articleFind = store.articles.find(
                        (article) => article.id === id 
                    );
        
                        if (articleFind.quantity === store.cart[articleFind.id].amount) 
                        return alert("We have no more products"); 

                    store.cart[id].amount++;
                }
                if(select.target.classList.contains("bx-minus")){
                    const id = Number(select.target.parentElement.id);
                    if (store.cart[id].amount === 1){
                        const response = confirm("Are you sure you want to remove this product")
                        if (!response) return;

                        delete store.cart[id];
                    } else {

                    store.cart[id].amount--;
                    }
                }
                if(select.target.classList.contains("bx-trash")){
                    const id = Number(select.target.parentElement.id);
                    const response = confirm("Are you sure you want to remove this product")
                    if (!response) return;
                    
                    delete store.cart[id];
                }

                window.localStorage.setItem("cart", JSON.stringify(store.cart))
                printArticlesInCard(store)
                prinTotalArticles(store);
                totalAmountBuyProduct(store);
    });
}
  function prinTotalArticles(store) {
    const infoTotalArticles = document.querySelector(".infoTotalArticles");
    const infoTotalAmount = document.querySelector(".infoTotalAmount");
    let totalArticles = 0;
    let totalAmount = 0;
    for (const article in store.cart) {
      const { amount, price } = store.cart[article];
      totalAmount += price * amount;
      totalArticles += store.cart[article].amount;
    }
    infoTotalArticles.textContent = totalArticles + " units";
    infoTotalAmount.textContent = "$" + totalAmount + ".00";
  }
  
  function totalBuy(store) {
    const btnBuy = document.querySelector(".btnBuy");
    btnBuy.addEventListener("click", function() {
      if (!Object.values(store.cart).length) return alert("No tienes productos en el carrito");
      const response = confirm("¿Seguro que quieres comprar?");
      if (!response) return;
      const currentArticles = [];
      for (const article of store.articles) {
        const articleCart = store.cart[article.id];
        if (article.id === articleCart?.id) {
          currentArticles.push({
            ...article,
            quantity: article.quantity - articleCart.amount,
          });
        } else {
          currentArticles.push(article);
        }
      }
      store.articles = currentArticles;
      store.cart = {};
      window.localStorage.setItem("articles", JSON.stringify(store.articles));
      window.localStorage.setItem("cart", JSON.stringify(store.cart));
      prinTotalArticles(store);
      printArticlesInCard(store);
      printArticles(store);
      totalAmountBuyProduct(store);
    });
  }
  
  function totalAmountBuyProduct(store) {
    const amountArticles = document.querySelector(".amountArticles");
    let amount = 0;
    for (const article in store.cart) {
      amount += store.cart[article].amount;
    }
    amountArticles.textContent = amount;
  }
  
  function handleNavbar() {
    const iconMenu = document.querySelector(".bxs-dashboard");
    const menu = document.querySelector(".menuDisplay");
    iconMenu.addEventListener("click", function() {
      menu.classList.toggle("menuDisplayShow");
    });
  }
  
  function transitionNavbar() {
    const navbar = document.querySelector(".navBarMenu");
    window.addEventListener("scroll", function() {
      if (window.scrollY > 250) {
        navbar.classList.add("navBar__Active");
      } else {
        navbar.classList.remove("navBar__Active");
      }
    });
  }
  
  function filterProducts(filter, articles) {
    if (filter === "Show all") {
      return articles;
    } else if (filter === "Shirt") {
      return articles.filter(article => article.category === "shirt");
    } else if (filter === "Hoddie") {
      return articles.filter(article => article.category === "Hoddie");
    } else if (filter === "Sweater") {
      return articles.filter(article => article.category === "sweater");
    }
  }
  
  function handleFilter(store) {
    const filterButtons = document.querySelectorAll(".filterBtn");
    const articles = store.articles;
    filterButtons.forEach(button => {
      button.addEventListener("click", function() {
        const filter = button.dataset.filter;
        const filteredArticles = filterProducts(filter, articles);
        printArticles(filteredArticles);
        addToCartArticles(store);
      });
    });
  }
  
  async function init() {
    const store = await getMerchadise();
    const cartStorage = window.localStorage.getItem("cart");
    store.cart = cartStorage ? JSON.parse(cartStorage) : {};
    const articlesStorage = window.localStorage.getItem("articles");
    store.articles = articlesStorage ? JSON.parse(articlesStorage) : [];
    printArticles(store.articles);
    printArticlesInCard(store);
    showBagMove();
    addToCartArticles(store);
    handleArticlesIncart(store);
    prinTotalArticles(store);
    totalBuy(store);
    totalAmountBuyProduct(store);
    handleNavbar();
    transitionNavbar();
    handleFilter(store);
  }
  
  init();