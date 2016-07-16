function getPosition(windowWidth, margin, matrixLength, width, height, gutter) {
    let position = {x: 0, y: height};
    let maxCol = Math.floor((windowWidth * 0.50) / width);

    for (let m = 0; m < matrixLength + 1; m++) {
        if(m == 0) {
            position.x = margin;
        } else if(m % maxCol !== 0) {
            position.x += width + gutter;
        } else {
            position.x = margin;
            position.y += height + gutter;
        }
    }

    return position;
}

function getSize(windowWidth, twitteWidth, twitteHeight) {
    let size = {width: 0, height: 0};
    let ratio = twitteWidth / twitteHeight;

    size.width = windowWidth * 0.6 / 10;
    size.height = size.width / ratio;

    return size
}

export { getSize, getPosition };

