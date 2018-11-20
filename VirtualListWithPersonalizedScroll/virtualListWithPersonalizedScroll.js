/*
ES6 Virtual List in Vanilla Javascript based on Sergi Mansilla version
https://sergimansilla.com/blog/virtual-scrolling/
*/

class VirtualList {
  createScroller(totalHeight) {
    this.scroller = this.container.querySelector('[data-virtual-list-scroller]');
    this.scroller.classList.add('scroller');
    this.scroller.style.position = 'absolute';
    this.scroller.style.width = '1px';
    this.scroller.style.height = `${totalHeight}px`;
    this.scroller.innerHTML = '';
  }

  renderChunk(fromPos, howMany) {
    let item;
    const fragment = document.createDocumentFragment();

    let finalItem = fromPos + howMany;
    if (finalItem > this.totalRows) finalItem = this.totalRows;

    for (let i = fromPos; i < finalItem; i += 1) {
      item = this.items[i];
      item.classList.add('vrow'); // avaliar se necessário
      item.style.top = `${i * this.itemHeight}px`; //poderia remover em caso de não ser absolute?
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

  constructor(container) {
    this.container = container;

    //const list = [];
    //this.items = this.container.querySelectorAll('[data-virtual-list-element]');
    const list = this.container.querySelectorAll('[data-virtual-list-element]');

    /*
    let totalHeight = 0;
    list.forEach((item) => {
      totalHeight += item.clientHeight;
    });
    this.totalHeight = totalHeight;
    */
    this.items = list;

    this.totalRows = this.items && this.items.length;
    this.itemHeight = this.container.querySelector('[data-virtual-list-element]').clientHeight;
    this.createScroller(this.itemHeight * this.totalRows); //totalHeight
    
    this.screenItemsLen = Math.ceil(this.container.clientHeight / this.itemHeight) + 1 || 20; //qtos cabem na tela
    this.cachedItemsLen = this.screenItemsLen * 3; //qtos itens a serem carregados
    this.renderChunk(0, this.cachedItemsLen / 2);

    this.container.addEventListener('scroll', (e) => {
      this.onScroll(e);
    });
  }
}

document.querySelectorAll('[data-virtual-list-container]').forEach((container) => {
  //Virtual List init
  const virtualList = new VirtualList(container);
  
  //scroll personalized init
  const scrollTarget = container.querySelector('[data-scroll-target]');
  const simplebar = new SimpleBar(scrollTarget, { autoHide: false });
  simplebar.getScrollElement().addEventListener('scroll', (e) => virtualList.onScroll(e));
});
