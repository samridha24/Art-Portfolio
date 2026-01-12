function resizeGalleryRows() {
  const rows = document.querySelectorAll('.collection1');
  
  rows.forEach(row => {
    const images = Array.from(row.querySelectorAll('img'));
    if (images.length === 0) return;

    Promise.all(images.map(img => {
      if (img.complete && img.naturalWidth > 0) {
        return Promise.resolve();
      }
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    })).then(() => {
      images.forEach(img => {
        img.style.height = '';
        img.style.width = '';
      });

      row.offsetHeight;

      const rowStyle = window.getComputedStyle(row);
      const rowPaddingLeft = parseFloat(rowStyle.paddingLeft);
      const rowPaddingRight = parseFloat(rowStyle.paddingRight);
      const gap = parseFloat(rowStyle.gap) || 10;

      const containerWidth = row.clientWidth - rowPaddingLeft - rowPaddingRight;
      
      const numImages = images.length;
      const totalGapWidth = gap * (numImages - 1);

      const imgStyle = window.getComputedStyle(images[0]);
      const imgPaddingLeft = parseFloat(imgStyle.paddingLeft);
      const imgPaddingRight = parseFloat(imgStyle.paddingRight);
      const imgBorderLeft = parseFloat(imgStyle.borderLeftWidth);
      const imgBorderRight = parseFloat(imgStyle.borderRightWidth);
      const imgExtra = imgPaddingLeft + imgPaddingRight + imgBorderLeft + imgBorderRight;
      const totalImageExtra = imgExtra * numImages;

      const availableWidth = containerWidth - totalGapWidth - totalImageExtra;

      const aspectRatios = images.map(img => {
        return img.naturalWidth / img.naturalHeight;
      });

      const sumAspectRatios = aspectRatios.reduce((sum, ratio) => sum + ratio, 0);

      const optimalHeight = (availableWidth / sumAspectRatios) + 0.5;
      
      images.forEach(img => {
        img.style.height = optimalHeight + 'px';
        img.style.width = 'auto';
        img.style.maxWidth = 'none';
        img.style.flexShrink = '0';
      });
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', resizeGalleryRows);
} else {
  resizeGalleryRows();
}

window.addEventListener('load', resizeGalleryRows);

let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(resizeGalleryRows, 100);
});
