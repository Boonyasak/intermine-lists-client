Chaplin = require 'chaplin'

Folder = require 'chaplin/models/Folder'

# A storage of all folders, resides in Store.
module.exports = class FolderCollection extends Chaplin.Collection
    
    model: Folder