import { Container } from '@grafana/ui'

const files = import.meta.glob('../../public/layers/*.geojson', {
  as: 'raw',
  eager: true,
})
const fileUrls = Object.keys(files).map((key) => [
  key.replace('../../public/layers/', ''),
  key.replace('../../public', ''),
])

const AvailableData = () => {
  return (
    <Container padding='md'>
      <ol>
        {fileUrls.map(([fileName, url]) => (
          <li key={fileName}>
            <a href={url} target="_blank" rel="noreferrer">
              {fileName}
            </a>
          </li>
        ))}
      </ol>
    </Container>
  )
}

export default AvailableData
