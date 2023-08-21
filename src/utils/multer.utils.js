const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const profilePath = path.join('src', 'files', 'profiles');
const productPath = path.join('src', 'files', 'products');
const documentPath = path.join('src', 'files', 'documents');

const storage = multer.diskStorage({
    destination: async (req, file, callback) => {
        const userId = req.params.uid;
        let userPath = ""; 
              
        if (file.fieldname === "profile"){          
          userPath = path.join(profilePath, 'user_' + userId);
        }
        if(file.fieldname === "product"){
            userPath = path.join(productPath, 'product_' + userId);
        }
        if(file.fieldname === "identificacion"){
            userPath = path.join(documentPath, 'document_' + userId);
        }
        if(file.fieldname === "domicilio"){
            userPath = path.join(documentPath, 'domicilio_' + userId);
        }
        if(file.fieldname === "cuenta"){
            userPath = path.join(documentPath, 'cuenta_' + userId);
        }

        try {
            await fs.mkdir(userPath, { recursive: true });
            callback(null, userPath);
        } catch (e) {
            callback(e, null);
        }
    },
    filename: (req, file, callback) => {
        const fileNameWithoutExtension = path.basename(file.originalname, path.extname(file.originalname));
        const fullFileName = `${Date.now()}-${fileNameWithoutExtension}${path.extname(file.originalname)}`;
        callback(null, fullFileName);
    }
});

const uploads = multer({ storage: storage }).fields([
    { name: 'profile' },
    { name: 'product' },
    { name: 'identificacion' },
    { name: 'domicilio' },
    { name: 'cuenta' }
]);

module.exports = uploads;