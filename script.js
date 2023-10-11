'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');


///////////////////////////////////////
// Modal window

const openModal = function (e)
{
    e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));// now it's going to work on the modal window of open account and the open free account.

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e)
{
    if (e.key === 'Escape' && !modal.classList.contains('hidden'))
    {
        closeModal();
    }

});

//smooth scrolling

btnScrollTo.addEventListener('click', function (e) {
    const s1Coords = section1.getBoundingClientRect();
    console.log(s1Coords);
    console.log(e.target.getBoundingClientRect());//e.target is essentially the btnscrollto element here
    console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
    console.log('height/width viewport', document.documentElement.clientHeight, document.documentElement.clientWidth);

    //Scrolling
    // window.scrollTo(s1Coords.left + window.pageXOffset, s1Coords.top + window.pageYOffset);//current position plus the current scroll.

    // to implement smoooth behaior like this we need to specify an object with the left,top and behavior properties.

    /*old school way of doing the smooth scrolling
    window.scrollTo
        ({
            left: s1Coords.left + window.pageXOffset,//left property
            top: s1Coords.top + window.pageYOffset,//top
            behavior: 'smooth',//behavior is the property of smooth scrolling 

        });
    */
    //new way
    section1.scrollIntoView({ behavior: 'smooth' });// here on the scrollintoview method we specify an object which is the behavior again then select it as smooth.

});

//Page Navigation

/*this is not the right way to do it cause what if we have 1000's of elements then we would simply be copying the same code again and again that's why we need 
 event delegation.
document.querySelectorAll('.nav__link').forEach(function (el)// the query selector all will create a node list in here and from the list we will do a foreach loop to get the 
                                                            // each element from the node list
{
    el.addEventListener('click', function (e)// to each element we are now using the addeventlistener method
    {
        e.preventDefault();
        const id = this.getAttribute('href');// we used get attribute in here that to see everytime we click each links which section is that attribute is pointing to
        console.log(id);
        document.querySelector(id).scrollIntoView({ behavior: 'smooth' });



    });
});
*/

// In event delegation we need 2 steps.1.Add event listener to common parent element.2.in that event listener determine what element originated the event.

document.querySelector('.nav__links').addEventListener('click', function (e)
{
    e.preventDefault();

    //Matching strategy
    if (e.target.classList.contains('nav__link'))
    {
        e.preventDefault();
        const id = e.target.getAttribute('href');// here instead of this method we need to use e.target cause the this method only works on the current element.
        document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }


});

//Tabbed component


tabsContainer.addEventListener('click', function (e)
{
    const clicked = e.target.closest('.operations__tab');

    //Guard clause
    if (!clicked) return;// so we did this because suppose we clicked anywhere else other than the container tab it will ignore that immediately.

    //Remove active classes
    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    tabsContent.forEach(c => c.classList.remove('operations__content--active'));

     //Activate tab
    clicked.classList.add('operations__tab--active');

    //Activate content area

    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');

});

//Menu fade animation
// mouseenter doesn't bubble but mouseover does bubble

const handleOver = function (e)
{
    if (e.target.classList.contains('nav__link'))
    {
        const link = e.target;
        const siblings = link.closest('.nav').querySelectorAll('.nav__link');
        const logo = link.closest('.nav').querySelector('img');

        siblings.forEach(el => {
            if (el !== link) el.style.opacity = this;// cause the this keyword is now our opacity

        });

        logo.style.opacity = this;

    }

}

//passing"argument" into handler
nav.addEventListener('mouseover', handleOver.bind(0.5));// we used bind method to change the opacity of both function
nav.addEventListener('mouseout', handleOver.bind(1));

/*
//Sticky navigation
// scroll event is available on window not document

const initialCoords = section1.getBoundingClientRect();
window.addEventListener('scroll', function ()
{
    if (window.scrollY > initialCoords.top)
        nav.classList.add('sticky');
    else
        nav.classList.remove('sticky');

});
*/

//Sticky Navigation:Intersection observer API

