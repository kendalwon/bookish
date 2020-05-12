let slide_index = 1;

//next/previous controls
const nextSlide = (n) => {  
  displaySlide(slide_index += n);  
}  

//thumbnail image controls
const currentSlide = (n) => {  
  displaySlide(slide_index = n);  
}  

const displaySlide = (n) => { 
  console.log('display change');
  const slides = document.querySelectorAll(".slide");
  const bars = document.querySelectorAll(".bar");
  if (n > slides.length) { 
    slide_index = 1; 
  } else if (n < 1) { 
    slide_index = slides.length;
  } else {
    slide_index = n;
  }
  slides.forEach((slide, index) => {
    if (index == (slide_index - 1)) {
      slide.classList.remove("hideSlide");
    } else {
      slide.classList.add("hideSlide");
    }  
  });
  bars.forEach((bar, index) => {
    if (index == (slide_index - 1)) {
      bar.classList.add("barActive");
    } else {
      bar.classList.remove("barActive");
    }  
  });
}