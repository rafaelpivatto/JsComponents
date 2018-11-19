/*
ES6 Virtual List in Vanilla Javascript based on Sergi Mansilla version
https://sergimansilla.com/blog/virtual-scrolling/
*/

class VirtualList {
  createScroller(totalHeight) {
    this.scroller = this.parent.querySelector('[data-virtual-list-scroller]');
    this.scroller.classList.add('scroller');
    this.scroller.style.position = 'absolute';
    this.scroller.style.width = '1px';
    this.scroller.style.height = `${totalHeight}px`;
    this.scroller.innerHTML = '';
  }

  createContainer() {
    this.container = this.parent.querySelector('[data-virtual-list-container]');
    this.container.classList.add('virtualList');
  }

  renderChunk(fromPos, howMany) {
    let item;
    const fragment = document.createDocumentFragment();

    let finalItem = fromPos + howMany;
    if (finalItem > this.totalRows) finalItem = this.totalRows;

    for (let i = fromPos; i < finalItem; i += 1) {
      item = this.items[i];
      item.classList.add('vrow');
      item.style.top = `${i * this.itemHeight}px`;
      fragment.appendChild(item);
    }

    this.scroller.innerHTML = '';
    this.scroller.appendChild(fragment);
  }

  onScroll(e) {
    let lastRepaintY;
    const maxBuffer = this.screenItemsLen * this.itemHeight;
    const { scrollTop } = e.target;
    let first = parseInt(scrollTop / this.itemHeight, 10) - this.screenItemsLen;
    first = first < 0 ? 0 : first;
    if (!lastRepaintY || Math.abs(scrollTop - lastRepaintY) > maxBuffer) {
      this.renderChunk(first, this.cachedItemsLen);
      lastRepaintY = scrollTop;
    }
    e.preventDefault();
  }

  constructor(parent) {
    this.parent = parent;

    this.items = [];
    const list = this.parent.querySelectorAll('[data-virtual-list-element]');
    Array.prototype.forEach.call(list, (item) => {
      this.items.push(item);
    });

    this.totalRows = this.items && this.items.length;
    this.itemHeight = this.parent.querySelector('[data-virtual-list-element]').clientHeight;
    this.createScroller(this.itemHeight * this.totalRows);
    this.createContainer();

    this.screenItemsLen = Math.ceil(this.container.clientHeight / this.itemHeight) + 1 || 20;
    this.cachedItemsLen = this.screenItemsLen * 3;
    this.renderChunk(0, this.cachedItemsLen / 2);

    this.parent.style.overflow = 'hidden';

    this.container.addEventListener('scroll', (e) => {
      this.onScroll(e);
    });
  }
}

document.querySelectorAll('[data-virtual-list]').forEach((vlist) => {
  //new VirtualList(vlist);
  const virtualList = new VirtualList(vlist);
  const scrollTarget = vlist.querySelector('[data-scroll-target]');
  if(scrollTarget) {
    const simplebar = new SimpleBar(scrollTarget, { 
      autoHide: false 
    });
    simplebar.getScrollElement().addEventListener('scroll', function(e){
      //console.log('scroll', e);
      virtualList.onScroll(e);
    });
  }
});
