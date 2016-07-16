function getPosition(matrix, column, width, height, gutter) {
    let position = {x: 0, y: 0};

    for (let m = 0; m < matrix.length; m++) {
        if(m % (column-1) !== 0 || m == 0) {
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

    size.width = windowWidth / (column + 4);
    size.height = size.width * ratio;

    return size
}

export { getSize, getPosition };

