function getPosition(windowWidth, matrixLength, width, height, gutter) {
    let position = {x: 0, y: 0};
    let maxCol = Math.round(windowWidth / width);

    for (let m = 0; m < matrixLength; m++) {
        if(m % maxCol !== 0 || m == 0) {
            position.x += width + gutter;
        } else {
            position.x = 0;
            position.y += height + gutter;
        }
    }
    return position;
}

function getSize(windowWidth, twitteWidth, twitteHeight) {
    let size = {width: 0, height: 0};
    let ratio = twitteWidth / twitteHeight;

    size.width = windowWidth / 10;
    size.height = size.width * ratio;

    return size
}

export { getSize, getPosition };