/*
const obsCallBack = function (entries, observer)// so this callback function here will get called each time that the observed element or the target element which is section1
//in here is intersecting the root element here and the threshold that we defined.the entries here is actually an array of the threshold entries.
{
    entries.forEach(entry =>
    {

    });
};

const obsOption =//this options first needs a root property
{
    root: null,
    threshold: [0, 0.2],//so 0% percent here means that basically our callback will trigger each time that the target element moves completely out of the view and also as it
            // enters the view and so that's because the callback function will be called when the threshold is passed when moving into the view and moving out of the view


};

const observer = new IntersectionObserver(obsCallBack,obsOption);
observer.observe(section1);

*/


const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
//console.log(navHeight);
const stickyNav = function (entries)
{
    const [entry] = entries;
    //console.log(entry);
    if (!entry.isIntersecting)
        nav.classList.add('sticky');
    else
        nav.classList.remove('sticky');
    
}

const headerObserver = new IntersectionObserver(stickyNav,
    {
        root: null,
        threshold: 0,
        rootMargin: `-${navHeight}px`,//this root margin here for example 90 is a box of 90px will be applied outside of our target element.

    });
headerObserver.observe(header);


/*
//Reveal sections
const allSections = document.querySelectorAll('section');

const revealSection = function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');

    observer.unobserve(entry.target);// with this unobserve method if we scroll up it will not observe the page anymore.if we scroll down then it will observe.
}

const sectionObserver = new IntersectionObserver(revealSection,
    {
        root: null,
        threshold: 0.15,

    });

allSections.forEach(function (section) {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
});

*/

//Lazy Loading images
const imgTargets = document.querySelectorAll('img[data-src]');// so we select all the images which have the property of data src.

const loadImg = function (entries, observer)
{
    const [entry] = entries;
    if (!entry.isIntersecting) return;

    //Replace src with data src
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', function ()
    {
        entry.target.classList.remove('lazy-img');

    });

    observer.unobserve(entry.target); 

}

const imgObserver = new IntersectionObserver(loadImg,
    {
        root: null,
        threshold: 0,
        rootMargin: '-200px',

    });
imgTargets.forEach(img => imgObserver.observe(img));

//Slider

const slider = function ()
{

    const slides = document.querySelectorAll('.slide');
    const btnLeft = document.querySelector('.slider__btn--left');
    const btnRight = document.querySelector('.slider__btn--right');
    let curSlide = 0;
    const maxSlides = slides.length;
    const dotContainer = document.querySelector('.dots');

    const createDots = function () {
        slides.forEach((_, i) =>// we put the dash for throwaway variable cause we don't need that parameter but still we have to define something on that parameter.
        {
            dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide=${i}></button>`)// we put the before end cause we are adding it as the
            //last child always.


        });
    }

    const activateDots = function (slide)
    {
        document.querySelectorAll('.dots__dot').forEach
            (dot => dot.classList.remove('dots__dot--active'));

        document.querySelector(`.dots__dot[data-slide="${slide}"]`)
            .classList.add('dots__dot--active');

    };



    /*
    const slider = document.querySelector('.slider');
    slider.style.transform = 'scale(0.2)';
    slider.style.overflow = 'visible';
    */

    const goToSlide = function (slide) {

        slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i - slide)}%)`);//lets say we want the 1st slide to be -100%, then 0%,then 100%,then 200%, so how do
        //we do that? we multiple the whole thing by 100 then we take the current index and then we subtract to current slide.
        // so here what's gonna happen on this loop is the first index of the loop is 0, so 0 - 1=-1, and -1*100=-100,then the index is 1, so 1-1 is 0, then 0*100=0,
        //then index is going to be 2,2-1=1,then 1*100=100,then 3-1=2, 2*100=200.

    }


    const nextSlide = function ()// this one doesn't need any parameters because the goal of this is really just to export the functionality into it's own named function.
    {

        if (curSlide === maxSlides - 1)// here we need to stop the current slide because javascript doesn't know how many slides are in there if we dont stop then the 
        {                               //slide will keep go in.
            curSlide = 0;
        }
        else {
            curSlide++;// so start the curslide as 0 then when we go to the next page we simply increase that by 1.
        }

        goToSlide(curSlide);
        activateDots(curSlide);

    };

    const prevSlide = function () {
        if (curSlide === 0) {
            curSlide = maxSlides - 1;
        }
        else {
            curSlide--;

        }
        goToSlide(curSlide);
        activateDots(curSlide);
    }

    const init = function () {
        createDots();// we need to call the function to see the dots
        goToSlide(0);
        activateDots(0);

    };

    init();

    //Event handlers
    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', prevSlide);

    // sliding by keyboard
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') prevSlide();
        e.key === 'ArrowRight' && nextSlide();// also we could do this by short circuiting.


    });

    dotContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('dots__dot')) {
            const { slide } = e.target.dataset;
            goToSlide(slide);
            activateDots(slide);

        };

    });

};

