class SlidepushComponent {
  toggleSlidepush(event) {
    const slidepushList = document.getElementById(this.getAttribute('data-slidepush-id').concat('-list'));
    slidepushList.classList.toggle('hide');
    const overlay = document.getElementById(this.getAttribute('data-slidepush-id').concat('-overlay'));
    overlay.classList.toggle('active');
    event.stopPropagation();
  }

  init(fragment, id) {
    const close = fragment.getElementById(id.concat('-close'));
    close.addEventListener('click', this.toggleSlidepush);
    const dropdown = fragment.getElementById(id.concat('-dropdown'));
    dropdown.addEventListener('click', this.toggleSlidepush);
  }

  mocklist(list, id) {
    for (let i = 0; i < 30; i += 1) {
      const object = document.createElement('li');
      object.setAttribute('data-slidepush-id', id);
      object.appendChild(document.createTextNode(`Object${i}`));
      object.addEventListener('click', this.toggleSlidepush);
      list.appendChild(object);
    }
  }

  createStructure(fragment, id) {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    overlay.id = id.concat('-overlay');
    fragment.appendChild(overlay);

    const root = document.createElement('div');
    root.classList.add('slidepush');
    root.id = id;
    fragment.appendChild(root);

    const dropdown = document.createElement('div');
    dropdown.classList.add('dropdown');
    dropdown.id = id.concat('-dropdown');
    dropdown.setAttribute('data-slidepush-id', id);
    root.appendChild(dropdown);

    const close = document.createElement('div');
    close.appendChild(document.createTextNode('x'));
    close.classList.add('close');
    close.id = id.concat('-close');
    close.setAttribute('data-slidepush-id', id);
    dropdown.appendChild(close);

    const list = document.createElement('ul');
    list.classList.add('list');
    list.classList.add('hide');
    list.id = id.concat('-list');
    root.appendChild(list);

    this.mocklist(list, id);
  }

  constructor(parent) {
    const id = parent.getAttribute('data-slidepush-id');
    const fragment = document.createDocumentFragment();
    this.createStructure(fragment, id);
    this.init(fragment, id);
    parent.appendChild(fragment);
  }
}

/**
 * Test
 */
var openTriggers = document.querySelectorAll('[data-slide-push-trigger]');
const overlay = document.querySelector('.overlay');

openTriggers.forEach(function(trigger) {
  const targetId = trigger.getAttribute('data-slide-push-trigger');
  const target = document.querySelector(`[data-slide-push-target='${targetId}']`);
  target.classList.add('hide');
  

  trigger.addEventListener('click', () => {
    target.classList.remove('hide');
    overlay.classList.add('active');
  });
});

var closeTriggers = document.querySelectorAll('[data-slide-push-close]');
closeTriggers.forEach(function(trigger) {
  trigger.addEventListener('click', () => {
    const targetId = trigger.getAttribute('data-slide-push-close');
    const target = document.querySelector(`[data-slide-push-target='${targetId}']`);
    target.classList.add('hide');
    overlay.classList.remove('active');
  });
});

/**
 * -- Test
 */

let component = new SlidepushComponent(document.querySelector('.parent'));
