// whole-script strict mode syntax
// JavaScript is very flexible (자바스크립트는 되게 유연하다)
// flexible === dangerous (유연함은 위험할 수 있다.)
// added ECMAScript 5
'use strict';

console.log("Hello World!");


//const dream = document.querySelector('div[data-ht-wow="home"]');
//console.log(dream.dataset);

// 브라우저 -> 검사 -> console 에 보면
// data-ht-wow --> htWow
// 처럼 변화되었는데,
// 이처럼 'data-변수' 가  위 처럼 변한 것을
// camelCase 화가 되었다. 라고 한다.


// 01. Make navbar transparent when it is on the top
// google search : javascript scroll position
// google search : javascript element size
const navbar = document.querySelector('#navbar');
const navbarHeight = navbar.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
    //console.log(window.scrollY);
    //console.log(`navbarHeight: ${navbarHeight}`); /* (`) 백틱사용 */
    if(window.scrollY > navbarHeight)
    {
        navbar.classList.add('navbar--dark'); /* navbar에 class 추가 */
    }
    else
    {
        navbar.classList.remove('navbar--dark'); /* navbar에 class 삭제 */
    }
});

// 02. Handle scrolling when tapping on the navber menu
const navbarMenu = document.querySelector('.navbar__menu');
navbarMenu.addEventListener('click', (event) => {
    const target = event.target;
    const link   = target.dataset.link;
    if (link == null) {
        return;
    }
    navbarMenu.classList.remove('open');
    console.log(event.target.dataset.link);
    scrollIntoView(link);
});

// 03. Navbar toggle button for small screen
const navbarToggleBtn = document.querySelector('.navbar__toggle-btn');
navbarToggleBtn.addEventListener('click', (event) => {
    navbarMenu.classList.toggle('open');
});

// 04. Handle click on "contact me" button on home
const homeContactBtn = document.querySelector('.home__contact');
homeContactBtn.addEventListener('click', (event) => {
    const target = event.target;
    const link   = target.dataset.link;
    console.log(link);
    scrollIntoView(link);
});

// 05. Make home slowly fade to transparent as the window scrolls down
const home = document. querySelector('.home__container');
const homeHeight = home.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
    home.style.opacity = 1 - window.scrollY / homeHeight;
});

// 06. Scroll "arrow up" button when scrolling down
const arrowUp = document.querySelector('.arrow-up');
document.addEventListener('scroll', () => {
    if(window.scrollY > homeHeight /2){
        arrowUp.classList.add('visible');
    }
    else {
        arrowUp.classList.remove('visible');
    }
});

// 07. handle click on the "arrow up" button
arrowUp.addEventListener('click', () => {
    scrollIntoView('#home');
});

// 08. projects
const workBtnContainer = document.querySelector('.work__categories');
const projectContainer = document.querySelector('.work__project');
const projects = document.querySelectorAll('.project');
workBtnContainer.addEventListener('click', (event) => {
    const filter = event.target.dataset.filter || event.target.parentNode.dataset.filter;
    if (filter == null) {
        return;
    }
    // ----- Remove selection from the previous item and select the new one
    const active = document.querySelector('.category__btn.selected');
    active.classList.remove('selected');
    const target = event.target.nodeName === 'BUTTON' ? event.target : event.target.parentNode;
    target.classList.add('selected');
    // -----

    projectContainer.classList.add('anim-out');
    setTimeout(() => {
        projects.forEach((project) => {
            if (filter === 'all' || filter === project.dataset.type) {
                project.classList.remove('invisible');
            }
            else {
                project.classList.add('invisible');
            }
        });    
        projectContainer.classList.remove('anim-out');
    }, 300);
});


// 1. 모든 섹션 요소들과 메뉴아이템들을 가지고 온다.
// 2. IntersectionObserver를 이용해서 모든 섹션들을 관찰한다.
// 3. 보여지는 섹션에 해당하는 메뉴 아이템을 활성화 시킨다.

const sectionIds = [
    '#home', 
    '#about', 
    '#skills', 
    '#work', 
    '#testimonials',
    '#contact'
];

const sections = sectionIds.map(id => document.querySelector(id));
const navItems = sectionIds.map(id => document.querySelector(`[data-link="${id}"]`));
// [] 를 이용하여 해당 속성의 element 를 가져올 수 있다.
// document.querySelector('[data-link="#home"]');
// document.querySelector('[class="home__container"]');

let selectedNavIndex = 0;
let selectedNavItem = navItems[0];
function selectNavItem(selected) {
    selectedNavItem.classList.remove('active');
    selectedNavItem = selected;
    selectedNavItem.classList.add('active');
}

function scrollIntoView(selector) {
    const scrollTo = document.querySelector(selector);
    scrollTo.scrollIntoView({behavior: 'smooth'});
    // element.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
    selectNavItem(navItems[sectionIds.indexOf(selector)]);
}

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.4,
};

const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        
        if (!entry.isIntersecting && entry.intersectionRatio > 0) {
        // entry.isIntersecting 는 threshold 만큼 들어오면 실행
        // !entry.isIntersecting 는 1 - threshold 만큼 나가면 실행
        // -> 70% viewport에서 나가면 true (원래는 30% viewport에 들어오면 true)
        // -> 이제 기준은 나간거에 초점을 맞추어 이벤트가 실행된다.
        // viewport가 위쪽으로 빠지면(나가면) Y 좌표는 - 를 반환하고,
        // viewport가 아래쪽으로 빠지면(나가면) Y 좌표는 + 를 반환한다.
        // 즉, 위쪽으로 빠지면 BoundingClientRect.y 의 값은 -,
        // 아래쪽으로 빠지면 BoundingClientRect.y 의 값은 + 이다.
        // 정리 : 1 - 들어오는 기준인지, 나가는 기준인지
        //        2 - 위쪽에서 들어오는지, 위쪽으로 나가는지 / 아래쪽에서 들어오는지, 아래쪽으로 나가는지

        // entry.intersectionRatio 는 처음 화면이 로딩이 될 때, viewprot에 보여지는 화면을
        // 0 ~ 1 까지의 수치로 나타내는 속성이다. (1 - 전부 보여짐, 0 - 보이지 않음)

            const index = sectionIds.indexOf(`#${entry.target.id}`);

            // 스크롤링이 아래로 되어서 페이지가 올라옴
            if (entry.boundingClientRect.y < 0) {
                // 빠진 해당 인덱스에서 다음 인덱스 선택
                selectedNavIndex = index + 1;
            }
            else {
                // 빠진 해당 인덱스에서 이전 인덱스 선택
                selectedNavIndex = index - 1;
            }
        }
    });
};

// Intersection Observer API
const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach(section => observer.observe(section));

window.addEventListener('wheel', () => {
    if(window.scrollY === 0) {
        selectedNavIndex = 0;
    }
    else if (window.scrollY + window.innerHeight === document.body.clientHeight) {
        selectedNavIndex = navItems.length - 1;
    }
    selectNavItem(navItems[selectedNavIndex]);
});
// scroll : 스크롤이 움직이면 이벤트를 발생하는 이벤트
// wheel  : 사용자가 마우스 휠로 직접 스크롤을 움직이면 발생하는 이벤트