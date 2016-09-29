var pinstrap = {
    lastColCount: 0,
    colSizes: ['xs', 'sm', 'md', 'lg'],
    itemStore: [],

    init: function (el) {
        console.log('init');
        this.container = $(el);
        if (!this.container.hasClass('clearfix')) {
            this.container.addClass('clearfix');
        }

        var pinstrapItems = this.container.find('.pinstrap-item');
        for (i = 0; i < pinstrapItems.length; i++) {
            var item = $(pinstrapItems[i]);
            this.itemStore.push(item);
            item.detach();
        }

        if (!this.container.is(":visible")) {
            this.container.show();
        }

        console.log(this.itemStore);

        this.handleResize();
    },

    handleResize: function () {
        console.log('handleResize');
        console.log(this);
        if (this.setupColumns() === true) {
            for (i = 0; i < this.itemStore.length; i++) {
                var item = this.itemStore[i];
                var height = 2147483647; // int maxvalue
                var col1;

                var columns = this.container.find('.pinstrap-column');
                for (j = 0; j < columns.length; j++) {
                    var col2 = $(columns[j]);
                    if (Math.min(height, col2.height()) < height) {
                        height = col2.height();
                        col1 = col2;
                    }
                }

                col1.append(item);
            }
        }
    },

    setupColumns: function () {
        var result = false;
        var colCount;
        if (Modernizr.mq('(max-width: 767px)')) {
            colCount = 1;
        } else if (Modernizr.mq('(max-width: 991px)')) {
            colCount = 2;
        } else if (Modernizr.mq('(max-width: 1199px)')) {
            colCount = 3;
        } else {
            colCount = 4;
        }
        if (colCount !== this.lastColCount) {
            var size = this.colSizes[colCount - 1];
            var gridCols = 12 / colCount;
            $('.pinstrap-column').remove();
            this.addColumns('col-' + size + '-' + gridCols, colCount);
            result = true;
        }
        console.log('setupColumns: ' + result);
        console.log('colCount: ' + colCount);
        return result;
    },

    addColumns: function (gridClass, count) {
        console.log('addColumns(' + gridClass + ', ' + count + ')');
        for (i = 0; i < count; i++) {
            this.container.append('<div class="pinstrap-column ' + gridClass + '"></div>');
        }
    }
};
