const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:8000/', { waitUntil: 'networkidle' });
  const info = await page.evaluate(() => {
    const slider = document.getElementById('testimonialSlider');
    const track = slider.querySelector('.rc-testimonial-slider__track');
    const slides = slider.querySelectorAll('.rc-testimonial-slider__slide');
    const sliderRect = slider.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();
    const cs = window.getComputedStyle(slider);
    const tcs = window.getComputedStyle(track);
    return {
      sliderW: sliderRect.width,
      trackW: trackRect.width,
      sliderOverflow: cs.overflow,
      sliderOverflowX: cs.overflowX,
      trackWidth: tcs.width,
      slideCount: slides.length,
      slide0W: slides[0].getBoundingClientRect().width,
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
