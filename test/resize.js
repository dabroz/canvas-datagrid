import {
  mouseup,
  mousedown,
  mousemove,
  assertPxColor,
  g,
  smallData,
  c,
  doAssert,
  dblclick,
} from './util.js';

export default function () {
  it('Resize a column from a column header.', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
      style: {
        cellWidth: 50,
      },
    });
    grid.addEventListener('rendercell', function (e) {
      if (e.cell.columnIndex === 0) {
        e.ctx.fillStyle = c.b;
      }
    });
    grid.focus();
    mousemove(window, 94, 10, grid.canvas);
    mousedown(grid.canvas, 94, 10);
    mousemove(window, 190, 10, grid.canvas);
    mouseup(document.body, 190, 10, grid.canvas);
    setTimeout(function () {
      assertPxColor(grid, 100, 36, c.b, done);
    }, 10);
  });
  it('Resizes selected columns.', function () {
    var grid = g({
      test: this.test,
      data: smallData(),
      style: {
        cellWidth: 50,
      },
    });
    grid.focus();
    grid.selectColumn(0);
    grid.selectColumn(1, true);

    const columnSizes = Object.keys(grid.sizes.columns);
    doAssert(
      columnSizes.length === 1 && columnSizes[0] === '-1',
      'No column widths set',
    );

    mousemove(window, 94, 10, grid.canvas);
    mousedown(grid.canvas, 94, 10);
    mousemove(window, 190, 10, grid.canvas);
    mouseup(window, 190, 10, grid.canvas);

    doAssert(
      grid.sizes.columns[0] === grid.sizes.columns[1],
      'Columns have same width',
    );

    mousemove(window, 190, 10, grid.canvas);
    mousedown(grid.canvas, 190, 10);
    mousemove(window, 94, 10, grid.canvas);
    mouseup(window, 94, 10, grid.canvas);

    doAssert(
      grid.sizes.columns[0] === 50 && grid.sizes.columns[1] === 50,
      'Columns have been set back to original width',
    );
  });
  it('Resizes selected rows.', function () {
    var grid = g({
      test: this.test,
      data: smallData(),
      style: {
        cellHeight: 25,
      },
    });
    grid.focus();
    grid.selectRow(0);
    grid.selectRow(1, true);

    const rowSizes = Object.keys(grid.sizes.rows);
    doAssert(rowSizes.length === 0, 'No row heights set');

    mousemove(window, 10, 50, grid.canvas);
    mousedown(grid.canvas, 10, 50);
    mousemove(window, 10, 60, grid.canvas);
    mouseup(window, 10, 60, grid.canvas);

    doAssert(
      grid.sizes.rows[0] === grid.sizes.rows[1],
      'Rows have same height',
    );

    mousemove(window, 10, 60, grid.canvas);
    mousedown(grid.canvas, 10, 60);
    mousemove(window, 10, 50, grid.canvas);
    mouseup(window, 10, 50, grid.canvas);

    doAssert(
      grid.sizes.rows[0] === 25 && grid.sizes.rows[1] === 25,
      'Rows have been set back to original height',
    );
  });
  // Skipping: this test fails here, but when cannot reproduce in browser.
  // Does not seem to affect behavior, but leaving this here until we either
  // a) decide it's no longer a good test, b) find a better way to test, or
  // c) get more reports of something being broken.
  it.skip('Resizes row and column after the handle is dropped.', function () {
    var grid = g({
      test: this.test,
      data: smallData(),
      resizeAfterDragged: true,
      style: {
        cellHeight: 25,
        cellWidth: 50,
      },
    });
    grid.focus();

    const rowSizes = Object.keys(grid.sizes.rows);
    doAssert(rowSizes.length === 0, 'No row heights set');

    mousemove(window, 10, 50, grid.canvas);
    mousedown(grid.canvas, 10, 50);
    mousemove(window, 10, 60, grid.canvas);
    mouseup(window, 10, 60, grid.canvas);

    doAssert(grid.sizes.rows[0] === 35, 'The row height should be 35');

    mousemove(window, 10, 60, grid.canvas);
    mousedown(grid.canvas, 10, 60);
    mousemove(window, 10, 50, grid.canvas);
    mouseup(window, 10, 50, grid.canvas);

    doAssert(
      grid.sizes.rows[0] === 25,
      'The row height have been set back to the original',
    );

    mousemove(window, 94, 10, grid.canvas);
    mousedown(grid.canvas, 94, 10);
    mousemove(window, 190, 10, grid.canvas);
    mouseup(window, 190, 10, grid.canvas);

    doAssert(grid.sizes.columns[0] === 146, 'The column width should be 146');

    mousemove(window, 190, 10, grid.canvas);
    mousedown(grid.canvas, 190, 10);
    mousemove(window, 94, 10, grid.canvas);
    mouseup(window, 94, 10, grid.canvas);

    doAssert(
      grid.sizes.columns[0] === 50,
      'The column height have been set back to the original',
    );
  });
  it('Resize a column by double clicking a column header.', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
      style: {
        cellWidth: 50,
      },
    });

    grid.addEventListener('resizecolumn', function (e) {
      doAssert(e.x === grid.sizes.columns[0], 'x matches width of column 0');
      done();
    });
    grid.focus();
    mousemove(window, 94, 10, grid.canvas);
    dblclick(grid.canvas, 94, 10);
  });
  it('Resize selected columns by double clicking a column header.', function () {
    var grid = g({
      test: this.test,
      data: smallData(),
      style: {
        cellWidth: 50,
      },
    });

    grid.selectColumn(0);
    grid.selectColumn(1, true);

    chai.assert.deepStrictEqual(Object.keys(grid.sizes.columns),
      ['-1'],
      'No column widths set',
    );

    mousemove(window, 94, 10, grid.canvas);
    dblclick(grid.canvas, 94, 10);

    chai.assert.deepStrictEqual(Object.keys(grid.sizes.columns), [
      '0',
      '1',
      '-1',
    ]);
  });
  it('Resize a column from a cell.', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
      borderDragBehavior: 'resize',
      allowColumnResizeFromCell: true,
      style: {
        cellWidth: 50,
      },
    });
    grid.addEventListener('rendercell', function (e) {
      if (e.cell.columnIndex === 0) {
        e.ctx.fillStyle = c.b;
      }
    });
    setTimeout(function () {
      grid.focus();
      mousemove(window, 94, 36, grid.canvas);
      mousedown(grid.canvas, 94, 36);
      mousemove(window, 190, 36, grid.canvas);
      mouseup(window, 190, 36, grid.canvas);
      assertPxColor(grid, 110, 36, c.b, done);
    }, 1);
  });
  it('Resize a row.', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
      style: {
        cellWidth: 50,
      },
    });
    grid.addEventListener('rendercell', function (e) {
      if (e.cell.columnIndex === -1 && e.cell.rowIndex === 0) {
        e.ctx.fillStyle = c.b;
      }
    });
    setTimeout(function () {
      grid.focus();
      mousemove(window, 10, 48, grid.canvas);
      mousedown(grid.canvas, 10, 48);
      mousemove(window, 10, 100, grid.canvas);
      mouseup(window, 10, 100, grid.canvas);
      assertPxColor(grid, 10, 90, c.b, done);
    }, 1);
  });
  it('Resize a row from a cell.', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
      allowRowResizeFromCell: true,
      borderDragBehavior: 'resize',
      style: {
        cellWidth: 50,
      },
    });
    grid.addEventListener('rendercell', function (e) {
      if (e.cell.columnIndex === -1 && e.cell.rowIndex === 0) {
        e.ctx.fillStyle = c.b;
      }
    });
    setTimeout(function () {
      grid.focus();
      mousemove(window, 40, 48, grid.canvas);
      mousedown(grid.canvas, 40, 48);
      mousemove(window, 40, 100, grid.canvas);
      mouseup(window, 40, 100, grid.canvas);
      assertPxColor(grid, 10, 90, c.b, done);
    }, 1);
  });
  it('Keeps column widths when removing a column', function (done) {
    var grid = g({
      test: this.test,
      data: smallData()
    });
    grid.setColumnWidth(0, 20);
    grid.setColumnWidth(1, 100);    
    grid.setColumnWidth(2, 50);
    grid.deleteColumn(0);
    doAssert(grid.getColumnWidth(0) === 100, "new column[0] width should be old column[1] width");
    doAssert(grid.getColumnWidth(1) === 50, "new column[1] width should be old column[2] width");
    done();
  });
  it('Keeps column widths when adding a column', function (done) {
    var grid = g({
      test: this.test,
      data: smallData()
    });
    grid.setColumnWidth(0, 20);
    grid.setColumnWidth(1, 100);    
    grid.setColumnWidth(2, 50);
    grid.addColumn({name: 'Foo'});
    doAssert(grid.getColumnWidth(0) === 20, "new column[0] width should be old column[0] width");
    doAssert(grid.getColumnWidth(1) === 100, "new column[1] width should be old column[1] width");
    doAssert(grid.getColumnWidth(2) === 50, "new column[2] width should be old column[2] width");    
    done();
  });
  it('Keeps column widths when inserting a column', function (done) {
    var grid = g({
      test: this.test,
      data: smallData()
    });
    grid.setColumnWidth(0, 20);
    grid.setColumnWidth(1, 100);    
    grid.setColumnWidth(2, 50);
    grid.insertColumn({name: 'Foo'}, 1);
    doAssert(grid.getColumnWidth(0) === 20, "new column[0] width should be old column[0] width");
    doAssert(grid.getColumnWidth(2) === 100, "new column[2] width should be old column[1] width");
    doAssert(grid.getColumnWidth(3) === 50, "new column[3] width should be old column[2] width");    
    done();
  });
}
