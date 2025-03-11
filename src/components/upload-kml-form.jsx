export default function UploadKmlForm({addKmlData}){

    const uploadLabel = {
        display:'block',
        textAlign: 'left',
        fontWeight: 'bold'
    }

    const uploadInput = {
        textAlign: 'left',
        display: 'block',
        marginTop: '1rem',
    }

    function uploadFile(e){
        const file = e.target.files[0]

        if(file){
            const reader = new FileReader()

            reader.onload = function(e){
                const fileContent = e.target.result
                addKmlData(fileContent)
            }

            reader.readAsText(file)
        }
    }

    return (
        <div>
            <label style={uploadLabel} htmlFor="kml-upload">Upload Kml file</label>
            <input style={uploadInput} onChange={uploadFile} type="file" name="kml-upload" id="kml-upload" accept="" />
        </div>
    )
}