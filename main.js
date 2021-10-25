const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path');

let db = require('./database'); // Llamado a base de datos.

let win;
function createWindow() {
    win = new BrowserWindow({ // Crea ventana de app.
        width: 800,
        heigth: 600,
        webPreferences: {
            //nodeIntegration: true,
            //contextIsolation: true
            preload: path.join(app.getAppPath(), './index.js') // Unión de archivos.
        }
    })
    win.loadFile('index.html') // Carga de fichero entre paréntesis.
}

app.whenReady().then(createWindow) // Ejecutada la app, recibe instrucción crear ventana.

app.on("window-all-closed", () => {
    if(process.platform !== 'darwin') {
        app.quit()
    }
})

app.on("activate", () => {
    if(BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

ipcMain.handle("get", () => {
    getProducts()
});

ipcMain.handle("add", (event, obj) => {
    addProduct(obj)
});

ipcMain.handle('get_one', (event, obj) => {
    getproduct(obj)
});

ipcMain.handle('remove_product', (event, obj) => {
    deleteproduct(obj)
});  
  
ipcMain.handle('update', (event, obj) => {
    updateproduct(obj)
});

function getProducts() {
    db.query("SELECT * FROM product", (error, results, fields) => {
        if (error) {
            console.log(error);
        }
        win.webContents.send("products", results)
    });
}

function addProduct(obj) {
    const sql = "INSERT INTO product SET ?";
    db.query(sql, obj, (error, results, fields) => {
        if(error) {
            console.log(error);
        }
        getProducts()
    });
}

function deleteproduct(obj) {
    let { id } = obj
    let sql = "SELECT * FROM product WHERE id = ?"
    db.query(sql, id, (error, results, fields) => {
        if(error) {
            console.log(error);
        }
        console.log(results)
        win.webContents.send("products", results[0])
    });
}

function updateproduct(obj) {
    let { id, name, price } = obj
    const sql = "UPDATE product SET name=?, price=? WHERE id=?";
    db.query(sql, [name, price, id], (error, results, fields) => {
        if(error) {
            console.log(error);
        }
    getProducts()  
   });
}