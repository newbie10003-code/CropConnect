import ScrollReveal from 'scrollreveal';
export const Animation = () => {
  const isMobile = window.innerWidth <= 800; 

  if (!isMobile) {
    const sr = ScrollReveal({
        distance: '60px',
        duration: 1500,
        delay: 40
      });
    
      sr.reveal('.odd', { delay: 20, origin: 'left' });
      sr.reveal('.even', { delay: 20, origin: 'right' });
      sr.reveal('.tp', { delay: 2, origin: 'top' });
      sr.reveal('.down', { delay: 10, origin: 'bottom' ,distance: '15px'});
    }

    };
  