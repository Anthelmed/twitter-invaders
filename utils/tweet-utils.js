function getPosition(windowWidth, margin, matrixLength, width, height, gutter) {
    let position = {x: 0, y: 0};
    let maxCol = Math.round((windowWidth * 0.6) / width);

    if(matrixLength !== 0) {
        for (let m = 0; m < matrixLength; m++) {
            if(m % maxCol !== 0 ) {
                position.x += width + gutter;
            } else {
                position.x = margin;
                position.y += height + gutter;
            }
        }
    } else {
        position.x = margin;
    }

    return position;
}

function getSize(windowWidth, twitteWidth, twitteHeight) {
    let size = {width: 0, height: 0};
    let ratio = twitteWidth / twitteHeight;

    size.width = windowWidth * 0.6 / 10;
    size.height = size.width * ratio;

    return size
}

export { getSize, getPosition };

