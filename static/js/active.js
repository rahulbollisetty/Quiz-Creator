let current = document.querySelector('.navbar-nav');
var links = document.querySelectorAll('.nav-item');
const loc = location.href;
console.log(loc);
current.querySelector('.active').classList.remove('active');
for (let i = 0; i < links.length; i++) {
    if (links[i].href === loc) {
        links[i].classList.add('active')
    }
}