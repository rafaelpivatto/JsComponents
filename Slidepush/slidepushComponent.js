class SlideComponent {
  
  registerOpenTriggers() {
    const overlay = this.overlay;
    this.openTriggers.forEach(function(trigger) {
      const targetId = trigger.getAttribute('data-slide-push-trigger');
      const target = document.querySelector(`[data-slide-push-target='${targetId}']`);
      target.classList.add('hide');
      
      trigger.addEventListener('click', () => {
        target.classList.remove('hide');
        overlay.classList.add('active');
      });
    });
  }

  registerCloseTriggers() {
    const overlay = this.overlay;
    this.closeTriggers.forEach(function(trigger) {
      trigger.addEventListener('click', () => {
        const targetId = trigger.getAttribute('data-slide-push-close');
        const target = document.querySelector(`[data-slide-push-target='${targetId}']`);
        target.classList.add('hide');
        overlay.classList.remove('active');
      });
    });
  }

  constructor() {
    this.openTriggers = document.querySelectorAll('[data-slide-push-trigger]');
    this.closeTriggers = document.querySelectorAll('[data-slide-push-close]');
    this.overlay = document.querySelector('.overlay');

    this.registerOpenTriggers();
    this.registerCloseTriggers();
  }
}

new SlideComponent();
