exports.getAllVendors = (req, res, next) => {
    res.send('List of all vendors');
};

exports.getVendor = (req, res, next) => {
    res.send('Single vendor');
};

exports.createVendor = (req, res, next) => {
    res.send('create new vendor');
}

exports.updateVendor = (req, res, next) => {
    res.send('update vendor');
}

exports.deleteVendor = (req, res, next) => {
    res.send('delete vendor');
}