slider();



/*




///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
/*
// selecting documents

console.log(document.documentElement);// we select the entire HTML documents by document.document element.
console.log(document.head);
console.log(document.body);

const header = document.querySelector('header');// this will return the first element that matches the header selector here.
const allSelctions = document.querySelectorAll('.section');// if we want to use multiple elements then we should use this.doc.queryselectorall()returns a node list.
console.log(allSelctions);

document.getElementById('section--1'); // here we only pass the id name itself without the selector.
const allButtons = document.getElementsByTagName('button');// this will show all the elements with the name of button.this method actually returns a html collection
                                                           // which different than a nodelist.because the html collection is actually a so called live collection.
                                                          // that means if the dom changes then this collection is immediately updated automatically.
console.log(allButtons);
console.log(document.getElementsByClassName('btn'));// this one also returns a live html collection.

// creating and inserting elements

//.insertAdjacentHtml// we used this method to create a movement

const message = document.createElement('div');// this will create a dom element.
message.classList.add('cookie-message');
//message.textContent = 'We used cookies for improved functionality and analytics';
message.innerHTML = 'We used cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
// we can use the prepend and append method not only to create the elements but also to move them.that is because the dom element is unique.here we prepend the cookie 
//message as the 1st child of the element also we moved the element by using the method of append to return the cookie message as a last child.
//header.prepend(message);// we created a whole new element to the HTML header.prepending method basically adds the elements as the 1st child of header element.
header.append(message);//we can also this as the last child of the header element.
//header.append(message.cloneNode(true));//by this clonenode method we can simply define that all the child elements will also be copied.
header.before(message);// this will now insert the message before the header element.
header.after(message);// this one here after the header element.

// delete the elements
document.querySelector('.btn--close-cookie').addEventListener('click', function () {
    // new method
    message.remove();//after we click the got it button it will remove the message by the remove method.
    //message.parentElement.removeChild(message);// old method
});

//styles, attributs and classes
// styles

/*

message.style.backgroundColor = '#37383d';// now the color of the cookir message will show into the screen in a nice way.we used css to change the color of the cookie-msg.
message.style.width = '125%';// now the width of the cookie message will be little bit wider than before.

console.log(getComputedStyle(message).color);//by this method we can simply see what's is the whole style for that cookie message.we can see the colors,background and all.
console.log(getComputedStyle(message).height);

message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';
document.documentElement.style.setProperty('--color-primary', 'orangered');// with this we can easily change the style of our page simply by setting one property.

// attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.className);

logo.alt = 'Beautiful minimalist logo';// it will change the bankist logo to whatever we wrote.

// Non-standard
console.log(logo.designer);
console.log(logo.getAttribute('designer'));// now with this getattribute method it will show the designer name by hwatever we put it manually in html file.
logo.setAttribute('company', 'Bankist');// this is the opposite of getattribute method.

console.log(logo.src);
console.log(logo.getAttribute('src'));

const link = document.querySelector('.twitter-link');
console.log(link.href);
console.log(link.getAttribute('href'));

const link2 = document.querySelector('.nav__link--btn');
console.log(link2.href);
console.log(link2.getAttribute('href'));

//Data attributes
//data attributes are special kind of attributes that starts with the word data
console.log(logo.dataset.versionNumber);// in here we use camel case on the number while in html we have the dash.
// just like property names we need to turn the html versionnumber form into camel case.

//classes
// we can add,remove,toggle,contains multiple classes by passing in multiple values
logo.classList.add('c','j');
logo.classList.remove('c','j');
logo.classList.toggle('c');
logo.classList.contains('c');

*/



