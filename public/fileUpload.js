FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
    FilePondPluginFileValidateType,
    FilePondPluginFileValidateSize
)

FilePond.setOptions({
    stylePanelAspectRatio: 150/150,
    imageResizeTargetWidth: 150,
    imageResizeTargetHeight: 150,
    maxFileSize: '2MB',
    acceptedFileTypes: ['image/*']
})
//Turn all file input elements into ponds
FilePond.parse(document.body);