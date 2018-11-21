/*
ES6 Virtual List in Vanilla Javascript based on Sergi Mansilla version
https://sergimansilla.com/blog/virtual-scrolling/
*/

class VirtualList {
  createScroller() {
    this.scroller = this.container.querySelector('[data-virtual-list-scroller]');
    this.scroller.style.position = 'absolute';
    this.scroller.style.height = `${this.totalHeight}px`;
  }

  renderChunk(fromPos, howMany) {
    const fragment = document.createDocumentFragment();
    let item,
      finalItem = fromPos + howMany;

    if (finalItem > this.totalRows) finalItem = this.totalRows;
    
    for (let i = fromPos; i < finalItem; i += 1) {
      item = this.items[i];
      fragment.appendChild(item);
    }

    this.scroller.innerHTML = '';
    this.scroller.appendChild(fragment);
  }

  onScroll(e) {
    /*
    const maxBuffer = this.screenItemsLen * this.itemHeight,
      { scrollTop } = e.target;
    let lastRepaintY,
      first = parseInt(scrollTop / this.itemHeight, 10) - this.screenItemsLen
    
    first = first < 0 ? 0 : first;
    
    if (!lastRepaintY || Math.abs(scrollTop - lastRepaintY) > maxBuffer) {
      this.renderChunk(first, this.cachedItemsLen);
      lastRepaintY = scrollTop;
    }
    */
    const { scrollTop } = e.target;
    let itemsAboveOfView = 0,
      itemsToView = 0,
      pixelsAboveofView = 0,
      pixelFitsInsideContainer = 0,
      indexFirstItemToPrint;

    for (let i = 0; i <= this.itemsHeight.length ; i++) {
      if (pixelsAboveofView < scrollTop) {
        itemsAboveOfView++;
      } else {
        itemsToView++;
        pixelFitsInsideContainer += this.itemsHeight[i];
        if (pixelFitsInsideContainer > this.container.clientHeight) {
          break;
        }
      }
      pixelsAboveofView += this.itemsHeight[i];
    }

    indexFirstItemToPrint = itemsAboveOfView -1 - 5; //5 value will be set 
    indexFirstItemToPrint = indexFirstItemToPrint < 0 ? 0 : indexFirstItemToPrint;
    itemsToView = itemsToView + 10; //10 value will be set

    this.renderChunk(indexFirstItemToPrint, itemsToView);

    console.log('==============================================');
    console.log('itemsAboveOfView', itemsAboveOfView);
    console.log('indexFirstItemToPrint', indexFirstItemToPrint);
    console.log('indexFirstItemToPrint', indexFirstItemToPrint);
    console.log('itemsToView', itemsToView);
    console.log('pixelFitsInsideContainer', pixelFitsInsideContainer);

    e.preventDefault();
  }

  constructor(container) {
    this.container = container;

    const list = this.container.querySelectorAll('li'),
      itemsHeight = [];
    let totalHeight = 0,
      top = 0;

    list.forEach((item) => {
      totalHeight += item.clientHeight;
      item.style.top = `${top}px`;
      top += parseInt(item.clientHeight);
      itemsHeight.push( item.clientHeight);
    });
    this.totalHeight = totalHeight;
    this.items = list;
    this.itemsHeight = itemsHeight;

    this.totalRows = this.items && this.items.length;
    this.itemHeight = this.container.querySelector('li').clientHeight;
    this.createScroller();
    
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
