/*
ES6 Scrollbar for Trident/Edge and Gecko browser engine
Based on MouraScroll (@vmoura)
*/

class ScrollComponent {
  moveScroll() {
    // set the element's new position:
    if (this.actualPosition > 0 && this.actualPosition <= this.scrollSize) {
      this.thumb.style.top = `${this.actualPosition}px`;
      this.content.scrollTop = `${(this.actualPosition * this.visibleScreen) / -(this.scrollSize)}px`;
    } else if (this.actualPosition > this.scrollSize) {
      this.thumb.style.top = `${this.scrollSize}px`;
      this.content.scrollTop = `${(this.scrollSize * this.visibleScreen) / -(this.scrollSize)}px`;
    } else {
      this.thumb.style.top = 0;
      this.content.scrollTop = 0;
    }
  }

  toggleScrollBar() {
    setTimeout(() => {
      if (this.content.scrollHeight > this.container.clientHeight) {
        this.track.classList.remove('hide');
      } else {
        this.track.classList.add('hide');
        this.thumb.style.top = 0;
        this.content.style.top = 0;
      }
    }, 200);
  }

  constructor(parent) {
    this.isWebkit = navigator.userAgent.toLowerCase().indexOf('webkit') > -1;
    this.scrollTarget = parent.querySelector('[data-scroll-target]');
    this.pos1 = 0;
    this.pos2 = 0;
    this.scrollPosition = 0;

    if (this.isWebkit) {
      this.scrollTarget.classList.add('webkit-supported');
    } else {
      const elm = this.scrollTarget.firstElementChild;
      elm.style.overflow = 'hidden';

      this.container = document.createElement('div');
      this.container.setAttribute('class', 'scroll-container');
      this.container.setAttribute('data-scroll-container', '');

      this.content = document.createElement('div');
      this.content.setAttribute('class', 'scroll-content');
      this.content.setAttribute('data-scroll-content', '');

      this.track = document.createElement('div');
      this.track.setAttribute('class', 'scrollbar-track');
      this.track.setAttribute('data-scroll-track', '');

      this.thumb = document.createElement('div');
      this.thumb.setAttribute('class', 'scrollbar-thumb');
      this.thumb.setAttribute('data-scroll-thumb', '');

      this.container.appendChild(this.content);
      this.track.appendChild(this.thumb);
      this.container.appendChild(this.track);
      this.content.appendChild(elm);
      this.scrollTarget.appendChild(this.container);

      this.toggleScrollBar();

      const self = this;
      this.thumb.addEventListener('mousedown', (event) => {
        const e = event || window.event;
        e.stopPropagation();

        // get the mouse cursor position at startup:
        self.pos1 = e.clientY;

        document.onmouseup = () => {
          /* stop moving when mouse button is released: */
          document.onmouseup = null;
          document.onmousemove = null;
        };

        // call a function whenever the cursor moves:
        document.onmousemove = (mouseMove) => {
          const mouseEvent = mouseMove || window.event;
          // calculate the new cursor position:
          self.pos2 = self.pos1 - mouseEvent.clientY;
          self.pos1 = mouseEvent.clientY;
          self.actualPosition = (self.thumb.offsetTop - self.pos2);
          self.visibleScreen = self.content.scrollHeight - self.container.clientHeight;
          self.scrollSize = self.track.scrollHeight - self.thumb.scrollHeight;
          self.moveScroll();
        };
      });

      this.container.addEventListener('wheel', (e) => {
        self.scrollSize = self.track.scrollHeight - self.thumb.scrollHeight;
        self.actualPosition = self.scrollPosition;
        self.visibleScreen = self.content.scrollHeight - self.container.clientHeight;

        if (e.deltaY > 0) {
          self.scrollPosition += 15;
        } else {
          self.scrollPosition -= 15;
        }

        if (self.scrollPosition < 0) {
          self.scrollPosition = 0;
        } else if (self.scrollPosition > self.scrollSize) {
          self.scrollPosition = self.scrollSize;
        }
        self.thumb.style.top = `${self.scrollPosition}px`;
        self.moveScroll();
      });
      window.addEventListener('resize', self.toggleScrollBar);
    }
  }
}

const scroll = new ScrollComponent();
scroll.element = 1;
