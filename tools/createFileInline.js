const createFileInline = (
    { dc_id, id, file_name, file_size, mime },
    ahr,
    type
) => {
    return {
        dc_id: dc_id,
        file_id: id,
        type: type,
        file_name: file_name,
        size: file_size,
        mime: mime,
        access_hash_rec: ahr
    };
};
export default createFileInline;
