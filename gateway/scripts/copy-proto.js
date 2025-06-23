const fs = require('fs');
const path = require('path');

// Directorio de origen y destino
const srcDir = path.join(__dirname, '..', 'src', 'proto');
const destDir = path.join(__dirname, '..', 'dist', 'proto');

// Asegurarse de que el directorio de destino existe
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Leer todos los archivos del directorio de origen
fs.readdir(srcDir, (err, files) => {
  if (err) {
    console.error('Error reading proto directory:', err);
    return;
  }

  // Filtrar solo los archivos .proto
  const protoFiles = files.filter(file => path.extname(file) === '.proto');

  // Copiar cada archivo .proto
  protoFiles.forEach(file => {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);

    fs.copyFile(srcFile, destFile, (copyErr) => {
      if (copyErr) {
        console.error(`Error copying ${file}:`, copyErr);
      } else {
        console.log(`Copied ${file} to ${destDir}`);
      }
    });
  });
});