var confettiElement = document.getElementById('confetti-canvas');
var confettiSettings = {
   target: confettiElement,
   max: '200',
   size: '0.8',
   animate: true,
   props: [
      'circle',
      'square',
      'triangle',
      'line',
      {
         type: 'svg',
         src: '../images/confetti-spiral-1.svg',
         size: 35,
         weight: 0.2,
      },
      {
         type: 'svg',
         src: '../images/confetti-spiral-2.svg',
         size: 30,
         weight: 0.2,
      },
      {
         type: 'svg',
         src: '../images/confetti-spiral-3.svg',
         size: 30,
         weight: 0.2,
      },
   ],
   colors: [
      [112, 214, 249], // blue
      [243, 107, 38], // orange
      [192, 172, 126], // gold
      [239, 239, 239], // white
   ],
   clock: '25',
   rotate: true,
   width: '1366',
   height: '625',
   start_from_edge: false,
   respawn: true,
};
var confetti = new ConfettiGenerator(confettiSettings);
confetti.render();
