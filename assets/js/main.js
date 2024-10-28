const getCategories = async () => {
    const { data } = await axios.get('https://dummyjson.com/products/category-list');

    return data;
}
const loder = document.querySelector('.loder-container');
loder.classList.add('active');

const displayCategories = async () => {
    try {
        const categories = await getCategories();
        const result = categories.map((category) => {
            return `<div class="category">
            <h2>${category}</h2>
            <a href="categoryDetails.html?category=${category}">Details</a>
        </div>`
        }).join(' ');

        document.querySelector(".categories .row").innerHTML = result;
    } catch (error) {
        document.querySelector('.categories .row').innerHTML = '<p>Erroe loding categories</p>';
    } finally {
        loder.classList.remove('active');
    }
}

const getProducts = async (page) => {
    const skip = (page - 1) * 30;
    const { data } = await axios.get(`https://dummyjson.com/products?limit=30&skip=${skip}`);

    return data;
}
const displayProducts = async (page = 1) => {
    try {
        const data = await getProducts(page);
        const numberOfPages = Math.ceil(data.total / 30);
        const result = data.products.map((product) => {
            return `<div class="product">
            <img src="${product.thumbnail}" alt="${product.description}" class='images' />
            <h3>${product.title}</h3>
            <span>${product.price} $</span></div>`
        }).join(' ');

        document.querySelector('.products .row').innerHTML = result;

        let paginationLink = ``;
        if (page == 1) {
            paginationLink = `<li class="page-item disabled"><button disabled class="page-link">&laquo;</button></li>`;
        } else {
            paginationLink = `<li class="page-item"><button onclick=displayProducts('${page - 1}') class="page-link">&laquo;</button></li>`;
        }

        for (let i = 1; i <= numberOfPages; i++) {
            paginationLink += `<li class="page-item ${i == page ? 'active' : ''}"><button onclick=displayProducts('${i}') class="page-link">${i}</button></li>`
        }
        if (page == numberOfPages) {
            paginationLink += `<li class="page-item disabled"><button disabled class="page-link">&raquo;</button></li>`;
        } else {
            paginationLink += `<li class="page-item"><button onclick=displayProducts('${parseInt(page) + 1}') class="page-link">&raquo;</button></li>`;
        }
        document.querySelector('.pagination').innerHTML = paginationLink;

        modal();

    } catch (error) {
        document.querySelector('.products.row').innerHTML = '<p>Error loding products</p>';
    } finally {
        loder.classList.remove('active');
    }
}

displayCategories();
displayProducts();

window.onscroll = () => {
    const nav = document.querySelector('.header');
    const categories = document.querySelector('.categories');

    if (window.scrollY > categories.offsetTop) {
        nav.classList.add('scrollNavbar');
    } else {
        nav.classList.remove('scrollNavbar');
    }
}

function modal() {
    const modal = document.querySelector('.my-modal');
    const closeBut = document.querySelector('.close-but');
    const leftBut = document.querySelector('.left-but');
    const rightBut = document.querySelector('.right-but');
    const images = Array.from(document.querySelectorAll('.images'));
    let currentIndex = 0;

    images.forEach((img) => {
        img.addEventListener('click', function (e) {
            modal.classList.remove('d-none');
            modal.querySelector('img').setAttribute('src', e.target.src);
            currentIndex = images.indexOf(e.target);
        })
    })
    closeBut.addEventListener('click', function () {
        modal.classList.add('d-none');
    })
    leftBut.addEventListener('click', function () {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = images.length - 1;
        }
        const src = images[currentIndex].src;
        modal.querySelector('img').setAttribute('src', src);
    })
    rightBut.addEventListener('click', function () {
        currentIndex++;
        if (currentIndex >= images.length) {
            currentIndex = 0;
        }
        const src = images[currentIndex].src;
        modal.querySelector('img').setAttribute('src', src);
    })
    document.addEventListener('keydown', function (e) {
        console.log(e);
        if (e.code == 'ArrowLeft') {
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = images.length - 1;
            }
            const src = images[currentIndex].src;
            modal.querySelector('img').setAttribute('src', src);
        } else if (e.code == 'ArrowRight') {
            currentIndex++;
            if (currentIndex >= images.length) {
                currentIndex = 0;
            }
            const src = images[currentIndex].src;
            modal.querySelector('img').setAttribute('src', src);
        } else if (e.code == 'Escape') {
            modal.classList.add('d-none');
        }
    })
}