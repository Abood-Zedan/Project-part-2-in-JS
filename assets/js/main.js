const getCategories =async ()=> {
    const {data} = await axios.get('https://dummyjson.com/products/category-list');
    
    return data;
}
const loder = document.querySelector('.loder-container');
loder.classList.add('active');

const displayCategories = async ()=> {
    try {
    const categories = await getCategories();
    const result = categories.map((category)=> {
        return `<div class="category">
            <h2>${category}</h2>
            <a href="categoryDetails.html?category=${category}">Details</a>
        </div>`
    }).join(' ');

    document.querySelector(".categories .row").innerHTML = result;
    }catch(error) {
        document.querySelector('.categories .row').innerHTML = '<p>Erroe loding categories</p>' ;
    }finally {
        loder.classList.remove('active');
    }
}

const getProducts = async (page)=> {
    const skip = (page - 1) * 30;
    const {data} = await axios.get(`https://dummyjson.com/products?limit=30&skip=${skip}`);
    
    return data;
}
const displayProducts = async (page = 1)=> {
    try {
    const data = await getProducts(page);
    const numberOfPages =Math.ceil(data.total/30);
    const result = data.products.map ((product)=> {
        return `<a href='productDeatils.html?product=${product.id}'><div class="product">
            <img src="${product.thumbnail}" alt="${product.description}" />
            <h3>${product.title}</h3>
            <span>${product.price} $</span>
        </div></a>`
    }).join(' ');

    document.querySelector('.products .row').innerHTML = result;

    let paginationLink = ``;
    if(page == 1){
        paginationLink = `<li class="page-item disabled"><button disabled class="page-link">&laquo;</button></li>`;
    }else {
        paginationLink = `<li class="page-item"><button onclick=displayProducts('${page-1}') class="page-link">&laquo;</button></li>`;
    }

    for(let i=1;i<=numberOfPages;i++){
        paginationLink += `<li class="page-item ${i == page?'active':''}"><button onclick=displayProducts('${i}') class="page-link">${i}</button></li>`
    }
    if(page == numberOfPages){
        paginationLink += `<li class="page-item disabled"><button disabled class="page-link">&raquo;</button></li>`;
    }else {
        paginationLink += `<li class="page-item"><button onclick=displayProducts('${parseInt(page)+1}') class="page-link">&raquo;</button></li>`;
    }
    document.querySelector('.pagination').innerHTML = paginationLink;

    }catch (error) {
        document.querySelector('.products.row').innerHTML = '<p>Error loding products</p>' ;
    }finally {
        loder.classList.remove('active');
    }
}

displayCategories();
displayProducts();

window.onscroll = ()=> {
    const nav = document.querySelector('.header');
    const categories = document.querySelector('.categories');

    if (window.scrollY > categories.offsetTop) {
        nav.classList.add('scrollNavbar');
    }else {
        nav.classList.remove('scrollNavbar');
    }
}