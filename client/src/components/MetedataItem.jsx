import "../styles/metadataItem.css"

function MetadataItem({ title, description, image ,index}) {
    return (
    <div key={index} className="metadata-item">
    <h2>{title }</h2>
    <br></br>
    <p>{description }</p>
    {image && <img src={image} alt="Preview" />}
  </div>)
}

export default MetadataItem