/*

// types of events and event handlers

// so an event is basically a signal that is generated by a dom node.

// we can actually remove an eventhandler in case we don't need it anymore.

const h1 = document.querySelector('h1');
// here we using the mouseenter event

const alertH1 = function (e)
{
    alert('addEventListener:Great!You are reading the heading');// so this event will alert us with this pop up. everytime we hover on the body of the screen
   //h1.removeEventListener('mouseenter', alertH1);// removing the event listener.so in this eventlistener if we first hover on the screen it will show the alert 1st then
                                                  // it will remove the eventlistener.
}

h1.addEventListener('mouseenter', alertH1);// this event fires whenever a mouse enters certain element
// also we could remove the event handler after a certain amount of time

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

/*old school way
h1.onmouseenter = function (e)
{
    alert('onmouseenter:Great!You are reading the heading');
}


// event propagation in practice

//by default events can only be handled  in the target and in the bubbling phase.

//rgb(255,255,255)

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () => `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;


// addeventlistener in here is ony listening to the bubbling phhase not the capturing phase.
// the capturing phase is not that useful.
document.querySelector('.nav__link').addEventListener('click', function (e)
{
    this.style.backgroundColor = randomColor();// here the this keyword is pointing the dom element.
    //e.currenttarget is the element on which the event handler is attached.
    console.log('Link', e.target, e.currentTarget);//here e.target means that where the event exactly happened or where the click happened.

    // stop propagation
    //e.stopPropagation();// now the other two parent elements will not change their background color because we stopped the propagation.only the features modal will change.

});

document.querySelector('.nav__links').addEventListener('click', function (e)
{
    this.style.backgroundColor = randomColor();
    console.log('Container', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e)
{
    this.style.backgroundColor = randomColor();
    console.log('Nav', e.target, e.currentTarget);
});// by putting true in here the event handler will no longer listen to bubbling events but instead to capturing events.

*/


//Dom traversing: is basically walking to the dom

/*
const h1 = document.querySelector('h1');

// going downwards:child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'white';// we are basically chaning the color of the h1 (highlight)section
h1.lastElementChild.style.color = 'darkblue';

//going upwards:parents
console.log(h1.parentNode);
console.log(h1.parentElement);

// however we actually need a parent element which is not direct a parent or in other words we might need to find a parent element no matter how far away it is in the dom
// tree and for that we have the closest method.so let's say that on the page we had multiple headers so multiple elements with the class of headers.but for some reason
//we only wanted to find the one that is a parent element of h1.closes method recieves a query string just like query selector and query selector all.


h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'var(--gradient-primary)';


//going sideways:siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);

[...h1.parentElement.children].forEach(function (el)
{
    if (el !== h1) el.style.transform = 'scale(0.5)';

});

*/


// LifeCycle Dom events
//when we talk about the lifecycle we mean right from the moment that the page is 1st accessed until the user leaves it.

document.addEventListener('DOMContentLoaded', function (e)// dom content loaded event is fired by the document as soon as the html is completely parsed, which means
                                                          // that the html has been downloaded and be convert to the dom tree. 
{
    console.log('HTML parsed and Dom tree built!', e);

});

// next up there is also the loadevent,and the loadevent is fired by the window as son as not only the html parsed but also all the images and external resources like css
// files are also loaded.so basically complete has finished loading is when this even gets fired

window.addEventListener('load', function (e)
{
    console.log('page fully loaded', e);

});

//befor unload event also gets fires on window, and this event here is created immediately before a user is about to leave a page.

/*
window.addEventListener('beforeunload', function (e)
{
    e.preventDefault();
    console.log(e);
    e.returnValue = '';// so this will give up a pop up message if i want to close the tab.
});
*/




















