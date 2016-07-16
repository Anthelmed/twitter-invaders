function getPosition(matrixLength, column, width, height, gutter) {
    let position = {x: 0, y: 0};

    for (let m = 0; m < matrixLength; m++) {
        if((m + 1) % column !== 0 || m == 0) {
            position.x += width + gutter;
        } else {
            position.x = 0;
            position.y += height + gutter;
        }
    }
    return position;
}

function getSize(windowWidth, twitteWidth, twitteHeight, column) {
    let size = {width: 0, height: 0};
    let ratio = twitteWidth / twitteHeight;

    size.width = windowWidth / (column + 2);
    size.height = size.width * ratio;

    return size
}

export { getSize, getPosition };

