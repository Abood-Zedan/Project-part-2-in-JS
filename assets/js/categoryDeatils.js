const getProducts = async () => {
    const params = new URLSearchParams(window.location.search).get('category');
    const { data } = await axios.get(`https://dummyjson.com/products/category/${params}`);
    return data;
}
const loder = document.querySelector('.loder-container');
loder.classList.add('active');
const displayProducts = async () => {
    try {
        const data = await getProducts();
        const result = data.products.map((product) => {
            return `<div class="product">
            <img src="${product.thumbnail}" alt="${product.description}" />
            <h3>${product.title}</h3>
            <span>${product.price} $</span>
        </div>`
        }).join(' ');
        document.querySelector('.products .row').innerHTML = result;
    }catch(error) {
        document.querySelector('.products .row').innerHTML = '<p>Error loding products</p>';
    }finally {
        loder.classList.remove('active');
    }
}
displayProducts();