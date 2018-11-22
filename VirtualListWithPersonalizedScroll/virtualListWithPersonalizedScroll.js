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

    indexFirstItemToPrint = itemsAboveOfView -1 - 3; //the value can be changed
    indexFirstItemToPrint = indexFirstItemToPrint < 0 ? 0 : indexFirstItemToPrint;
    itemsToView = itemsToView + 7; //the value can be changed

    this.renderChunk(indexFirstItemToPrint, itemsToView);

    e.preventDefault();
  }

  constructor(container) {
    this.container = container;

    this.items = this.container.querySelectorAll('li');
    const itemsHeight = [],
      containerLength = this.container.clientHeight;
    let totalHeight = 0,
      top = 0,
      itemsToView = 0,
      pixelFitsInsideContainer = 0;

    this.items.forEach((item) => {
      const height = item.clientHeight;
      item.style.top = `${top}px`;
      top += parseInt(height);
      totalHeight += height;
      itemsHeight.push(height);
      if (pixelFitsInsideContainer < containerLength) {
        itemsToView++;
        pixelFitsInsideContainer += height; 
      }
    });
    itemsToView += 7; //the value can be changed

    this.totalHeight = totalHeight;
    this.itemsHeight = itemsHeight;

    this.totalRows = this.items && this.items.length;
    this.createScroller();
    this.renderChunk(0, itemsToView);

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
